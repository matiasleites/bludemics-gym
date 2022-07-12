import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./authContext";

export function RequireAuth({ children }) {
  const isLoggedbool = localStorage.getItem("uid");
  const { isLogged } = useAuth();
  let location = useLocation();
  if (isLogged || (isLoggedbool && isLoggedbool.length > 0)) {
    return children;
  } else {
    return <Navigate to="/home" state={{ from: location }} />;
  }
}
