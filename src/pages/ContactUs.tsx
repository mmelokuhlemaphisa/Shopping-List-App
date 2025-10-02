import React from "react";
import NavBar from "../components/Navbar";
import Footer from "../components/Footer";

const Contact: React.FC = () => {
  return (
    <div>
      <NavBar />
      <div className="page-container">
        <h1 className="page-title">Contact Us</h1>
        <p className="page-subtitle">
          We'd love to hear from you! Please use the form below or reach out
          using the details provided.
        </p>

        <form className="contact-form">
          <input type="text" placeholder="Your Name" className="form-input" />
          <input type="email" placeholder="Your Email" className="form-input" />
          <textarea
            placeholder="Your Message"
            className="form-textarea"
            rows={5}
          ></textarea>
          <button type="submit" className="form-button">
            Send Message
          </button>
        </form>

        <div className="contact-info">
          <p>
            <strong>Email:</strong> support@shopMate.com
          </p>
          <p>
            <strong>Phone:</strong> +27 12 345 6789
          </p>
          <p>
            <strong>Address:</strong> Kwazulu-Natal, South Africa
          </p>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Contact;
