import { useEffect, useState } from "react";

function Pago({ carrito }) {
  const API_URL = import.meta.env.VITE_API_URL;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!carrito || carrito.length === 0) {
      setError("El carrito está vacío, no se puede procesar el pago");
      setLoading(false);
      return;
    }

    const carritoParaPago = carrito.map(item => ({
      nombre: item.nombre || item.title || "Producto sin nombre",
      precio: item.precio,
      cantidad: item.cantidad,
      productoId: item._id || item.id
    }));

    console.log("Items para pago:", carritoParaPago);

    const crearSesionPago = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/usuarios/pago`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ items: carritoParaPago })
        });

        const data = await response.json();
        if (data.url) {
          // Pequeño delay para mostrar la animación
          setTimeout(() => {
            window.location.href = data.url;
          }, 1500);
        } else {
          setError("No se pudo iniciar el proceso de pago");
          setLoading(false);
        }
      } catch (error) {
        console.error("Error al crear sesión de Stripe:", error);
        setError("Hubo un error al intentar procesar el pago");
        setLoading(false);
      }
    };

    crearSesionPago();
  }, [carrito, token]);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Error en el Pago</h2>
            <p className="text-gray-600">{error}</p>
          </div>
          <button 
            onClick={() => window.history.back()}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Volver al Carrito
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="mb-8">
          {/* Spinner animado */}
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
            <div className="absolute inset-2 bg-blue-50 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Procesando Pago</h2>
          <p className="text-gray-600 mb-4">Redirigiendo a Stripe...</p>
          
          {/* Barra de progreso animada */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full animate-pulse" style={{width: '75%'}}></div>
          </div>
          
          <p className="text-sm text-gray-500">Por favor, no cierres esta ventana</p>
        </div>
        
        {/* Resumen del carrito */}
        {carrito && carrito.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-4 text-left">
            <h3 className="font-semibold text-gray-800 mb-2">Resumen del pedido:</h3>
            <div className="space-y-1 text-sm text-gray-600">
              {carrito.slice(0, 3).map((item, index) => (
                <div key={index} className="flex justify-between">
                  <span>{item.nombre || item.title} x{item.cantidad}</span>
                  <span>${(item.precio * item.cantidad).toFixed(2)}</span>
                </div>
              ))}
              {carrito.length > 3 && (
                <div className="text-center text-gray-500 italic">
                  +{carrito.length - 3} productos más
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Pago;