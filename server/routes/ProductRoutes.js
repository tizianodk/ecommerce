const express = require("express");
const router = express.Router();

const productController = require("../controllers/ProductController");
const resenasController = require("../controllers/reseñasController.js");
const authMiddleware = require("../middlewares/authMiddleware.js");
const upload = require("../middlewares/uploads.js"); // 👉 multer personalizado

// 📦 Productos
router.post("/", authMiddleware, upload.single("imagen"), productController.Post);
router.get("/", productController.get);
router.put("/editar/:id", authMiddleware, upload.single("imagen"), productController.put);
router.delete("/:id", authMiddleware, productController.delete);

// ✍️ Reseñas
router.get("/:productoId/resenas", resenasController.obtenerResenas);
router.post("/:productoId/resenas", resenasController.crearResena);

module.exports = router;