import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const DragPage = () => {
  const [listOne, setListOne] = useState(["Item 1", "Item 2", "Item 3"]);
  const [listTwo, setListTwo] = useState(["Item A", "Item B", "Item C"]);
  const [listThree, setListThree] = useState(["Item X", "Item Y", "Item Z"]);
  const [newItem, setNewItem] = useState(""); // For adding new items

  const onDragEnd = (result) => {
    const { source, destination } = result;

    // If dropped outside a valid droppable area
    if (!destination) return;

    // Helper function to get and set state dynamically
    const getStateSetter = (id) => {
      if (id === "listOne") return [listOne, setListOne];
      if (id === "listTwo") return [listTwo, setListTwo];
      return [listThree, setListThree];
    };

    // Get the source and destination lists dynamically
    const [sourceList, setSourceList] = getStateSetter(source.droppableId);
    const [destinationList, setDestinationList] = getStateSetter(
      destination.droppableId
    );

    // If dropped in the same list
    if (source.droppableId === destination.droppableId) {
      const items = Array.from(sourceList);
      const [moved] = items.splice(source.index, 1);
      items.splice(destination.index, 0, moved);
      setSourceList(items);
    } else {
      // If dropped in a different list
      const sourceItems = Array.from(sourceList);
      const destinationItems = Array.from(destinationList);

      const [moved] = sourceItems.splice(source.index, 1);
      destinationItems.splice(destination.index, 0, moved);

      setSourceList(sourceItems);
      setDestinationList(destinationItems);
    }
  };

  // Add new item to List One
  const handleAddItem = () => {
    if (newItem.trim()) {
      setListOne([...listOne, newItem]);
      setNewItem("");
    }
  };

  // Delete item from any list
  const handleDeleteItem = (listId, index) => {
    if (listId === "listOne") {
      const updatedList = [...listOne];
      updatedList.splice(index, 1);
      setListOne(updatedList);
    } else if (listId === "listTwo") {
      const updatedList = [...listTwo];
      updatedList.splice(index, 1);
      setListTwo(updatedList);
    } else {
      const updatedList = [...listThree];
      updatedList.splice(index, 1);
      setListThree(updatedList);
    }
  };

  return (
    <div>
      {/* Add Item Section */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Add new item to List One"
          style={{
            padding: "8px",
            marginRight: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
        <button
          onClick={handleAddItem}
          style={{
            padding: "8px 12px",
            background: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Add Item
        </button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div style={{ display: "flex", gap: "20px" }}>
          {/* First List */}
          <Droppable droppableId="listOne">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{
                  background: "#f8f9fa",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  width: "200px",
                }}
              >
                <h4>List One</h4>
                {listOne.map((item, index) => (
                  <Draggable key={item} draggableId={item} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          padding: "8px",
                          margin: "4px 0",
                          background: "#fff",
                          border: "1px solid #ddd",
                          borderRadius: "4px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          ...provided.draggableProps.style,
                        }}
                      >
                        {item}
                        <button
                          onClick={() => handleDeleteItem("listOne", index)}
                          style={{
                            background: "red",
                            color: "#fff",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            padding: "2px 8px",
                          }}
                        >
                          X
                        </button>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          {/* Second List */}
          <Droppable droppableId="listTwo">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{
                  background: "#f8f9fa",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  width: "200px",
                }}
              >
                <h4>List Two</h4>
                {listTwo.map((item, index) => (
                  <Draggable key={item} draggableId={item} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          padding: "8px",
                          margin: "4px 0",
                          background: "#fff",
                          border: "1px solid #ddd",
                          borderRadius: "4px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          ...provided.draggableProps.style,
                        }}
                      >
                        {item}
                        <button
                          onClick={() => handleDeleteItem("listTwo", index)}
                          style={{
                            background: "red",
                            color: "#fff",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            padding: "2px 8px",
                          }}
                        >
                          X
                        </button>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          {/* Third List */}
          <Droppable droppableId="listThree">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{
                  background: "#f8f9fa",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  width: "200px",
                }}
              >
                <h4>List Three</h4>
                {listThree.map((item, index) => (
                  <Draggable key={item} draggableId={item} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          padding: "8px",
                          margin: "4px 0",
                          background: "#fff",
                          border: "1px solid #ddd",
                          borderRadius: "4px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          ...provided.draggableProps.style,
                        }}
                      >
                        {item}
                        <button
                          onClick={() => handleDeleteItem("listThree", index)}
                          style={{
                            background: "red",
                            color: "#fff",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            padding: "2px 8px",
                          }}
                        >
                          X
                        </button>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </DragDropContext>
    </div>
  );
};

export default DragPage;
