import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../store";
import {
  addItem,
  updateItem,
  deleteItem,
  setSearch,
  setSort,
  type ShoppingItem,
} from "../features/ShoppingListSlice";
import { v4 as uuidv4 } from "uuid";

const ShoppingList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, search, sort } = useSelector(
    (state: RootState) => state.shoppingList
  );

  const [form, setForm] = useState({
    id: "",
    name: "",
    quantity: 1,
    notes: "",
    category: "",
    image: "",
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Filter + sort logic
  const filtered = items
    .filter((i: ShoppingItem) =>
      i.name.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a: ShoppingItem, b: ShoppingItem) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "category") return a.category.localeCompare(b.category);
      if (sort === "date")
        return (
          new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
        );
      return 0;
    });

  const handleAddOrUpdate = () => {
    if (!form.name.trim()) return;

    if (isEditing) {
      dispatch(updateItem({ ...form, dateAdded: new Date().toISOString() }));
    } else {
      const newItem: ShoppingItem = {
        id: uuidv4(),
        name: form.name,
        quantity: form.quantity,
        notes: form.notes,
        category: form.category,
        image: form.image,
        dateAdded: new Date().toISOString(),
      };
      dispatch(addItem(newItem));
    }

    setForm({
      id: "",
      name: "",
      quantity: 1,
      notes: "",
      category: "",
      image: "",
    });
    setModalOpen(false);
    setIsEditing(false);
  };

  const handleEdit = (item: ShoppingItem) => {
    setForm({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      notes: item.notes ?? "",
      category: item.category,
      image: item.image ?? "",
    }); // pre-fill modal with item data
    setModalOpen(true);
    setIsEditing(true);
  };

  return (
    <div className="shopping-list">
      <button className="form-button" onClick={() => setModalOpen(true)}>
        Add New Item
      </button>

      {items.length === 0 && (
        <p style={{ margin: "10px 0" }}>
          You currently have no items. Click "Add New Item" to start your
          shopping list!
        </p>
      )}

      <div className="search-sort">
        <input
          type="text"
          placeholder="Search..."
          className="form-input search-input"
          value={search}
          onChange={(e) => dispatch(setSearch(e.target.value))}
        />
        <select
          className="form-input sort-select"
          value={sort || ""}
          onChange={(e) =>
            dispatch(
              setSort(e.target.value as "name" | "category" | "date" | null)
            )
          }
        >
          <option value="">Sort By</option>
          <option value="name">Name</option>
          <option value="category">Category</option>
          <option value="date">Date Added</option>
        </select>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{isEditing ? "Edit Item" : "Add New Item"}</h3>
            <div className="shopping-form">
              <input
                type="text"
                placeholder="Item Name"
                className="form-input"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <input
                type="number"
                placeholder="Quantity"
                className="form-input"
                value={form.quantity}
                onChange={(e) =>
                  setForm({ ...form, quantity: Number(e.target.value) })
                }
              />
              <input
                type="text"
                placeholder="Notes (optional)"
                className="form-input"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
              <input
                type="text"
                placeholder="Category"
                className="form-input"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              />
              <input
                type="text"
                placeholder="Image URL (optional)"
                className="form-input"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
              />
              <div className="modal-buttons">
                <button className="form-button" onClick={handleAddOrUpdate}>
                  {isEditing ? "Update Item" : "Add Item"}
                </button>
                <button
                  className="form-button"
                  onClick={() => {
                    setModalOpen(false);
                    setIsEditing(false);
                    setForm({
                      id: "",
                      name: "",
                      quantity: 1,
                      notes: "",
                      category: "",
                      image: "",
                    });
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Items List */}
      <ul className="items-list">
        {filtered.map((item) => (
          <li key={item.id} className="item-card">
            <div className="item-info">
              <h3 className="item-name">{item.name}</h3>
              <p>Quantity: {item.quantity}</p>
              {item.category && (
                <p className="item-detail">Category: {item.category}</p>
              )}
              {item.notes && <p className="item-detail">Notes: {item.notes}</p>}
              {item.image && (
                <img src={item.image} alt={item.name} className="item-image" />
              )}
            </div>
            <div className="item-actions">
              <button className="form-button" onClick={() => handleEdit(item)}>
                Edit
              </button>
              <button
                className="delete-button"
                onClick={() => dispatch(deleteItem(item.id))}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ShoppingList;
