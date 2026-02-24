import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Wallet, CreditCard, Calendar, Bell, Plus, Trash2, ExternalLink, PauseCircle, PlayCircle } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

// --- LOGO IMPORTLARI (Assets Klasörüne Göre Düzenlendi) ---
import netflixLogo from '../assets/netflix.png';
import youtubeLogo from '../assets/youtube.png';
import disneyLogo from '../assets/disney.png';
import blutvLogo from '../assets/blutv.png';
import exxenLogo from '../assets/exxen.png';
import gainLogo from '../assets/gain.png';
import spotifyLogo from '../assets/spotify.png';
import appleMusicLogo from '../assets/applemusic.png'; // Dosya adına dikkat: applemusic.png
import deezerLogo from '../assets/deezer.png';
import xboxLogo from '../assets/xboxone.png'; // Dosya adına dikkat: xboxone.png
import psPlusLogo from '../assets/playstationplus.png'; // Dosya adına dikkat: playstationplus.png
import steamLogo from '../assets/steam.png';
import discordLogo from '../assets/discord.png';
import amazonLogo from '../assets/amazon.png';
import hepsiburadaLogo from '../assets/hepsiburada.png';
import yemeksepetiLogo from '../assets/yemeksepeti.png';
import chatgptLogo from '../assets/chatgpt.png';
import microsoftLogo from '../assets/microsoft.png';
import adobeLogo from '../assets/adobe.png';
import canvaLogo from '../assets/canva.png';
import duolingoLogo from '../assets/duolingo.png';
import googleOneLogo from '../assets/googleone.png'; // Dosya adına dikkat: googleone.png
import icloudLogo from '../assets/icloud.png';
import githubLogo from '../assets/github.png';

// --- POPÜLER SERVİSLER, LİNKLER VE YEREL LOGOLAR ---
const POPULAR_SERVICES = [
  // EĞLENCE & YAYIN
  { name: "Netflix", category: "Eğlence", logo: netflixLogo, cancelUrl: "https://www.netflix.com/cancelplan" },
  { name: "YouTube Premium", category: "Eğlence", logo: youtubeLogo, cancelUrl: "https://www.youtube.com/paid_memberships" },
  { name: "Disney+", category: "Eğlence", logo: disneyLogo, cancelUrl: "https://www.disneyplus.com/account/subscription" },
  { name: "BluTV", category: "Eğlence", logo: blutvLogo, cancelUrl: "https://www.blutv.com/hesabim" },
  { name: "Exxen", category: "Eğlence", logo: exxenLogo, cancelUrl: "https://www.exxen.com/tr/settings/cancellation" },
  { name: "Gain", category: "Eğlence", logo: gainLogo, cancelUrl: "https://www.gain.tv/hesabim" },
  
  // MÜZİK
  { name: "Spotify", category: "Müzik", logo: spotifyLogo, cancelUrl: "https://www.spotify.com/account/change-plan/" },
  { name: "Apple Music", category: "Müzik", logo: appleMusicLogo, cancelUrl: "https://music.apple.com/account/settings" },
  { name: "Deezer", category: "Müzik", logo: deezerLogo, cancelUrl: "https://www.deezer.com/account/subscription" },

  // OYUN
  { name: "Xbox Game Pass", category: "Oyun", logo: xboxLogo, cancelUrl: "https://account.microsoft.com/services" },
  { name: "PlayStation Plus", category: "Oyun", logo: psPlusLogo, cancelUrl: "https://www.playstation.com/acct/management" },
  { name: "Steam", category: "Oyun", logo: steamLogo, cancelUrl: "https://store.steampowered.com/account/subscriptions/" },
  { name: "Discord Nitro", category: "Sosyal", logo: discordLogo, cancelUrl: "https://discord.com/channels/@me" },

  // ALIŞVERİŞ & HİZMET
  { name: "Amazon Prime", category: "Alışveriş", logo: amazonLogo, cancelUrl: "https://www.amazon.com/gp/primecentral" },
  { name: "Hepsiburada Premium", category: "Alışveriş", logo: hepsiburadaLogo, cancelUrl: "https://www.hepsiburada.com/uyelik/premium/yonet" },
  { name: "Yemeksepeti Club", category: "Yemek", logo: yemeksepetiLogo, cancelUrl: "https://www.yemeksepeti.com/" },

  // İŞ & ÜRETKENLİK
  { name: "ChatGPT Plus", category: "Yapay Zeka", logo: chatgptLogo, cancelUrl: "https://chat.openai.com/#settings/DataControls" },
  { name: "Microsoft 365", category: "İş", logo: microsoftLogo, cancelUrl: "https://account.microsoft.com/services" },
  { name: "Adobe Creative Cloud", category: "Tasarım", logo: adobeLogo, cancelUrl: "https://account.adobe.com/plans" },
  { name: "Canva", category: "Tasarım", logo: canvaLogo, cancelUrl: "https://www.canva.com/settings/billing" },
  { name: "Duolingo", category: "Eğitim", logo: duolingoLogo, cancelUrl: "https://www.duolingo.com/settings/plus" },
  
  // DEPOLAMA & YAZILIM
  { name: "Google One", category: "Depolama", logo: googleOneLogo, cancelUrl: "https://one.google.com/settings" },
  { name: "iCloud+", category: "Depolama", logo: icloudLogo, cancelUrl: "https://support.apple.com/HT207594" },
  { name: "GitHub", category: "Yazılım", logo: githubLogo, cancelUrl: "https://github.com/settings/billing" },
];

const COLORS = ["#6366f1", "#ec4899", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6", "#06b6d4", "#84cc16", "#14b8a6", "#f97316"];

// API'dan logo çeken fonksiyon (Yedek olarak duruyor, manuel eklemeler için)
const getLogoUrl = (name) => {
  if (!name) return "";
  const domain = name.toLowerCase().replace(/\s+/g, '') + ".com";
  return `https://logo.clearbit.com/${domain}`;
};

export default function Dashboard() {
  const [subs, setSubs] = useState([]);
  const [stats, setStats] = useState({ totalMonthly: 0, activeCount: 0, upcomingCount: 0, notifications: 0 });
  const [filter, setFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: "", price: "", cancelUrl: "", durationDays: "30", category: "Genel" });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      const [subsRes, statsRes] = await Promise.all([
        axios.get("http://localhost:5000/api/subscriptions", config),
        axios.get("http://localhost:5000/api/subscriptions/stats", config)
      ]);
      setSubs(subsRes.data);
      setStats(statsRes.data);
    } catch (err) { console.log("Hata oluştu"); }
  };

  const chartData = subs.reduce((acc, sub) => {
    const categoryName = sub.category || "Genel";
    const existing = acc.find((item) => item.name === categoryName);
    if (existing) {
      existing.value += sub.price;
    } else {
      acc.push({ name: categoryName, value: sub.price });
    }
    return acc;
  }, []);

  const toggleStatus = async (sub) => {
    const newStatus = sub.status === "Active" ? "Paused" : "Active";
    const token = localStorage.getItem("token");
    
    if (newStatus === "Paused" && sub.cancelUrl) {
      if(window.confirm(`${sub.name} aboneliğini iptal etmek için iptal sayfasına gitmek ister misin?`)) {
        window.open(sub.cancelUrl, "_blank", "noopener,noreferrer");
      }
    }

    try {
      await axios.patch(`http://localhost:5000/api/subscriptions/${sub.id}/status`, 
        { status: newStatus }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchData();
    } catch (error) { 
      alert("Durum değiştirilemedi."); 
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Silmek istediğine emin misin?")) return;
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:5000/api/subscriptions/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchData();
    } catch (error) { alert("Hata oluştu."); }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      await axios.post("http://localhost:5000/api/subscriptions", {
        ...formData, price: parseFloat(formData.price), currency: "TRY", startDate: new Date()
      }, { headers: { Authorization: `Bearer ${token}` } });
      
      setShowModal(false); 
      setStep(1);
      setFormData({ name: "", price: "", cancelUrl: "", durationDays: "30", category: "Genel" }); 
      fetchData();
    } catch (error) { alert("Hata oluştu"); }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-left">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Hoş Geldiniz! 👋</h1>
          <p className="text-gray-500 mt-1">Abonelik harcamalarınızın detaylı analizi ve yönetimi.</p>
        </div>

        {/* --- ÜST ÖZET KARTLARI --- */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div><p className="text-sm text-gray-500">Toplam Harcama</p><p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalMonthly.toFixed(2)} ₺</p></div>
            <div className="p-3 bg-green-50 rounded-full"><Wallet className="w-8 h-8 text-green-600" /></div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between text-blue-600">
            <div><p className="text-sm text-gray-500">Aktif Abonelik</p><p className="text-3xl font-bold text-gray-900 mt-2">{stats.activeCount}</p></div>
            <div className="p-3 bg-blue-50 rounded-full"><CreditCard className="w-8 h-8 text-blue-600" /></div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between text-orange-600">
            <div><p className="text-sm text-gray-500">Yaklaşan Ödeme</p><p className="text-3xl font-bold text-gray-900 mt-2">{stats.upcomingCount}</p></div>
            <div className="p-3 bg-orange-50 rounded-full"><Calendar className="w-8 h-8 text-orange-600" /></div>
          </div>
          <Link to="/notifications" className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition">
            <div><p className="text-sm text-gray-500">Bildirimler</p><p className="text-3xl font-bold text-gray-900 mt-2">{stats.notifications}</p></div>
            <div className="p-3 bg-red-50 rounded-full"><Bell className="w-8 h-8 text-red-600" /></div>
          </Link>
        </div>

        {/* --- HARCAMA ANALİZİ (GRAFİK) BÖLÜMÜ --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Kategori Bazlı Dağılım</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value.toFixed(2)} ₺`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 overflow-y-auto max-h-[380px]">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Harcama Özeti</h2>
            <div className="space-y-4">
              {chartData.sort((a,b) => b.value - a.value).map((item, index) => (
                <div key={index} className="flex justify-between items-center border-b border-gray-50 pb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                    <span className="text-sm font-medium text-gray-600">{item.name}</span>
                  </div>
                  <span className="font-bold text-gray-900">{item.value.toFixed(2)} ₺</span>
                </div>
              ))}
              {chartData.length === 0 && <p className="text-gray-400 text-sm text-center py-10">Veri bulunamadı.</p>}
            </div>
          </div>
        </div>

        {/* --- LİSTE FİLTRE VE EKLEME --- */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-200">
            {["All", "Active", "Paused"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filter === f ? "bg-gray-900 text-white shadow" : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {f === "All" ? "Tümü" : f === "Active" ? "Aktif" : "Duraklatılmış"}
              </button>
            ))}
          </div>

          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-200">
            <Plus className="w-5 h-5" /> Yeni Abonelik
          </button>
        </div>

        {/* --- ABONELİK KARTLARI --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {subs.filter(s => filter === "All" || s.status === filter).map((sub) => (
              <div key={sub.id} className={`bg-white p-6 rounded-2xl shadow-sm border transition relative group ${sub.status === 'Paused' ? 'border-gray-200 opacity-75' : 'border-gray-100 hover:shadow-md'}`}>
                
                <span className={`absolute top-4 right-12 px-2 py-1 text-xs font-bold rounded-md ${sub.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {sub.status === 'Active' ? 'Aktif' : 'Duraklatıldı'}
                </span>

                <button onClick={() => handleDelete(sub.id)} className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition"><Trash2 className="w-5 h-5" /></button>

                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center overflow-hidden">
                    {/* KARTLARDAKİ LOGO: Eğer yerel logo varsa kullan, yoksa API'dan dene */}
                    {POPULAR_SERVICES.find(s => s.name === sub.name)?.logo ? (
                      <img src={POPULAR_SERVICES.find(s => s.name === sub.name).logo} alt={sub.name} className="w-8 h-8 object-contain" />
                    ) : (
                      <img 
                        src={getLogoUrl(sub.name)} 
                        alt={sub.name}
                        className="w-8 h-8 object-contain"
                        onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${sub.name}&background=6366f1&color=fff`; }}
                      />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{sub.name}</h3>
                    <p className="text-xs text-gray-500">{sub.category} • {sub.durationDays || "30"} Gün</p>
                  </div>
                </div>

                <div className="flex justify-between items-end mb-6">
                  <div>
                    <p className="text-xs text-gray-400">Sonraki Ödeme</p>
                    <p className="text-sm font-semibold text-gray-700">{new Date(sub.nextPaymentDate).toLocaleDateString()}</p>
                  </div>
                  <p className="text-xl font-bold text-indigo-600">{sub.price} ₺</p>
                </div>

                <div className="flex gap-2">
                    {/* GÜNCELLENEN BUTON YAPISI */}
                    <button 
                      onClick={() => toggleStatus(sub)}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition ${
                        sub.status === 'Active' ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'bg-green-50 text-green-600 hover:bg-green-100'
                      }`}
                    >
                      {sub.status === 'Active' ? <><PauseCircle className="w-4 h-4"/> Duraklat</> : <><PlayCircle className="w-4 h-4"/> Başlat</>}
                    </button>

                    {sub.cancelUrl && (
                        <a href={sub.cancelUrl} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold text-red-500 bg-red-50 hover:bg-red-100 transition">
                        İptal Et <ExternalLink className="w-3 h-3"/>
                        </a>
                    )}
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* --- MODAL (ABONELİK EKLEME) --- */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl relative flex flex-col max-h-[90vh]">
            
            <div className="p-8 pb-0">
                <button onClick={() => { setShowModal(false); setStep(1); }} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 text-3xl">×</button>
            </div>

            {step === 1 ? (
              <div className="flex flex-col h-full overflow-hidden p-8 pt-0">
                <h2 className="text-2xl font-bold mb-2 text-gray-800">Abonelik Seç</h2>
                <p className="text-gray-500 mb-6 text-sm font-medium">Popüler Servisler</p>
                
                <div className="overflow-y-auto pr-2 custom-scrollbar flex-1 mb-6">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {POPULAR_SERVICES.map((service) => (
                        <button
                        key={service.name}
                        onClick={() => {
                            setFormData({ 
                                ...formData, 
                                name: service.name, 
                                category: service.category,
                                cancelUrl: service.cancelUrl || "" 
                            });
                            setStep(2);
                        }}
                        className="flex flex-col items-center justify-center p-4 border-2 border-gray-50 rounded-2xl hover:border-indigo-100 hover:bg-indigo-50 transition-all group h-32"
                        >
                        <div className="w-12 h-12 rounded-xl shadow-sm flex items-center justify-center bg-white border border-gray-100 mb-3 group-hover:scale-110 transition overflow-hidden shrink-0">
                            {/* MODALDAKİ LOGO: YEREL DOSYADAN ÇEKİLİYOR */}
                            <img src={service.logo} alt={service.name} className="w-8 h-8 object-contain" />
                        </div>
                        <span className="text-xs font-bold text-gray-700 text-center line-clamp-2">{service.name}</span>
                        </button>
                    ))}
                    </div>
                </div>

                <div className="pt-4 border-t border-dashed border-gray-200 shrink-0">
                    <button onClick={() => setStep(2)} className="w-full p-4 border-2 border-dashed border-gray-200 rounded-2xl text-gray-500 font-bold hover:bg-gray-50 transition flex items-center justify-center gap-2">
                        <Plus className="w-5 h-5"/> Özel Abonelik Ekle
                    </button>
                </div>
              </div>
            ) : (
              <div className="p-8 pt-0 overflow-y-auto">
                <form onSubmit={handleAdd} className="space-y-6 mt-8">
                    <div className="flex items-center gap-4 mb-6">
                    <button type="button" onClick={() => setStep(1)} className="text-indigo-600 font-bold text-sm">← Geri Dön</button>
                    <div className="flex items-center gap-3">
                        {/* FORMDAKİ LOGO: Seçilen servisin yerel logosunu gösterir */}
                        {POPULAR_SERVICES.find(s => s.name === formData.name)?.logo && (
                          <img src={POPULAR_SERVICES.find(s => s.name === formData.name).logo} className="w-10 h-10 rounded-lg object-contain border p-1 bg-white" />
                        )}
                        <h2 className="text-2xl font-bold text-gray-800">{formData.name || "Abonelik Detayları"}</h2>
                    </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Platform Adı</label>
                        <input type="text" className="w-full bg-gray-50 border-0 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Fiyat (TL)</label>
                        <input type="number" className="w-full bg-gray-50 border-0 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} required />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Kategori</label>
                        <input type="text" className="w-full bg-gray-50 border-0 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} required />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Döngü (Gün)</label>
                        <input type="number" className="w-full bg-gray-50 border-0 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.durationDays} onChange={(e) => setFormData({...formData, durationDays: e.target.value})} required />
                    </div>
                    </div>
                    
                    <input type="hidden" value={formData.cancelUrl} />

                    <button type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition shadow-lg text-lg">Kaydet ve Başlat</button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}