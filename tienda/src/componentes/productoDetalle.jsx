import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function ProductoDetalle({ productos, agregarAlCarrito }) {
    const API_URL = import.meta.env.VITE_API_URL;
    const { id } = useParams();
    const navigate = useNavigate();
    const [resenas, setResenas] = useState([]);
    const [nuevaResena, setNuevaResena] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [imagenActual, setImagenActual] = useState(0);

    useEffect(() => {
        const fetchResenas = async () => {
            try {
                const response = await fetch(`${API_URL}/productos/${id}/resenas`);
                if (!response.ok) {
                    throw new Error("Error al obtener las resenas");
                }
                const data = await response.json();
                setResenas(data.resenas || []);
            } catch (error) {
                console.error("Error al obtener las resenas:", error);
                setResenas([]);
            }
        };

        fetchResenas();
    }, [id]);

    useEffect(() => {
        if (resenas.length > 1) {
            const interval = setInterval(() => {
                setCurrentIndex((prevIndex) => 
                    prevIndex === resenas.length - 1 ? 0 : prevIndex + 1
                );
            }, 3000);

            return () => clearInterval(interval);
        }
    }, [resenas]);

    if (!productos || !Array.isArray(productos) || productos.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Cargando producto...</p>
                </div>
            </div>
        );
    }

    const producto = productos.find((producto) => producto._id === id);

    if (!producto) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Producto no encontrado</h2>
                    <button 
                        onClick={() => navigate('/productos')}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                        Ver todos los productos
                    </button>
                </div>
            </div>
        );
    }

    const enviarResena = async () => {
        if (nuevaResena.trim() === "") {
            alert("Por favor, escribe una resena antes de enviar.");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/productos/${id}/resenas`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ productoId: id, texto: nuevaResena }),
            });
            
            if (!response.ok) {
                throw new Error("Error al enviar la resena");
            }
            
            const nuevaResenaData = await response.json();
            setResenas([...resenas, nuevaResenaData]);
            setNuevaResena("");
            alert("¡Reseña enviada exitosamente!");
        } catch (error) {
            console.error("Error al enviar la resena:", error);
            alert("Error al enviar la resena. Por favor, inténtalo de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    const imagenes = Array.isArray(producto.imagenes) ? producto.imagenes : [producto.imagen];

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumb */}
                <nav className="flex mb-8" aria-label="Breadcrumb">
                    <ol className="inline-flex items-center space-x-1 md:space-x-3">
                        <li className="inline-flex items-center">
                            <button 
                                onClick={() => navigate('/productos')}
                                className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600"
                            >
                                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                                </svg>
                                Productos
                            </button>
                        </li>
                        <li aria-current="page">
                            <div className="flex items-center">
                                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                                </svg>
                                <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">{producto.nombre}</span>
                            </div>
                        </li>
                    </ol>
                </nav>

                {/* Producto principal */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
                        {/* Galería de imágenes */}
                        <div className="space-y-4">
                            <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
                                <img 
                                    src={`${API_URL}/uploads/${imagenes[imagenActual]}`} 
                                    alt={producto.nombre}
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                            
                            {imagenes.length > 1 && (
                                <div className="flex space-x-2 overflow-x-auto pb-2">
                                    {imagenes.map((imagen, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setImagenActual(index)}
                                            className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                                                imagenActual === index ? 'border-blue-600' : 'border-transparent hover:border-gray-300'
                                            }`}
                                        >
                                            <img 
                                                src={`${API_URL}/uploads/${imagen}`} 
                                                alt={`Vista ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Información del producto */}
                        <div className="space-y-6">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">{producto.nombre}</h1>
                                <div className="flex items-center space-x-4">
                                    <span className="text-3xl font-bold text-blue-600">${producto.precio}</span>
                                    <span className="text-sm text-green-600 bg-green-100 px-3 py-1 rounded-full">
                                        En stock
                                    </span>
                                </div>
                            </div>

                            <div className="border-t border-gray-200 pt-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">Descripción</h3>
                                <p className="text-gray-700 leading-relaxed">{producto.descripcion}</p>
                            </div>

                            <div className="border-t border-gray-200 pt-6">
                                
                                
                                
                                
                                
                                
                                
                                
                                
                                
                                <button 
                                    onClick={() => agregarAlCarrito(producto)}
                                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                                >
                                    <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5.5M7 13l2.5 5.5m0 0L17 21" />
                                    </svg>
                                    Agregar al Carrito
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sección de reseñas */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                    {/* Escribir reseña */}
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Escribir Reseña</h3>
                        <div className="space-y-4">
                            <textarea
                                placeholder="Comparte tu experiencia con este producto..."
                                value={nuevaResena}
                                onChange={(e) => setNuevaResena(e.target.value)}
                                rows="4"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            />
                            <button 
                                onClick={enviarResena}
                                disabled={loading || !nuevaResena.trim()}
                                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
                            >
                                {loading ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                ) : (
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                )}
                                {loading ? 'Enviando...' : 'Enviar Reseña'}
                            </button>
                        </div>
                    </div>

                    {/* Ver reseñas */}
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Reseñas de Clientes</h3>
                        
                        {resenas.length > 0 ? (
                            <div className="space-y-4">
                                <div className="bg-gray-50 rounded-lg p-4 min-h-[120px] flex items-center">
                                    <div className="w-full">
                                        <div className="flex items-start space-x-3">
                                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <div className="flex-1 overflow-hidden">
                                                <p className="text-gray-700 leading-relaxed break-words whitespace-normal overflow-wrap">
                                                    {resenas[currentIndex] ? resenas[currentIndex].texto : "No hay reseña disponible"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                {resenas.length > 1 && (
                                    <div className="flex justify-center items-center space-x-2">
                                        {resenas.map((_, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setCurrentIndex(index)}
                                                className={`w-2 h-2 rounded-full transition-all ${
                                                    currentIndex === index ? 'bg-blue-600 w-8' : 'bg-gray-300 hover:bg-gray-400'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                )}
                                
                                <div className="text-center text-sm text-gray-500">
                                    Mostrando reseña {currentIndex + 1} de {resenas.length}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                </div>
                                <p className="text-gray-500">Aún no hay reseñas para este producto.</p>
                                <p className="text-sm text-gray-400 mt-2">¡Sé el primero en compartir tu opinión!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductoDetalle;