import React from "react";
import { Link } from "react-router-dom";

const NavBar: React.FC = () => {
  return (
    <nav className="navbar">
      <h1 className="navbar-title">🛒ShopMate</h1>

      <div className="navbar-links">
        <Link to="/home" className="nav-link">
          Home
        </Link>
        <Link to="/profile" className="nav-link">
          Profile
        </Link>
        <Link to="/" className="nav-link">
          Logout
        </Link>
      </div>
    </nav>
  );
};

export default NavBar;
