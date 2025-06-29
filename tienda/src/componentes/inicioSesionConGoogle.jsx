import React, { useEffect } from "react";
import { useGoogleLogin } from "react-google-login";
import { useNavigate } from "react-router-dom";
import "../estilos/inicioSesionConGoogle.css"; // Asegúrate de tener un archivo CSS para estilos

const InicioSesionConGoogle = () => {
  const clientId = import.meta.env.GOOGLE_CLIENT_ID; // Reemplaza con tu Client ID de Google
  const navigate = useNavigate();

  // Capturar el token desde la URL al cargar el componente
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      console.log("Token capturado:", token);
      localStorage.setItem("token", token); // Guardar el token en localStorage
      navigate("/dashboard"); // Redirigir al dashboard o página principal
    }
  }, [navigate]);

  const onSuccess = (response) => {
    console.log("Inicio de sesión exitoso:", response);
    // Enviar el token al backend para validarlo (si es necesario)
    fetch("https://ecommerce-9o4q.onrender.com/auth/google/callback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: response.tokenId }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Respuesta del backend:", data);
        // Guardar el token en localStorage si el backend lo devuelve
        localStorage.setItem("token", data.token);
      })
      .catch((err) => console.error("Error al enviar el token al backend:", err));
  };

  const onFailure = (error) => {
    console.error("Error al iniciar sesión con Google:", error);
  };

  const { signIn } = useGoogleLogin({
    clientId,
    onSuccess,
    onFailure,
    cookiePolicy: "single_host_origin",
  });

  return (
    <button onClick={signIn} className="google-login-button">
      Iniciar sesión con Google
    </button>
  );
};

export default InicioSesionConGoogle;