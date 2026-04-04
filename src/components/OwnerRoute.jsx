import { Navigate } from "react-router-dom";
import { isOwnerLoggedIn } from "../utils/auth";

export default function OwnerRoute({ children }) {
  if (!isOwnerLoggedIn()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
