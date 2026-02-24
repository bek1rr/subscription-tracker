import { Link, useNavigate } from "react-router-dom";
import { LogOut, Rocket, LayoutDashboard, Settings, Bell } from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* LOGO */}
        <Link to="/dashboard" className="flex items-center gap-2 text-xl font-extrabold text-indigo-600 hover:opacity-80 transition">
          <Rocket className="w-7 h-7" />
          <span>SubTracker</span>
        </Link>

        {/* MENÜ LİNKLERİ */}
        <div className="flex items-center gap-6">
          
          <Link to="/dashboard" className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 font-medium transition group">
            <LayoutDashboard className="w-5 h-5 group-hover:scale-110 transition" />
            <span className="hidden sm:block">Panel</span>
          </Link>

          {/* BİLDİRİMLER LİNKİ (BURASI ÇOK ÖNEMLİ) */}
          <Link to="/notifications" className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 font-medium transition group">
            <Bell className="w-5 h-5 group-hover:rotate-12 transition" />
            <span className="hidden sm:block">Bildirimler</span>
          </Link>

          <Link to="/settings" className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 font-medium transition group">
            <Settings className="w-5 h-5 group-hover:rotate-90 transition" />
            <span className="hidden sm:block">Ayarlar</span>
          </Link>

          <div className="h-6 w-px bg-gray-300 mx-2 hidden sm:block"></div>

          <button onClick={handleLogout} className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-xl hover:bg-red-600 hover:text-white transition font-bold text-sm">
            <LogOut className="w-4 h-4" />
            <span>Çıkış</span>
          </button>
          
        </div>
      </div>
    </nav>
  );
}