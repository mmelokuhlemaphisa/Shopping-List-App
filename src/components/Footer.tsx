import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <p className="footer-text">
        © {new Date().getFullYear()} Shopping Manager. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
