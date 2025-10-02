import React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";

const WelcomeCard: React.FC = () => {
  const { name } = useSelector((state: RootState) => state.profile);

  return (
    <div className="welcome-card">
      <h2>👋 Welcome back, {name || "Guest"}!</h2>
      <p>What would you like to do today?</p>
    </div>
  );
};

export default WelcomeCard;
