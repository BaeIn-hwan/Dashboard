import { useShallow } from "zustand/shallow";

import { useSizeStore } from "@/shared/lib/zustand/sizeStore";
import { WIDTH_OPTIONS } from "@/widgets/canvas/models/constants";

export default function CanvasSettings() {
  const { layoutWidth, updateLayoutWidth } = useSizeStore(
    useShallow((state) => ({
      layoutWidth: state.layoutWidth,
      updateLayoutWidth: state.updateLayoutWidth,
    })),
  );

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-medium text-gray-500">레이아웃 너비</span>
      <div className="flex gap-1">
        {WIDTH_OPTIONS.map((w) => (
          <button
            key={w}
            onClick={() => updateLayoutWidth(w)}
            className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
              layoutWidth === w
                ? "bg-black text-white"
                : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            {w}px
          </button>
        ))}
      </div>
    </div>
  );
}
