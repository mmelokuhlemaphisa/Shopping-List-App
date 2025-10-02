// src/pages/ShoppingListPage.tsx
import React from "react";
import NavBar from "../components/Navbar";
import Footer from "../components/Footer";
import ShoppingBoard from "../components/ShoppingBoard";

const ShoppingListPage: React.FC = () => {
  return (
    <div className="page-layout">
      {/* Top Navigation */}
      <NavBar />

      {/* Main Content */}
      <main className="page-main">
        <h1 className="page-title">🛒 My Shopping List</h1>
        <ShoppingBoard />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ShoppingListPage;
