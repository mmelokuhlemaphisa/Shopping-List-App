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

// Async thunks (simulate API if needed)
export const fetchShoppingLists = createAsyncThunk<
  ShoppingItem[],
  void,
  { state: RootState }
>("shoppingList/fetchAll", async () => {
  // in real app, fetch from backend
  const data: ShoppingItem[] = [];
  return data;
});

export const shoppingListSlice = createSlice({
  name: "shoppingList",
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<ShoppingItem>) => {
      state.items.push(action.payload);
    },
    updateItem: (state, action: PayloadAction<ShoppingItem>) => {
      const index = state.items.findIndex((i) => i.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
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
      });
  },
});

export const { addItem, updateItem, deleteItem, setSearch, setSort } =
  shoppingListSlice.actions;

export default shoppingListSlice.reducer;
