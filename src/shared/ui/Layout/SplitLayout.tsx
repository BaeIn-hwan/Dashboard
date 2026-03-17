import type { SplitLayoutProps } from "./types";

const FIXED_PANEL_WIDTH = "w-72"; // 288px, margin과 동일해야 함

export default function SplitLayout(props: SplitLayoutProps) {
  const { fixedSide = "left", fixedContent, scrollContent } = props;

  const isLeft = fixedSide === "left";

  return (
    <>
      {/* 고정 패널: 창 스크롤 없음, 내부 div에서만 스크롤 */}
      <div
        className={`fixed inset-y-0 flex h-screen flex-col ${FIXED_PANEL_WIDTH} ${isLeft ? "left-0" : "right-0"}`}
        aria-label="Fixed panel"
      >
        <div className="min-h-0 flex-1 overflow-y-auto">{fixedContent}</div>
      </div>

      {/* 스크롤 패널: 문서 흐름, 창 스크롤 */}
      <div
        className={`min-h-screen ${isLeft ? "ml-72" : "mr-72"}`}
        aria-label="Scroll panel"
      >
        {scrollContent}
      </div>
    </>
  );
}
