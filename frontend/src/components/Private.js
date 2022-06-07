import { Navigate } from "react-router-dom";

export default function Private({ element }) {
  return localStorage.getItem("authToken") ? (
    element
  ) : (
    <Navigate to="/login" replace={true} />
  );
}
