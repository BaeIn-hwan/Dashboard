import { useState } from "react";

import type { CanvasBlock } from "@/entities/block";

import { blocksToTableHtml } from "@/features/html-generation";
import { useSizeStore } from "@/shared/lib/zustand/sizeStore";
import { Tab } from "@/shared/ui/Tab";

interface ResultPanelProps {
  blocks: CanvasBlock[];
  bgColor: "white" | "black";
}

export function ResultPanel({ blocks, bgColor }: ResultPanelProps) {
  const layoutWidth = useSizeStore((state) => state.layoutWidth);
  const [tab, setTab] = useState("preview");
  const [copied, setCopied] = useState(false);

  const html = blocksToTableHtml(blocks, layoutWidth, bgColor);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const previewSrcDoc =
    html ||
    '<p style="color: #aaa; text-align: center; padding: 40px; font-family: Arial, sans-serif;">블록을 추가하면 여기서 미리볼 수 있습니다.</p>';

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-center border-b border-gray-200 p-3">
        <Tab
          items={[
            { label: "Preview", value: "preview" },
            { label: "HTML", value: "html" },
          ]}
          defaultValue="preview"
          onChange={setTab}
        />
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        {tab === "preview" && (
          <iframe
            srcDoc={previewSrcDoc}
            className="h-full w-full border-0"
            title="이메일 템플릿 미리보기"
            sandbox="allow-same-origin"
          />
        )}

        {tab === "html" && (
          <>
            <div className="flex justify-end border-b border-gray-200 p-2">
              <button
                onClick={handleCopy}
                disabled={!html}
                className="rounded px-3 py-1 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-100 disabled:opacity-40"
              >
                {copied ? "복사됨 ✓" : "HTML 복사"}
              </button>
            </div>
            <pre className="flex-1 overflow-auto p-3 text-xs leading-relaxed text-gray-700">
              <code>
                {html || "블록을 추가하면 HTML 코드가 여기에 표시됩니다."}
              </code>
            </pre>
          </>
        )}
      </div>
    </div>
  );
}
