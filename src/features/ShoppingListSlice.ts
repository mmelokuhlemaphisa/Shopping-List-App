import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import axios from "axios";
import type { RootState } from "../../store";

// ========================
// Type Definitions
// ========================
export interface ShoppingListInfo {
  listId: string;
  name: string;
  category: string;
  userId: string;
  dateAdded: string;
  image?: string;
}

export interface ShoppingListState {
  lists: ShoppingListInfo[];
  loading: boolean;
  error: string | null;
  search: string;
  sort: "name" | "category" | "date" | null;
}

// ========================
// Initial State
// ========================
const initialState: ShoppingListState = {
  lists: [],
  loading: false,
  error: null,
  search: "",
  sort: null,
};

// ========================
// Async Thunks
// ========================

// Fetch shopping lists
export const fetchShoppingLists = createAsyncThunk<ShoppingListInfo[], string>(
  "shoppingLists/fetchAll",
  async (userId) => {
    const res = await axios.get(
      `http://localhost:3000/shoppingLists?userId=${userId}`
    );
    return res.data;
  }
);

// Add new shopping list
export const addShoppingList = createAsyncThunk<
  ShoppingListInfo,
  ShoppingListInfo
>("shoppingLists/add", async (list) => {
  const res = await axios.post(`http://localhost:3000/shoppingLists`, list);
  return res.data;
});

// Update shopping list
export const updateShoppingList = createAsyncThunk<
  ShoppingListInfo,
  ShoppingListInfo
>("shoppingLists/update", async (list) => {
  const findRes = await axios.get(
    `http://localhost:3000/shoppingLists?listId=${list.listId}`
  );
  const existing = findRes.data && findRes.data[0];
  if (!existing) throw new Error("Shopping list not found");
  const dbId = existing.id;
  const res = await axios.put(`http://localhost:3000/shoppingLists/${dbId}`, {
    ...list,
    id: dbId,
  });
  return res.data;
});

// Delete shopping list and related items
export const deleteShoppingList = createAsyncThunk<string, string>(
  "shoppingLists/delete",
  async (listId) => {
    // Find by listId to get db id
    const findRes = await axios.get(
      `http://localhost:3000/shoppingLists?listId=${listId}`
    );
    const existing = findRes.data && findRes.data[0];
    if (existing) {
      const dbId = existing.id;
      await axios.delete(`http://localhost:3000/shoppingLists/${dbId}`);
    }

    // Also delete related items
    const { data: relatedItems } = await axios.get(
      `http://localhost:3000/shoppingItems?listId=${listId}`
    );
    await Promise.all(
      relatedItems.map((item: any) =>
        axios.delete(`http://localhost:3000/shoppingItems/${item.id}`)
      )
    );

    return listId;
  }
);

// ========================
// Slice
// ========================
const shoppingListSlice = createSlice({
  name: "shoppingLists",
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
      .addCase(fetchShoppingLists.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchShoppingLists.fulfilled, (state, action) => {
        state.lists = action.payload;
        state.loading = false;
      })
      .addCase(fetchShoppingLists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load lists";
      })
      .addCase(addShoppingList.fulfilled, (state, action) => {
        state.lists.push(action.payload);
      })
      .addCase(updateShoppingList.fulfilled, (state, action) => {
        const index = state.lists.findIndex(
          (l) => l.listId === action.payload.listId
        );
        if (index !== -1) state.lists[index] = action.payload;
      })
      .addCase(deleteShoppingList.fulfilled, (state, action) => {
        state.lists = state.lists.filter((l) => l.listId !== action.payload);
      });
  },
});

export const { setSearch, setSort } = shoppingListSlice.actions;
export default shoppingListSlice.reducer;
