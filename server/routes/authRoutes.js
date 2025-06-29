const express = require("express");
const passport = require("passport");

const router = express.Router();

// Ruta para iniciar sesión con Google
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Ruta de callback después de la autenticación
router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/" }),
    (req, res) => {
      // Generar un token JWT
      const jwt = require("jsonwebtoken");
      const token = jwt.sign(
        { id: req.user._id, rol: req.user.rol },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );
  
      // Redirigir al cliente con el token al frontend en Vercel
      res.redirect(`https://ecommerce-5yy8.vercel.app/?token=${token}`);
    }
  );

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