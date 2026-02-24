const startCron = require("./cron/cronJob");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth.routes");
const subscriptionRoutes = require("./routes/subscription.routes"); // <-- YENİ

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/subscriptions", subscriptionRoutes); // <-- YENİ

app.get("/", (req, res) => {
  res.json({ message: "API çalışıyor 🚀" });
});

const PORT = process.env.PORT || 5000;

// Cron Servisini Başlat
startCron();
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use("/api/notifications", require("./routes/notification.routes"));