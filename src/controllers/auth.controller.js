const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();

// Register (Kayıt Ol)
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Email zaten var mı?
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Bu email zaten kullanımda." });
    }

    // 2. Şifreyi hashle (Güvenlik)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Kullanıcıyı oluştur
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json({ message: "Kullanıcı başarıyla oluşturuldu.", user });
  } catch (error) {
    res.status(500).json({ error: "Kayıt hatası", details: error.message });
  }
};

// Login (Giriş Yap)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Kullanıcıyı bul
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "Kullanıcı bulunamadı." });
    }

    // 2. Şifreyi kontrol et
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: "Hatalı şifre!" });
    }

    // 3. Token üret (JWT)
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || "gizli_anahtar", {
      expiresIn: "1d",
    });

    res.json({ message: "Giriş başarılı", token, user: { id: user.id, name: user.name } });
  } catch (error) {
    res.status(500).json({ error: "Giriş hatası" });
  }
};

// ... (Register ve Login fonksiyonları yukarıda kalsın) ...

// Kullanıcı Bilgilerini Getir (Profil Sayfası İçin)
exports.getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userData.userId },
      select: { id: true, name: true, email: true, phone: true, currency: true, language: true } // Şifreyi gönderme!
    });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Profil bilgileri alınamadı." });
  }
};

// Kullanıcı Bilgilerini Güncelle
exports.updateProfile = async (req, res) => {
  try {
    const { name, email, phone, currency, language } = req.body;
    
    const updatedUser = await prisma.user.update({
      where: { id: req.userData.userId },
      data: { name, email, phone, currency, language },
      select: { id: true, name: true, email: true, phone: true, currency: true, language: true }
    });

    res.status(200).json({ message: "Profil güncellendi!", user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: "Güncelleme başarısız." });
  }
};

// ... (Diğer fonksiyonlar yukarıda)

// Şifre Değiştirme
exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.userData.userId;

    // 1. Kullanıcıyı bul
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: "Kullanıcı bulunamadı." });

    // 2. Mevcut şifre doğru mu?
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Mevcut şifreniz hatalı!" });
    }

    // 3. Yeni şifreyi şifrele (Hash)
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 4. Veritabanını güncelle
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });

    res.status(200).json({ message: "Şifreniz başarıyla güncellendi!" });

  } catch (error) {
    res.status(500).json({ error: "Şifre değiştirilemedi." });
  }
};