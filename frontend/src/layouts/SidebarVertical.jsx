import {
  FiHome,
  FiTrendingUp,
  FiFileText,
  FiArrowUpCircle,
} from "react-icons/fi";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

export default function SidebarVertical() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 flex flex-col justify-between py-6 px-4 border-r border-gray-700 shadow-lg">
        {/* Logo */}
        <div className="text-center mb-10">
          <h1 className="text-2xl font-bold text-purple-300">TechWave</h1>
          <p className="text-gray-400 text-sm">Panel administrativo</p>
        </div>

        {/* Botones de navegación */}
        <nav className="flex flex-col gap-4">
          <button
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${
              isActive("/ventas")
                ? "bg-black text-yellow-400"
                : "text-gray-300 hover:text-purple-300 hover:bg-gray-800"
            }`}
            onClick={() => navigate("/ventas")}
          >
            <FiTrendingUp size={22} />
            <span className="font-medium">Ventas</span>
          </button>

          <button
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${
              isActive("/reportes")
                ? "bg-black text-yellow-400"
                : "text-gray-300 hover:text-purple-300 hover:bg-gray-800"
            }`}
            onClick={() => navigate("/reportes")}
          >
            <FiFileText size={22} />
            <span className="font-medium">Reportes</span>
          </button>

          <button
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${
              isActive("/gastos")
                ? "bg-black text-yellow-400"
                : "text-gray-300 hover:text-red-400 hover:bg-gray-800"
            }`}
            onClick={() => navigate("/gastos")}
          >
            <FiArrowUpCircle size={22} />
            <span className="font-medium">Gastos / Egresos</span>
          </button>
          <button
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${
              isActive("/mesa-de-trabajo")
                ? "bg-black text-yellow-400"
                : "text-gray-300 hover:text-purple-300 hover:bg-gray-800"
            }`}
            onClick={() => navigate("/mesa-de-trabajo")}
          >
            <FiHome size={22} />
            <span className="font-medium">Inicio</span>
          </button>
        </nav>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 overflow-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}
