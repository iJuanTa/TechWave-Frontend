import { useNavigate } from "react-router-dom";
import { FiAlertTriangle } from "react-icons/fi";

export default function AccesoDenegado() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-gray-100 px-6">

      {/* ÍCONO */}
      <div className="flex flex-col items-center mb-6 animate-pulse">
        <FiAlertTriangle size={90} className="text-red-500 mb-4" />
      </div>

      {/* TÍTULO */}
      <h1 className="text-5xl font-extrabold text-red-400 mb-4 text-center">
        Acceso Denegado
      </h1>

      {/* MENSAJE */}
      <p className="text-lg text-gray-300 max-w-xl text-center mb-8">
        No tienes permisos para acceder a esta sección.  
        <br />
        TechWave está trabajando continuamente para expandir las funciones y mejorar tu experiencia.  
        <br />
        ¡Gracias por formar parte de esta ola tecnológica!
      </p>

      {/* BOTÓN */}
      <button
        onClick={() => navigate(-1)}
        className="px-6 py-3 bg-purple-700 hover:bg-purple-800 rounded-xl text-white font-semibold shadow-lg transition transform hover:scale-105"
      >
        Volver al inicio
      </button>
    </div>
  );
}
