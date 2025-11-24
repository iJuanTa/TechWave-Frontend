import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function LayoutProcesador() {
  const navigate = useNavigate();
  const location = useLocation();
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const res = await axios.get("http://localhost:8080/me", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setUsuario(res.data);
      } catch (err) {
        console.error("No se pudo obtener usuario:", err);
      }
    };
    fetchUsuario();
  }, []);

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 flex flex-col justify-between py-6 px-4 border-r border-gray-700 shadow-lg">
        {/* Logo */}
        <div className="text-center mb-10">
          <h1 className="text-2xl font-bold text-purple-300">TechWave</h1>
          <p className="text-gray-400 text-sm">Panel procesador</p>
        </div>

        {/* Botones de navegación */}
        <nav className="flex flex-col gap-4">
          <button
            className={`px-4 py-2 rounded-lg w-full text-left transition ${
              isActive("/procesador/inventario")
                ? "bg-black text-yellow-400"
                : "text-gray-300 hover:text-purple-300 hover:bg-gray-800"
            }`}
            onClick={() => navigate("/procesador/inventario")}
          >
            Inventario
          </button>

          <button
            className={`px-4 py-2 rounded-lg w-full text-left transition ${
              isActive("/procesador/envios")
                ? "bg-black text-yellow-400"
                : "text-gray-300 hover:text-purple-300 hover:bg-gray-800"
            }`}
            onClick={() => navigate("/procesador/envios")}
          >
            Envíos
          </button>

          <button
            className={`px-4 py-2 rounded-lg w-full text-left transition ${
              isActive("/procesador/compras")
                ? "bg-black text-yellow-400"
                : "text-gray-300 hover:text-purple-300 hover:bg-gray-800"
            }`}
            onClick={() => navigate("/indefinido")}
          >
            Compras
          </button>
        </nav>

        {/* Botón Ir al panel */}
        <button
          className={`mt-6 px-4 py-2 rounded-lg w-full text-left transition ${
            isActive("/mesa-de-trabajo")
              ? "bg-black text-yellow-400"
              : "text-gray-300 hover:text-purple-300 hover:bg-gray-800"
          }`}
          onClick={() => navigate("/mesa-de-trabajo")}
        >
          Ir al panel
        </button>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 overflow-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}
