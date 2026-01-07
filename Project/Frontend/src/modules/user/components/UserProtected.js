import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const UserProtected = ({ children }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = sessionStorage.getItem('token');
    if (!storedToken) {
      navigate("/login", { replace: true });
    }
    setLoading(false);
  }, [navigate]);

  if (loading) return null;
  return children;
};

export default UserProtected;