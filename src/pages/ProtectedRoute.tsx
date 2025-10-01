// import React from "react";
// import { Navigate } from "react-router-dom";
// import { useSelector } from "react-redux";
// import type { RootState } from "../../store";

// interface ProtectedRouteProps {
//   children: JSX.Element;
// }

// const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
//   const userId = useSelector((state: RootState) => state.login.userId);

//   if (!userId) {
//     // User is not logged in, redirect to login
//     return <Navigate to="/login" replace />;
//   }

//   // User is logged in, render the child component
//   return children;
// };

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
