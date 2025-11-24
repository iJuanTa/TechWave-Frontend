import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  FiArrowLeft,
  FiUser,
  FiHome,
  FiShoppingCart,
  FiBox,
  FiLogOut,
  FiTruck,
} from "react-icons/fi";
import { useCarrito } from "../context/CarritoContext";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const rol = localStorage.getItem("role");

  const { cantidadTotal } = useCarrito();
  const [usuario, setUsuario] = useState(null);
  const esDetalleProducto = location.pathname.startsWith("/producto/");

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

  const handleLogout = () => {
    axios.post(
      "http://localhost:8080/auth/logout",
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    localStorage.removeItem("token_exp");
    navigate("/login");
  };

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <aside className="w-20 bg-gray-800 flex flex-col justify-between items-center py-6 border-r border-gray-700 shadow-lg">
        <div className="flex flex-col items-center space-y-6">
          {/* Perfil */}
          <button
            className={`p-1 rounded-full overflow-hidden ${
              isActive("/perfil") ? "bg-black" : "bg-gray-700"
            } hover:bg-gray-600`}
            title="Perfil"
            onClick={() => navigate("/perfil")}
          >
            {usuario?.fotoUrl ? (
              <img
                src={`http://localhost:8080${usuario.fotoUrl}`}
                alt="Perfil"
                className="w-12 h-12 object-cover rounded-full"
              />
            ) : (
              <FiUser
                size={24}
                className={
                  isActive("/perfil") ? "text-yellow-400" : "text-white"
                }
              />
            )}
          </button>

          {/* Carrito */}
          <button
            className={`relative p-3 rounded-lg ${
              isActive("/carrito") ? "bg-black" : "bg-gray-700"
            } hover:bg-gray-600`}
            title="Carrito"
            onClick={() => navigate("/carrito")}
          >
            <FiShoppingCart
              size={24}
              className={
                isActive("/carrito") ? "text-yellow-400" : "text-white"
              }
            />
            {cantidadTotal > 0 && (
              <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-red-500 text-white text-xs rounded-full px-1">
                {cantidadTotal}
              </span>
            )}
          </button>

          {/* Tienda */}
          <button
            className={`p-3 rounded-lg ${
              isActive("/tienda") ? "bg-black" : "bg-gray-700"
            } hover:bg-gray-600`}
            title="Tienda"
            onClick={() => navigate("/tienda")}
          >
            <FiHome
              size={22}
              className={isActive("/tienda") ? "text-yellow-400" : "text-white"}
            />
          </button>

          {/* Pedidos */}
          <button
            className={`p-3 rounded-lg ${
              isActive("/pedidos") ? "bg-black" : "bg-gray-700"
            } hover:bg-gray-600`}
            title="Pedidos"
            onClick={() => navigate("/pedidos")}
          >
            <FiTruck
              size={24}
              className={
                isActive("/pedidos") ? "text-yellow-400" : "text-white"
              }
            />
          </button>

          {/* Mesa de trabajo */}
          {rol !== "ROLE_USUARIO" && (
            <button
              className={`p-3 rounded-lg ${
                isActive("/mesa-de-trabajo") ? "bg-black" : "bg-purple-700"
              } hover:bg-purple-600`}
              title="Mesa de trabajo"
              onClick={() => navigate("/mesa-de-trabajo")}
            >
              <FiBox
                size={24}
                className={
                  isActive("/mesa-de-trabajo")
                    ? "text-yellow-400"
                    : "text-white"
                }
              />
            </button>
          )}
        </div>

        {/* Logout */}
        <button
          className="p-3 rounded-lg bg-red-700 hover:bg-red-600"
          title="Cerrar sesión"
          onClick={handleLogout}
        >
          <FiLogOut size={24} />
        </button>
      </aside>

      {/* Contenido */}
      <main className="flex-1 overflow-auto p-6">
        {esDetalleProducto && (
          <button
            onClick={() => navigate(-1)}
            className="mb-4 p-3 rounded-lg bg-gray-700 hover:bg-gray-600 flex items-center"
          >
            <FiArrowLeft size={24} />
            <span className="ml-2">Atrás</span>
          </button>
        )}
        <Outlet />
      </main>
    </div>
  );
}
