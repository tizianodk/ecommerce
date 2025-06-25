import React from 'react';
import facebook from '../imagenes/fb.png';
import instagram from '../imagenes/ig.png';

function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Sección principal del footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Información de la empresa */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-blue-400 mb-4">TechStore</h3>
            <p className="text-gray-300 leading-relaxed">
              Tu tienda de confianza para productos tecnológicos de alta calidad.
            </p>
            <p className="text-gray-400 text-sm">
              Más de 10 años brindando las mejores soluciones tech.
            </p>
          </div>

          {/* Enlaces útiles */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white mb-4">Enlaces Útiles</h4>
            <ul className="space-y-2">
              <li>
                <a href="/productos" className="text-gray-300 hover:text-blue-400 transition-colors duration-200 flex items-center">
                  <span className="mr-2">🛍️</span>Productos
                </a>
              </li>
              <li>
                <a href="/ofertas" className="text-gray-300 hover:text-blue-400 transition-colors duration-200 flex items-center">
                  <span className="mr-2">🏷️</span>Ofertas
                </a>
              </li>
              <li>
                <a href="/soporte" className="text-gray-300 hover:text-blue-400 transition-colors duration-200 flex items-center">
                  <span className="mr-2">🛠️</span>Soporte
                </a>
              </li>
              <li>
                <a href="/contacto" className="text-gray-300 hover:text-blue-400 transition-colors duration-200 flex items-center">
                  <span className="mr-2">📞</span>Contacto
                </a>
              </li>
            </ul>
          </div>

          {/* Información de contacto */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white mb-4">Contacto</h4>
            <div className="space-y-3">
              <p className="text-gray-300 flex items-center">
                <span className="mr-3 text-lg">📧</span>
                <a href="mailto:info@techstore.com" className="hover:text-blue-400 transition-colors">
                  info@techstore.com
                </a>
              </p>
              <p className="text-gray-300 flex items-center">
                <span className="mr-3 text-lg">📞</span>
                <a href="tel:+543811234567" className="hover:text-blue-400 transition-colors">
                  +54 381 123-4567
                </a>
              </p>
              <p className="text-gray-300 flex items-center">
                <span className="mr-3 text-lg">📍</span>
                San Miguel de Tucumán, Argentina
              </p>
            </div>
          </div>

          {/* Redes sociales */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white mb-4">Síguenos</h4>
            <div className="flex space-x-4">
              <a 
                href="https://facebook.com/techstore" 
                className="group bg-gray-800 p-3 rounded-full hover:bg-blue-600 transition-all duration-300 transform hover:scale-110"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visitar nuestro Facebook"
              >
                <img 
                  src={facebook} 
                  alt="Facebook" 
                  className="w-6 h-6 group-hover:brightness-0 group-hover:invert transition-all duration-300" 
                />
              </a>
              <a 
                href="https://instagram.com/techstore" 
                className="group bg-gray-800 p-3 rounded-full hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 transition-all duration-300 transform hover:scale-110"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visitar nuestro Instagram"
              >
                <img 
                  src={instagram} 
                  alt="Instagram" 
                  className="w-6 h-6 group-hover:brightness-0 group-hover:invert transition-all duration-300" 
                />
              </a>
            </div>
            <div className="mt-4">
              <p className="text-gray-400 text-sm">¡Síguenos para ofertas exclusivas!</p>
            </div>
          </div>
        </div>

        {/* Separador */}
        <div className="border-t border-gray-700 my-8"></div>

        {/* Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-gray-400 text-sm">
            &copy; 2025 TechZone. Todos los derechos reservados.
          </p>
          <div className="flex items-center space-x-4 text-sm">
            <a 
              href="/privacidad" 
              className="text-gray-400 hover:text-white transition-colors duration-200"
            >
              Política de Privacidad
            </a>
            <span className="text-gray-600">|</span>
            <a 
              href="/terminos" 
              className="text-gray-400 hover:text-white transition-colors duration-200"
            >
              Términos de Uso
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;