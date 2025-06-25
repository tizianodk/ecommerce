import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import imagen1 from '../imagenes/imagen1.png';
import imagen2 from '../imagenes/imagen2.png';
import imagen3 from '../imagenes/imagen3.png';
import imagen4 from '../imagenes/imagen4.png';
import imagen5 from '../imagenes/imagen5.png';
import gabinete from '../imagenes/productos/gabinete.png';
import placavideo from '../imagenes/productos/placavideo.png';
import auricular from '../imagenes/productos/auricularGamer.png';

function Inicio() {
    const [currentIndex, setCurrentIndex] = useState(0); 
    const [isTransitioning, setIsTransitioning] = useState(true);
    const [isPlaying, setIsPlaying] = useState(true);
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);
    const intervalRef = useRef(null);

    const navigate = useNavigate();

    
    const imagenes = [
        { src: imagen1, alt: "Productos Gaming de Alta Gama", titulo: "Gaming Extremo", descripcion: "Descubre nuestra colección de hardware gaming" },
        { src: imagen2, alt: "Tecnología de Vanguardia", titulo: "Innovación Tech", descripcion: "Los últimos avances en tecnología" },
        { src: imagen3, alt: "Componentes Premium", titulo: "Calidad Premium", descripcion: "Componentes de la más alta calidad" },
        { src: imagen4, alt: "Ofertas Especiales", titulo: "Ofertas Increíbles", descripcion: "Precios que no podrás resistir" },
        { src: imagen5, alt: "Soporte Técnico", titulo: "Soporte 24/7", descripcion: "Estamos aquí para ayudarte" },
    ];

    const extendedImages = [imagenes[imagenes.length - 1], ...imagenes, imagenes[0]];

    const productosDestacados = [
        {
            id: '683b58b2ea0ecf5a69c3fde0',
            imagen: gabinete,
            nombre: "Gabinete Gamer RGB",
            categoria: "PC Gaming",
            precio: "$250",
            rating: 4.8,
            descripcion: "Panel lateral de vidrio templado," + 
            "Iluminación LED RGB con control," +
            'Soporte para GPU de gran tamaño,'+
            'Espacio para refrigeración líquida hasta 360 mm,'+
            'Filtros antipolvo extraíbles,'+
            'Gestión de cables eficiente,'+
            'Múltiples bahías para SSD y HDD,' +
            "Conectividad USB 3.0 en el panel frontal",
            caracteristicas: ["Vidrio templado", "RGB personalizable", "Gestión de cables", "Filtros antipolvo"]
        },
        {
            id: '683b58d3ea0ecf5a69c3fde3',
            imagen: placavideo,
            nombre: "Placa de Video",
            categoria: "Componentes",
            precio: "$850",
            rating: 4.9,
            descripcion: 'Arquitectura gráfica de última generación (NVIDIA / AMD)'+
                        'Memoria GDDR6 / GDDR6X / GDDR7 ultrarrápida'+
                        'Soporte para Ray Tracing y DLSS / FSR (según modelo)'+
                        'Salidas de video HDMI 2.1 y DisplayPort'+
                        'Refrigeración de alto rendimiento (ventiladores duales/triples o diseño de cámara de vapor)'+
                        'Ideal para gaming en 1080p, 1440p o 4K'+
                        'Compatible con monitores de alta tasa de refresco',
            caracteristicas: ["4K Gaming", "Ray Tracing", "DLSS 3.0", "Refrigeración silenciosa"]
        },
        {
            id: '683b6390ea0ecf5a69c3fe18',
            imagen: auricular,
            nombre: "Auricular Gamer",
            categoria: "Periféricos",
            precio: "$35",
            rating: 4.7,
            descripcion: 'Sonido envolvente 7.1 con drivers de alta precisión'+
                        'Micrófono con cancelación de ruido para una comunicación clara'+                     
                        'Almohadillas de espuma viscoelástica para máximo confort'+                      
                        'Conexión inalámbrica o por cable (según modelo)'+                 
                        'Diseño ergonómico y ajustable para adaptarse a cualquier usuario'+                                    
                        'Compatible con PC, consolas, y dispositivos móviles'+                                    
                        'Iluminación LED RGB (si aplica)' +                                   
                        'Control de volumen integrado en el cable/auricular',
            caracteristicas: ["Surround 7.1", "Cancelación de ruido", "Ultra cómodos", "Micrófono retráctil"]
        }
    ];

    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: false,
            offset: 100,
        });
    }, []);

    useEffect(() => {
        if (isPlaying) {
            intervalRef.current = setInterval(() => {
                handleNext();
            }, 4000);
        } else {
            clearInterval(intervalRef.current);
        }

        return () => clearInterval(intervalRef.current);
    }, [currentIndex, isPlaying]);

    const handlePrev = () => {
        if (currentIndex === 0) {
            setIsTransitioning(false);
            setCurrentIndex(extendedImages.length - 2);
            setTimeout(() => setIsTransitioning(true), 0);
        } else {
            setCurrentIndex(prev => prev - 1);
        }
    };

    const handleNext = () => {
        if (currentIndex === extendedImages.length - 1) {
            setIsTransitioning(false);
            setCurrentIndex(1);
            setTimeout(() => setIsTransitioning(true), 0);
        } else {
            setCurrentIndex(prev => prev + 1);
        }
    };

    const goToSlide = (index) => {
        setCurrentIndex(index + 1);
    };

    const togglePlayPause = () => {
        setIsPlaying(!isPlaying);
    };

    // Touch handlers para móviles
    const handleTouchStart = (e) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > 50;
        const isRightSwipe = distance < -50;

        if (isLeftSwipe) handleNext();
        if (isRightSwipe) handlePrev();
    };

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, index) => (
            <span key={index} className={`text-lg ${index < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}>
                ★
            </span>
        ));
    };


    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section con Carousel */}
            <section className="relative overflow-hidden">
                <div className="relative h-96 md:h-[600px]">
                    <div className="relative w-full h-full overflow-hidden">
                        <div
                            className="flex h-full"
                            style={{
                                transform: `translateX(-${currentIndex * 100}%)`,
                                transition: isTransitioning ? 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
                            }}
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleTouchEnd}
                        >
                            {extendedImages.map((image, index) => (
                                <div key={index} className="relative w-full h-full flex-shrink-0">
                                    <img
                                        src={typeof image === 'string' ? image : image.src}
                                        alt={typeof image === 'string' ? `Slide ${index}` : image.alt}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                                        <div className="text-center text-white max-w-4xl px-4">
                                            {typeof image !== 'string' && (
                                                <>
                                                    <h2 className="text-3xl md:text-5xl font-bold mb-4 animate-fade-in-up">
                                                        {image.titulo}
                                                    </h2>
                                                    <p className="text-lg md:text-xl animate-fade-in-up delay-200">
                                                        {image.descripcion}
                                                    </p>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Controles del carousel */}
                        <button 
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all duration-200 backdrop-blur-sm" 
                            onClick={handlePrev} 
                            aria-label="Imagen anterior"
                        >
                            <span className="text-2xl">&#10094;</span>
                        </button>
                        <button 
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all duration-200 backdrop-blur-sm" 
                            onClick={handleNext} 
                            aria-label="Siguiente imagen"
                        >
                            <span className="text-2xl">&#10095;</span>
                        </button>

                        {/* Indicadores */}
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                            {imagenes.map((_, index) => (
                                <button
                                    key={index}
                                    className={`w-3 h-3 rounded-full transition-all duration-200 ${
                                        currentIndex === index + 1 
                                            ? 'bg-white' 
                                            : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                                    }`}
                                    onClick={() => goToSlide(index)}
                                    aria-label={`Ir a imagen ${index + 1}`}
                                />
                            ))}
                        </div>

                        {/* Control de reproducción */}
                        <button 
                            className="absolute top-4 right-4 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all duration-200 backdrop-blur-sm" 
                            onClick={togglePlayPause} 
                            aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
                        >
                            <span className="text-lg">{isPlaying ? '⏸️' : '▶️'}</span>
                        </button>
                    </div>
                </div>
            </section>

            {/* Sección de Bienvenida */}
            <section className="py-16 bg-white" data-aos="fade-up">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                            Bienvenid@ a <span className="text-blue-600">TechZone</span>
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            Tu destino para la mejor tecnología gaming y componentes de alta gama.
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                        <div className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 hover:shadow-lg transition-all duration-300" data-aos="fade-up" data-aos-delay="100">
                            <div className="text-4xl mb-4">🚀</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">Calidad Premium</h3>
                            <p className="text-gray-600">Productos de las mejores marcas con garantía extendida</p>
                        </div>
                        <div className="text-center p-6 rounded-xl bg-gradient-to-br from-green-50 to-emerald-100 hover:shadow-lg transition-all duration-300" data-aos="fade-up" data-aos-delay="200">
                            <div className="text-4xl mb-4">💰</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">Mejores Precios</h3>
                            <p className="text-gray-600">Ofertas exclusivas y precios competitivos</p>
                        </div>
                        <div className="text-center p-6 rounded-xl bg-gradient-to-br from-purple-50 to-violet-100 hover:shadow-lg transition-all duration-300" data-aos="fade-up" data-aos-delay="300">
                            <div className="text-4xl mb-4">🛡️</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">Soporte 24/7</h3>
                            <p className="text-gray-600">Estamos aquí para ayudarte cuando lo necesites</p>
                        </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button 
                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                            onClick={() => navigate('/productos')}
                        >
                            Explorar Productos
                        </button>
                        <button 
                            className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105"
                            onClick={() => navigate('/registro')}
                        >
                            Registrarse
                        </button>
                    </div>
                </div>
            </section>

            {/* Productos Destacados */}
            <section className="py-16 bg-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12" data-aos="fade-down">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            🌟 Productos Destacados
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Lo mejor de nuestra colección seleccionado especialmente para ti
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {productosDestacados.map((producto, index) => (
                            <div 
                                key={producto.id} 
                                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden" 
                                data-aos="zoom-in" 
                                data-aos-delay={index * 100}
                            >
                                <div className="relative">
                                    <img 
                                        src={producto.imagen} 
                                        alt={producto.nombre}
                                        className="w-full h-64 object-cover"
                                        loading="lazy"
                                    />
                                </div>

                                <div className="p-6">
                                    <div className="text-sm text-blue-600 font-medium mb-2">{producto.categoria}</div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">{producto.nombre}</h3>
                                    
                                    <div className="flex items-center mb-4">
                                        <div className="flex mr-2">
                                            {renderStars(producto.rating)}
                                        </div>
                                        <span className="text-gray-600 text-sm">({producto.rating})</span>
                                    </div>

                                    <div className="flex items-center mb-4">
                                        <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">{producto.precio}</span>
                                    </div>

                                    <p className="text-gray-600 mb-4 leading-relaxed">{producto.descripcion}</p>

                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {producto.caracteristicas.map((caracteristica, idx) => (
                                            <span key={idx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                                {caracteristica}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex flex-col gap-3">
                                        <button onClick={() => navigate(`/producto/${producto.id}`)}
                                        className="w-full border-2 border-gray-300 hover:border-blue-600 text-gray-700 hover:text-blue-600 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2">
                                            👁️ Ver Detalles
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Call to Action Final */}
            <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-700" data-aos="fade-up">
                <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        ¿Listo para mejorar tu setup?
                    </h2>
                    <p className="text-xl text-blue-100 mb-8">
                        Únete a miles de gamers que ya confían en nosotros
                    </p>
                    <button 
                        className="bg-white hover:bg-gray-100 text-blue-600 px-8 py-4 rounded-lg font-bold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                        onClick={() => navigate('/productos')}
                    >
                        Ver Todos los Productos
                    </button>
                </div>
            </section>
        </div>
    );
}

export default Inicio;