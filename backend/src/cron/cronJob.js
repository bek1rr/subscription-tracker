const cron = require("node-cron");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const nodemailer = require("nodemailer");

// E-posta Gönderici Ayarları (Transporter)
// E-posta Gönderici Ayarları (Transporter)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
  user: process.env.EMAIL_USER,
  pass: process.env.EMAIL_PASS,
},
});

const startCronJob = () => {
  cron.schedule("0 9 * * *", async () => {
    console.log("⏳ Cron Job: Günlük kontrol başlatıldı (09:00)...");

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1); // Yarın ödemesi olanları bul

    try {
      // Yarın ödemesi olan abonelikleri ve sahiplerini getir
      const upcomingSubs = await prisma.subscription.findMany({
        where: {
          nextPaymentDate: {
            gte: tomorrow,
            lt: new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000),
          },
        },
        include: { user: true }, // Kullanıcı bilgisini de al (Mail adresi lazım)
      });

      if (upcomingSubs.length > 0) {
        console.log(`📬 ${upcomingSubs.length} adet yaklaşan ödeme bulundu. Mailler gönderiliyor...`);

        for (const sub of upcomingSubs) {
          // Mail İçeriği
          const mailOptions = {
            from: process.env.EMAIL_USER,
            to: sub.user.email, // Kullanıcının mailine gönder
            subject: `🔔 Hatırlatma: ${sub.name} Ödemesi Yarın!`,
            html: `
              <h3>Merhaba ${sub.user.name},</h3>
              <p>Yarın <strong>${sub.name}</strong> aboneliğin için ödeme günün.</p>
              <p>Tutar: <strong>${sub.price} ₺</strong></p>
              <br>
              <p>İyi günler dileriz!<br>🚀 Abonelik Takip Sistemi</p>
            `,
          };

          // Maili Gönder
          await transporter.sendMail(mailOptions);
          await prisma.notification.create({
  data: { userId: sub.userId, message: `${sub.name} ödemesi yaklaşıyor!`, type: "warning" }
});
          console.log(`✅ Mail gönderildi: ${sub.user.email} -> ${sub.name}`);
        }
      } else {
        console.log("🔎 Yaklaşan ödeme bulunamadı.");
      }
    } catch (error) {
      console.error("❌ Cron Job hatası:", error);
    }
  });

  console.log("✅ Abonelik Takip Servisi Başlatıldı (09:00 da günlük kontrol yapılacak).");
};

module.exports = startCronJob;