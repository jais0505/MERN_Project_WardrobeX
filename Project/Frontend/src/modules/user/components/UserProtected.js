import { useEffect } from "react";

const UserProtected = ({ children }) => {
  const uid = sessionStorage.getItem("uid");

  useEffect(() => {
    if (!uid) {
      window.location.replace("/login");   // prevents back navigation
    }
  }, [uid]);

  if (!uid) return null;   // don't flash UI

  return children;
};

export default UserProtected;
