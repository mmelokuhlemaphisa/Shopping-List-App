import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Left Section */}
        <div className="footer-left">
          <p className="footer-text">
            © {new Date().getFullYear()} Shopping Manager. All rights reserved.
          </p>
          <p className="footer-text">Designed by M Maphisa</p>
        </div>

       
        <div className="footer-links">
          <Link to="/contact" className="footer-text">
            Contact Us
          </Link>
          <Link to="/privacy" className="footer-text">
            Privacy Policy
          </Link>
          
        </div>
      </div>
    </footer>
  );
};

export default Footer;
