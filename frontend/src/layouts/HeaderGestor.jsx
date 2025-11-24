import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function HeaderGestor() {
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem("role");
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const res = await axios.get("http://localhost:8080/me", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setUsuario(res.data);
      } catch (err) {
        console.error("Error obteniendo usuario:", err);
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
          <h1 className="text-2xl font-bold text-purple-300">Gestion productos</h1>
          <p className="text-gray-400 text-sm">Bienvenido, {usuario?.username || "..."}</p>
        </div>

        {/* Botones de navegación */}
        <nav className="flex flex-col gap-4">
          {role !== "ROLE_USUARIO" && (
            <>
              <button
                className={`px-3 py-2 rounded-lg transition text-left ${
                  isActive("/gestor/panel-gestor/agregar-producto")
                    ? "bg-black text-yellow-400"
                    : "text-gray-300 hover:text-purple-300 hover:bg-gray-800"
                }`}
                onClick={() => navigate("/gestor/panel-gestor/agregar-producto")}
              >
                Agregar Producto
              </button>

              <button
                className={`px-3 py-2 rounded-lg transition text-left ${
                  isActive("/gestor/panel-gestor/agregar-categoria")
                    ? "bg-black text-yellow-400"
                    : "text-gray-300 hover:text-purple-300 hover:bg-gray-800"
                }`}
                onClick={() => navigate("/gestor/panel-gestor/agregar-categoria")}
              >
                Crear Categoría
              </button>

              <button
                className={`px-3 py-2 rounded-lg transition text-left ${
                  isActive("/gestor/panel-gestor/productos")
                    ? "bg-black text-yellow-400"
                    : "text-gray-300 hover:text-purple-300 hover:bg-gray-800"
                }`}
                onClick={() => navigate("/gestor/panel-gestor/productos")}
              >
                Ver Productos
              </button>

              <button
                className={`px-3 py-2 rounded-lg transition text-left ${
                  isActive("/mesa-de-trabajo")
                    ? "bg-black text-yellow-400"
                    : "text-gray-300 hover:text-purple-300 hover:bg-gray-800"
                }`}
                onClick={() => navigate("/mesa-de-trabajo")}
              >
                Ir al Panel
              </button>
            </>
          )}
        </nav>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 overflow-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}
