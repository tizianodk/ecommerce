import React from 'react';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Productos() {
    const API_URL = import.meta.env.VITE_API_URL;
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("nombre");
    const [filterBy, setFilterBy] = useState("todos");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_URL}/productos`);
                
                if (!response.ok) {
                    throw new Error("Error en la respuesta de la API");
                }
                const data = await response.json();
                console.log(data);
                setProductos(data);
            } catch (error) {
                console.error("Error al obtener los productos:", error);
                setError("Error al cargar los productos. Por favor, intenta de nuevo.");
            } finally {
                setLoading(false);
            }
        };

        fetchProductos();
    }, []);

    // Filtrar y ordenar productos
    const productosFiltrados = productos
        .filter(producto => 
            producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            producto.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            switch (sortBy) {
                case "precio-asc":
                    return a.precio - b.precio;
                case "precio-desc":
                    return b.precio - a.precio;
                case "nombre":
                default:
                    return a.nombre.localeCompare(b.nombre);
            }
        });

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Cargando productos...</p>
                </div>
            </div>
    )}

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Error al cargar productos</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">Nuestros Productos</h1>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Descubre nuestra amplia selección de productos de alta calidad
                        </p>
                    </div>

                    {/* Barra de búsqueda y filtros */}
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                        {/* Búsqueda */}
                        <div className="relative flex-1 max-w-md">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                placeholder="Buscar productos..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Ordenar */}
                        <div className="flex items-center space-x-4">
                            <label className="text-sm font-medium text-gray-700">Ordenar por:</label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="nombre">Nombre A-Z</option>
                                <option value="precio-asc">Precio: Menor a Mayor</option>
                                <option value="precio-desc">Precio: Mayor a Menor</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Productos */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Estadísticas */}
                <div className="mb-6 flex items-center justify-between">
                    <p className="text-gray-600">
                        {productosFiltrados.length} {productosFiltrados.length === 1 ? 'producto encontrado' : 'productos encontrados'}
                        {searchTerm && ` para "${searchTerm}"`}
                    </p>
                    
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm("")}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                        >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Limpiar búsqueda
                        </button>
                    )}
                </div>

                {/* Grid de productos */}
                {Array.isArray(productosFiltrados) && productosFiltrados.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {productosFiltrados.map((producto) => (
                            <div 
                                key={producto._id} 
                                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
                            >
                                {/* Imagen del producto */}
                                <div className="relative aspect-square bg-gray-100 overflow-hidden">
                                    <img 
                                        src={`${API_URL}/uploads/${producto.imagen}`} 
                                        alt={producto.nombre}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    
                                    {/* Overlay con acciones */}
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                                        <button
                                            onClick={() => navigate(`/producto/${producto._id}`)}
                                            className="bg-white text-gray-900 px-4 py-2 rounded-lg font-medium opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-gray-50"
                                        >
                                            Ver Detalles
                                        </button>
                                    </div>
                                    
                                    {/* Badge de precio */}
                                    <div className="absolute top-4 right-4">
                                        <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                            ${producto.precio}
                                        </span>
                                    </div>
                                </div>

                                {/* Información del producto */}
                                <div className="p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                                        {producto.nombre}
                                    </h3>
                                    
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                        {producto.descripcion}
                                    </p>
                                    
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-1">
                                            <div className="flex text-yellow-400">
                                                {[...Array(5)].map((_, i) => (
                                                    <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                                    </svg>
                                                ))}
                                            </div>
                                            <span className="text-sm text-gray-500">(4.5)</span>
                                        </div>
                                        
                                        <button
                                            onClick={() => navigate(`/producto/${producto._id}`)}
                                            className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center group"
                                        >
                                            Ver más
                                            <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {searchTerm ? 'No se encontraron productos' : 'No hay productos disponibles'}
                        </h3>
                        <p className="text-gray-600 mb-6">
                            {searchTerm 
                                ? `No encontramos productos que coincidan con "${searchTerm}"`
                                : 'Actualmente no tenemos productos en el catálogo.'
                            }
                        </p>
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm("")}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                            >
                                Ver todos los productos
                            </button>
                        )}
                    </div>
                )}

                {/* Paginación (placeholder para futura implementación) */}
                {productosFiltrados.length > 12 && (
                    <div className="mt-12 flex justify-center">
                        <div className="flex items-center space-x-2">
                            <button className="px-4 py-2 text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                Anterior
                            </button>
                            <button className="px-4 py-2 text-white bg-blue-600 border border-blue-600 rounded-lg">
                                1
                            </button>
                            <button className="px-4 py-2 text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                2
                            </button>
                            <button className="px-4 py-2 text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                3
                            </button>
                            <button className="px-4 py-2 text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                Siguiente
                            </button>
                        </div>
                    </div>
                )}
            </div>

        </div>
    )};

export default Productos;