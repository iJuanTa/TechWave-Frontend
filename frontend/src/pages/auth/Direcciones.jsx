import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiMapPin, FiPlusCircle, FiArrowLeftCircle } from "react-icons/fi";

export default function Direcciones() {
  const navigate = useNavigate();
  const [direcciones, setDirecciones] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargarDirecciones = async () => {
    try {
      const res = await axios.get("http://localhost:8080/me/direcciones", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      const activas = (res.data || []).filter(d => d.activa);
      setDirecciones(activas);
    } catch (err) {
      console.error(err);
      setDirecciones([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDirecciones();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-700 text-xl bg-white">
        Cargando direcciones...
      </div>
    );

  const eliminarDireccion = async (id) => {
    if (!window.confirm("¿Deseas eliminar esta dirección?")) return;

    try {
      await axios.delete(`http://localhost:8080/me/direccion/eliminar/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      setDirecciones(direcciones.filter((d) => d.id !== id));
      alert("Dirección eliminada correctamente");
    } catch (err) {
      console.error(err);
      alert("Error al eliminar la dirección");
    }
  };

  const maxDireccionesActivas = 3;
  const puedeAgregar = direcciones.length < maxDireccionesActivas;

  return (
    <div className="max-w-5xl mx-auto mt-10 bg-white p-6 rounded-lg shadow-sm">
      <button
        className="flex items-center gap-2 mb-6 text-blue-600 hover:text-blue-500"
        onClick={() => navigate("/perfil")}
      >
        <FiArrowLeftCircle size={22} />
        Volver al perfil
      </button>

      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Mis Direcciones
      </h1>

      <div className="flex justify-end mb-5">
        <button
          onClick={() => puedeAgregar && navigate("/agregar-direccion")}
          disabled={!puedeAgregar}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-white ${
            puedeAgregar
              ? "bg-green-600 hover:bg-green-500"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          <FiPlusCircle size={20} />
          Agregar dirección
        </button>
      </div>

      {!puedeAgregar && (
        <div className="text-center text-yellow-600 mb-5">
          Has alcanzado el límite de {maxDireccionesActivas} direcciones activas.
        </div>
      )}

      {direcciones.length === 0 && (
        <div className="text-center text-gray-500 bg-gray-100 p-6 rounded-lg">
          No tienes direcciones activas.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {direcciones.map((d) => (
          <div
            key={d.id}
            className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition cursor-pointer"
          >
            <div className="flex items-center gap-3 mb-4">
              <FiMapPin size={32} className="text-blue-500" />
              <h2 className="text-lg font-bold text-gray-800">{d.nombre || "Dirección"}</h2>
            </div>

            <p className="text-gray-700">
              <span className="font-semibold">Calle:</span> {d.direccion}
            </p>
            <p className="text-gray-700 mt-1">
              <span className="font-semibold">Ciudad:</span> {d.ciudad?.ciudad || "Desconocida"}
            </p>
            <p className="text-gray-700 mt-1">
              <span className="font-semibold">Departamento/Estado:</span>{" "}
              {d.ciudad?.departamento?.departamento || "Desconocido"}
            </p>
            <p className="text-gray-700 mt-1">
              <span className="font-semibold">Código Postal:</span> {d.codigo_postal}
            </p>

            <div className="flex justify-end mt-5">
              <button
                onClick={() => eliminarDireccion(d.id)}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg font-semibold text-white"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
