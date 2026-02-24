import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard"; // <-- Bunu ekle
import Settings from "./pages/Settings";
import Notifications from "./pages/Notifications";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} /> {/* <-- Bunu ekle */}
        <Route path="/settings" element={<Settings />} /> {/* Route ekle */}
        <Route path="/notifications" element={<Notifications />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;