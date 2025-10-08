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
  status: "Pending" | "Purchased" | "Out of Stock";
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

// Fetch lists
export const fetchShoppingLists = createAsyncThunk<ShoppingListInfo[], string>(
  "shoppingList/fetchLists",
  async (userId) => {
    const res = await axios.get(
      `http://localhost:3000/shoppingLists?userId=${userId}`
    );
    return res.data;
  }
);

// Fetch items
export const fetchShoppingItems = createAsyncThunk<ShoppingItem[], string>(
  "shoppingList/fetchItems",
  async (userId) => {
    const res = await axios.get(
      `http://localhost:3000/shoppingItems?userId=${userId}`
    );
    return res.data;
  }
);

// Add list
export const addShoppingList = createAsyncThunk<
  ShoppingListInfo,
  ShoppingListInfo
>("shoppingList/addList", async (list) => {
  const res = await axios.post(`http://localhost:3000/shoppingLists`, list);
  return res.data;
});

// ✅ Update list (fixed backend update)
export const updateShoppingList = createAsyncThunk<
  ShoppingListInfo,
  ShoppingListInfo
>("shoppingList/updateList", async (list) => {
  // json-server routes by the resource's internal `id` field, but the app
  // stores a `listId` UUID. First locate the internal record, then PUT to
  // that internal id so the server updates the correct resource.
  const findRes = await axios.get(
    `http://localhost:3000/shoppingLists?listId=${list.listId}`
  );
  const existing = findRes.data && findRes.data[0];
  if (!existing) throw new Error("Shopping list not found on server");
  const dbId = existing.id;
  const payload = { ...list, id: dbId };
  const res = await axios.put(
    `http://localhost:3000/shoppingLists/${dbId}`,
    payload
  );
  return res.data;
});

// ✅ Delete list + all items inside
export const deleteShoppingList = createAsyncThunk<string, string>(
  "shoppingList/deleteList",
  async (listId) => {
    // json-server uses the resource's internal `id` for REST routes. Find
    // the record by `listId` then delete by the internal id.
    const findRes = await axios.get(
      `http://localhost:3000/shoppingLists?listId=${listId}`
    );
    const existing = findRes.data && findRes.data[0];
    if (existing) {
      const dbId = existing.id;
      await axios.delete(`http://localhost:3000/shoppingLists/${dbId}`);
    }

    // Delete related items (these use item.id which in our db.json is the
    // item's real id, so we can delete directly)
    const { data: relatedItems } = await axios.get(
      `http://localhost:3000/shoppingItems?listId=${listId}`
    );

    await Promise.all(
      relatedItems.map((item: ShoppingItem) =>
        axios.delete(`http://localhost:3000/shoppingItems/${item.id}`)
      )
    );

    return listId;
  }
);

// Add item
export const addShoppingItem = createAsyncThunk<ShoppingItem, ShoppingItem>(
  "shoppingList/addItem",
  async (item) => {
    const res = await axios.post(`http://localhost:3000/shoppingItems`, item);
    return res.data;
  }
);

// Update item
export const updateShoppingItem = createAsyncThunk<ShoppingItem, ShoppingItem>(
  "shoppingList/updateItem",
  async (item) => {
    const res = await axios.put(
      `http://localhost:3000/shoppingItems/${item.id}`,
      item
    );
    return res.data;
  }
);

// Delete item
export const deleteShoppingItem = createAsyncThunk<string, string>(
  "shoppingList/deleteItem",
  async (id) => {
    await axios.delete(`http://localhost:3000/shoppingItems/${id}`);
    return id;
  }
);

// ========================
// Slice
// ========================
const shoppingListSlice = createSlice({
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
      .addCase(fetchShoppingLists.fulfilled, (state, action) => {
        state.lists = action.payload;
        state.loading = false;
      })
      .addCase(fetchShoppingItems.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
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
        state.items = state.items.filter((i) => i.listId !== action.payload);
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

export const { setSearch, setSort } = shoppingListSlice.actions;
export default shoppingListSlice.reducer;
