import React from "react";

import Footer from "../components/Footer";
import shopping from "../assets/shopping.jpg";
import { Link } from "react-router";

const LandingPage: React.FC = () => {
  return (
    <div className="landing-page">
      <nav className="navbar">
            <h1 className="navbar-title">ShopMate</h1>
            <div className="navbar-links">
              
              
             
            </div>
          </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-text">
          <h1 className="hero-title">Shopping List</h1>
          <p className="hero-subtitle">
            Keep track of your shopping items, categories, quantities, and notes
            all in one place.
          </p>

          <Link to="/login">
          <button className="cta-button">Get Started</button>
          </Link>

        </div>
        <div className="hero-image">
          <img src={shopping} alt="Shopping illustration" />
        </div>
      </section>

      <section className="features-section">
        <h2>Why Choose Our App?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Organize Your Lists</h3>
            <p>Create multiple shopping lists and categorize them easily.</p>
          </div>
          <div className="feature-card">
            <h3>Track Quantities</h3>
            <p>Keep a record of quantities to never overbuy or forget items.</p>
          </div>
          <div className="feature-card">
            <h3>Add Notes & Images</h3>
            <p>Attach notes and images for clarity on what to buy.</p>
          </div>
        </div>
      </section>

   
      <section className="about-section">
        <h2>About Us</h2>
        <p>
          Our mission is to make shopping simple, organized, and stress-free.
          With our app, you can create multiple shopping lists, categorize your
          items, track quantities, add notes, and even attach images. We aim to
          help everyone save time and avoid unnecessary purchases.
        </p>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
