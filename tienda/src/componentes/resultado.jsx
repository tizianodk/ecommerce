import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

function Resultado({setCarrito}) {
    const API_URL = import.meta.env.VITE_API_URL;
    const [searchParams] = useSearchParams();
    const [recibo, setRecibo] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const status = searchParams.get("status");
    const sessionId = searchParams.get("session_id");
    

    useEffect(() => {
        // Vaciar el carrito al llegar a esta página
        setCarrito([]);
        localStorage.removeItem('carrito'); // También eliminar del localStorage
    }, [setCarrito]);

    useEffect(() => {
        if (status === "success" && sessionId) {
            const obtenerRecibo = async () => {
                try {
                    const response = await fetch(`${API_URL}/usuarios/recibo/${sessionId}`);
                    if (!response.ok) {
                        throw new Error("Error al obtener el recibo");
                    }
                    const data = await response.json();
                    setRecibo(data);
                } catch (error) {
                    setError(error.message);
                } finally {
                    setLoading(false);
                }
            };
            obtenerRecibo();
        } else {
            setLoading(false);
        }
    }, [status, sessionId]);

    const formatDate = (timestamp) => {
        return new Date(timestamp * 1000).toLocaleString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Procesando tu solicitud...</p>
                </div>
            </div>
        );
    }

    if (status === "cancel") {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center border-l-4 border-red-500">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">Pago Cancelado</h1>
                    <p className="text-gray-600 mb-6">Tu pago ha sido cancelado. No se realizó ningún cargo.</p>
                    <div className="space-y-3">
                        <button
                            onClick={() => navigate("/")}
                            className="w-full bg-red-500 hover:bg-red-600 text-white py-3 px-6 rounded-xl font-semibold transition-colors duration-200"
                        >
                            Volver a la Tienda
                        </button>
                        <button
                            onClick={() => navigate(-1)}
                            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-semibold transition-colors duration-200"
                        >
                            Intentar Nuevamente
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center border-l-4 border-red-500">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">Error</h1>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => navigate("/")}
                        className="w-full bg-red-500 hover:bg-red-600 text-white py-3 px-6 rounded-xl font-semibold transition-colors duration-200"
                    >
                        Volver a la Tienda
                    </button>
                </div>
            </div>
        );
    }

    if (recibo) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full border-l-4 border-green-500">
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">¡Pago Exitoso!</h1>
                        <p className="text-gray-600">Tu compra se ha procesado correctamente</p>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-6 mb-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                            <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                            Detalles del Pedido
                        </h2>
                        <div className="space-y-3">
                            {recibo.lineItems.data.map((item, index) => (
                                <div key={item.id} className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-200">
                                    <div className="flex items-center">
                                        <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                                            {item.quantity}
                                        </span>
                                        <span className="text-gray-700">{item.description}</span>
                                    </div>
                                    <span className="font-semibold text-gray-800">
                                        ${(item.amount_total / 100).toFixed(2)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div className="text-center p-4 bg-blue-50 rounded-xl">
                                <div className="text-2xl font-bold text-blue-600">
                                    ${(recibo.session.amount_total / 100).toFixed(2)}
                                </div>
                                <div className="text-sm text-gray-600">Total Pagado</div>
                            </div>
                            <div className="text-center p-4 bg-purple-50 rounded-xl">
                                <div className="text-lg font-semibold text-purple-600">
                                    {formatDate(recibo.session.created)}
                                </div>
                                <div className="text-sm text-gray-600">Fecha de Compra</div>
                            </div>
                            <div className="text-center p-4 bg-green-50 rounded-xl">
                                <div className="text-lg font-semibold text-green-600 w-auto">
                                    {recibo.session.customer_details?.name || "Cliente"}
                                </div>
                                <div className="text-sm text-gray-600">Cliente</div>
                            </div>
                        </div>

                        <div className="text-center">
                            <p className="text-gray-600 mb-6">
                                ¡Gracias por tu compra, <strong>{recibo.session.customer_details?.name || "Cliente"}</strong>!
                            </p>
                            <button
                                onClick={() => navigate("/")}
                                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 px-8 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105"
                            >
                                Continuar Comprando
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return null;
}

export default Resultado;