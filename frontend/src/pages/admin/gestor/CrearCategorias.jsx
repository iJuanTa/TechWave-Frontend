import { useState } from "react";
import axios from "axios";

export default function CrearCategoria() {
  const [nombre, setNombre] = useState("");
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const [error, setError] = useState(null);

  const validarNombre = (valor) => /^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/.test(valor);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje(null);
    setError(null);

    if (!validarNombre(nombre)) {
      setError("El nombre solo puede contener letras y espacios.");
      return;
    }

    try {
      setCargando(true);

      const dto = { nombre };

      const res = await axios.post(
        "http://localhost:8080/productos/crearCategoria",
        dto,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      setMensaje(res.data);
      setNombre("");
    } catch (err) {
      console.error(err);
      setError("No se pudo crear la categoría.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-center bg-gray-100 py-10">
      <div className="w-full max-w-2xl bg-white p-10 rounded-2xl border border-gray-200 shadow-xl space-y-6">
        
    

        <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">
          Crear Categoría
        </h1>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-2 text-gray-700 font-medium text-lg">
              Nombre de la categoría
            </label>
            <input
              type="text"
              value={nombre}
              placeholder="Ej: Laptops"
              onChange={(e) => setNombre(e.target.value)}
              className="w-full px-5 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-900 text-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
            />
            {nombre.length > 0 && !validarNombre(nombre) && (
              <p className="text-red-500 text-sm mt-2">
                Solo se permiten letras y espacios.
              </p>
            )}
          </div>

          {mensaje && (
            <div className="p-4 bg-green-100 text-green-800 rounded-lg text-center border border-green-200">
              {mensaje}
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-100 text-red-800 rounded-lg text-center border border-red-200">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={cargando}
            className={`w-full py-4 rounded-lg text-white font-bold text-lg shadow-md transition ${
              cargando
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-yellow-400 hover:bg-yellow-500"
            }`}
          >
            {cargando ? "Creando..." : "Crear Categoría"}
          </button>
        </form>
      </div>
    </div>
  );
}
