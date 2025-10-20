import React, { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../store";
import {
  fetchShoppingLists,
  setSearch,
  setSort,
} from "../features/ShoppingListSlice";
import { useSearchParams } from "react-router-dom";

import {
  addShoppingItem,
  updateShoppingItem,
  deleteShoppingItem,
  fetchShoppingItems,
  type ShoppingItem,
} from "../features/ShoppingItemsSlice";
import { v4 as uuidv4 } from "uuid";
import "../App.css";
import NavBar from "../components/Navbar";
import { useToast } from "../components/Toast";

const ShoppingListDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const userId = useSelector((state: RootState) => state.login.id);
  const { lists, search, sort } = useSelector(
    (state: RootState) => state.shoppingList
  );
  const [searchParams, setSearchParams] = useSearchParams();
  const firstInputRef = useRef<HTMLInputElement | null>(null);
  const items = useSelector((state: RootState) => state.shoppingItems.items);

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
  const [customCategory, setCustomCategory] = useState("");
  const toast = useToast();
  const [pendingDeleteItem, setPendingDeleteItem] = useState<string | null>(
    null
  );
  const [pendingDeleteAnchor, setPendingDeleteAnchor] =
    useState<HTMLElement | null>(null);

  useEffect(() => {
    if (userId) {
      dispatch(fetchShoppingLists(userId));
      dispatch(fetchShoppingItems(userId));
    }
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
      category:
        form.category === "Other" ? customCategory || "" : form.category || "",
      image: form.image || "",
      status: form.status || "Pending",
      dateAdded: new Date().toISOString(),
      userId,
      listId: id,
    };

    if (isEditing) {
      dispatch(updateShoppingItem(itemToSave));
      toast.push("Item updated", "success");
    } else {
      dispatch(addShoppingItem(itemToSave));
      toast.push("Item added", "success");
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

  // focus the first input when the modal opens
  useEffect(() => {
    if (modalOpen) {
      setTimeout(() => firstInputRef.current?.focus(), 50);
    }
  }, [modalOpen]);

  const handleEdit = (item: ShoppingItem) => {
    setForm({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      notes: item.notes || "",
      // if the item's category is not one of the known options, set the
      // select to 'Other' and populate customCategory so the user can see it
      category: [
        "Decoration",
        "Food",
        "Drinks",
        "Music",
        "Furniture",
        "Lighting",
        "Other",
      ].includes(item.category)
        ? item.category
        : "Other",
      image: item.image || "",
      status: item.status || "Pending",
    });
    // if it's a non-standard category, show it in custom input
    if (
      item.category &&
      ![
        "Decoration",
        "Food",
        "Drinks",
        "Music",
        "Furniture",
        "Lighting",
        "Other",
      ].includes(item.category)
    ) {
      setCustomCategory(item.category);
    } else {
      setCustomCategory("");
    }
    setModalOpen(true);
    setIsEditing(true);
  };

  // Share an item: try Web Share API, fallback to clipboard copy
  const handleShare = async (item: ShoppingItem) => {
    const shareText = `Item: ${item.name}\nQuantity: ${
      item.quantity
    }\nCategory: ${item.category || "-"}\nNotes: ${item.notes || "-"}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${item.name} - Shopping Item`,
          text: shareText,
        });
      } else if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareText);
        toast.push("Item details copied to clipboard.", "success");
      } else {
        // final fallback: create a temporary textarea, select & copy, notify
        const ta = document.createElement("textarea");
        ta.value = shareText;
        document.body.appendChild(ta);
        ta.select();
        try {
          document.execCommand("copy");
          toast.push("Item details copied to clipboard.", "success");
        } catch (err) {
          toast.push(
            "Unable to copy automatically. Please select and copy.",
            "info"
          );
        }
        document.body.removeChild(ta);
      }
    } catch (err) {
      // fallback: try clipboard then notify
      if (navigator.clipboard && navigator.clipboard.writeText) {
        try {
          await navigator.clipboard.writeText(shareText);
          toast.push("Item details copied to clipboard.", "success");
          return;
        } catch (copyErr) {
          // ignore
        }
      }
      toast.push("Unable to share item details automatically.", "info");
    }
  };

  // Share the entire list (all items on the page)
  const handleShareAll = async () => {
    const header = `List: ${listInfo.name}\nTotal items: ${listItems.length}\n\n`;
    const bodyLines = listItems.map(
      (it) =>
        `- ${it.name} (qty: ${it.quantity}) ${it.notes ? `- ${it.notes}` : ""}`
    );
    const shareText = header + bodyLines.join("\n");
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${listInfo.name} - Shopping List`,
          text: shareText,
        });
        return;
      }

      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareText);
        toast.push("List details copied to clipboard.", "success");
        return;
      }

      // fallback: create a temporary textarea and copy
      const ta = document.createElement("textarea");
      ta.value = shareText;
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
        toast.push("List details copied to clipboard.", "success");
      } catch (err) {
        toast.push(
          "Unable to copy automatically. Please select and copy.",
          "info"
        );
      }
      document.body.removeChild(ta);
    } catch (err) {
      toast.push("Unable to share list details automatically.", "info");
    }
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
            onChange={(e) => {
              const v = e.target.value;
              dispatch(setSearch(v));
              // debounce URL update
              window.clearTimeout((window as any)._searchDeb);
              (window as any)._searchDeb = window.setTimeout(() => {
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
          <button
            onClick={() => {
              // prepare a fresh form for adding
              setForm({
                id: "",
                name: "",
                quantity: 0,
                notes: "",
                category: "",
                image: "",
                status: "Pending",
              });
              setCustomCategory("");
              setIsEditing(false);
              setModalOpen(true);
            }}
            className="add-list-btn"
          >
            Add Item
          </button>
          <button
            onClick={() => handleShareAll()}
            className="share-list-btn"
            style={{ marginLeft: 8 }}
          >
            Share List
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
                <option value="food">food</option>
                <option value="dairy">dairy</option>
                <option value="drinks">drinks</option>
                <option value="fruits">fruits</option>
                <option value="veggies">veggies</option>
                <option value="appliences">appliences</option>
                <option value="deodorant">deodorant</option>
                <option value="lotion">lotion</option>
                <option value="hair">hair</option>
                <option value="shoes">shoes</option>
                <option value="dresses">dresses</option>
                <option value="jerseys">jerseys</option>
                <option value="bags">bags</option>
              </select>
              {/* If user selects Other, show an input to type a custom category */}
              {form.category === "Other" && (
                <input
                  type="text"
                  placeholder="Enter custom category"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                />
              )}
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
                    setCustomCategory("");
                    setForm({
                      id: "",
                      name: "",
                      quantity: 0,
                      notes: "",
                      category: "",
                      image: "",
                      status: "Pending",
                    });
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
                  <td data-label="Image">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="table-image"
                      />
                    ) : (
                      <span className="no-image">-</span>
                    )}
                  </td>
                  <td data-label="Name">{item.name}</td>
                  <td data-label="Quantity">{item.quantity}</td>
                  <td data-label="Category">{item.category || "-"}</td>
                  <td data-label="Status">{item.status || "Pending"}</td>
                  <td data-label="Notes">{item.notes || "-"}</td>
                  <td data-label="Date Added">
                    {new Date(item.dateAdded).toLocaleDateString()}
                  </td>
                  <td data-label="Actions">
                    <button onClick={() => handleEdit(item)}>Edit</button>
                    <button onClick={() => handleShare(item)}>Share</button>
                    {pendingDeleteItem === item.id ? (
                      <>
                        <button
                          style={{ backgroundColor: "#dc2626", color: "white" }}
                          onClick={async () => {
                            await dispatch(deleteShoppingItem(item.id));
                            setPendingDeleteItem(null);
                            toast.push(
                              "Item deleted",
                              "success",
                              pendingDeleteAnchor || null
                            );
                            setPendingDeleteAnchor(null);
                          }}
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => {
                            setPendingDeleteItem(null);
                            setPendingDeleteAnchor(null);
                          }}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={(e) => {
                          setPendingDeleteItem(item.id);
                          setPendingDeleteAnchor(
                            e.currentTarget as HTMLElement
                          );
                        }}
                        className="delete-btn"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="no-items">
            <div className="no-items-content">
              <span className="no-items-icon">🛒</span>
              <p>
                No items added yet for <strong>{listInfo.name}</strong>.<br />
                Start adding items using the Add Items button above!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingListDetails;
