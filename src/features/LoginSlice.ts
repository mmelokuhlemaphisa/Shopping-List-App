import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";


export interface LoginState {
  username: string;
  password: string;
  email: string;
}
// Define the initial state using that type
const initialState: LoginState = {
  username: "Melokuhle",
  password: "12345",
  email:"melokuhle@9908gmail.com",

};

export const loginSlice = createSlice({
  name: "counter",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {},
});
export default loginSlice.reducer;
