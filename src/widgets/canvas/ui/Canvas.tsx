import { useState, type DragEvent } from "react";

import type { CanvasBlock, SimpleBlock } from "@/entities/block";

import { useSizeStore } from "@/shared/lib/zustand/sizeStore";
import { BlockConfigModal } from "@/widgets/canvas/ui/BlockConfigModal";
import { CanvasBlockItem } from "@/widgets/canvas/ui/CanvasBlockItem";
import CanvasSettings from "@/widgets/canvas/ui/CanvasSettings";
import { LayoutBlockItem } from "@/widgets/canvas/ui/LayoutBlockItem";

interface CanvasProps {
  blocks: CanvasBlock[];
  bgColor: "white" | "black";
  onBlocksChange: (blocks: CanvasBlock[]) => void;
  onBgColorChange: (c: "white" | "black") => void;
}

function createBlock(typeData: string): CanvasBlock {
  const id = Math.random().toString(36).slice(2, 10);
  if (typeData.startsWith("layout:")) {
    const columns = parseInt(typeData.split(":")[1]) as 2 | 3;
    return {
      id,
      type: "layout",
      columns,
      cells: Array(columns).fill(null) as (SimpleBlock | null)[],
    };
  }
  switch (typeData) {
    case "image":
      return { id, type: "image", src: "", alt: "", href: "", align: "center" };
    case "text":
      return {
        id,
        type: "text",
        content: "텍스트를 입력하세요.",
        align: "left",
        fontSize: 16,
        color: "#333333",
      };
    case "button":
      return {
        id,
        type: "button",
        label: "버튼",
        href: "#",
        align: "center",
        bgColor: "#1a1a1a",
        textColor: "#ffffff",
      };
    case "divider":
      return { id, type: "divider", color: "#e0e0e0", thickness: 1 };
    case "spacer":
      return { id, type: "spacer", height: 32 };
    default:
      return {
        id,
        type: "text",
        content: "",
        align: "left",
        fontSize: 16,
        color: "#333333",
      };
  }
}

function findBlock(blocks: CanvasBlock[], id: string): SimpleBlock | null {
  for (const block of blocks) {
    if (block.type !== "layout" && block.id === id) return block;
    if (block.type === "layout") {
      const found = block.cells.find((c) => c?.id === id);
      if (found) return found;
    }
  }
  return null;
}

function updateBlockInTree(
  blocks: CanvasBlock[],
  updated: SimpleBlock,
): CanvasBlock[] {
  return blocks.map((b) => {
    if (b.type !== "layout" && b.id === updated.id) return updated;
    if (b.type === "layout")
      return {
        ...b,
        cells: b.cells.map((c) => (c?.id === updated.id ? updated : c)),
      };
    return b;
  });
}

function deleteFromTree(blocks: CanvasBlock[], id: string): CanvasBlock[] {
  return blocks
    .filter((b) => b.id !== id)
    .map((b) => {
      if (b.type === "layout")
        return { ...b, cells: b.cells.map((c) => (c?.id === id ? null : c)) };
      return b;
    });
}

function reorderBlocks(
  blocks: CanvasBlock[],
  fromId: string,
  toIndex: number,
): CanvasBlock[] {
  const fromIndex = blocks.findIndex((b) => b.id === fromId);
  if (fromIndex === -1) return blocks;
  const result = [...blocks];
  const [removed] = result.splice(fromIndex, 1);
  const adjusted = toIndex > fromIndex ? toIndex - 1 : toIndex;
  result.splice(adjusted, 0, removed);
  return result;
}

// 블록 사이에 위치하는 드롭 라인
function DropZone({
  index,
  onInsert,
  onReorder,
}: {
  index: number;
  onInsert: (typeData: string, atIndex: number) => void;
  onReorder: (fromId: string, toIndex: number) => void;
}) {
  const [isOver, setIsOver] = useState(false);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) setIsOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOver(false);

    const blockId = e.dataTransfer.getData("application/canvas-block-id");
    if (blockId) {
      onReorder(blockId, index);
      return;
    }

    const typeData = e.dataTransfer.getData("application/block-type");
    if (typeData) onInsert(typeData, index);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`transition-all duration-150 ${isOver ? "py-2" : "py-1"}`}
    >
      <div
        className={`w-full rounded-full transition-all duration-150 ${isOver ? "h-0.5 bg-blue-400 shadow-sm shadow-blue-200" : "h-px bg-transparent"}`}
      />
    </div>
  );
}

export function Canvas({
  blocks,
  bgColor,
  onBlocksChange,
  onBgColorChange,
}: CanvasProps) {
  const layoutWidth = useSizeStore((state) => state.layoutWidth);
  const [isDragOver, setIsDragOver] = useState(false);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);

  const editingBlock = editingBlockId
    ? findBlock(blocks, editingBlockId)
    : null;

  // 팔레트 드래그일 때만 배경 피드백
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    if (e.dataTransfer.types.includes("application/block-type")) {
      e.preventDefault();
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node))
      setIsDragOver(false);
  };

  // 빈 캔버스일 때만 outer drop 처리
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (blocks.length > 0) return;
    const typeData = e.dataTransfer.getData("application/block-type");
    if (!typeData) return;
    const newBlock = createBlock(typeData);
    onBlocksChange([newBlock]);
    if (newBlock.type !== "layout") setEditingBlockId(newBlock.id);
  };

  const handleInsert = (typeData: string, atIndex: number) => {
    const newBlock = createBlock(typeData);
    const next = [...blocks];
    next.splice(atIndex, 0, newBlock);
    onBlocksChange(next);
    if (newBlock.type !== "layout") setEditingBlockId(newBlock.id);
  };

  const handleReorder = (fromId: string, toIndex: number) => {
    onBlocksChange(reorderBlocks(blocks, fromId, toIndex));
  };

  const handleCellDrop = (
    layoutId: string,
    cellIndex: number,
    typeData: string,
  ) => {
    const newBlock = createBlock(typeData) as SimpleBlock;
    onBlocksChange(
      blocks.map((b) =>
        b.id === layoutId && b.type === "layout"
          ? {
              ...b,
              cells: b.cells.map((c, i) => (i === cellIndex ? newBlock : c)),
            }
          : b,
      ),
    );
    setEditingBlockId(newBlock.id);
  };

  // 캔버스 블록(최상위 또는 다른 셀)을 레이아웃 셀로 이동
  const handleMoveBlockToCell = (
    layoutId: string,
    cellIndex: number,
    blockId: string,
  ) => {
    const block = findBlock(blocks, blockId);
    if (!block) return;
    // 원래 위치에서 제거 후 대상 셀에 삽입
    const afterRemove = deleteFromTree(blocks, blockId);
    onBlocksChange(
      afterRemove.map((b) =>
        b.id === layoutId && b.type === "layout"
          ? {
              ...b,
              cells: b.cells.map((c, i) => (i === cellIndex ? block : c)),
            }
          : b,
      ),
    );
  };

  const handleCellBlockDelete = (layoutId: string, cellIndex: number) => {
    onBlocksChange(
      blocks.map((b) =>
        b.id === layoutId && b.type === "layout"
          ? { ...b, cells: b.cells.map((c, i) => (i === cellIndex ? null : c)) }
          : b,
      ),
    );
  };

  const handleDelete = (id: string) => {
    if (editingBlockId === id) setEditingBlockId(null);
    onBlocksChange(deleteFromTree(blocks, id));
  };

  const handleUpdate = (updated: SimpleBlock) => {
    onBlocksChange(updateBlockInTree(blocks, updated));
  };

  const handleBlockDragStart = (e: DragEvent<HTMLDivElement>, id: string) => {
    e.dataTransfer.setData("application/canvas-block-id", id);
    e.dataTransfer.effectAllowed = "move";
    setDraggingId(id);
  };

  const handleBlockDragEnd = () => setDraggingId(null);

  return (
    <>
      {/* Toolbar */}

      <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-gray-200 bg-white/90 px-4 py-2.5 backdrop-blur-sm">
        <CanvasSettings />
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-gray-500">배경색</span>
          <div className="flex gap-1">
            {(["white", "black"] as const).map((c) => (
              <button
                key={c}
                onClick={() => onBgColorChange(c)}
                className={`rounded border px-2.5 py-1 text-xs font-medium transition-colors ${
                  bgColor === c
                    ? "border-blue-400 ring-2 ring-blue-100"
                    : "border-gray-200 hover:bg-gray-100"
                } ${c === "black" ? "bg-black text-white" : "bg-white text-gray-700"}`}
              >
                {c === "white" ? "White" : "Black"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Canvas area */}
      <div className="min-h-full p-6">
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`mx-auto transition-colors ${blocks.length === 0 ? "" : "border-2 border-dashed border-gray-300 px-4"}`}
          style={{ width: `${layoutWidth}px` }}
        >
          {blocks.length === 0 ? (
            <div
              className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed py-24 text-center transition-colors ${
                isDragOver
                  ? "border-blue-400 bg-blue-50"
                  : "border-gray-300 bg-white"
              }`}
            >
              <span className="mb-3 text-4xl">📧</span>
              <p className="font-medium text-gray-500">
                블록을 여기에 드래그하세요
              </p>
              <p className="mt-1 text-sm break-keep text-gray-400">
                왼쪽 패널에서 블록을 드래그하여 이메일 템플릿을 구성하세요
              </p>
            </div>
          ) : (
            <>
              {blocks.map((block, index) => (
                <div key={block.id}>
                  <DropZone
                    index={index}
                    onInsert={handleInsert}
                    onReorder={handleReorder}
                  />
                  {block.type === "layout" ? (
                    <LayoutBlockItem
                      block={block}
                      selectedBlockId={editingBlockId}
                      isDragging={draggingId === block.id}
                      onDelete={handleDelete}
                      onCellDrop={handleCellDrop}
                      onCellCanvasBlockDrop={handleMoveBlockToCell}
                      onCellBlockClick={(cell) => setEditingBlockId(cell.id)}
                      onCellBlockDelete={handleCellBlockDelete}
                      onDragStart={handleBlockDragStart}
                      onDragEnd={handleBlockDragEnd}
                    />
                  ) : (
                    <CanvasBlockItem
                      block={block}
                      isSelected={editingBlockId === block.id}
                      isDragging={draggingId === block.id}
                      onDelete={handleDelete}
                      onClick={() => setEditingBlockId(block.id)}
                      onDragStart={handleBlockDragStart}
                      onDragEnd={handleBlockDragEnd}
                    />
                  )}
                </div>
              ))}
              <DropZone
                index={blocks.length}
                onInsert={handleInsert}
                onReorder={handleReorder}
              />
            </>
          )}
        </div>
      </div>

      {/* Config modal */}
      {editingBlock && (
        <BlockConfigModal
          block={editingBlock}
          onUpdate={handleUpdate}
          onClose={() => setEditingBlockId(null)}
        />
      )}
    </>
  );
}
