import React, { useEffect, useState } from 'react';
import carrito from '../imagenes/carrito1.png';
import Registro from './registro';
import Login from './login';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../imagenes/logo.png';
import { 
  Home, 
  Package, 
  UserPlus, 
  LogIn as LoginIcon, 
  LogOut, 
  ShoppingCart, 
  Menu, 
  X
} from 'lucide-react';

function NavBar({ isAuthenticated, handleLogout, rol, carritoItems }) {
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [user, setUser] = useState(null); 
    const navigate = useNavigate();

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);


    const handleOpenModal = (content) => {
        setModalContent(content);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setModalContent(null);
    };

    const handleLogoutAndRedirect = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        handleLogout();
        navigate("/login");
        setIsMobileMenuOpen(false);
    };

    const handleCarritoClick = () => {
        navigate("/carrito");
    };

    const handleMobileMenuToggle = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    const cartItemCount = carritoItems?.length || 0;

    return (
        <>
            {/* Navbar */}
            <nav className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 shadow-2xl border-b border-purple-500/20 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-24">
                        {/* Logo */}
                        <div className="flex items-center">
                            <Link to="/" className="flex items-center group">
                                <img 
                                    src={Logo} 
                                    alt="Logo" 
                                    className="h-16 w-auto mr-3 group-hover:scale-110 transition-transform duration-200 rounded-full" 
                                />
                                <span className="text-white font-bold text-xl hidden sm:block">
                                    TechZone
                                </span>
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-8">
                                <Link 
                                    to="/" 
                                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center hover:bg-white/10 backdrop-blur-sm"
                                >
                                    <Home className="h-4 w-4 mr-2" />
                                    Inicio
                                </Link>

                                {isAuthenticated && rol === "admin" && (
                                    <Link to="/admin"                                     
                                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center hover:bg-white/10 backdrop-blur-sm"
                                    >
                                        <UserPlus className="h-4 w-4 mr-2" />
                                        Admin
                                    </Link>
                                )}
                                
                                <Link 
                                    to="/productos" 
                                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center hover:bg-white/10 backdrop-blur-sm"
                                >
                                    <Package className="h-4 w-4 mr-2" />
                                    Productos
                                </Link>
                                
                                <Link 
                                    to="/registro" 
                                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center hover:bg-white/10 backdrop-blur-sm"
                                >
                                    <UserPlus className="h-4 w-4 mr-2" />
                                    Registrarse
                                </Link>
                                
                                {!isAuthenticated ? (
                                    <Link 
                                        to="/login" 
                                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center shadow-lg hover:scale-105 transform"
                                    >
                                        <LoginIcon className="h-4 w-4 mr-2" />
                                        Iniciar Sesión
                                    </Link>
                                ) : (
                                    <div className="flex items-center space-x-4">
                                        {user?.picture && (
                                            <img
                                                src={user.picture} // Mostrar la foto del usuario
                                                alt="Foto de perfil"
                                                className="h-10 w-10 rounded-full border-2 border-white"
                                            />
                                        )}
                                        <button 
                                            onClick={handleLogoutAndRedirect}
                                            className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center shadow-lg hover:scale-105 transform"
                                        >
                                            <LogOut className="h-4 w-4 mr-2" />
                                            Cerrar Sesión
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right side - Cart and Mobile Menu */}
                        <div className="flex items-center space-x-4">
                            {/* Cart Button */}
                            <button 
                                onClick={handleCarritoClick}
                                className="relative p-2 text-gray-400 hover:text-white transition-colors duration-200 group"
                            >
                                <ShoppingCart className="h-6 w-6 group-hover:scale-110 transition-transform duration-200" />
                                {cartItemCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-pulse shadow-lg">
                                        {cartItemCount}
                                    </span>
                                )}
                            </button>

                            {/* Mobile Menu Button */}
                            <button
                                onClick={handleMobileMenuToggle}
                                className="md:hidden p-2 text-gray-400 hover:text-white transition-colors duration-200"
                            >
                                {isMobileMenuOpen ? (
                                    <X className="h-6 w-6" />
                                ) : (
                                    <Menu className="h-6 w-6" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
}

export default NavBar;