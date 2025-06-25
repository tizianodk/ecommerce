const express = require("express");
const mongoose = require("mongoose");
require('dotenv').config();
const cors = require("cors");
const bodyParser = require("body-parser");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Rutas
const userRoutes = require("./routes/userRoutes.js");
const productRoutes = require("./routes/ProductRoutes.js");
const ordenRoutes = require("./routes/ordenRoutes.js");
const resenasRoutes = require("./routes/reseñasRoutes.js");
const { stripeWebhook } = require("./controllers/webhook.js");

const server = express();

// Middleware para webhook (antes de express.json)
server.post("/webhook", bodyParser.raw({ type: "application/json" }), stripeWebhook);

// Middlewares generales
server.use(cors());
server.use(express.json());
server.use("/uploads", express.static("uploads"));

// Rutas
server.use("/usuarios", userRoutes);
server.use("/productos", productRoutes);
server.use("/ordenes", ordenRoutes);
server.use("/resenas", resenasRoutes);

// Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("✅ Conectado a MongoDB Atlas"))
  .catch((err) => console.error("❌ Error conectando a MongoDB:", err));

// Puerto dinámico (para Render)
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
