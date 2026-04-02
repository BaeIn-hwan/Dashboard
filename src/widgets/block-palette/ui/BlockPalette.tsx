import type { SimpleBlockType } from "@/entities/block";
import type { DragEvent } from "react";

type PaletteDragData = SimpleBlockType | "layout:2" | "layout:3";

const PALETTE_ITEMS: Array<{
  dragData: PaletteDragData;
  icon: string;
  label: string;
  description: string;
}> = [
  {
    dragData: "image",
    icon: "🖼",
    label: "이미지",
    description: "이미지 업로드",
  },
  { dragData: "text", icon: "T", label: "텍스트", description: "텍스트 단락" },
  { dragData: "button", icon: "□", label: "버튼", description: "CTA 버튼" },
  { dragData: "divider", icon: "—", label: "구분선", description: "수평선" },
  { dragData: "spacer", icon: "↕", label: "스페이서", description: "여백" },
  {
    dragData: "layout:2",
    icon: "⬜⬜",
    label: "2열 레이아웃",
    description: "2개 컬럼 분할",
  },
  {
    dragData: "layout:3",
    icon: "⬜⬜⬜",
    label: "3열 레이아웃",
    description: "3개 컬럼 분할",
  },
];

const SECTIONS = [
  { label: "기본 블록", items: PALETTE_ITEMS.slice(0, 5) },
  { label: "레이아웃", items: PALETTE_ITEMS.slice(5) },
];

export function BlockPalette() {
  const handleDragStart = (
    e: DragEvent<HTMLDivElement>,
    dragData: PaletteDragData,
  ) => {
    e.dataTransfer.setData("application/block-type", dragData);
    e.dataTransfer.effectAllowed = "copy";
  };

  return (
    <div className="space-y-6">
      {SECTIONS.map((section) => (
        <div key={section.label}>
          <h2 className="px-3 py-3.5 text-[14px] font-semibold tracking-wider text-gray-600 uppercase">
            {section.label}
          </h2>

          <div className="mt-1 space-y-1.5 px-3">
            {section.items.map((item) => (
              <div
                key={item.dragData}
                draggable
                onDragStart={(e) => handleDragStart(e, item.dragData)}
                className="flex cursor-grab items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 transition-all select-none hover:border-gray-400 hover:shadow-sm active:cursor-grabbing"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-gray-100 text-sm font-semibold text-gray-600">
                  {item.icon}
                </span>
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    {item.label}
                  </p>
                  <p className="text-xs text-gray-400">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
