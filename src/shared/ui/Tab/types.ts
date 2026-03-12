export interface TabItem {
  label: string;
  value: string;
}

export interface TabProps {
  items: TabItem[];
  defaultValue?: string;
  onChange?: (value: string) => void;
}
