const express = require("express");
const passport = require("passport");
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const User = require("../models/user.js"); // Modelo de usuario

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Ruta para iniciar sesión con Google
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Ruta de callback después de la autenticación con Passport
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    // Generar un token JWT
    const token = jwt.sign(
      { id: req.user._id, rol: req.user.rol },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // Redirigir al cliente con el token al frontend en Vercel
    res.redirect(
        `https://ecommerce-5yy8.vercel.app/?token=${token}&user=${encodeURIComponent(
        JSON.stringify(req.user)
      )}`
    );
    }
);

// Ruta para manejar el token enviado desde el frontend
router.post("/google/callback", async (req, res) => {
  const { token } = req.body;

  try {
    // Verificar el token de Google
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub, email, name, picture } = payload;

    // Buscar o crear usuario en la base de datos
    let user = await User.findOne({ googleId: sub });
    if (!user) {
      user = new User({
        nombre: name,
        email,
        googleId: sub,
        picture,
        rol: "cliente",
      });
      await user.save();
    }

    // Generar un token JWT
    const jwtToken = jwt.sign(
      { id: user._id, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({ token: jwtToken, user });
  } catch (err) {
    console.error("Error al verificar el token de Google:", err);
    res.status(401).json({ error: "Token inválido" });
  }
});

// Ruta para cerrar sesión
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error(err);
    }
    res.redirect("/");
  });
});

module.exports = router;