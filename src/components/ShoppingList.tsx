// src/components/ShoppingListsDashboard.tsx
import React, { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../store";
import {
  addShoppingList,
  updateShoppingList,
  deleteShoppingList,
  fetchShoppingLists,
  setSearch,
  setSort,
  type ShoppingListInfo,
} from "../features/ShoppingListSlice";
import { fetchShoppingItems } from "../features/ShoppingItemsSlice";
import { v4 as uuidv4 } from "uuid";
import { Link } from "react-router-dom";
import "../App.css";
import { useToast } from "./Toast";

const ShoppingListsDashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const userId = useSelector((state: RootState) => state.login.id);
  const { lists, search, sort, loading } = useSelector(
    (state: RootState) => state.shoppingList
  );
  const items = useSelector((state: RootState) => state.shoppingItems.items);

  const [form, setForm] = useState({ name: "", category: "", image: "" });
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState("");
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  const toast = useToast();

  // Fetch shopping lists and items on mount so data persists across refresh
  useEffect(() => {
    if (userId) {
      dispatch(fetchShoppingLists(userId));
      dispatch(fetchShoppingItems(userId));
    }
  }, [dispatch, userId]);

  // URL sync: read initial q and sort from url
  const [searchParams, setSearchParams] = useSearchParams();
  useEffect(() => {
    const q = searchParams.get("q") || "";
    const s = searchParams.get("sort") || "";
    if (q !== search) dispatch(setSearch(q));
    if (s !== (sort || "")) dispatch(setSort((s as any) || null));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // debounce search param updates
  const searchDebounceRef = useRef<number | undefined>(undefined);

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
      toast.push("List updated", "success");
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
      toast.push("List added", "success");
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
  const handleDelete = async (listId: string, anchor?: HTMLElement | null) => {
    // call after user confirmed via inline UI
    await dispatch(deleteShoppingList(listId)); // ✅ backend delete
    setPendingDelete(null);
    toast.push("List deleted", "success", anchor || null);
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
            onChange={(e) => {
              const v = e.target.value;
              dispatch(setSearch(v));
              window.clearTimeout(searchDebounceRef.current);
              // update URL after short debounce
              // @ts-ignore
              searchDebounceRef.current = window.setTimeout(() => {
                const params = new URLSearchParams(searchParams.toString());
                if (v) params.set("q", v);
                else params.delete("q");
                setSearchParams(params);
              }, 300);
            }}
            className="search-input"
          />

          <select
            value={sort || ""}
            onChange={(e) => {
              const val = e.target.value as "name" | "category" | "date" | "";
              dispatch(setSort(val || null));
              const params = new URLSearchParams(searchParams.toString());
              if (val) params.set("sort", val);
              else params.delete("sort");
              setSearchParams(params);
            }}
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
                  {pendingDelete === list.listId ? (
                    <>
                      <button
                        style={{ backgroundColor: "#dc2626", color: "white" }}
                        onClick={(e) =>
                          handleDelete(list.listId, e.currentTarget)
                        }
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setPendingDelete(null)}
                        className="cancel-btn"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      style={{ backgroundColor: "#dc2626", color: "white" }}
                      onClick={() => setPendingDelete(list.listId)}
                    >
                      Delete
                    </button>
                  )}
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
