import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import CryptoJS from "crypto-js";

// ✅ Load secret key from environment variables (Vite/React)
const SECRET_KEY = import.meta.env.VITE_SECRET_KEY || "fallback_key";

export interface RegisterState {
  username: string;
  password: string;
  email: string;
  name: string;
  surname: string;
  cellNumber: string;
  loading: boolean;
  error: string | null;
}

const initialState: RegisterState = {
  username: "",
  password: "",
  email: "",
  name: "",
  surname: "",
  cellNumber: "",
  loading: false,
  error: null,
};

export interface RegisterPayload {
  username: string;
  password: string;
  email: string;
  name: string;
  surname: string;
  cellNumber: string;
}

// 🔐 Register user with encrypted password
export const registerUser = createAsyncThunk(
  "register/registerUser",
  async (userData: RegisterPayload, { rejectWithValue }) => {
    try {
      // Encrypt the password
      const encryptedPassword = CryptoJS.AES.encrypt(
        userData.password,
        SECRET_KEY
      ).toString();

      // Post to your API
      const response = await axios.post("http://localhost:3000/user", {
        ...userData,
        password: encryptedPassword,
      });

      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Error registering user");
    }
  }
);

export const registerSlice = createSlice({
  name: "register",
  initialState,
  reducers: {
    // Generic field setter for form inputs
    setField: (state, action) => {
      const { field, value } = action.payload;
      (state as any)[field] = value;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setField } = registerSlice.actions;
export default registerSlice.reducer;
