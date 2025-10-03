import React, { useState, type FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../store";
import {loginUser} from "../features/LoginSlice";
import { useNavigate } from "react-router-dom";
import "../App.css"; // <-- import styles

const Login: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.login);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(loginUser({ username, password })).unwrap();
      alert("Login successful!");
      navigate("/home"); // redirect to home page
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="login-container">
      <div className="overlay"></div>

      <form onSubmit={handleSubmit} className="login-card">
        <h2 className="login-title">Welcome Back 👋</h2>

        {error && <p className="error-text">{error}</p>}

        <label htmlFor="username" className="input-label">
          Username
        </label>
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="input-field"
          required
        />

        <label htmlFor="password" className="input-label">
          Password
        </label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field"
          required
        />

        <button type="submit" className="login-btn" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="register-text">
          Don’t have an account?{" "}
          <span className="register-link" onClick={() => navigate("/register")}>
            Register
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
