import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingCart, CreditCard } from "lucide-react";

function Carrito({ carrito, setCarrito }) {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(null);
  const [animandoItem, setAnimandoItem] = useState(null);

  // Función para eliminar completamente un item
  const handleRemoveCompleteItem = (id) => {
    setAnimandoItem(id);
    setTimeout(() => {
      const nuevoCarrito = carrito.filter(item => item._id !== id);
      setCarrito(nuevoCarrito);
      setAnimandoItem(null);
      setMostrarConfirmacion(null);
    }, 300);
  };

  // Función para disminuir cantidad
  const handleDecreaseItem = (id) => {
    const nuevoCarrito = carrito.reduce((acc, item) => {
      if (item._id === id) {
        if (item.cantidad > 1) {
          acc.push({ ...item, cantidad: item.cantidad - 1 });
        }
        // Si cantidad es 1, no lo agregamos (lo eliminamos)
      } else {
        acc.push(item);
      }
      return acc;
    }, []);
    setCarrito(nuevoCarrito);
  };

  // Función para aumentar cantidad
  const handleIncreaseItem = (id) => {
    const nuevoCarrito = carrito.map(item => 
      item._id === id 
        ? { ...item, cantidad: item.cantidad + 1 }
        : item
    );
    setCarrito(nuevoCarrito);
  };

  // Función para actualizar cantidad directamente
  const handleQuantityChange = (id, nuevaCantidad) => {
    const cantidad = parseInt(nuevaCantidad) || 1;
    
    if (cantidad < 1) {
      handleDecreaseItem(id);
      return;
    }
    
    const nuevoCarrito = carrito.map(item => 
      item._id === id 
        ? { ...item, cantidad: cantidad }
        : item
    );
    setCarrito(nuevoCarrito);
  };

  // Calcular totales
  const subtotal = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
  const cantidadTotal = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  
  // Simular impuestos y envío (puedes ajustar según tus necesidades)
  //const impuestos = subtotal * 0.1; // 10% de impuestos
  const envio = subtotal > 50 ? 0 : 5; // Envío gratis si es mayor a $50
  const total = subtotal + envio;

  // Componente Modal de confirmación
  const ConfirmacionModal = ({ item, onConfirm, onCancel }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Confirmar eliminación
        </h3>
        <p className="text-gray-600 mb-6">
          ¿Estás seguro de que quieres eliminar <strong>{item.nombre}</strong> del carrito?
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-sm">
        {/* Header del carrito */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-6 h-6 text-indigo-600" />
            <h2 className="text-2xl font-bold text-gray-900">
              Carrito de Compras
            </h2>
            {cantidadTotal > 0 && (
              <span className="bg-indigo-100 text-indigo-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                {cantidadTotal} {cantidadTotal === 1 ? 'item' : 'items'}
              </span>
            )}
          </div>
        </div>

        {/* Contenido del carrito */}
        <div className="p-6">
          {carrito.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Tu carrito está vacío
              </h3>
              <p className="text-gray-600 mb-6">
                Agrega algunos productos para comenzar tu compra
              </p>
              <button
                onClick={() => navigate("/productos")}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Ver Productos
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Items del carrito */}
              <div className="space-y-4">
                {carrito.map((item) => (
                  <div
                    key={item._id}
                    className={`border border-gray-200 rounded-lg p-4 transition-all duration-300 ${
                      animandoItem === item._id ? 'opacity-0 transform scale-95' : 'opacity-100 transform scale-100'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {/* Imagen del producto */}
                      <div className="flex-shrink-0">
                        <img
                          src={`${API_URL}/uploads/${item.imagen}`}
                          alt={item.nombre}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      </div>

                      {/* Información del producto */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {item.nombre}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          ${parseFloat(item.precio).toFixed(2)} c/u
                        </p>
                        
                        {/* Controles de cantidad */}
                        <div className="flex items-center gap-3">
                          <div className="flex items-center border border-gray-300 rounded-lg">
                            <button
                              onClick={() => handleDecreaseItem(item._id)}
                              className="p-2 hover:bg-gray-100 transition-colors rounded-l-lg"
                              aria-label="Disminuir cantidad"
                            >
                              <Minus size={16} />
                            </button>
                            
                            <input
                              type="number"
                              value={item.cantidad}
                              onChange={(e) => handleQuantityChange(item._id, e.target.value)}
                              className="w-16 text-center border-0 focus:ring-0 py-2"
                              min="1"
                            />
                            
                            <button
                              onClick={() => handleIncreaseItem(item._id)}
                              className="p-2 hover:bg-gray-100 transition-colors rounded-r-lg"
                              aria-label="Aumentar cantidad"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                          
                          <span className="text-sm text-gray-500">
                            {item.cantidad} {item.cantidad === 1 ? 'unidad' : 'unidades'}
                          </span>
                        </div>
                      </div>

                      {/* Precio total del item y botón eliminar */}
                      <div className="flex flex-col items-end gap-2">
                        <div className="text-right">
                          <p className="text-xl font-bold text-gray-900">
                            ${(parseFloat(item.precio) * item.cantidad).toFixed(2)}
                          </p>
                        </div>
                        
                        <button
                          onClick={() => setMostrarConfirmacion(item)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          aria-label="Eliminar producto"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Resumen de la compra */}
              <div className="border-t border-gray-200 pt-6 mt-8">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Resumen de la Compra
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal ({cantidadTotal} items)</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between text-gray-600">
                      <span>
                        Envío {subtotal > 50 && <span className="text-green-600 text-xs">(Gratis)</span>}
                      </span>
                      <span>{envio === 0 ? 'Gratis' : `$${envio.toFixed(2)}`}</span>
                    </div>
                    
                    {subtotal <= 50 && (
                      <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
                        💡 Agrega ${(50 - subtotal).toFixed(2)} más para obtener envío gratis
                      </div>
                    )}
                    
                    <div className="border-t border-gray-300 pt-3">
                      <div className="flex justify-between text-xl font-bold text-gray-900">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Botones de acción */}
                  <div className="flex flex-col sm:flex-row gap-3 mt-6">
                    <button
                      onClick={() => navigate("/productos")}
                      className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                    >
                      Continuar Comprando
                    </button>
                    
                    <button
                      onClick={() => navigate("/pago")}
                      className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2"
                    >
                      <CreditCard size={20} />
                      Proceder al Pago
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de confirmación */}
      {mostrarConfirmacion && (
        <ConfirmacionModal
          item={mostrarConfirmacion}
          onConfirm={() => handleRemoveCompleteItem(mostrarConfirmacion._id)}
          onCancel={() => setMostrarConfirmacion(null)}
        />
      )}
    </div>
  );
}

export default Carrito;