import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { RootState } from "../../store";

// ========================
// Type Definitions
// ========================
export interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  notes?: string;
  category: string;
  status: "Pending" | "Purchased" | "Out of Stock";
  image?: string;
  dateAdded: string;
  userId: string;
  listId: string;
}

export interface ShoppingItemState {
  items: ShoppingItem[];
  loading: boolean;
  error: string | null;
}

const initialState: ShoppingItemState = {
  items: [],
  loading: false,
  error: null,
};

// ========================
// Async Thunks
// ========================
export const fetchShoppingItems = createAsyncThunk<ShoppingItem[], string>(
  "shoppingItems/fetchAll",
  async (userId) => {
    const res = await axios.get(
      `http://localhost:3000/shoppingItems?userId=${userId}`
    );
    return res.data;
  }
);

export const addShoppingItem = createAsyncThunk<ShoppingItem, ShoppingItem>(
  "shoppingItems/add",
  async (item) => {
    const res = await axios.post("http://localhost:3000/shoppingItems", item);
    return res.data;
  }
);

export const updateShoppingItem = createAsyncThunk<ShoppingItem, ShoppingItem>(
  "shoppingItems/update",
  async (item) => {
    const res = await axios.put(
      `http://localhost:3000/shoppingItems/${item.id}`,
      item
    );
    return res.data;
  }
);

export const deleteShoppingItem = createAsyncThunk<string, string>(
  "shoppingItems/delete",
  async (id) => {
    await axios.delete(`http://localhost:3000/shoppingItems/${id}`);
    return id;
  }
);

// ========================
// Slice
// ========================
const shoppingItemsSlice = createSlice({
  name: "shoppingItems",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchShoppingItems.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
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

export default shoppingItemsSlice.reducer;
