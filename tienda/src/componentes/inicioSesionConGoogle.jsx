import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const InicioSesionConGoogle = ({setIsAuthenticated, setRol, setUser}) => {
  const navigate = useNavigate();

  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id: "382958214614-t2qsai5g234vth6m7ft3srrppfdoi3o0.apps.googleusercontent.com", // Reemplaza con tu Client ID
      callback: handleCallbackResponse,
    });

    google.accounts.id.renderButton(
      document.getElementById("google-signin-button"),
      { theme: "outline", size: "large" } // Opciones del botón
    );
  }, []);

  const handleCallbackResponse = (response) => {
    console.log("Token de Google:", response.credential);
    // Envía el token al backend para validarlo
    fetch("https://ecommerce-9o4q.onrender.com/auth/google/callback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: response.credential }),
      })
        .then((res) => {
          console.log("Respuesta del backend:", res);
          return res.json();
        })
        .then((data) => {
          console.log("Datos procesados:", data);
          localStorage.setItem("token", data.token); // Guardar el token en localStorage
          localStorage.setItem("user", JSON.stringify(data.user)); // Guardar la información del usuario
      
          setIsAuthenticated(true);
          setRol(data.user.rol);
          setUser(data.user)
      
          navigate("/"); // Redirigir al dashboard
        })
        .catch((err) => console.error("Error al iniciar sesion con Google:", err));};

  return <div id="google-signin-button"></div>;
};

export default InicioSesionConGoogle;