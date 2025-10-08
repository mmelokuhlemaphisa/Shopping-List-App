// src/components/ShoppingListsDashboard.tsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../store";
import {
  addShoppingList,
  updateShoppingList,
  deleteShoppingList,
  fetchShoppingLists,
  fetchShoppingItems,
  setSearch,
  setSort,
  type ShoppingListInfo,
} from "../features/ShoppingList";
import { v4 as uuidv4 } from "uuid";
import { Link } from "react-router-dom";
import "../App.css";

const ShoppingListsDashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const userId = useSelector((state: RootState) => state.login.id);
  const { lists, search, sort, loading, items } = useSelector(
    (state: RootState) => state.shoppingList
  );

  const [form, setForm] = useState({ name: "", category: "", image: "" });
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState("");

  // Fetch shopping lists and items on mount so data persists across refresh
  useEffect(() => {
    if (userId) {
      dispatch(fetchShoppingLists(userId));
      dispatch(fetchShoppingItems(userId));
    }
  }, [dispatch, userId]);

  // Filter & sort lists
  const filtered = lists
    .filter((l) => l.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "category") return a.category.localeCompare(b.category);
      if (sort === "date")
        return (
          new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
        );
      return 0;
    });

  // Add or update list (fully connected to backend)
  const handleAddOrUpdate = async () => {
    if (!form.name.trim() || !userId) return;

    if (isEditing) {
      const updatedList: ShoppingListInfo = {
        listId: editId,
        name: form.name,
        category: form.category,
        userId,
        dateAdded: new Date().toISOString(),
        image: form.image || "",
      };
      await dispatch(updateShoppingList(updatedList)); // ✅ backend update
    } else {
      const newList: ShoppingListInfo = {
        listId: uuidv4(),
        name: form.name,
        category: form.category,
        userId,
        dateAdded: new Date().toISOString(),
        image: form.image || "",
      };
      await dispatch(addShoppingList(newList)); // ✅ backend add
    }

    // Reset form
    setModalOpen(false);
    setIsEditing(false);
    setEditId("");
    setForm({ name: "", category: "", image: "" });
  };

  // Edit a list
  const handleEdit = (list: ShoppingListInfo) => {
    setForm({
      name: list.name,
      category: list.category,
      image: list.image || "",
    });
    setModalOpen(true);
    setIsEditing(true);
    setEditId(list.listId);
  };

  // Delete a list (with confirmation)
  const handleDelete = async (listId: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this list and all its items?"
    );
    if (confirmDelete) {
      await dispatch(deleteShoppingList(listId)); // ✅ backend delete
    }
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <h2>🛒 My Shopping Lists</h2>
        <div className="dashboard-controls">
          <input
            type="text"
            placeholder="Search lists..."
            value={search}
            onChange={(e) => dispatch(setSearch(e.target.value))}
            className="search-input"
          />

          <select
            value={sort || ""}
            onChange={(e) =>
              dispatch(
                setSort(e.target.value as "name" | "category" | "date" | null)
              )
            }
            className="sort-select"
          >
            <option value="">Sort By</option>
            <option value="name">Name</option>
            <option value="category">Category</option>
            <option value="date">Date Added</option>
          </select>

          <button onClick={() => setModalOpen(true)} className="add-list-btn">
            ➕ Add List
          </button>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h3>{isEditing ? "✏️ Edit List" : "🆕 Add New List"}</h3>
            <input
              type="text"
              placeholder="List Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />
            <input
              type="text"
              placeholder="Image URL"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
            />

            <div className="modal-buttons">
              <button className="confirm-btn" onClick={handleAddOrUpdate}>
                {isEditing ? "Update" : "Add"}
              </button>
              <button
                className="cancel-btn"
                onClick={() => {
                  setModalOpen(false);
                  setIsEditing(false);
                  setForm({ name: "", category: "", image: "" });
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* List Grid */}
      <div className="list-grid">
        {loading ? (
          <p>Loading lists...</p>
        ) : filtered.length === 0 ? (
          <div className="no-items">
            <div className="no-items-content">
              <span className="no-items-icon">🛒</span>
               <p>No shopping lists yet. Click “Add List” to get started!</p>
            </div>
          </div>
        
        ) : (
          filtered.map((list) => (
            <div key={list.listId} className="list-card">
              <img
                src={list.image || "https://via.placeholder.com/150"}
                alt={list.name}
                className="item-image"
              />
              <div className="list-info">
                <h3>{list.name}</h3>
                <p>🗂️ Category: {list.category}</p>
                {/* show how many items this list has (0 items if none) */}
                <p>
                  {
                    items.filter(
                      (it) => it.listId === list.listId && it.userId === userId
                    ).length
                  }{" "}
                  items
                </p>
                <p className="date-added">
                  📅 Added: {new Date(list.dateAdded).toLocaleDateString()}
                </p>
                <div className="list-buttons">
                  <Link to={`/shopping-list/${list.listId}`}>
                    <button>View</button>
                  </Link>
                  <button onClick={() => handleEdit(list)}>Edit</button>
                  <button
                    style={{ backgroundColor: "#dc2626", color: "white" }}
                    onClick={() => handleDelete(list.listId)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ShoppingListsDashboard;
