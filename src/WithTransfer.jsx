import { useState } from "react";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, horizontalListSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import { Transfer } from "antd";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const data = Array.from({ length: 10 }).map((_, i) => ({
  key: i.toString(),
  title: `content${i + 1}`,
}));

const SortableItem = ({ id, value, onDoubleClick }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} onClick={onDoubleClick}>
      {value}
    </div>
  );
};

const WithTransfer = () => {
  const [targetKeys, setTargetKeys] = useState([]);
  const [dataSource, setDataSource] = useState(data);

  // Handle double click to move items between lists
  const handleDoubleClick = (record) => {
    const nextTargetKeys = targetKeys.includes(record.key)
      ? targetKeys.filter((k) => k !== record.key)
      : [...targetKeys, record.key];
    setTargetKeys(nextTargetKeys);
  };

  // Handle drag end to reorder items within a list
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = parseInt(active.id, 10);
    const overId = parseInt(over.id, 10);
    const activeIndex = dataSource.findIndex((item) => item.key === activeId.toString());
    const overIndex = dataSource.findIndex((item) => item.key === overId.toString());

    if (activeIndex !== -1 && overIndex !== -1) {
      const sortedData = arrayMove(dataSource, activeIndex, overIndex);
      setDataSource(sortedData);
    }
  };

  // Custom render for transfer items
  const renderItem = (item) => {
    return (
      <SortableItem
        id={item.key}
        index={dataSource.findIndex((i) => i.key === item.key)}
        value={item.title}
        onDoubleClick={() => handleDoubleClick(item)}
      />
    );
  };

  return (
    <div className="users">
      <DndContext
        sensors={useSensors(useSensor(PointerSensor))}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={dataSource.map((item) => item.key)}
          strategy={horizontalListSortingStrategy}
        >
          <Transfer
            dataSource={dataSource}
            targetKeys={targetKeys}
            onChange={setTargetKeys}
            render={renderItem}
          />
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default WithTransfer;
