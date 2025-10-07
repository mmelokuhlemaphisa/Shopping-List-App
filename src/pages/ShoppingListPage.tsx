// src/components/ShoppingListDetails.tsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../store";
import {
  fetchShoppingLists,
  addShoppingItem,
  updateShoppingItem,
  deleteShoppingItem,
  type ShoppingItem,
} from "../features/ShoppingList";
import { v4 as uuidv4 } from "uuid";
import "../App.css";
import NavBar from "../components/Navbar";

const ShoppingListDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const userId = useSelector((state: RootState) => state.login.id);
  const items = useSelector((state: RootState) => state.shoppingList.items);
  const lists = useSelector((state: RootState) => state.shoppingList.lists);

  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    id: "",
    name: "",
    quantity: 0,
    notes: "",
    image: "",
  });

  useEffect(() => {
    if (userId) dispatch(fetchShoppingLists(userId));
  }, [dispatch, userId]);

  const listInfo = lists.find((l) => l.listId === id) || {
    name: "Unknown List",
    category: "",
  };
  const listItems = items.filter(
    (item) => item.listId === id && item.userId === userId
  );

  const handleAddOrUpdate = () => {
    if (!form.name.trim() || !userId) return;

    if (isEditing) {
      dispatch(
        updateShoppingItem({
          ...form,
          userId,
          listId: id!,
          dateAdded: new Date().toISOString(),
          category: listInfo.category,
        })
      );
    } else {
      const newItem: ShoppingItem = {
        id: uuidv4(),
        name: form.name,
        quantity: form.quantity,
        notes: form.notes,
        image: form.image,
        dateAdded: new Date().toISOString(),
        userId,
        listId: id!,
        category: listInfo.category,
      };
      dispatch(addShoppingItem(newItem));
    }
    setModalOpen(false);
    setIsEditing(false);
    setForm({ id: "", name: "", quantity: 0, notes: "", image: "" });
  };

  const handleEdit = (item: ShoppingItem) => {
    setForm({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      notes: item.notes || "",
      image: item.image || "",
    });
    setModalOpen(true);
    setIsEditing(true);
  };

  return (
    <div>
        <NavBar />
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h2>{listInfo.name} Items</h2>
          <div>
            <button onClick={() => setModalOpen(true)}>Add Item</button>
            <Link to="/home">
              <button style={{ marginLeft: "8px" }}>Back to Lists</button>
            </Link>
          </div>
        </div>

        {/* Modal */}
        {modalOpen && (
          <div className="modal-backdrop">
            <div className="modal-content">
              <h3>{isEditing ? "Edit Item" : "Add New Item"}</h3>
              <input
                type="text"
                placeholder="Item Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <input
                type="number"
                placeholder="Quantity"
                value={form.quantity}
                onChange={(e) =>
                  setForm({ ...form, quantity: Number(e.target.value) })
                }
              />
              <input
                type="text"
                placeholder="Notes"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
              <input
                type="text"
                placeholder="Image URL"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
              />
              <div className="modal-buttons">
                <button onClick={handleAddOrUpdate}>
                  {isEditing ? "Update" : "Add"}
                </button>
                <button
                  onClick={() => {
                    setModalOpen(false);
                    setIsEditing(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Table */}
        {listItems.length > 0 ? (
          <table className="item-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Quantity</th>
                <th>Notes</th>
                <th>Date Added</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {listItems.map((item) => (
                <tr key={item.id}>
                  <td>
                    <img
                      src={item.image || "https://via.placeholder.com/100"}
                      alt={item.name}
                      className="table-image"
                    />
                  </td>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>{item.notes || "-"}</td>
                  <td>{new Date(item.dateAdded).toLocaleDateString()}</td>
                  <td>
                    <button onClick={() => handleEdit(item)}>Edit</button>
                    <button
                      onClick={() => dispatch(deleteShoppingItem(item.id))}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No items added yet for {listInfo.name}. Start adding items!</p>
        )}
      </div>
    </div>
  );
};

export default ShoppingListDetails;
