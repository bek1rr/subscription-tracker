const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.userData.userId },
      orderBy: { createdAt: "desc" }
    });
    res.status(200).json(notifications);
  } catch (error) { res.status(500).json({ error: "Hata!" }); }
};

exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.notification.updateMany({
      where: { id: parseInt(id), userId: req.userData.userId },
      data: { isRead: true }
    });
    res.status(200).json({ message: "Okundu." });
  } catch (error) { res.status(500).json({ error: "Hata!" }); }
};

exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.notification.deleteMany({
      where: { id: parseInt(id), userId: req.userData.userId }
    });
    res.status(200).json({ message: "Silindi." });
  } catch (error) { res.status(500).json({ error: "Hata!" }); }
};