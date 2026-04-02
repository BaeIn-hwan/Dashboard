import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface SizeStore {
  layoutWidth: number;
  updateLayoutWidth: (w: number) => void;
}
export const useSizeStore = create<SizeStore>()(
  devtools((set) => ({
    layoutWidth: 375,
    updateLayoutWidth: (w) => set({ layoutWidth: w }),
  })),
);
