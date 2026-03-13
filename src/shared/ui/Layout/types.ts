import type { ReactNode } from "react";

export interface SplitLayoutProps {
  /** 고정 패널 위치. 추후 좌/우 스왑 시 변경 */
  fixedSide?: "left" | "right";
  /** 고정 패널 안에 넣을 콘텐츠 (내부 스크롤) */
  fixedContent: ReactNode;
  /** 창 스크롤 영역에 넣을 콘텐츠 */
  scrollContent: ReactNode;
}
