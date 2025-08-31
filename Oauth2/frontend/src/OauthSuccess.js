import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function OauthSuccess() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("serverToken", token);
      navigate("/dashboard"); // przekierowanie np. do panelu użytkownika
    }
  }, [location, navigate]);

  return <p>Logowanie zakończone...</p>;
}
