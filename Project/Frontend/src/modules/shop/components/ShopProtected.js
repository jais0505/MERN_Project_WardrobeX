import { useEffect } from "react";

const ShopProtected = ({ children}) => {
  const sid = sessionStorage.getItem("sid");

  useEffect(() => {
    if (!sid) {
        window.location.replace("/login");
    }
  }, [sid]);

  if (!sid) return null;

  return children
}

export default ShopProtected