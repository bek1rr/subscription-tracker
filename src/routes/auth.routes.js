const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const checkAuth = require("../middleware/auth.middleware"); // <-- Bunu import etmeyi unutma!

router.post("/register", authController.register);
router.post("/login", authController.login);

// YENİ ROTALAR (Giriş yapmış olmak zorunlu)
router.get("/profile", checkAuth, authController.getProfile);
router.put("/profile", checkAuth, authController.updateProfile);
router.put("/password", checkAuth, authController.updatePassword);
module.exports = router;