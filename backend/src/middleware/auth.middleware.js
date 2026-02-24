const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    // 1. Token'ı header'dan al ("Bearer eyJhbGci...")
    const token = req.headers.authorization.split(" ")[1];

    // 2. Token'ı çöz
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET || "gizli_anahtar");

    // 3. Token içindeki userId'yi isteğe ekle (Böylece controller kimin işlem yaptığını bilir)
    req.userData = { userId: decodedToken.userId };

    next(); // Devam et, sorun yok
  } catch (error) {
    res.status(401).json({ message: "Yetkisiz erişim! Lütfen giriş yapın." });
  }
};