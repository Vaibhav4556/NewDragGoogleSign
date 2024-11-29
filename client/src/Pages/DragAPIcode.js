import React, { useState, useEffect } from "react";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const DragPage = () => {
  const [listOne, setListOne] = useState([]);
  const [listTwo, setListTwo] = useState([]);
  const [listThree, setListThree] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [editItemId, setEditItemId] = useState(null);
  const [editText, setEditText] = useState("");

  // Fetch initial data
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get("http://localhost:3003/api/items");
        const items = response.data;

        setListOne(items.filter((item) => item.listId === "listOne"));
        setListTwo(items.filter((item) => item.listId === "listTwo"));
        setListThree(items.filter((item) => item.listId === "listThree"));
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    fetchItems();
  }, []);

  const handleAddItem = async () => {
    if (newItem.trim()) {
      try {
        const response = await axios.post("http://localhost:3003/api/items", {
          listId: "listOne",
          item: newItem,
        });
        setListOne([...listOne, response.data]);
        setNewItem("");
      } catch (error) {
        console.error("Error adding item:", error);
      }
    }
  };

  const handleDeleteItem = async (listId, id) => {
    try {
      await axios.delete(`http://localhost:3003/api/items/${id}`);
      if (listId === "listOne") {
        setListOne(listOne.filter((item) => item._id !== id));
      } else if (listId === "listTwo") {
        setListTwo(listTwo.filter((item) => item._id !== id));
      } else {
        setListThree(listThree.filter((item) => item._id !== id));
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleEditItem = (id, itemText) => {
    setEditItemId(id);
    setEditText(itemText);
  };

  const handleSaveEdit = async (id) => {
    if (editText.trim()) {
      try {
        const response = await axios.put(`http://localhost:3003/api/items/${id}`, {
          item: editText,
        });

        const updatedItem = response.data;
        const updatedList =
          updatedItem.listId === "listOne"
            ? listOne
            : updatedItem.listId === "listTwo"
            ? listTwo
            : listThree;

        const updatedListSetter =
          updatedItem.listId === "listOne"
            ? setListOne
            : updatedItem.listId === "listTwo"
            ? setListTwo
            : setListThree;

        const updatedItems = updatedList.map((item) =>
          item._id === id ? { ...item, item: updatedItem.item } : item
        );

        updatedListSetter(updatedItems);
        setEditItemId(null);
        setEditText("");
      } catch (error) {
        console.error("Error saving edit:", error);
      }
    }
  };

  // const onDragEnd = async (result) => {
  //   const { source, destination } = result;

  //   // Check if the item was dropped outside a valid list
  //   if (!destination) return;

  //   const sourceList =
  //     source.droppableId === "listOne"
  //       ? listOne
  //       : source.droppableId === "listTwo"
  //       ? listTwo
  //       : listThree;

  //   const destinationList =
  //     destination.droppableId === "listOne"
  //       ? listOne
  //       : destination.droppableId === "listTwo"
  //       ? listTwo
  //       : listThree;

  //   const sourceSetter =
  //     source.droppableId === "listOne"
  //       ? setListOne
  //       : source.droppableId === "listTwo"
  //       ? setListTwo
  //       : setListThree;

  //   const destinationSetter =
  //     destination.droppableId === "listOne"
  //       ? setListOne
  //       : destination.droppableId === "listTwo"
  //       ? setListTwo
  //       : setListThree;

  //   if (source.droppableId === destination.droppableId) {
  //     const items = Array.from(sourceList);
  //     const [moved] = items.splice(source.index, 1);
  //     items.splice(destination.index, 0, moved);
  //     sourceSetter(items);
  //   } else {
  //     const sourceItems = Array.from(sourceList);
  //     const destinationItems = Array.from(destinationList);
  //     const [moved] = sourceItems.splice(source.index, 1);
  //     moved.listId = destination.droppableId; // Update the listId of the moved item
  //     destinationItems.splice(destination.index, 0, moved);

  //     // Update state
  //     sourceSetter(sourceItems);
  //     destinationSetter(destinationItems);

  //     // Persist changes to the backend
  //     try {
  //       await axios.put(`http://localhost:3003/api/items/${moved._id}`, {
       
  //         listId: moved.listId,
  //         item: moved.item,
  //       });
  //     } catch (error) {
  //       console.error("Error updating item:", error);
  //       // Optionally revert changes in case of an error
  //       sourceSetter([...sourceList]);
  //       destinationSetter([...destinationList]);
  //     }
  //   }
  // };

  const onDragEnd = async (result) => {
    const { source, destination } = result;
  
    // If dropped outside a valid destination
    if (!destination) return;
  
    // Get source and destination lists
    const sourceList =
      source.droppableId === "listOne" ? listOne :
      source.droppableId === "listTwo" ? listTwo : listThree;
  
    const destinationList =
      destination.droppableId === "listOne" ? listOne :
      destination.droppableId === "listTwo" ? listTwo : listThree;
  
    const sourceSetter =
      source.droppableId === "listOne" ? setListOne :
      source.droppableId === "listTwo" ? setListTwo : setListThree;
  
    const destinationSetter =
      destination.droppableId === "listOne" ? setListOne :
      destination.droppableId === "listTwo" ? setListTwo : setListThree;
  
    // Moving within the same list
    if (source.droppableId === destination.droppableId) {
      const reorderedItems = Array.from(sourceList);
      const [movedItem] = reorderedItems.splice(source.index, 1);
      reorderedItems.splice(destination.index, 0, movedItem);
      sourceSetter(reorderedItems);
      return;
    }
  
    // Moving to a different list
    const sourceItems = Array.from(sourceList);
    const destinationItems = Array.from(destinationList);
    const [movedItem] = sourceItems.splice(source.index, 1);
  
    // Update the listId of the moved item
    movedItem.listId = destination.droppableId;
  
    destinationItems.splice(destination.index, 0, movedItem);
  
    // Optimistically update state
    sourceSetter(sourceItems);
    destinationSetter(destinationItems);
  
    // Persist the change in the backend
    try {
      await axios.put(`http://localhost:3003/api/items/${movedItem._id}`, {
        listId: movedItem.listId, // Update the listId in the backend
        item: movedItem.item,
      });
    } catch (error) {
      console.error("Error updating listId in database:", error);
  
      // Revert state changes if the backend update fails
      sourceSetter([...sourceList]);
      destinationSetter([...destinationList]);
    }
  };
  
  const renderList = (list, listId, heading) => (
    <Droppable droppableId={listId}>
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
          <h4 style={{ textAlign: "center" }}>{heading}</h4>
          {list.map((item, index) => (
            <Draggable key={item._id} draggableId={item._id} index={index}>
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
                  {editItemId === item._id ? (
                    <div style={{ display: "flex", width: "100%" }}>
                      <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        style={{
                          padding: "8px",
                          marginRight: "10px",
                          border: "1px solid #ccc",
                          borderRadius: "4px",
                          width: "100%",
                        }}
                      />
                      <button
                        onClick={() => handleSaveEdit(item._id)}
                        style={{
                          background: "green",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          padding: "2px 6px",
                          cursor: "pointer",
                        }}
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <>
                      <span>{item.item}</span>
                      <button
                        onClick={() => handleEditItem(item._id, item.item)}
                        style={{
                          background: "yellow",
                          color: "black",
                          border: "none",
                          borderRadius: "4px",
                          padding: "2px 6px",
                          cursor: "pointer",
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteItem(listId, item._id)}
                        style={{
                          background: "red",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          padding: "2px 6px",
                          cursor: "pointer",
                        }}
                      >
                        X
                      </button>
                    </>
                  )}
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );

  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        <input
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Add new item to TO DO"
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
        <div style={{ display: "flex", justifyContent: "flex-start", gap: "20px" }}>
          {renderList(listOne, "listOne", "TO DO")}
          {renderList(listTwo, "listTwo", "IN PROGRESS")}
          {renderList(listThree, "listThree", "COMPLETED")}
        </div>
      </DragDropContext>
    </div>
  );
};

export default DragPage;
