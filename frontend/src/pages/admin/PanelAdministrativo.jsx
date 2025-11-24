import { useNavigate } from "react-router-dom";
import { FiUsers, FiSettings, FiShield, FiActivity } from "react-icons/fi";

export default function PanelAministrativo() {
  const navigate = useNavigate();

  const secciones = [
    {
      nombre: "Gestionamiento",
      icono: <FiUsers size={32} className="text-white" />,
      color: "bg-blue-600 hover:bg-blue-500",
      ruta: "/gestor/panel-gestor/productos",
    },
    {
      nombre: "Procesamiento",
      icono: <FiActivity size={32} className="text-white" />,
      color: "bg-green-600 hover:bg-green-500",
      ruta: "/procesador/inventario",
    },
    {
      nombre: "Supervisor",
      icono: <FiShield size={32} className="text-white" />,
      color: "bg-purple-600 hover:bg-purple-500",
      ruta: "/ventas",
    },
    {
      nombre: "Administrador",
      icono: <FiSettings size={32} className="text-white" />,
      color: "bg-red-600 hover:bg-red-500",
      ruta: "/admin/admin",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4">
      <h1 className="text-4xl font-bold text-center text-gray-500 mb-10">
        Panel Administrativo
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {secciones.map((sec) => (
          <div
            key={sec.nombre}
            onClick={() => navigate(sec.ruta)}
            className={`${sec.color} cursor-pointer p-6 rounded-xl shadow-lg flex flex-col items-center justify-center transition transform hover:scale-105`}
          >
            {sec.icono}
            <h2 className="text-xl font-bold text-white mt-4">{sec.nombre}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}
