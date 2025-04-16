import { Navigate } from "react-router-dom";
import { useAuth } from "../hook/useAuth";
import { JSX } from "react";
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
