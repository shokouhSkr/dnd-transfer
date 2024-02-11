import { useState } from "react";
import "./users.css";
import { closestCenter, DndContext } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export const data = [
  {
    id: 1,
    name: "Sara",
  },
  {
    id: 2,
    name: "Marry",
  },
  {
    id: 3,
    name: "John",
  },
  {
    id: 4,
    name: "Lisa",
  },
  {
    id: 5,
    name: "David",
  },
  {
    id: 6,
    name: "Stephan",
  },
  {
    id: 7,
    name: "Jack",
  },
];

const SortableUser = ({ user, onDoubleClick }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: user.id });
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
    zIndex: 9999, // Ensure the item stays on top of others
    opacity: 1, // Adjust the opacity to make it stand out
    backgroundColor: "#fbcb7e",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="user"
      onDoubleClick={() => onDoubleClick(user)}
    >
      {user.name}
    </div>
  );
};

const WithoutTransfer = () => {
  const [users1, setUsers1] = useState(data.slice(0, 3));
  const [users2, setUsers2] = useState(data.slice(3));
  const allUsers = [...users1, ...users2];

  // Move an item from one list to another using double-click
  const handleDoubleClick = (item) => {
    if (users1.includes(item)) {
      setUsers1(users1.filter((user) => user.id !== item.id));
      setUsers2([...users2, item]);
    } else if (users2.includes(item)) {
      setUsers2(users2.filter((user) => user.id !== item.id));
      setUsers1([...users1, item]);
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) {
      return;
    }

    const activeId = parseInt(active.id, 10);
    const overId = parseInt(over.id, 10);
    let sourceList = users1;
    let targetList = users2;

    // Determine which list the item came from and which list it was dropped into
    if (users1.some((user) => user.id === activeId)) {
      sourceList = users1;
    } else {
      sourceList = users2;
    }
    if (users1.some((user) => user.id === overId)) {
      targetList = users1;
    } else {
      targetList = users2;
    }

    // Find the index of the 'over' element in the target list
    const targetIndex = targetList.findIndex((user) => user.id === overId);

    // Remove the item from the source list
    const sourceIndex = sourceList.findIndex((user) => user.id === activeId);
    const [removed] = sourceList.splice(sourceIndex, 1);

    // Insert the item into the target list at the correct position
    targetList.splice(targetIndex, 0, removed);

    // Update the state with the new lists
    setUsers1([...users1]);
    setUsers2([...users2]);
  };

  return (
    <div className="users">
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div>
          <SortableContext items={users1} strategy={verticalListSortingStrategy}>
            {users1.map((user) => (
              <SortableUser key={user.id} user={user} onDoubleClick={handleDoubleClick} />
            ))}
          </SortableContext>
        </div>

        <div>
          <SortableContext items={users2} strategy={verticalListSortingStrategy}>
            {users2.map((user) => (
              <SortableUser key={user.id} user={user} onDoubleClick={handleDoubleClick} />
            ))}
          </SortableContext>
        </div>
      </DndContext>
    </div>
  );
};

export default WithoutTransfer;
