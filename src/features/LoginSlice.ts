import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

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

const initialState: LoginState = {
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
      const response = await axios.get("http://localhost:3000/user");
      const users = response.data as LoginState[];

      const user = users.find(
        (u) =>
          u.username === userData.username && u.password === userData.password
      );

      if (!user) {
        return rejectWithValue("Invalid username or password");
      }

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
