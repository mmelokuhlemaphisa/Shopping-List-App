import React, { useEffect, useState, type FormEvent } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../store";
import { fetchProfile, updateProfile } from "../features/ProfileSlice";
import { useToast } from "../components/Toast";
import { useNavigate } from "react-router-dom";
import "../App.css";

const Profile: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const toast = useToast();

  const userId = useSelector((state: RootState) => state.login.id);

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

  useEffect(() => {
    if (userId) {
      dispatch(fetchProfile(userId));
    }
  }, [dispatch, userId]);

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
      await dispatch(
        updateProfile({
          ...formData,
          id: userId,
          loading: false,
          error: null,
        })
      ).unwrap();
      toast.push("Profile updated!", "success");
      setEditMode(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        {/* Header with gradient */}
        <div className="profile-header">
          <div className="avatar-wrapper">
            <div className="avatar">👤</div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="profile-content">
          <h2 className="profile-name">
            {name} {surname || ""}
          </h2>

          {error && <p className="error-text">{error}</p>}

          {!editMode ? (
            <div className="profile-info">
              <p>
                <strong>Username:</strong> {username}
              </p>
              <br />
              <p>
                <strong>Email:</strong> {email}
              </p>
              <br />
              <p>
                <strong>Name:</strong> {name}
              </p>
              <br />
              <p>
                <strong>Surname:</strong> {surname}
              </p>
              <br />
              <p>
                <strong>Cell Number:</strong> {cellNumber}
              </p>

              <button className="btn primary" onClick={() => setEditMode(true)}>
                Edit Profile
              </button>
              <button className="back- btn" onClick={() => navigate("/")}>
                Logout
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="edit-form">
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Username"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
              />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
              />
              <input
                type="text"
                name="surname"
                value={formData.surname}
                onChange={handleChange}
                placeholder="Surname"
              />
              <input
                type="text"
                name="cellNumber"
                value={formData.cellNumber}
                onChange={handleChange}
                placeholder="Cell Number"
              />

              <button type="submit" className="btn success" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </form>
          )}

          <button className="btn secondary" onClick={() => navigate("/home")}>
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
