// src/features/shoppingListSlice.ts
import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { RootState } from "../../store";

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
}

export interface ShoppingListState {
  items: ShoppingItem[];
  loading: boolean;
  error: string | null;
  search: string;
  sort: "name" | "category" | "date" | null;
}

const initialState: ShoppingListState = {
  items: [],
  loading: false,
  error: null,
  search: "",
  sort: null,
};

// Async thunks for JSON server
import axios from "axios";

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

export const shoppingListSlice = createSlice({
  name: "shoppingList",
  initialState,
  reducers: {
    updateItem: (
      state: ShoppingListState,
      action: PayloadAction<ShoppingItem>
    ) => {
      const index = state.items.findIndex(
        (i: ShoppingItem) => i.id === action.payload.id
      );
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteItem: (state: ShoppingListState, action: PayloadAction<string>) => {
      state.items = state.items.filter(
        (i: ShoppingItem) => i.id !== action.payload
      );
    },
    setSearch: (state: ShoppingListState, action: PayloadAction<string>) => {
      state.search = action.payload;
    },
    setSort: (
      state: ShoppingListState,
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
      });
  },
});

export const { updateItem, deleteItem, setSearch, setSort } =
  shoppingListSlice.actions;

export default shoppingListSlice.reducer;
