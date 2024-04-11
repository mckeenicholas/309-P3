import React, { useState } from "react";

interface SelectableListItem {
  id: string;
  label: string;
}

interface SelectableListProps {
  items: SelectableListItem[];
  onSelect: (selectedItem: SelectableListItem) => void; // Callback when an item is selected
}

const SelectableList: React.FC<SelectableListProps> = ({ items, onSelect }) => {
  React.useEffect(() => {
    if (items.length > 0) {
      setSelectedItemId(items[0].id);
      onSelect(items[0]);
    }
  }, []);

  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const handleSelectItem = (item: SelectableListItem) => {
    setSelectedItemId(item.id);
    onSelect(item);
  };

  return (
    <ul
      style={{
        listStyleType: "none",
        padding: 0,
        maxHeight: "400px",
        overflowY: "auto",
      }}
    >
      {items.map((item) => (
        <li
          key={item.id}
          style={{
            cursor: "pointer",
            padding: "8px",
            backgroundColor: item.id === selectedItemId ? "#009d63" : "#fff",
            color: item.id === selectedItemId ? "#fff" : "#000",
          }}
          onClick={() => handleSelectItem(item)}
        >
          {item.label}
        </li>
      ))}
    </ul>
  );
};

export default SelectableList;
