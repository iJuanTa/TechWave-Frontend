import { useNavigate } from "react-router-dom";

export default function PaginaIndefinida() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-900 text-white p-4 text-center">
      <h1 className="text-5xl font-bold mb-4">🚧 Página en planeación 🚧</h1>
      <p className="text-xl mb-6 text-gray-400 max-w-md">
        TechWave está trabajando de la mano con Juanta para poder sacar esta página adelante.
      </p>
      <p className="text-lg mb-8 text-gray-400 max-w-md">
        Muchas gracias por visitar la página, tu paciencia nos ayuda a mejorar.
      </p>
      <button
        className="px-6 py-3 bg-purple-700 rounded-lg hover:bg-purple-500 transition"
        onClick={() => navigate(-1)}
      >
        Volver al inicio
      </button>
    </div>
  );
}
