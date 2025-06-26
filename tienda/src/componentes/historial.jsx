import React, { useEffect, useState } from "react";
import axios from "axios";

const OrdenHistorial = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtro, setFiltro] = useState('todas');
  const [ordenamiento, setOrdenamiento] = useState('reciente');

  useEffect(() => {
    fetchOrdenes();
  }, []);

  const fetchOrdenes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`${API_URL}/ordenes`);
      const data = Array.isArray(response.data) ? response.data : response.data.ordenes || [];
      
      setOrdenes(data);
    } catch (err) {
      console.error("Error al traer las órdenes:", err);
      setError("Error al cargar el historial de órdenes. Por favor, intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(precio);
  };

  const obtenerEstadoOrden = (fecha) => {
    const diasPasados = Math.floor((new Date() - new Date(fecha)) / (1000 * 60 * 60 * 24));
    if (diasPasados < 1) return { estado: 'Procesando', clase: 'bg-yellow-100 text-yellow-800' };
    if (diasPasados < 3) return { estado: 'En camino', clase: 'bg-blue-100 text-blue-800' };
    return { estado: 'Entregado', clase: 'bg-green-100 text-green-800' };
  };

  const filtrarOrdenes = () => {
    let ordenesFiltradas = [...ordenes];

    // Aplicar filtro
    if (filtro !== 'todas') {
      ordenesFiltradas = ordenesFiltradas.filter(orden => {
        const { estado } = obtenerEstadoOrden(orden.createdAt);
        return estado.toLowerCase().includes(filtro);
      });
    }

    // Aplicar ordenamiento
    ordenesFiltradas.sort((a, b) => {
      if (ordenamiento === 'reciente') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (ordenamiento === 'antiguo') {
        return new Date(a.createdAt) - new Date(b.createdAt);
      } else if (ordenamiento === 'mayor') {
        return b.total - a.total;
      } else if (ordenamiento === 'menor') {
        return a.total - b.total;
      }
      return 0;
    });

    return ordenesFiltradas;
  };

  const calcularTotalProductos = (items) => {
    return items?.reduce((total, item) => total + (item.cantidad || 0), 0) || 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Cargando historial de órdenes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md mx-4">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={fetchOrdenes} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const ordenesFiltradas = filtrarOrdenes();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            📋 Historial de Órdenes
          </h1>
          <p className="text-gray-600 text-lg">
            Aquí puedes ver todas tus compras realizadas
          </p>
        </div>

        {ordenes.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <div className="text-8xl mb-6">🛒</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">No hay órdenes registradas</h3>
            <p className="text-gray-600 mb-8">Cuando realices tu primera compra, aparecerá aquí.</p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors duration-200">
              Explorar Productos
            </button>
          </div>
        ) : (
          <>
            {/* Controles de filtro y ordenamiento */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex flex-col">
                    <label htmlFor="filtro" className="text-sm font-medium text-gray-700 mb-2">
                      Filtrar por estado:
                    </label>
                    <select 
                      id="filtro"
                      value={filtro} 
                      onChange={(e) => setFiltro(e.target.value)}
                      className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="todas">Todas las órdenes</option>
                      <option value="procesando">Procesando</option>
                      <option value="enviando">En camino</option>
                      <option value="entregado">Entregadas</option>
                    </select>
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="ordenamiento" className="text-sm font-medium text-gray-700 mb-2">
                      Ordenar por:
                    </label>
                    <select 
                      id="ordenamiento"
                      value={ordenamiento} 
                      onChange={(e) => setOrdenamiento(e.target.value)}
                      className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="reciente">Más reciente</option>
                      <option value="antiguo">Más antiguo</option>
                      <option value="mayor">Mayor precio</option>
                      <option value="menor">Menor precio</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Estadísticas rápidas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                <h4 className="text-lg font-semibold mb-2">Total de Órdenes</h4>
                <span className="text-3xl font-bold">{ordenes.length}</span>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
                <h4 className="text-lg font-semibold mb-2">Total Gastado</h4>
                <span className="text-3xl font-bold">
                  {formatearPrecio(ordenes.reduce((sum, orden) => sum + orden.total, 0))}
                </span>
              </div>
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                <h4 className="text-lg font-semibold mb-2">Productos Comprados</h4>
                <span className="text-3xl font-bold">
                  {ordenes.reduce((sum, orden) => sum + calcularTotalProductos(orden.items), 0)}
                </span>
              </div>
            </div>

            {/* Lista de órdenes */}
            <div className="space-y-6">
              {ordenesFiltradas.map((orden) => {
                const { estado, clase } = obtenerEstadoOrden(orden.createdAt);
                
                return (
                  <div key={orden._id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                    <div className="p-6">
                      {/* Header de la orden */}
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                        <div className="flex items-center gap-4 mb-4 sm:mb-0">
                          <h3 className="text-xl font-bold text-gray-800">
                            Orden #{orden._id?.slice(-8) || 'N/A'}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${clase}`}>
                            {estado}
                          </span>
                        </div>
                        <div className="text-gray-600">
                          {formatearFecha(orden.createdAt)}
                        </div>
                      </div>

                      {/* Información del usuario */}
                      <div className="mb-6">
                        <p className="text-gray-700 flex items-center">
                          <span className="mr-2">👤</span>
                          <strong>Cliente:</strong> 
                          <span className="ml-2">{orden.user?.nombre || "Usuario no disponible"}</span>
                        </p>
                      </div>

                      {/* Lista de productos */}
                      <div className="mb-6">
                        <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                          📦 Productos ({calcularTotalProductos(orden.items)} items)
                        </h4>
                        <div className="grid gap-3">
                          {orden.items?.map((item, index) => (
                            <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                              <div className="flex-1">
                                <span className="font-medium text-gray-800">
                                  {item.producto?.nombre || "Producto no disponible"}
                                </span>
                                <span className="ml-3 text-gray-600">
                                  x{item.cantidad}
                                </span>
                              </div>
                              {item.precio && (
                                <span className="font-semibold text-gray-800">
                                  {formatearPrecio(item.precio * item.cantidad)}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Footer de la orden */}
                      <div className="flex flex-col sm:flex-row justify-between items-center pt-6 border-t border-gray-200">
                        <div className="flex items-center mb-4 sm:mb-0">
                          <span className="text-gray-600 mr-3">Total:</span>
                          <span className="text-2xl font-bold text-gray-800">
                            {formatearPrecio(orden.total)}
                          </span>
                        </div>
                        <div className="flex gap-3">
                          <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                            Ver Detalles
                          </button>
                          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                            Recomprar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {ordenesFiltradas.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">
                  No se encontraron órdenes con los filtros seleccionados.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default OrdenHistorial;