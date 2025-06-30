import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Inicio from './componentes/inicio.jsx';
import NavBar from './componentes/navbar.jsx';
import Registro from './componentes/registro';
import Login from './componentes/login';
import Footer from './componentes/footer.jsx';
import Productos from './componentes/productos.jsx';
import AdminPanel from './componentes/admin.jsx';
import ProductoDetalle from './componentes/productoDetalle.jsx';
import Carrito from './componentes/carrito.jsx';
import Pago from './componentes/pago.jsx';
import Resultado from './componentes/resultado.jsx';
import OrdenHistorial from './componentes/historial.jsx';

function App() {
    const API_URL = import.meta.env.VITE_API_URL;
    const [carrito, setCarrito] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [rol, setRol] = useState(null);
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    
    const location = useLocation();
    
    // Páginas que no deben mostrar el footer
    const paginasSinFooter = [
        '/login', 
        '/registro', 
        '/admin', 
        '/carrito', 
        '/pago', 
        '/success', 
        '/cancel', 
        '/admin/historial'
    ];
    
    const mostrarFooter = !paginasSinFooter.includes(location.pathname);

    // Verificar autenticación al cargar la app
    useEffect(() => {
        const verificarAutenticacion = () => {
            const token = localStorage.getItem("token");
            const userData = localStorage.getItem("user");
        
            if (token && userData) {
                setIsAuthenticated(true);
                setRol(JSON.parse(userData).rol); // Extraer el rol del usuario
                setUser(JSON.parse(userData));
            } else {
                setIsAuthenticated(false);
                setRol(null);
                setUser(null)
            }
        };
    
        verificarAutenticacion();
    }, []);
    
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const userData = params.get("user");
        const token = params.get("token");
    
        if (userData && token) {
            // Guardar datos en localStorage
            localStorage.setItem("user", userData);
            localStorage.setItem("token", token);
        
            // Actualizar el estado global
            setIsAuthenticated(true);
            setRol(JSON.parse(userData).rol); // Extraer el rol del usuario
        
            // Limpiar los parámetros de la URL
            window.history.replaceState({}, document.title, "/");
        }
    }, []);

    // Cargar productos
    useEffect(() => {
        const fetchProductos = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const token = localStorage.getItem("token"); 
                const response = await fetch(`${API_URL}/productos`, {
                    method: "GET",
                    headers: {
                        ...(token && { Authorization: `Bearer ${token}` }),
                        "Content-Type": "application/json",
                    },
                });
                
                if (!response.ok) {
                    throw new Error("Error al obtener los productos");
                }
                
                const data = await response.json();
                setProductos(data);
            } catch (error) {
                console.error("Error al obtener los productos:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
    
        fetchProductos();
    }, []);

    // Cargar carrito del localStorage
    useEffect(() => {
        const carritoGuardado = localStorage.getItem('carrito');
        if (carritoGuardado) {
            try {
                setCarrito(JSON.parse(carritoGuardado));
            } catch (error) {
                console.error('Error al cargar el carrito:', error);
            }
        }
    }, []);

    // Guardar carrito en localStorage cuando cambie
    useEffect(() => {
        if (carrito.length > 0) {
            localStorage.setItem('carrito', JSON.stringify(carrito));
        } else {
            localStorage.removeItem('carrito');
        }
    }, [carrito]);

    

    const handleLogout = () => {
        setIsAuthenticated(false);
        setRol(null);
        setCarrito([]);
        localStorage.removeItem("userId");
        localStorage.removeItem("nombre");
        localStorage.removeItem("rol");
        localStorage.removeItem("token");
        localStorage.removeItem("carrito");
    };

    const ProtectedRoute = ({ children, requiredRole }) => {
        // Si no está autenticado y se requiere autenticación
        if (requiredRole && !isAuthenticated) {
            return <Navigate to="/login" replace />;
        }
        
        // Si se requiere un rol específico y no lo tiene
        if (requiredRole && rol !== requiredRole) {
            return <Navigate to="/" replace />;
        }

        return children;
    };

    const agregarAlCarrito = (producto) => {
        setCarrito((prevCarrito) => {
            const productoExistente = prevCarrito.find(item => item._id === producto._id);
            if (productoExistente) {
                return prevCarrito.map(item =>
                    item._id === producto._id 
                        ? { ...item, cantidad: item.cantidad + 1 } 
                        : item
                );
            } else {
                return [...prevCarrito, { ...producto, cantidad: 1 }];
            }
        });
        
        // Mostrar notificación moderna
        showNotification(`${producto.nombre} agregado al carrito`, 'success');
    };

    const showNotification = (message, type = 'info') => {
        // Crear elemento de notificación
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 translate-x-full ${
            type === 'success' ? 'bg-green-500 text-white' : 
            type === 'error' ? 'bg-red-500 text-white' : 
            'bg-blue-500 text-white'
        }`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Animar entrada
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 100);
        
        // Remover después de 3 segundos
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    };

    // Componente de loading
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Cargando aplicación...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <NavBar 
                isAuthenticated={isAuthenticated} 
                handleLogout={handleLogout} 
                rol={rol} 
                carritoItems={carrito} 
                user={user}
            />
            
            <main className="flex-grow">
                <Routes>
                    <Route path="/" 
                    element={ <Inicio />    
                    }
                    />
                    
                    <Route 
                        path="/registro" 
                        element={
                            isAuthenticated ? 
                            <Navigate to="/" replace /> : 
                            <Registro />
                        } 
                    />
                    
                    <Route 
                        path="/login" 
                        element={
                            isAuthenticated ? 
                            <Navigate to="/admin" replace /> : 
                            <Login 
                                setIsAuthenticated={setIsAuthenticated} 
                                setRol={setRol} 
                                setUser={setUser}
                            />
                        }
                    />

                    <Route 
                        path="/productos" 
                        element={
                            <ProtectedRoute>
                                <Productos productos={productos} />
                            </ProtectedRoute>
                        }
                    />

                    <Route  
                        path='/admin/historial'
                        element={
                            <ProtectedRoute requiredRole="admin">
                                <OrdenHistorial />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/carrito"    
                        element={
                            <ProtectedRoute requiredRole="cliente">
                                <Carrito 
                                    carrito={carrito} 
                                    setCarrito={setCarrito} 
                                />
                            </ProtectedRoute>
                        }
                    />

                    <Route 
                        path='/pago'
                        element={
                            <ProtectedRoute requiredRole="cliente">
                                <Pago carrito={carrito} />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path='/success' 
                        element={<Resultado 
                            setCarrito={setCarrito}/>}
                    />

                    <Route
                        path='/cancel'  
                        element={<Resultado 
                            setCarrito={setCarrito}/>}
                    />

                    <Route
                        path='/producto/:id'
                        element={
                            <ProductoDetalle 
                                productos={productos} 
                                agregarAlCarrito={agregarAlCarrito}
                            />
                        }
                    />

                    <Route 
                        path="/admin"
                        element={
                            <ProtectedRoute requiredRole="admin">
                                <AdminPanel />
                            </ProtectedRoute>
                        }
                    />

                    {/* Ruta 404 */}
                    <Route 
                        path="*" 
                        element={
                            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
                                <div className="text-center">
                                    <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 20a7.962 7.962 0 01-5-1.709M15 11V7a3 3 0 00-3-3 3 3 0 00-3 3v4a3 3 0 106 0z" />
                                        </svg>
                                    </div>
                                    <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
                                    <p className="text-gray-600 text-lg mb-6">Página no encontrada</p>
                                    <button
                                        onClick={() => window.history.back()}
                                        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
                                    >
                                        Volver
                                    </button>
                                </div>
                            </div>
                        } 
                    />
                </Routes>
            </main>
            
            {mostrarFooter && <Footer />}
            
            {/* Mostrar error global si existe */}
            {error && (
                <div className="fixed bottom-4 left-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
                    <p>Error: {error}</p>
                    <button 
                        onClick={() => setError(null)}
                        className="ml-2 text-red-200 hover:text-white"
                    >
                        ✕
                    </button>
                </div>
            )}
        </div>
    );
}

export default App;