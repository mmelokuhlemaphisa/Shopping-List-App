// src/features/ShoppingList.ts
import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { RootState } from "../../store";
import axios from "axios";

// ========================
// Type Definitions
// ========================
export interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  notes?: string;
  category: string;
  status: "Pending" | "Purchased" | "Out of Stock"; // REQUIRED now
  image?: string;
  dateAdded: string;
  userId: string;
  listId: string;
}

export interface ShoppingListInfo {
  listId: string;
  name: string;
  category: string;
  userId: string;
  dateAdded: string;
  image?: string;
}

export interface ShoppingListState {
  items: ShoppingItem[];
  lists: ShoppingListInfo[];
  loading: boolean;
  error: string | null;
  search: string;
  sort: "name" | "category" | "date" | null;
}

const initialState: ShoppingListState = {
  items: [],
  lists: [],
  loading: false,
  error: null,
  search: "",
  sort: null,
};

// ========================
// Async Thunks
// ========================

// Fetch all shopping lists
export const fetchShoppingLists = createAsyncThunk<
  ShoppingListInfo[],
  string,
  { state: RootState }
>("shoppingList/fetchLists", async (userId) => {
  const response = await axios.get(
    `http://localhost:3000/shoppingLists?userId=${userId}`
  );
  return response.data;
});

// Fetch all shopping items
export const fetchShoppingItems = createAsyncThunk<
  ShoppingItem[],
  string,
  { state: RootState }
>("shoppingList/fetchItems", async (userId) => {
  const response = await axios.get(
    `http://localhost:3000/shoppingItems?userId=${userId}`
  );
  return response.data;
});

// Add a new shopping list
export const addShoppingList = createAsyncThunk<
  ShoppingListInfo,
  ShoppingListInfo,
  { state: RootState }
>("shoppingList/addList", async (list) => {
  const response = await axios.post(
    "http://localhost:3000/shoppingLists",
    list
  );
  return response.data;
});

// Add a new shopping item
export const addShoppingItem = createAsyncThunk<
  ShoppingItem,
  ShoppingItem,
  { state: RootState }
>("shoppingList/addItem", async (item) => {
  const response = await axios.post(
    "http://localhost:3000/shoppingItems",
    item
  );
  return response.data;
});

// Update a shopping item
export const updateShoppingItem = createAsyncThunk<
  ShoppingItem,
  ShoppingItem,
  { state: RootState }
>("shoppingList/updateItem", async (item) => {
  const response = await axios.put(
    `http://localhost:3000/shoppingItems/${item.id}`,
    item
  );
  return response.data;
});

// Delete a shopping item
export const deleteShoppingItem = createAsyncThunk<
  string,
  string,
  { state: RootState }
>("shoppingList/deleteItem", async (id) => {
  await axios.delete(`http://localhost:3000/shoppingItems/${id}`);
  return id;
});

// Delete a shopping list
export const deleteShoppingList = createAsyncThunk<
  string,
  string,
  { state: RootState }
>("shoppingList/deleteList", async (listId) => {
  await axios.delete(`http://localhost:3000/shoppingLists/${listId}`);
  return listId;
});

// ========================
// Slice
// ========================
export const shoppingListSlice = createSlice({
  name: "shoppingList",
  initialState,
  reducers: {
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },
    setSort: (
      state,
      action: PayloadAction<"name" | "category" | "date" | null>
    ) => {
      state.sort = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Lists
      .addCase(fetchShoppingLists.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShoppingLists.fulfilled, (state, action) => {
        state.loading = false;
        state.lists = action.payload;
      })
      .addCase(fetchShoppingLists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch lists";
      })

      // Fetch Items
      .addCase(fetchShoppingItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShoppingItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchShoppingItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch items";
      })

      // Add List / Item
      .addCase(addShoppingList.fulfilled, (state, action) => {
        state.lists.push(action.payload);
      })
      .addCase(addShoppingItem.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })

      // Update Item
      .addCase(updateShoppingItem.fulfilled, (state, action) => {
        const index = state.items.findIndex((i) => i.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      })

      // Delete Item
      .addCase(deleteShoppingItem.fulfilled, (state, action) => {
        state.items = state.items.filter((i) => i.id !== action.payload);
      })

      // Delete List
      .addCase(deleteShoppingList.fulfilled, (state, action) => {
        state.lists = state.lists.filter((l) => l.listId !== action.payload);
        // Optionally, delete all items from that list
        state.items = state.items.filter((i) => i.listId !== action.payload);
      });
  },
});

export const { setSearch, setSort } = shoppingListSlice.actions;

export default shoppingListSlice.reducer;
