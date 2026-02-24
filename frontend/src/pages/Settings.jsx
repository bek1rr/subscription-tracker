import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import axios from "axios";
import { User, Shield, Bell, Settings as SettingsIcon, Save, Lock } from "lucide-react";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("Profile");
  const [userData, setUserData] = useState({ name: "", email: "", phone: "", currency: "TRY", language: "tr" });
  
  // Şifre Değiştirme State'leri
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get("http://localhost:5000/api/auth/profile", { headers: { Authorization: `Bearer ${token}` } });
      setUserData(res.data);
    } catch (err) { console.log("Hata"); }
  };

  // Profil Kaydetme
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      await axios.put("http://localhost:5000/api/auth/profile", userData, { headers: { Authorization: `Bearer ${token}` } });
      alert("✅ Profil güncellendi!");
    } catch (error) { alert("❌ Hata oluştu."); } finally { setLoading(false); }
  };

  // Şifre Değiştirme Fonksiyonu
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      alert("⚠️ Yeni şifreler uyuşmuyor!");
      return;
    }
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      await axios.put("http://localhost:5000/api/auth/password", {
        currentPassword: passwords.current,
        newPassword: passwords.new
      }, { headers: { Authorization: `Bearer ${token}` } });
      
      alert("✅ Şifreniz başarıyla değiştirildi!");
      setPasswords({ current: "", new: "", confirm: "" }); // Kutuları temizle
    } catch (error) {
      alert("❌ " + (error.response?.data?.error || "Şifre değiştirilemedi."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Hesap Ayarları</h1>
        <p className="text-gray-500 mb-8">Hesabınızı ve tercihlerinizi buradan yönetin.</p>

        <div className="flex flex-col md:flex-row gap-8">
          
          {/* SOL MENÜ */}
          <div className="w-full md:w-64 space-y-2">
            {[
              { id: "Profile", icon: User, label: "Profil" },
              { id: "Security", icon: Shield, label: "Güvenlik" },
              { id: "Preferences", icon: SettingsIcon, label: "Tercihler" },
            ].map((item) => (
              <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${activeTab === item.id ? "bg-white text-indigo-600 shadow-sm border border-gray-100" : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"}`}>
                <item.icon className="w-5 h-5" /> {item.label}
              </button>
            ))}
          </div>

          {/* SAĞ İÇERİK */}
          <div className="flex-1 bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            
            {/* --- PROFİL SEKMESİ --- */}
            {activeTab === "Profile" && (
              <form onSubmit={handleSaveProfile} className="space-y-6">
                <h2 className="text-xl font-bold text-gray-800 border-b pb-4">Profil Bilgileri</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Ad Soyad</label><input type="text" className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none" value={userData.name} onChange={(e) => setUserData({...userData, name: e.target.value})} /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label><input type="text" className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none" value={userData.phone || ""} onChange={(e) => setUserData({...userData, phone: e.target.value})} /></div>
                  <div className="col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label><input type="email" className="w-full border rounded-lg p-2.5 bg-gray-50 text-gray-500" value={userData.email} disabled /><p className="text-xs text-gray-400 mt-1">Değiştirilemez.</p></div>
                </div>
                <div className="flex justify-end pt-4"><button type="submit" disabled={loading} className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition">{loading ? "..." : "Kaydet"}</button></div>
              </form>
            )}

            {/* --- GÜVENLİK (ŞİFRE) SEKMESİ --- */}
            {activeTab === "Security" && (
              <form onSubmit={handlePasswordUpdate} className="space-y-6">
                <h2 className="text-xl font-bold text-gray-800 border-b pb-4">Güvenlik Ayarları</h2>
                
                <div className="max-w-md">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mevcut Şifre</label>
                        <div className="relative">
                            <input 
                                type="password" 
                                className="w-full border rounded-lg p-2.5 pl-10 focus:ring-2 focus:ring-indigo-500 outline-none"
                                value={passwords.current}
                                onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                                required
                            />
                            <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Yeni Şifre</label>
                        <input 
                            type="password" 
                            className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
                            value={passwords.new}
                            onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Yeni Şifre (Tekrar)</label>
                        <input 
                            type="password" 
                            className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
                            value={passwords.confirm}
                            onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                            required
                        />
                    </div>

                    <div className="flex justify-start">
                        <button type="submit" disabled={loading} className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition">
                            <Save className="w-4 h-4" /> {loading ? "Güncelleniyor..." : "Şifreyi Güncelle"}
                        </button>
                    </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl mt-6">
                    <h3 className="font-bold text-yellow-800 text-sm">İki Faktörlü Doğrulama (2FA)</h3>
                    <p className="text-xs text-yellow-700 mt-1">Bu özellik şu anda geliştirme aşamasındadır. Yakında aktif edilecektir.</p>
                </div>
              </form>
            )}

            {/* --- TERCİHLER SEKMESİ --- */}
            {activeTab === "Preferences" && (
                 <form onSubmit={handleSaveProfile} className="space-y-6">
                 <h2 className="text-xl font-bold text-gray-800 border-b pb-4">Genel Tercihler</h2>
                 <div><label className="block text-sm font-medium text-gray-700 mb-1">Para Birimi</label><select className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none" value={userData.currency} onChange={(e) => setUserData({...userData, currency: e.target.value})}><option value="TRY">TRY - Türk Lirası</option><option value="USD">USD - Amerikan Doları</option><option value="EUR">EUR - Euro</option></select></div>
                 <div><label className="block text-sm font-medium text-gray-700 mb-1">Dil</label><select className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none" value={userData.language} onChange={(e) => setUserData({...userData, language: e.target.value})}><option value="tr">Türkçe</option><option value="en">English</option></select></div>
                 <div className="flex justify-end pt-4"><button type="submit" disabled={loading} className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition">Kaydet</button></div>
               </form>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}