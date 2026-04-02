import { useState } from "react";

import type { CanvasBlock } from "@/entities/block";

import { ThreeColumnLayout } from "@/shared/ui/Layout";
import { BlockPalette } from "@/widgets/block-palette";
import { Canvas } from "@/widgets/canvas";
import { ResultPanel } from "@/widgets/result-panel";

export function DashboardPage() {
  const [blocks, setBlocks] = useState<CanvasBlock[]>([]);
  const [bgColor, setBgColor] = useState<"white" | "black">("white");

  return (
    <ThreeColumnLayout
      left={<BlockPalette />}
      center={
        <Canvas
          blocks={blocks}
          bgColor={bgColor}
          onBlocksChange={setBlocks}
          onBgColorChange={setBgColor}
        />
      }
      right={<ResultPanel blocks={blocks} bgColor={bgColor} />}
    />
  );
}
