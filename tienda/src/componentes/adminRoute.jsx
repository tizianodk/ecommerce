import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { AlertCircle, Shield, Loader } from "lucide-react";

const AdminRoute = ({ children }) => {
  
  const API_URL = import.meta.env.VITE_API_URL;
  const [isValidating, setIsValidating] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    validateAuth();
  }, []);

  const validateAuth = async () => {
    try {
      const token = localStorage.getItem("token");
      const rol = localStorage.getItem("rol");

      // Verificación básica
      if (!token || !rol) {
        setIsAuthorized(false);
        setIsValidating(false);
        return;
      }

      if (rol !== "admin") {
        setError("No tienes permisos de administrador");
        setIsAuthorized(false);
        setIsValidating(false);
        return;
      }

      // Validar token con el servidor (opcional pero recomendado)
      try {
        const response = await fetch(`${API_URL}/auth/validate`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.rol === "admin") {
            setIsAuthorized(true);
          } else {
            setError("Token válido pero sin permisos de administrador");
            setIsAuthorized(false);
          }
        } else {
          // Token inválido o expirado
          localStorage.removeItem("token");
          localStorage.removeItem("rol");
          setError("Sesión expirada. Por favor, inicia sesión nuevamente");
          setIsAuthorized(false);
        }
      } catch (fetchError) {
        // Si no se puede validar con el servidor, usar validación local
        console.warn("No se pudo validar el token con el servidor:", fetchError);
        setIsAuthorized(true);
      }
    } catch (error) {
      console.error("Error en validación de autenticación:", error);
      setError("Error al validar la autenticación");
      setIsAuthorized(false);
    } finally {
      setIsValidating(false);
    }
  };

  // Función para limpiar la sesión
  const clearSession = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("rol");
  };

  // Pantalla de carga mientras se valida
  if (isValidating) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-sm">
          <div className="flex flex-col items-center space-y-4">
            <Loader className="w-8 h-8 animate-spin text-indigo-600" />
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900">
                Validando permisos...
              </h3>
              <p className="text-sm text-gray-600">
                Verificando tu acceso de administrador
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Si no está autorizado, mostrar mensaje y redirigir
  if (!isAuthorized) {
    // Limpiar sesión si hay error
    if (error.includes("expirada") || error.includes("inválido")) {
      clearSession();
    }

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-sm max-w-md w-full mx-4">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Acceso Denegado
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {error || "No tienes permisos para acceder a esta página"}
              </p>
              
              <div className="space-y-2">
                <p className="text-xs text-gray-500">
                  Se requieren permisos de administrador
                </p>
              </div>
            </div>
            
            <div className="w-full pt-4">
              <Navigate to="/login" replace />
              <div className="text-center">
                <a 
                  href="/login" 
                  className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                >
                  <Shield size={16} />
                  Ir al Login
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Si está autorizado, renderizar los children
  return children;
};

export default AdminRoute;