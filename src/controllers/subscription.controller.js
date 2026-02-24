const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Abonelik Ekle
// Abonelik Ekle
exports.createSubscription = async (req, res) => {
  try {
    const { userId } = req.userData;
    
    // durationDays (Kaç gün sürdüğü) bilgisini de alıyoruz
    const { name, price, currency, category, startDate, cancelUrl, durationDays } = req.body;

    const start = new Date(startDate);
    let nextPayment = new Date(start);

    // ESKİ YÖNTEMİ SİL: (Monthly/Yearly kontrolü yerine)
    // YENİ YÖNTEM: Gelen gün sayısını ekle
    // Eğer kullanıcı boş bırakırsa varsayılan 30 gün olsun
    const daysToAdd = durationDays ? parseInt(durationDays) : 30;
    
    nextPayment.setDate(nextPayment.getDate() + daysToAdd);

    const newSubscription = await prisma.subscription.create({
      data: {
        userId: userId,
        name,
        price: parseFloat(price),
        currency,
        category,
        billingCycle: `${daysToAdd} Günlük`, // Veritabanına "30 Günlük" gibi yazalım
        startDate: start,
        nextPaymentDate: nextPayment,
        cancelUrl: cancelUrl
      }
    });

    res.status(201).json({ message: "Abonelik eklendi!", subscription: newSubscription });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Abonelik eklenirken hata oluştu." });
  }
};

// Kullanıcının Aboneliklerini Getir
exports.getMySubscriptions = async (req, res) => {
  try {
    const { userId } = req.userData;
    
    const subscriptions = await prisma.subscription.findMany({
      where: { userId: userId } // Sadece giriş yapan kişinin verilerini getir
    });

    res.status(200).json(subscriptions);
  } catch (error) {
    res.status(500).json({ error: "Veriler alınamadı." });
  }
};

// ... (üstteki kodlar aynen kalsın)

// Abonelik Silme Fonksiyonu
exports.deleteSubscription = async (req, res) => {
  try {
    const { id } = req.params; // Silinecek aboneliğin ID'si
    const { userId } = req.userData; // Kim siliyor? (Güvenlik için şart)

    // Sadece kendi aboneliğini silebilsin diye userId kontrolü yapıyoruz
    await prisma.subscription.deleteMany({
      where: {
        id: parseInt(id),
        userId: userId 
      }
    });

    res.status(200).json({ message: "Başarıyla silindi." });

  } catch (error) {
    res.status(500).json({ error: "Silme işlemi başarısız." });
  }
};
// ... (Diğer kodlar yukarıda)

// Dashboard İstatistiklerini Getir
exports.getStats = async (req, res) => {
  try {
    const { userId } = req.userData;

    // 1. Tüm aktif abonelikleri çek
    const subs = await prisma.subscription.findMany({
      where: { userId: userId }
    });

    // 2. Toplam Aylık Harcamayı Hesapla
    // Not: Yıllık abonelikleri 12'ye bölerek aylık maliyete ekleyebiliriz ama şimdilik düz topluyoruz.
    const totalMonthly = subs.reduce((acc, sub) => acc + sub.price, 0);

    // 3. Yaklaşan Ödemeleri Bul (Önümüzdeki 7 gün içindekiler)
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    const upcomingCount = subs.filter(sub => {
      const paymentDate = new Date(sub.nextPaymentDate);
      return paymentDate >= today && paymentDate <= nextWeek;
    }).length;

    res.status(200).json({
      totalMonthly,      // Toplam Para
      activeCount: subs.length, // Kaç tane abonelik var
      upcomingCount,     // Yaklaşan ödeme sayısı
      notifications: 0   // Şimdilik 0 (Sonra yapacağız)
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "İstatistikler alınamadı." });
  }
};

// ... (Diğer fonksiyonlar yukarıda)

// Durum Güncelleme (Pause / Resume)
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // Frontend'den "Active" veya "Paused" gelecek

    const updatedSub = await prisma.subscription.update({
      where: { id: parseInt(id) },
      data: { status: status }
    });

    res.status(200).json(updatedSub);
  } catch (error) {
    res.status(500).json({ error: "Durum güncellenemedi." });
  }
};