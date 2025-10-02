import React from "react";
import NavBar from "../components/Navbar";
import Footer from "../components/Footer";

const Privacy: React.FC = () => {
  return (
    <div>
      <NavBar />
      <div className="page-container">
        <h1 className="page-title">Privacy Policy</h1>
        <p className="page-subtitle">
          Your privacy is important to us. Below is a summary of how we handle
          your information.
        </p>

        <div className="privacy-section">
          <h2>1. Information We Collect</h2>
          <p>
            We only collect the information you provide when using Shopping
            Manager, such as your name and email when contacting us.
          </p>

          <h2>2. How We Use Your Information</h2>
          <p>
            Your data is used only to improve your experience and provide
            support. We never sell your information.
          </p>

          <h2>3. Data Security</h2>
          <p>
            We use industry-standard security measures to protect your data.
          </p>

          <h2>4. Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy, please contact us
            at <strong>privacy@shoppingmanager.com</strong>.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Privacy;
