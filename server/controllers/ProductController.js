const producto = require("../models/producto.js");
const cloudinary = require('../middlewares/cloudinary.js');
const fs = require('fs');

exports.Post = async (req, res) => {
  try {
    const { nombre, precio, descripcion } = req.body;

    let imagenUrl = null;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "productos"
      });
      imagenUrl = result.secure_url;
      fs.unlinkSync(req.file.path); // elimina el archivo local
    }

    const nuevoProducto = new producto({ nombre, precio, descripcion, imagen: imagenUrl });
    await nuevoProducto.save();

    res.status(201).json({ message: "Producto creado exitosamente", producto: nuevoProducto });
  } catch (err) {
    console.error("Error al crear el producto:", err);
    res.status(500).json({ error: "Error al crear el producto" });
  }
};

exports.get = async (req, res) => {
  try {
    const productos = await producto.find();
    res.status(200).json(productos);
  } catch (err) {
    console.error("Error al obtener los productos:", err);
    res.status(500).json({ error: "Error al obtener los productos" });
  }
};

exports.put = async (req, res) => {
  try {
    const id = req.params.id;
    const { nombre, precio, descripcion } = req.body;

    const updateData = { nombre, precio, descripcion };

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "productos"
      });
      updateData.imagen = result.secure_url;
      fs.unlinkSync(req.file.path);
    }

    const productoActualizado = await producto.findByIdAndUpdate(id, updateData, { new: true });

    if (!productoActualizado) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.status(200).json({ message: "Producto actualizado exitosamente", producto: productoActualizado });
  } catch (err) {
    console.error("Error al actualizar el producto:", err);
    res.status(500).json({ error: "Error al actualizar el producto" });
  }
};

exports.delete = async (req, res) => {
  try {
    const id = req.params.id;

    const productoEliminado = await producto.findByIdAndDelete(id);

    if (!productoEliminado) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.status(200).json({ message: "Producto eliminado exitosamente", producto: productoEliminado });
  } catch (err) {
    console.error("Error al eliminar el producto:", err);
    res.status(500).json({ error: "Error al eliminar el producto" });
  }
};
