//Login Page Slice
import { createSlice } from '@reduxjs/toolkit'


const loginSlice = createSlice({
  name: 'login',
  initialState: {
    isLoggedIn: false,
    user: null,
  },
  reducers: {
    login(state, action) {
      state.isLoggedIn = true
      state.user = action.payload},
    }
})
//exporting the slice
export default loginSlice.reducer
