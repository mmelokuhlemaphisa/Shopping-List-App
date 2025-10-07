
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
  setSearch,
  setSort,
} from "../features/ShoppingList";
import { v4 as uuidv4 } from "uuid";
import "../App.css";
import NavBar from "../components/Navbar";

const ShoppingListDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const userId = useSelector((state: RootState) => state.login.id);
  const { items, lists, search, sort } = useSelector(
    (state: RootState) => state.shoppingList
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    id: "",
    name: "",
    quantity: 0,
    notes: "",
    category: "",
    image: "",
    status: "Pending" as "Pending" | "Purchased" | "Out of Stock",
  });

  useEffect(() => {
    if (userId) dispatch(fetchShoppingLists(userId));
  }, [dispatch, userId]);

  const listInfo = lists.find((l) => l.listId === id) || {
    name: "Unknown List",
    category: "",
  };

  // Filter & sort items for this list
  const listItems = items
    .filter((item) => item.listId === id && item.userId === userId)
    .filter((item) => item.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "category") return a.category.localeCompare(b.category);
      if (sort === "date")
        return (
          new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
        );
      return 0;
    });

  const handleAddOrUpdate = () => {
    if (!form.name.trim() || !userId || !id) return;

    // Prepare ShoppingItem
    const itemToSave: ShoppingItem = {
      id: isEditing ? form.id : uuidv4(),
      name: form.name,
      quantity: form.quantity,
      notes: form.notes || "",
      category: form.category || "",
      image: form.image || "",
      status: form.status || "Pending",
      dateAdded: new Date().toISOString(),
      userId,
      listId: id,
    };

    if (isEditing) {
      dispatch(updateShoppingItem(itemToSave));
    } else {
      dispatch(addShoppingItem(itemToSave));
    }

    setModalOpen(false);
    setIsEditing(false);
    setForm({
      id: "",
      name: "",
      quantity: 0,
      notes: "",
      category: "",
      image: "",
      status: "Pending",
    });
  };

  const handleEdit = (item: ShoppingItem) => {
    setForm({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      notes: item.notes || "",
      category: item.category || "",
      image: item.image || "",
      status: item.status || "Pending",
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
        </div>

        {/* Search & Sort */}
        <div className="dashboard-controls">
          <input
            type="text"
            placeholder="Search items..."
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
            Add Item
          </button>
          <Link to="/home">
            <button className="back-btn">Back to Lists</button>
          </Link>
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
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                <option value="">Select Category</option>
                <option value="Decoration">Decoration</option>
                <option value="Food">Food</option>
                <option value="Drinks">Drinks</option>
                <option value="Music">Music</option>
                <option value="Furniture">Furniture</option>
                <option value="Lighting">Lighting</option>
                <option value="Other">Other</option>
              </select>
              <select
                value={form.status}
                onChange={(e) =>
                  setForm({
                    ...form,
                    status: e.target.value as
                      | "Pending"
                      | "Purchased"
                      | "Out of Stock",
                  })
                }
              >
                <option value="Pending">Pending</option>
                <option value="Purchased">Purchased</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
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
                <th>Category</th>
                <th>Status</th>
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
                  <td>{item.category || "-"}</td>
                  <td>{item.status || "Pending"}</td>
                  <td>{item.notes || "-"}</td>
                  <td>{new Date(item.dateAdded).toLocaleDateString()}</td>
                  <td>
                    <button onClick={() => handleEdit(item)}>Edit</button>
                    <button
                      onClick={() => dispatch(deleteShoppingItem(item.id))}
                      className="delete-btn"
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
