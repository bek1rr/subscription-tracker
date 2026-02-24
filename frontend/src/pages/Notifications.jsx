import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import axios from "axios";
import { Bell, Check, Trash2 } from "lucide-react";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios.get("http://localhost:5000/api/notifications", {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setNotifications(res.data));
  }, []);

  const markRead = async (id) => {
    const token = localStorage.getItem("token");
    await axios.put(`http://localhost:5000/api/notifications/${id}/read`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  return (
    <div className="min-h-screen bg-gray-50 text-left">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Bildirimler</h1>
        <div className="space-y-4">
          {notifications.map(notif => (
            <div key={notif.id} className={`flex justify-between p-5 rounded-2xl border ${notif.isRead ? 'bg-white' : 'bg-blue-50 border-blue-100'}`}>
              <div className="flex gap-4">
                <Bell className="w-6 h-6 text-indigo-600" />
                <p className={`${notif.isRead ? 'text-gray-500' : 'font-bold'}`}>{notif.message}</p>
              </div>
              <button onClick={() => markRead(notif.id)} className="text-green-600"><Check /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}