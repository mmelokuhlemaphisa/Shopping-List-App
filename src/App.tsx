import { Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import ProtectedRoute from "./pages/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import ContactUs from "./pages/ContactUs";
import Privacy from "./pages/Privacy";
import ShoppingList from "./pages/ShoppingList";

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
      <Route path="/shopping-list" element={<ShoppingList />} />
    </Routes>
  );
}

export default App;
