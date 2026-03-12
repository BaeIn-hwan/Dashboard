import { useState } from "react";

import type { TabProps } from "./types";

import "./tab.scss";

export default function Tab(props: TabProps) {
  const { items, defaultValue, onChange } = props;

  const [selectedValue, setSelectedValue] = useState<string>(
    defaultValue || items[0].value,
  );

  const handleChange = (value: string) => {
    setSelectedValue(value);
    onChange?.(value);
  };

  return (
    <div className="tabs">
      {items.map((item) => (
        <label key={item.value}>
          <input
            type="radio"
            name="tab"
            value={item.value}
            className="sr-only"
            checked={selectedValue === item.value}
            onChange={() => handleChange(item.value)}
          />
          <span>{item.label}</span>
        </label>
      ))}
    </div>
  );
}
