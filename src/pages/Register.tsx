import React from "react";
import type { FormEvent, ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../store";
import { registerUser, setField } from "../features/RegisterSlice";
import { useToast } from "../components/Toast";
import { useNavigate } from "react-router-dom";
import "../App.css"; // import styles

const Register: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const toast = useToast();

  const {
    username,
    password,
    email,
    name,
    surname,
    cellNumber,
    loading,
    error,
  } = useSelector((state: RootState) => state.register);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(setField({ field: e.target.name, value: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(
        registerUser({ username, password, email, name, surname, cellNumber })
      ).unwrap();
      toast.push("Registration successful!", "success");
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="auth-container">
      <div className="overlay"></div>

      <form onSubmit={handleSubmit} className="auth-card">
        <h2 className="auth-title">Create Account ✨</h2>

        {error && <p className="error-text">{error}</p>}

        <label className="input-label">Username</label>
        <input
          type="text"
          name="username"
          placeholder="Enter username"
          value={username}
          onChange={handleChange}
          className="input-field"
          required
        />

        <label className="input-label">Email</label>
        <input
          type="email"
          name="email"
          placeholder="Enter email"
          value={email}
          onChange={handleChange}
          className="input-field"
          required
        />

        <label className="input-label">Password</label>
        <input
          type="password"
          name="password"
          placeholder="Enter password"
          value={password}
          onChange={handleChange}
          className="input-field"
          required
        />

        <label className="input-label">First Name</label>
        <input
          type="text"
          name="name"
          placeholder="Enter first name"
          value={name}
          onChange={handleChange}
          className="input-field"
          required
        />

        <label className="input-label">Surname</label>
        <input
          type="text"
          name="surname"
          placeholder="Enter surname"
          value={surname}
          onChange={handleChange}
          className="input-field"
          required
        />

        <label className="input-label">Phone Number</label>
        <input
          type="text"
          name="cellNumber"
          placeholder="Enter cell number"
          value={cellNumber}
          onChange={handleChange}
          className="input-field"
          required
        />

        <button type="submit" className="auth-btn" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="switch-text">
          Already have an account?{" "}
          <span className="switch-link" onClick={() => navigate("/login")}>
            Login
          </span>
        </p>
      </form>
    </div>
  );
};

export default Register;
