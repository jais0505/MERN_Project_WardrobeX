import { useEffect } from "react";
import { useNavigate } from "react-router";

const UserProtected = ({ children }) => {
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login", { replace: true });
    }
  }, [token, navigate]);

  if (!token) return null;

  return children;
};

export default UserProtected;
