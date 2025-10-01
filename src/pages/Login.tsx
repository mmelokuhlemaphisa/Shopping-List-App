import React, { useState, type FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../store";
import { loginUser } from "../features/LoginSlice";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error, token } = useSelector(
    (state: RootState) => state.login
  );

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(loginUser({ username, password })).unwrap();
      alert("Login successful!");
      navigate("/"); // redirect to home page
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}
        <br />
        <label htmlFor="username">Username:</label>
        <br />
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <br />
        <br />
        <label htmlFor="password">Password:</label>
        <br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-6 border rounded"
          required
        />
        <br />
        <br />
        <button
          type="submit"
          className={`w-full p-2 bg-blue-500 text-white font-bold rounded ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
<br />
<br />
        <p className="mt-4 text-center text-gray-600">
          Don't have an account?{" "}
          <span
            className="text-blue-500 cursor-pointer"
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
