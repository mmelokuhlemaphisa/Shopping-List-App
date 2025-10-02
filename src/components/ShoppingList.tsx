import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../store";
import {
  addItem,
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
    name: "",
    quantity: 1,
    notes: "",
    category: "",
    image: "",
  });

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

  const handleAdd = () => {
    if (!form.name.trim()) return;
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
    setForm({ name: "", quantity: 1, notes: "", category: "", image: "" });
  };

  return (
    <div className="shopping-list">
      <h2 className="shopping-title">My Shopping List</h2>

      {/* Search + Sort */}
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

      {/* Add Item Form */}
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
        <button className="form-button" onClick={handleAdd}>
          Add Item
        </button>
      </div>

      {/* Items List */}
      <ul className="items-list">
        {filtered.map((item) => (
          <li key={item.id} className="item-card">
            <div className="item-info">
              <h3 className="item-name">{item.name}</h3>
              <p>Qty: {item.quantity}</p>
              {item.category && (
                <p className="item-detail">Category: {item.category}</p>
              )}
              {item.notes && <p className="item-detail">Notes: {item.notes}</p>}
              {item.image && (
                <img src={item.image} alt={item.name} className="item-image" />
              )}
            </div>
            <button
              className="delete-button"
              onClick={() => dispatch(deleteItem(item.id))}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ShoppingList;
