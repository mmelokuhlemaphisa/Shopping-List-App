// src/features/shoppingListSlice.ts
import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { RootState } from "../../store";
import axios from "axios";

// Define item type
export interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  notes?: string;
  category: string;
  image?: string; // base64 or url
  dateAdded: string;
  userId: string;
  listId: string;
}

// Define list metadata type
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

// Async thunks for items
export const fetchShoppingLists = createAsyncThunk<
  ShoppingItem[],
  string,
  { state: RootState }
>("shoppingList/fetchAll", async (userId) => {
  const response = await axios.get(
    `http://localhost:3000/shoppingList?userId=${userId}`
  );
  return response.data;
});

export const addShoppingItem = createAsyncThunk<
  ShoppingItem,
  ShoppingItem,
  { state: RootState }
>("shoppingList/addItem", async (item) => {
  const response = await axios.post("http://localhost:3000/shoppingList", item);
  return response.data;
});

export const updateShoppingItem = createAsyncThunk<
  ShoppingItem,
  ShoppingItem,
  { state: RootState }
>("shoppingList/updateItem", async (item) => {
  const response = await axios.put(
    `http://localhost:3000/shoppingList/${item.id}`,
    item
  );
  return response.data;
});

export const deleteShoppingItem = createAsyncThunk<
  string,
  string,
  { state: RootState }
>("shoppingList/deleteItem", async (id) => {
  await axios.delete(`http://localhost:3000/shoppingList/${id}`);
  return id;
});

export const shoppingListSlice = createSlice({
  name: "shoppingList",
  initialState,
  reducers: {
    addList: (state, action: PayloadAction<ShoppingListInfo>) => {
      state.lists.push(action.payload);
    },
    updateItem: (state, action: PayloadAction<ShoppingItem>) => {
      const index = state.items.findIndex((i) => i.id === action.payload.id);
      if (index !== -1) state.items[index] = action.payload;
    },
    deleteItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },
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
      .addCase(fetchShoppingLists.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShoppingLists.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchShoppingLists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch shopping lists";
      })
      .addCase(addShoppingItem.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateShoppingItem.fulfilled, (state, action) => {
        const index = state.items.findIndex((i) => i.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(deleteShoppingItem.fulfilled, (state, action) => {
        state.items = state.items.filter((i) => i.id !== action.payload);
      });
  },
});

export const { addList, updateItem, deleteItem, setSearch, setSort } =
  shoppingListSlice.actions;

export default shoppingListSlice.reducer;
