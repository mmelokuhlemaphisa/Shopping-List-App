import {createSlice, createAsyncThunk, type PayloadAction,} from "@reduxjs/toolkit";
import axios from "axios";

// Profile interface
export interface ProfileState {
  id?: string;
  username: string;
  email: string;
  name: string;
  surname: string;
  cellNumber: string;
  loading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  username: "",
  email: "",
  name: "",
  surname: "",
  cellNumber: "",
  loading: false,
  error: null,
};

// Editable fields
type ProfileEditableFields =
  | "username"
  | "email"
  | "name"
  | "surname"
  | "cellNumber";

// Fetch profile
export const fetchProfile = createAsyncThunk<
  ProfileState,
  string,
  { rejectValue: string }
>("profile/fetchProfile", async (userId, { rejectWithValue }) => {
  try {
    const response = await axios.get(
      `https://shoping-list-api.onrender.com/user/${userId}`
    );
    return response.data;
  } catch (err: any) {
    return rejectWithValue("Failed to load profile");
  }
});

// Update profile
export const updateProfile = createAsyncThunk<
  ProfileState,
  ProfileState,
  { rejectValue: string }
>("profile/updateProfile", async (updatedData, { rejectWithValue }) => {
  try {
    const response = await axios.patch(
      `https://shoping-list-api.onrender.com/user/${updatedData.id}`,
      updatedData
    );
    return response.data;
  } catch (err: any) {
    return rejectWithValue("Failed to update profile");
  }
});

export const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setProfileField: (
      state,
      action: PayloadAction<{ field: ProfileEditableFields; value: string }>
    ) => {
      state[action.payload.field] = action.payload.value;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchProfile.fulfilled,
        (state, action: PayloadAction<ProfileState>) => {
          state.loading = false;
          state.id = action.payload.id;
          state.username = action.payload.username;
          state.email = action.payload.email;
          state.name = action.payload.name;
          state.surname = action.payload.surname;
          state.cellNumber = action.payload.cellNumber;
          state.error = null;
        }
      )
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to fetch profile";
      })
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateProfile.fulfilled,
        (state, action: PayloadAction<ProfileState>) => {
          state.loading = false;
          state.username = action.payload.username;
          state.email = action.payload.email;
          state.name = action.payload.name;
          state.surname = action.payload.surname;
          state.cellNumber = action.payload.cellNumber;
          state.error = null;
        }
      )
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to update profile";
      });
  },
});

export const { setProfileField } = profileSlice.actions;
export default profileSlice.reducer;
