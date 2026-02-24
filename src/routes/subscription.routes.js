const express = require("express");
const router = express.Router();
const subscriptionController = require("../controllers/subscription.controller");
const checkAuth = require("../middleware/auth.middleware");

// Ekleme
router.post("/", checkAuth, subscriptionController.createSubscription);

// Listeleme
router.get("/", checkAuth, subscriptionController.getMySubscriptions);

// --- YENİ EKLENEN KISIM (DİKKAT: SİLME İŞLEMİNDEN ÖNCE OLMALI) ---
// İstatistikleri Getir
router.get("/stats", checkAuth, subscriptionController.getStats); 

router.patch("/:id/status", checkAuth, subscriptionController.updateStatus);
// SİLME -> /api/subscriptions/15 gibi çalışır
router.delete("/:id", checkAuth, subscriptionController.deleteSubscription);

module.exports = router;