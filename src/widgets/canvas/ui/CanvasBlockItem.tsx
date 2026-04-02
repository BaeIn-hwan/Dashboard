import { useState, type DragEvent } from "react";

import type { SimpleBlock } from "@/entities/block";

interface CanvasBlockItemProps {
  block: SimpleBlock;
  isSelected: boolean;
  isDragging: boolean;
  onDelete: (id: string) => void;
  onClick: () => void;
  onDragStart: (e: DragEvent<HTMLDivElement>, id: string) => void;
  onDragEnd: () => void;
}

export function CanvasBlockItem({
  block,
  isSelected,
  isDragging,
  onDelete,
  onClick,
  onDragStart,
  onDragEnd,
}: CanvasBlockItemProps) {
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
      onClick={onClick}
      className={`group relative flex cursor-pointer rounded-lg border bg-white transition-all ${
        isDragging ? "opacity-40" : ""
      } ${
        isSelected
          ? "border-blue-400 ring-2 ring-blue-100"
          : "border-gray-200 hover:border-gray-400"
      }`}
    >
      {/* Drag handle */}
      <div
        onMouseEnter={() => setIsDragReady(true)}
        onMouseLeave={() => setIsDragReady(false)}
        onClick={(e) => e.stopPropagation()}
        className="flex w-6 shrink-0 cursor-grab items-center justify-center rounded-l-lg text-gray-300 opacity-0 transition-opacity group-hover:opacity-100 hover:text-gray-500 active:cursor-grabbing"
      >
        ⠿
      </div>

      {/* Block content */}
      <div className="pointer-events-none min-w-0 flex-1">
        {block.type === "image" && (
          <div className="p-3 pl-0">
            {block.src ? (
              <img src={block.src} alt={block.alt} className="w-full rounded" />
            ) : (
              <div className="flex flex-col items-center justify-center gap-1 rounded-md bg-gray-50 py-6 text-gray-400">
                <span className="text-2xl">🖼</span>
                <span className="text-xs">클릭하여 이미지 설정</span>
              </div>
            )}
          </div>
        )}

        {block.type === "text" && (
          <div className="px-4 py-3">
            <p
              className="line-clamp-3 text-sm"
              style={{
                textAlign: block.align,
                fontSize: `${block.fontSize}px`,
                color: block.color,
              }}
            >
              {block.content}
            </p>
          </div>
        )}

        {block.type === "button" && (
          <div className={`flex justify-${block.align} px-4 py-3`}>
            <span
              className="inline-block rounded px-5 py-2 text-sm font-bold"
              style={{ backgroundColor: block.bgColor, color: block.textColor }}
            >
              {block.label || "버튼"}
            </span>
          </div>
        )}

        {block.type === "divider" && (
          <div className="px-4 py-5">
            <hr
              style={{
                border: "none",
                borderTop: `${block.thickness}px solid ${block.color}`,
              }}
            />
          </div>
        )}

        {block.type === "spacer" && (
          <div
            className="flex w-full items-center justify-center bg-gray-50 text-xs text-gray-400"
            style={{ height: `${Math.min(block.height, 80)}px` }}
          >
            여백 {block.height}px
          </div>
        )}
      </div>

      {/* Delete button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(block.id);
        }}
        className="absolute top-2 right-2 z-10 hidden h-6 w-6 items-center justify-center rounded-full bg-red-100 text-xs text-red-600 group-hover:flex hover:bg-red-200"
        aria-label="블록 삭제"
      >
        ✕
      </button>

      {/* Edit hint */}
      {!isDragging && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
          <span className="rounded-full bg-black/60 px-2 py-0.5 text-xs text-white">
            클릭하여 편집
          </span>
        </div>
      )}
    </div>
  );
}
