import React, { useEffect, useState, type FormEvent } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../store";
import { fetchProfile, updateProfile } from "../features/ProfileSlice";
import { useNavigate } from "react-router-dom";
import "../App.css";

const Profile: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // Get logged-in user's id from login slice (property is 'id')
  const userId = useSelector((state: RootState) => state.login.id);

  // Get profile state from profileSlice
  const { username, email, name, surname, cellNumber, loading, error } =
    useSelector((state: RootState) => state.profile);

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    name: "",
    surname: "",
    cellNumber: "",
  });

  // Fetch profile on mount if user is logged in
  useEffect(() => {
    if (userId) {
      dispatch(fetchProfile(userId));
    }
  }, [dispatch, userId]);

  // Update formData when profile data changes
  useEffect(() => {
    setFormData({ username, email, name, surname, cellNumber });
  }, [username, email, name, surname, cellNumber]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    try {
      // Add loading and error fields to match ProfileState
      await dispatch(
        updateProfile({
          ...formData,
          id: userId,
          loading: false,
          error: null,
        })
      ).unwrap();
      alert("Profile updated!");
      setEditMode(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">My Profile</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {!editMode ? (
          <div>
            <p>
              <strong>Username:</strong> {username}
            </p>
            <p>
              <strong>Email:</strong> {email}
            </p>
            <p>
              <strong>Name:</strong> {name}
            </p>
            <p>
              <strong>Surname:</strong> {surname}
            </p>
            <p>
              <strong>Cell Number:</strong> {cellNumber}
            </p>

            <button
              className="mt-4 w-full bg-blue-500 text-white p-2 rounded"
              onClick={() => setEditMode(true)}
            >
              Edit Profile
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-2 mb-4 border rounded"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 mb-4 border rounded"
            />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 mb-4 border rounded"
            />
            <input
              type="text"
              name="surname"
              value={formData.surname}
              onChange={handleChange}
              className="w-full p-2 mb-4 border rounded"
            />
            <input
              type="text"
              name="cellNumber"
              value={formData.cellNumber}
              onChange={handleChange}
              className="w-full p-2 mb-4 border rounded"
            />

            <button
              type="submit"
              className="w-full bg-green-500 text-white p-2 rounded"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </form>
        )}

        <button
          className="mt-4 w-full bg-gray-500 text-white p-2 rounded"
          onClick={() => navigate("/")}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default Profile;
