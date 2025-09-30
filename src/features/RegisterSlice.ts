import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export interface RegisterState {
  username: string;
  password: string;
  Email :string;
  Name : string;
 Surname :string;
 CellNumber :string;

}
// Define the initial state using that type
const initialState: RegisterState = {
  username: "",
  password: "",
  Email :"",
  Name : "",
  Surname :"",
  CellNumber : "",
 

};
export const RegisterSlice = createSlice({
  name: "counter",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {},
});


export default RegisterSlice.reducer;
