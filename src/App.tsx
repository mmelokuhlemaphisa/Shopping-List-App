// src/App.tsx
import React from "react";
import { Routes, Route } from "react-router-dom";

// Pages
import LandingPage from "./pages/LandingPage";
import ContactUs from "./pages/ContactUs";
import Privacy from "./pages/Privacy";
import ShoppingList from "./components/ShoppingList";

import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Protected Route
import ProtectedRoute from "./pages/ProtectedRoute";
import ShoppingListPage from "./pages/ShoppingListPage";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<LandingPage />} />
      <Route path="/home" element={<Home />} />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route path="/contact" element={<ContactUs />} />
      <Route path="/privacy" element={<Privacy />} />

      {/* Shopping Lists */}
      <Route path="/shopping-list/:id" element={<ShoppingListPage />} />
    </Routes>
  );
}

export default App;
