import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, Edit3, Plus, X, Save, Eye, Upload, AlertCircle } from "lucide-react";

const AdminPanel = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: "",
    precio: "",
    descripcion: "",
    imagen: null,
  });

  const [productos, setProductos] = useState([]);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [idEditando, setIdEditando] = useState(null);
  const [imagenActual, setImagenActual] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [previewImagen, setPreviewImagen] = useState(null);

  useEffect(() => {
    fetchProductos();
  }, []);

  // Limpiar mensajes después de 5 segundos
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError("");
        setSuccess("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const fetchProductos = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/productos");
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
      const data = await res.json();
      setProductos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error cargando productos:", error);
      setError("Error al cargar productos: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Limpiar errores cuando el usuario empiece a escribir
    if (error) setError("");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        setError("Por favor selecciona un archivo de imagen válido");
        return;
      }
      
      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("La imagen debe ser menor a 5MB");
        return;
      }

      setForm(prev => ({
        ...prev,
        imagen: file,
      }));

      // Crear preview de la imagen
      const reader = new FileReader();
      reader.onload = (e) => setPreviewImagen(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const validarFormulario = () => {
    if (!form.nombre.trim()) {
      setError("El nombre es requerido");
      return false;
    }
    if (!form.precio || form.precio <= 0) {
      setError("El precio debe ser mayor a 0");
      return false;
    }
    if (!form.descripcion.trim()) {
      setError("La descripción es requerida");
      return false;
    }
    if (!modoEdicion && !form.imagen) {
      setError("La imagen es requerida para productos nuevos");
      return false;
    }
    return true;
  };

  const editarProducto = (producto) => {
    setForm({
      nombre: producto.nombre,
      precio: producto.precio,
      descripcion: producto.descripcion,
      imagen: null,
    });
    setModoEdicion(true);
    setIdEditando(producto._id);
    setImagenActual(producto.imagen);
    setPreviewImagen(null);
    setError("");
    setSuccess("");
  };

  const cancelarEdicion = () => {
    setForm({ nombre: "", descripcion: "", precio: "", imagen: null });
    setModoEdicion(false);
    setIdEditando(null);
    setImagenActual(null);
    setPreviewImagen(null);
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validarFormulario()) return;

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("nombre", form.nombre.trim());
    formData.append("precio", form.precio);
    formData.append("descripcion", form.descripcion.trim());

    if (form.imagen) {
      formData.append("imagen", form.imagen);
    }

    const url = modoEdicion
      ? `http://localhost:3000/productos/editar/${idEditando}`
      : "http://localhost:3000/productos";
    const method = modoEdicion ? "PUT" : "POST";

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const contentType = res.headers.get("content-type");
      let data;
      
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const textResponse = await res.text();
        console.error("Respuesta como texto:", textResponse);
        throw new Error(`El servidor devolvió HTML. Status: ${res.status}`);
      }

      if (res.ok) {
        setSuccess(modoEdicion ? "Producto actualizado exitosamente" : "Producto agregado exitosamente");
        cancelarEdicion();
        fetchProductos();
      } else {
        throw new Error(data.message || data.error || "Error desconocido");
      }
    } catch (error) {
      console.error("Error en la petición:", error);
      setError("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const eliminarProducto = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este producto? Esta acción no se puede deshacer.")) {
      return;
    }

    setLoading(true);
    const token = localStorage.getItem("token");
    
    try {
      const res = await fetch(`http://localhost:3000/productos/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setSuccess("Producto eliminado exitosamente");
        fetchProductos();
      } else {
        throw new Error(data.message || data.error || "Error desconocido");
      }
    } catch (error) {
      setError("Error al eliminar: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
            <button
              onClick={() => navigate("/admin/historial")}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Eye size={20} />
              Ver Historial
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulario */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              {modoEdicion ? <Edit3 size={24} /> : <Plus size={24} />}
              {modoEdicion ? "Editar Producto" : "Agregar Producto"}
            </h2>

            {/* Mensajes de estado */}
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-red-700">
                <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Producto *
                </label>
                <input
                  type="text"
                  name="nombre"
                  placeholder="Ingrese el nombre del producto"
                  value={form.nombre}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Precio *
                </label>
                <input
                  type="number"
                  name="precio"
                  placeholder="0.00"
                  value={form.precio}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  min="0"
                  step="0.01"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción *
                </label>
                <textarea
                  name="descripcion"
                  placeholder="Describe el producto..."
                  value={form.descripcion}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Imagen {!modoEdicion && "*"}
                </label>

                {/* Imagen actual en modo edición */}
                {modoEdicion && imagenActual && (
                  <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">Imagen actual:</p>
                    <img
                      src={`http://localhost:3000/uploads/${imagenActual}`}
                      alt="Imagen actual"
                      className="w-24 h-24 object-cover rounded-lg mx-auto"
                    />
                    <p className="text-xs text-gray-500 text-center mt-2">
                      Selecciona una nueva imagen solo si quieres cambiarla
                    </p>
                  </div>
                )}

                {/* Preview de nueva imagen */}
                {previewImagen && (
                  <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">Nueva imagen:</p>
                    <img
                      src={previewImagen}
                      alt="Preview"
                      className="w-24 h-24 object-cover rounded-lg mx-auto"
                    />
                  </div>
                )}

                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-2 text-gray-500" />
                      <p className="text-sm text-gray-500">
                        <span className="font-semibold">Click para subir</span> o arrastra una imagen
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG, JPEG (MAX. 5MB)</p>
                    </div>
                    <input
                      type="file"
                      name="imagen"
                      onChange={handleFileChange}
                      className="hidden"
                      accept="image/*"
                      disabled={loading}
                    />
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Save size={20} />
                  )}
                  {loading ? "Guardando..." : (modoEdicion ? "Actualizar" : "Guardar")}
                </button>

                {modoEdicion && (
                  <button
                    type="button"
                    onClick={cancelarEdicion}
                    disabled={loading}
                    className="flex items-center gap-2 bg-gray-500 text-white py-3 px-4 rounded-lg hover:bg-gray-600 disabled:opacity-50 transition-colors"
                  >
                    <X size={20} />
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Lista de productos */}
          <div className="bg-white rounded-lg shadow-sm p-6 h-150">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">
              Productos Existentes ({productos.length})
            </h3>

            {loading && productos.length === 0 ? (
              <div className="flex justify-center py-8">
                <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : productos.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Plus size={48} className="mx-auto mb-2 opacity-50" />
                <p className="text-lg">No hay productos aún</p>
                <p className="text-sm">Agrega tu primer producto usando el formulario</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {productos.map((producto) => (
                  <div
                    key={producto._id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex gap-4">
                      {producto.imagen && (
                        <img
                          src={`http://localhost:3000/uploads/${producto.imagen}`}
                          alt={producto.nombre}
                          className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                        />
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 truncate">
                          {producto.nombre}
                        </h4>
                        <p className="text-lg font-bold text-indigo-600">
                          ${parseFloat(producto.precio).toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {producto.descripcion}
                        </p>
                      </div>

                      <div className="flex flex-col gap-2 flex-shrink-0">
                        <button
                          onClick={() => editarProducto(producto)}
                          disabled={loading}
                          className="flex items-center gap-1 bg-amber-500 text-white px-3 py-1 rounded text-sm hover:bg-amber-600 disabled:opacity-50 transition-colors"
                        >
                          <Edit3 size={14} />
                          Editar
                        </button>
                        <button
                          onClick={() => eliminarProducto(producto._id)}
                          disabled={loading}
                          className="flex items-center gap-1 bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 disabled:opacity-50 transition-colors"
                        >
                          <Trash2 size={14} />
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;