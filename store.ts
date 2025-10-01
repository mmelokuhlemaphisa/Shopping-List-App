import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "./src/features/LoginSlice";
import registerReducer from "./src/features/RegisterSlice";
import ProfileReducer from "./src/features/ProfileSlice"

export const store = configureStore({
  reducer: {
    login: loginReducer,
    register: registerReducer,
    profile: ProfileReducer,

  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
