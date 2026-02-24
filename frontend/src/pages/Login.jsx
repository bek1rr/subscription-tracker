import { useState } from "react";
import axios from "axios";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true); // Giriş mi Kayıt mı modu?
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); // Sadece kayıt olurken lazım

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Hangi adrese istek atacağız?
    const endpoint = isLogin 
      ? "http://localhost:5000/api/auth/login" 
      : "http://localhost:5000/api/auth/register";

    const payload = isLogin 
      ? { email, password } 
      : { name, email, password };

    try {
      const res = await axios.post(endpoint, payload);
      
      if (isLogin) {
        // GİRİŞ BAŞARILIYSA
        localStorage.setItem("token", res.data.token);
        window.location.href = "/dashboard";
      } else {
        // KAYIT BAŞARILIYSA
        alert("Kayıt Başarılı! Şimdi giriş yapabilirsin.");
        setIsLogin(true); // Giriş ekranına döndür
      }

    } catch (error) {
      alert("Hata: " + (error.response?.data?.error || "İşlem başarısız!"));
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-black/50">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-2xl">
        
        <h2 className="mb-6 text-3xl font-bold text-center text-gray-800">
          {isLogin ? "Giriş Yap" : "Kayıt Ol"}
        </h2>
        
        <form onSubmit={handleSubmit}>
          {/* İsim Kutusu (Sadece Kayıt Olurken Görünür) */}
          {!isLogin && (
            <div className="mb-4">
              <label className="block mb-2 text-sm font-bold text-gray-700">İsim Soyisim</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Adınız"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={!isLogin}
              />
            </div>
          )}

          <div className="mb-4">
            <label className="block mb-2 text-sm font-bold text-gray-700">Email</label>
            <input
              type="email"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="ornek@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label className="block mb-2 text-sm font-bold text-gray-700">Şifre</label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="******"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-3 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            {isLogin ? "Giriş Yap" : "Kayıt Ol"}
          </button>
        </form>

        {/* Alt Değiştirme Linki */}
        <div className="mt-6 text-center text-sm">
          <p className="text-gray-600">
            {isLogin ? "Hesabın yok mu?" : "Zaten üye misin?"}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="ml-2 font-bold text-blue-600 hover:underline focus:outline-none"
            >
              {isLogin ? "Kayıt Ol" : "Giriş Yap"}
            </button>
          </p>
        </div>

      </div>
    </div>
  );
}