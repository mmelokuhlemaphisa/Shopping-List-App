import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import CryptoJS from "crypto-js";

// Use environment variable for encryption key
const SECRET_KEY = import.meta.env.VITE_SECRET_KEY || "fallback_key";

export interface LoginPayload {
  username: string;
  password: string;
}

export interface LoginState {
  id?: string;
  username: string;
  password: string;
  email: string;
  name?: string;
  surname?: string;
  cellNumber?: string;
  loading: boolean;
  error: string | null;
  token?: string;
}

// Restore user from localStorage if available
const storedUser = window.localStorage.getItem("user");
const initialState: LoginState = storedUser
  ? {
      ...JSON.parse(storedUser),
      loading: false,
      error: null,
      token: undefined,
      password: "",
    }
  : {
      username: "",
      password: "",
      email: "",
      name: "",
      surname: "",
      cellNumber: "",
      loading: false,
      error: null,
      token: undefined,
    };

export const loginUser = createAsyncThunk(
  "login/loginUser",
  async (userData: LoginPayload, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "https://shoping-list-api.onrender.com/user"
      );
      const users = response.data as LoginState[];

      // Allow login by username OR email
      const user = users.find(
        (u) => u.username === userData.username || u.email === userData.username
      );
      if (!user) return rejectWithValue("Invalid username or password");

      // Decrypt stored password
      const bytes = CryptoJS.AES.decrypt(user.password, SECRET_KEY);
      const decryptedPassword = bytes.toString(CryptoJS.enc.Utf8);

      if (userData.password !== decryptedPassword) {
        return rejectWithValue("Invalid username or password");
      }

      // Save user info to localStorage
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          id: user.id,
          username: user.username,
          email: user.email,
          name: user.name,
          surname: user.surname,
          cellNumber: user.cellNumber,
        })
      );
      return {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        surname: user.surname,
        cellNumber: user.cellNumber,
      };
    } catch (err: any) {
      return rejectWithValue("Login failed");
    }
  }
);

export const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    logout: (state) => {
      window.localStorage.removeItem("user");
      state.token = undefined;
      state.username = "";
      state.email = "";
      state.id = undefined;
      state.name = "";
      state.surname = "";
      state.cellNumber = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<any>) => {
        // Always store new user info on login
        window.localStorage.setItem(
          "user",
          JSON.stringify({
            id: action.payload.id,
            username: action.payload.username,
            email: action.payload.email,
            name: action.payload.name,
            surname: action.payload.surname,
            cellNumber: action.payload.cellNumber,
          })
        );
        state.loading = false;
        state.username = action.payload.username;
        state.email = action.payload.email;
        state.name = action.payload.name;
        state.surname = action.payload.surname;
        state.cellNumber = action.payload.cellNumber;
        state.id = action.payload.id;
        state.token = "dummy-token";
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = loginSlice.actions;
export default loginSlice.reducer;
