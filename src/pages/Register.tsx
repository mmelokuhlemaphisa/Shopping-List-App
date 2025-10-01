import React from "react"
import type { FormEvent, ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import type  {RootState, AppDispatch } from "../../store";
import { registerUser, setField } from "../features/RegisterSlice";
import { useNavigate } from "react-router-dom";

const Register: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

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
      alert("Registration successful!");
      navigate("/login"); // redirect to login after success
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
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}
        <br />
        <label htmlFor="username">Enter Username:</label>
        <br />
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={username}
          onChange={handleChange}
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <br />
        <br />
        <label htmlFor="username">Enter Email Addres:</label>
        <br />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={handleChange}
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <br />
        <br />
        <label htmlFor="username">Enter Password:</label>
        <br />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={handleChange}
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <br />
        <br />
        <label htmlFor="username">Enter First Name:</label>
        <br />
        <input
          type="text"
          name="name"
          placeholder="First Name"
          value={name}
          onChange={handleChange}
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <br />
        <br />
        <label htmlFor="username">Enter Last Name:</label>
        <br />
        <input
          type="text"
          name="surname"
          placeholder="Surname"
          value={surname}
          onChange={handleChange}
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <br />
        <br />
        <label htmlFor="username">Enter Phone Number:</label>
        <br />
        <input
          type="text"
          name="cellNumber"
          placeholder="Cell Number"
          value={cellNumber}
          onChange={handleChange}
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
          {loading ? "Registering..." : "Register"}
        </button>
        <br />
        <br />
        <p className="mt-4 text-center text-gray-600">
          Already have an account?{" "}
          <span
            className="text-blue-500 cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
};

export default Register;
