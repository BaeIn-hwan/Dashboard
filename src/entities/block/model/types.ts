export type SimpleBlockType = "image" | "text" | "button" | "divider" | "spacer";
export type BlockType = SimpleBlockType | "layout";

interface BlockBase {
  id: string;
  type: BlockType;
}

export interface ImageBlock extends BlockBase {
  type: "image";
  src: string;
  alt: string;
  href: string;
  align: "left" | "center" | "right";
}

export interface TextBlock extends BlockBase {
  type: "text";
  content: string;
  align: "left" | "center" | "right";
  fontSize: number;
  color: string;
}

export interface ButtonBlock extends BlockBase {
  type: "button";
  label: string;
  href: string;
  align: "left" | "center" | "right";
  bgColor: string;
  textColor: string;
}

export interface DividerBlock extends BlockBase {
  type: "divider";
  color: string;
  thickness: number;
}

export interface SpacerBlock extends BlockBase {
  type: "spacer";
  height: number;
}

export type SimpleBlock =
  | ImageBlock
  | TextBlock
  | ButtonBlock
  | DividerBlock
  | SpacerBlock;

export interface LayoutBlock extends BlockBase {
  type: "layout";
  columns: 2 | 3;
  cells: (SimpleBlock | null)[];
}

export type CanvasBlock = SimpleBlock | LayoutBlock;
