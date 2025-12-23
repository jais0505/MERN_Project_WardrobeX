import { useEffect } from "react";

const UserProtected = ({ children }) => {
  const uid = sessionStorage.getItem("uid");

  useEffect(() => {
    if (!uid) {
      window.location.replace("/login");
    }
  }, [uid]);

  if (!uid) return null;   

  return children;
};

export default UserProtected;
