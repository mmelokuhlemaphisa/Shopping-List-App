

// export default ProtectedRoute;
import React, { type JSX } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const userId = useSelector((state: RootState) => state.login.id);

  if (!userId) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
