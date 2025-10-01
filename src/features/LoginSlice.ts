import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

// Payload for login
export interface LoginPayload {
  username: string;
  password: string;
}

// Slice state
export interface LoginState {
  username: string;
  password: string;
  email: string;
  loading: boolean;
  error: string | null;
  token?: string;
}

const initialState: LoginState = {
  username: "",
  password: "",
  email: "",
  loading: false,
  error: null,
  token: undefined,
};

// Async thunk for login
export const loginUser = createAsyncThunk(
  "login/loginUser",
  async (userData: LoginPayload, { rejectWithValue }) => {
    try {
      // Fetch all users
      const response = await axios.get("http://localhost:3000/user");
      const users = response.data as LoginState[];

      // Check credentials
      const user = users.find(
        (u) =>
          u.username === userData.username && u.password === userData.password
      );

      if (!user) {
        return rejectWithValue("Invalid username or password");
      }

      // Return user data
      return { username: user.username, email: user.email };
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
      state.token = undefined;
      state.username = "";
      state.email = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.username = action.payload.username;
        state.email = action.payload.email;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = loginSlice.actions;
export default loginSlice.reducer;
