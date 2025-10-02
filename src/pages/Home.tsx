import React from "react";
import NavBar from "../components/Navbar";
import Footer from "../components/Footer";
import ShoppingList from "../components/ShoppingList";

const Home: React.FC = () => {
  return (
    <div className="home-page">
     
      <NavBar />

   
      <main className="main-content">
    
        <section className="welcome-section">
          <h1 className="welcome-title">Welcome to Shopping Manager!</h1>
          <p className="welcome-text">
            Organize your shopping items, keep track of categories, quantities,
            and notes all in one place.
          </p>
        </section>

       
        <ShoppingList />
      </main>

      <Footer />
    </div>
  );
};

export default Home;
