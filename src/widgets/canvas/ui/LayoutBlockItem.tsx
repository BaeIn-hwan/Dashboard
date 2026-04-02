import { useState, type DragEvent } from "react";

import type { LayoutBlock, SimpleBlock, SimpleBlockType } from "@/entities/block";

import { CanvasBlockItem } from "@/widgets/canvas/ui/CanvasBlockItem";

interface LayoutBlockItemProps {
  block: LayoutBlock;
  selectedBlockId: string | null;
  isDragging: boolean;
  onDelete: (id: string) => void;
  onCellDrop: (layoutId: string, cellIndex: number, typeData: string) => void;
  onCellCanvasBlockDrop: (layoutId: string, cellIndex: number, blockId: string) => void;
  onCellBlockClick: (cellBlock: SimpleBlock) => void;
  onCellBlockDelete: (layoutId: string, cellIndex: number) => void;
  onDragStart: (e: DragEvent<HTMLDivElement>, id: string) => void;
  onDragEnd: () => void;
}

const CELL_BLOCK_TYPES: Array<{ type: string; icon: string; label: string }> = [
  { type: "image",   icon: "🖼",  label: "이미지" },
  { type: "text",    icon: "T",   label: "텍스트" },
  { type: "button",  icon: "□",   label: "버튼" },
  { type: "divider", icon: "—",   label: "구분선" },
  { type: "spacer",  icon: "↕",   label: "스페이서" },
];

function LayoutCell({
  cell,
  isSelected,
  isDragging,
  onDrop,
  onCanvasBlockDrop,
  onClick,
  onDelete,
  onCellBlockDragStart,
  onCellBlockDragEnd,
}: {
  cell: SimpleBlock | null;
  isSelected: boolean;
  isDragging: boolean;
  onDrop: (typeData: string) => void;
  onCanvasBlockDrop: (blockId: string) => void;
  onClick: () => void;
  onDelete: () => void;
  onCellBlockDragStart: (e: DragEvent<HTMLDivElement>, id: string) => void;
  onCellBlockDragEnd: () => void;
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "move";
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const blockId = e.dataTransfer.getData("application/canvas-block-id");
    if (blockId) {
      onCanvasBlockDrop(blockId);
      return;
    }

    const typeData = e.dataTransfer.getData("application/block-type");
    if (!typeData || typeData.startsWith("layout:")) return;
    onDrop(typeData);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative flex-1 min-w-0 p-1.5 transition-colors ${isDragOver ? "bg-blue-50" : ""}`}
    >
      {cell ? (
        <CanvasBlockItem
          block={cell}
          isSelected={isSelected}
          isDragging={isDragging}
          onDelete={onDelete}
          onClick={onClick}
          onDragStart={onCellBlockDragStart}
          onDragEnd={onCellBlockDragEnd}
        />
      ) : (
        <div
          onClick={() => setShowPicker((v) => !v)}
          className={`flex h-24 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed text-xs transition-colors ${
            isDragOver
              ? "border-blue-400 bg-blue-50 text-blue-500"
              : "border-gray-300 text-gray-400 hover:border-gray-400 hover:text-gray-500"
          }`}
        >
          + 블록 추가
        </div>
      )}

      {/* Block type picker */}
      {showPicker && !cell && (
        <div
          className="absolute left-1.5 top-full z-20 mt-1 w-40 rounded-xl border border-gray-200 bg-white py-1.5 shadow-lg"
          onClick={(e) => e.stopPropagation()}
        >
          {CELL_BLOCK_TYPES.map((item) => (
            <button
              key={item.type}
              onClick={() => {
                onDrop(item.type);
                setShowPicker(false);
              }}
              className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-gray-100 text-xs font-semibold text-gray-600">
                {item.icon}
              </span>
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function LayoutBlockItem({
  block,
  selectedBlockId,
  isDragging,
  onDelete,
  onCellDrop,
  onCellCanvasBlockDrop,
  onCellBlockClick,
  onCellBlockDelete,
  onDragStart,
  onDragEnd,
}: LayoutBlockItemProps) {
  const [isDragReady, setIsDragReady] = useState(false);

  const handleDragStart = (e: DragEvent<HTMLDivElement>) => {
    if (!isDragReady) return;
    onDragStart(e, block.id);
  };

  const handleDragEnd = () => {
    setIsDragReady(false);
    onDragEnd();
  };

  return (
    <div
      draggable={isDragReady}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`group relative rounded-lg border border-gray-200 bg-white transition-all ${
        isDragging ? "opacity-40" : ""
      }`}
    >
      {/* Drag handle */}
      <div
        onMouseEnter={() => setIsDragReady(true)}
        onMouseLeave={() => setIsDragReady(false)}
        onClick={(e) => e.stopPropagation()}
        className="absolute left-2 top-2 z-10 cursor-grab text-sm text-gray-300 opacity-0 transition-opacity hover:text-gray-500 group-hover:opacity-100 active:cursor-grabbing"
      >
        ⠿
      </div>

      {/* Layout type badge */}
      <div className="absolute left-7 top-2 z-10 rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-500">
        {block.columns}열
      </div>

      {/* Delete layout block */}
      <button
        onClick={() => onDelete(block.id)}
        className="absolute right-2 top-2 z-10 hidden h-6 w-6 items-center justify-center rounded-full bg-red-100 text-xs text-red-600 hover:bg-red-200 group-hover:flex"
        aria-label="레이아웃 삭제"
      >
        ✕
      </button>

      <div className="flex divide-x divide-gray-200 pt-7 pb-1.5 px-1.5 gap-0">
        {block.cells.map((cell, idx) => (
          <LayoutCell
            key={idx}
            cell={cell}
            isSelected={cell !== null && cell.id === selectedBlockId}
            isDragging={cell !== null && cell.id === selectedBlockId && isDragging}
            onDrop={(typeData) => onCellDrop(block.id, idx, typeData as SimpleBlockType)}
            onCanvasBlockDrop={(blockId) => onCellCanvasBlockDrop(block.id, idx, blockId)}
            onClick={() => cell && onCellBlockClick(cell)}
            onDelete={() => onCellBlockDelete(block.id, idx)}
            onCellBlockDragStart={(e, id) => {
              e.stopPropagation();
              onDragStart(e, id);
            }}
            onCellBlockDragEnd={onDragEnd}
          />
        ))}
      </div>
    </div>
  );
}
