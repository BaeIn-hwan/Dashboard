import React, { useRef, useState, type ChangeEvent } from "react";

import type { SimpleBlock } from "@/entities/block";

interface BlockConfigModalProps {
  block: SimpleBlock;
  onUpdate: (updated: SimpleBlock) => void;
  onClose: () => void;
}

const BLOCK_LABELS: Record<SimpleBlock["type"], string> = {
  image: "이미지",
  text: "텍스트",
  button: "버튼",
  divider: "구분선",
  spacer: "스페이서",
};

function AlignSelector({
  value,
  onChange,
}: {
  value: "left" | "center" | "right";
  onChange: (v: "left" | "center" | "right") => void;
}) {
  const options = [
    { value: "left" as const, label: "좌측" },
    { value: "center" as const, label: "가운데" },
    { value: "right" as const, label: "우측" },
  ];
  return (
    <div className="flex gap-1">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`flex-1 rounded-md py-1.5 text-xs font-medium transition-colors ${
            value === opt.value
              ? "bg-black text-white"
              : "border border-gray-200 text-gray-600 hover:bg-gray-50"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-gray-600">
        {label}
      </label>
      {children}
    </div>
  );
}

function ColorField({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 w-11 cursor-pointer rounded border border-gray-200"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 rounded-md border border-gray-200 px-2 py-1.5 text-xs focus:ring-1 focus:ring-gray-400 focus:outline-none"
      />
    </div>
  );
}

export function BlockConfigModal({
  block,
  onUpdate,
  onClose,
}: BlockConfigModalProps) {
  const [draft, setDraft] = useState<SimpleBlock>(block);
  const [imageMode, setImageMode] = useState<"upload" | "url">("upload");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const set = (updates: Partial<SimpleBlock>) => {
    setDraft((prev) => ({ ...prev, ...updates }) as SimpleBlock);
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    set({ src: url } as Partial<SimpleBlock>);
  };

  const handleSave = () => {
    onUpdate(draft);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="max-h-[85vh] w-100 overflow-y-auto rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h2 className="font-semibold text-gray-800">
            {BLOCK_LABELS[draft.type]} 설정
          </h2>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4 px-5 py-4">
          {/* ── 이미지 ── */}
          {draft.type === "image" && (
            <>
              <Field label="이미지">
                {/* Mode toggle */}
                <div className="mb-2 flex rounded-lg border border-gray-200 p-0.5">
                  {(["upload", "url"] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setImageMode(mode)}
                      className={`flex-1 rounded-md py-1.5 text-xs font-medium transition-colors ${
                        imageMode === mode
                          ? "bg-black text-white"
                          : "text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      {mode === "upload" ? "파일 업로드" : "URL 입력"}
                    </button>
                  ))}
                </div>

                {imageMode === "upload" ? (
                  <>
                    {draft.src && !draft.src.startsWith("http") ? (
                      <div>
                        <img
                          src={draft.src}
                          alt={draft.alt}
                          className="w-full rounded-lg"
                        />
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="mt-1.5 w-full text-center text-xs text-gray-400 hover:text-gray-600"
                        >
                          이미지 변경
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex h-9.5 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 text-gray-400 transition-colors hover:border-gray-400"
                      >
                        <span className="text-sm">클릭하여 업로드</span>
                      </button>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={handleImageUpload}
                    />
                  </>
                ) : (
                  <>
                    <input
                      type="text"
                      value={draft.src?.startsWith("http") ? draft.src : ""}
                      onChange={(e) =>
                        set({ src: e.target.value } as Partial<SimpleBlock>)
                      }
                      placeholder="https://example.com/image.png"
                      className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:ring-1 focus:ring-gray-400 focus:outline-none"
                    />
                    {draft.src?.startsWith("http") && (
                      <img
                        src={draft.src}
                        alt={draft.alt}
                        className="mt-2 w-full rounded-lg"
                      />
                    )}
                  </>
                )}
              </Field>
              <Field label="링크 URL">
                <input
                  value={draft.type === "image" ? draft.href : ""}
                  onChange={(e) =>
                    set({ href: e.target.value } as Partial<SimpleBlock>)
                  }
                  className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:ring-1 focus:ring-gray-400 focus:outline-none"
                  placeholder="https://..."
                />
              </Field>
              <Field label="Alt 텍스트">
                <input
                  value={draft.alt}
                  onChange={(e) =>
                    set({ alt: e.target.value } as Partial<SimpleBlock>)
                  }
                  className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:ring-1 focus:ring-gray-400 focus:outline-none"
                  placeholder="이미지 설명"
                />
              </Field>
              <Field label="정렬">
                <AlignSelector
                  value={draft.align}
                  onChange={(v) => set({ align: v } as Partial<SimpleBlock>)}
                />
              </Field>
            </>
          )}

          {/* ── 텍스트 ── */}
          {draft.type === "text" && (
            <>
              <Field label="내용">
                <textarea
                  value={draft.content}
                  onChange={(e) =>
                    set({ content: e.target.value } as Partial<SimpleBlock>)
                  }
                  rows={4}
                  className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:ring-1 focus:ring-gray-400 focus:outline-none"
                />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="폰트 크기 (px)">
                  <input
                    type="number"
                    value={draft.fontSize}
                    min={10}
                    max={72}
                    onChange={(e) =>
                      set({
                        fontSize: Number(e.target.value),
                      } as Partial<SimpleBlock>)
                    }
                    className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:ring-1 focus:ring-gray-400 focus:outline-none"
                  />
                </Field>
                <Field label="색상">
                  <ColorField
                    value={draft.color}
                    onChange={(v) => set({ color: v } as Partial<SimpleBlock>)}
                  />
                </Field>
              </div>
              <Field label="정렬">
                <AlignSelector
                  value={draft.align}
                  onChange={(v) => set({ align: v } as Partial<SimpleBlock>)}
                />
              </Field>
            </>
          )}

          {/* ── 버튼 ── */}
          {draft.type === "button" && (
            <>
              <Field label="버튼 텍스트">
                <input
                  value={draft.label}
                  onChange={(e) =>
                    set({ label: e.target.value } as Partial<SimpleBlock>)
                  }
                  className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:ring-1 focus:ring-gray-400 focus:outline-none"
                />
              </Field>
              <Field label="링크 URL">
                <input
                  value={draft.href}
                  onChange={(e) =>
                    set({ href: e.target.value } as Partial<SimpleBlock>)
                  }
                  className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:ring-1 focus:ring-gray-400 focus:outline-none"
                  placeholder="https://..."
                />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="배경색">
                  <ColorField
                    value={draft.bgColor}
                    onChange={(v) =>
                      set({ bgColor: v } as Partial<SimpleBlock>)
                    }
                  />
                </Field>
                <Field label="텍스트 색상">
                  <ColorField
                    value={draft.textColor}
                    onChange={(v) =>
                      set({ textColor: v } as Partial<SimpleBlock>)
                    }
                  />
                </Field>
              </div>
              <Field label="정렬">
                <AlignSelector
                  value={draft.align}
                  onChange={(v) => set({ align: v } as Partial<SimpleBlock>)}
                />
              </Field>
              {/* 미리보기 */}
              <div
                className={`flex justify-${draft.align} rounded-lg border border-gray-100 bg-gray-50 p-3`}
              >
                <span
                  className="inline-block rounded px-5 py-2 text-sm font-bold"
                  style={{
                    backgroundColor: draft.bgColor,
                    color: draft.textColor,
                  }}
                >
                  {draft.label || "버튼"}
                </span>
              </div>
            </>
          )}

          {/* ── 구분선 ── */}
          {draft.type === "divider" && (
            <>
              <Field label="색상">
                <ColorField
                  value={draft.color}
                  onChange={(v) => set({ color: v } as Partial<SimpleBlock>)}
                />
              </Field>
              <Field label={`두께 (${draft.thickness}px)`}>
                <input
                  type="range"
                  min={1}
                  max={8}
                  value={draft.thickness}
                  onChange={(e) =>
                    set({
                      thickness: Number(e.target.value),
                    } as Partial<SimpleBlock>)
                  }
                  className="w-full"
                />
              </Field>
              <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                <hr
                  style={{
                    border: "none",
                    borderTop: `${draft.thickness}px solid ${draft.color}`,
                  }}
                />
              </div>
            </>
          )}

          {/* ── 스페이서 ── */}
          {draft.type === "spacer" && (
            <Field label={`높이 (${draft.height}px)`}>
              <input
                type="range"
                min={8}
                max={120}
                value={draft.height}
                onChange={(e) =>
                  set({
                    height: Number(e.target.value),
                  } as Partial<SimpleBlock>)
                }
                className="w-full"
              />
              <div
                className="mt-2 flex w-full items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 text-xs text-gray-400"
                style={{ height: `${Math.min(draft.height, 80)}px` }}
              >
                {draft.height}px
              </div>
            </Field>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 border-t border-gray-100 px-5 py-4">
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-100"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            className="rounded-lg bg-black px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}
