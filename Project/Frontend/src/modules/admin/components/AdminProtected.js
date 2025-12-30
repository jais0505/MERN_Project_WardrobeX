import { Children, useEffect } from "react";

const AdminProtected = ({ children}) => {
  const aid = sessionStorage.getItem('aid');

  useEffect(() => {
    if (!aid) {
        window.location.replace('/login');
    }
  }, [aid]);

  if(!aid) return null;

  return children;
}

export default AdminProtected