require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const User = require("./models/user.js"); // Importar el modelo de usuario
const bcrypt = require("bcrypt");
const session = require("express-session");
const passport = require("passport");
require("./passportConfig"); // Configuración de Passport



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

// Configurar sesiones
server.use(
  session({
    secret: process.env.SESSION_SECRET, // Cambiar por una variable de entorno en producción
    resave: false,
    saveUninitialized: false,
  })
);



// Inicializar Passport
server.use(passport.initialize());
server.use(passport.session());

// Rutas de autenticación
const authRoutes = require("./routes/authRoutes.js");
server.use("/auth", authRoutes);



// Crear un usuario administrador por defecto si no existe
const crearAdminPorDefecto = async () => {
  try {
    const adminExistente = await User.findOne({ rol: "admin" });

    if (!adminExistente) {
      const hashedPassword = await bcrypt.hash("admin123", 10); // Contraseña encriptada
      const admin = new User({
        nombre: "Admin",
        apellido: "Default",
        email: "admin@tienda.com",
        password: hashedPassword,
        rol: "admin",
      });

      await admin.save();
      console.log("✅ Usuario administrador creado por defecto");
    } else {
      console.log("✅ Usuario administrador ya existe");
    }
  } catch (err) {
    console.error("❌ Error al crear el usuario administrador por defecto:", err);
  }
};

// Llamar a la función al iniciar el servidor
crearAdminPorDefecto();


mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("✅ Conectado a MongoDB Atlas"))
  .catch((err) => console.error("❌ Error al intentar conectar a MongoDB Atlas:", err));

// Puerto dinámico (para Render)
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
