import type { ReactNode } from "react";

interface ThreeColumnLayoutProps {
  left: ReactNode;
  center: ReactNode;
  right: ReactNode;
}

export function ThreeColumnLayout({
  left,
  center,
  right,
}: ThreeColumnLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="w-70 shrink-0 overflow-y-auto border-r border-gray-200 bg-white">
        {left}
      </aside>
      <main className="flex-1 overflow-y-auto bg-gray-100">{center}</main>
      <aside className="flex-1 overflow-y-auto border-l border-gray-200 bg-white">
        {right}
      </aside>
    </div>
  );
}
