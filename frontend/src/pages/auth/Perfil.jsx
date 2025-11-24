import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Perfil() {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fotoFile, setFotoFile] = useState(null);
  const [subiendo, setSubiendo] = useState(false);
  const navigate = useNavigate();

  const fetchUsuario = async () => {
    try {
      const res = await axios.get("http://localhost:8080/me", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setUsuario(res.data);
    } catch (err) {
      setError("No se pudo cargar la información del usuario");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuario();
  }, []);

  const handleFileChange = (e) => setFotoFile(e.target.files[0]);

  const handleSubirFoto = async () => {
    if (!fotoFile) return;
    setSubiendo(true);

    const formData = new FormData();
    formData.append("file", fotoFile);

    try {
      const res = await axios.post(
        `http://localhost:8080/me/foto/editar`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert(res.data);
      fetchUsuario();
    } catch (err) {
      console.error(err);
      alert("Error al subir la foto");
    } finally {
      setSubiendo(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-700 text-xl">
        Cargando perfil...
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-500 text-xl">
        {error}
      </div>
    );

  return (
    <div className="bg-gray-100 min-h-screen px-4 sm:px-10 lg:px-20 py-8">
      {/* Volver */}
      <button
        onClick={() => navigate("/tienda")}
        className="mb-6 px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg font-semibold text-gray-800 transition"
      >
        ← Volver a la tienda
      </button>

      {/* Foto y username */}
      <div className="flex flex-col items-center gap-4 mb-8">
        <div className="w-48 h-48">
          <img
            src={
              usuario.fotoUrl
                ? `http://localhost:8080${usuario.fotoUrl}`
                : "https://via.placeholder.com/150?text=Sin+Foto"
            }
            alt="Foto de perfil"
            className="w-full h-full object-cover rounded-full border-4 border-gray-400 shadow-lg"
          />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">{usuario.username}</h1>

        {/* Subir foto */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
          <input
            type="file"
            onChange={handleFileChange}
            className="text-gray-600 p-2 rounded-lg border border-gray-300"
          />
          <button
            onClick={handleSubirFoto}
            disabled={subiendo}
            className={`text-white font-bold px-8 py-3 rounded-lg shadow-md transition transform hover:scale-105 ${
              subiendo
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-500"
            }`}
          >
            {subiendo ? "Subiendo..." : "Cambiar foto"}
          </button>
        </div>
      </div>

      {/* Información adicional */}
      <div className="flex flex-col md:flex-row justify-around mb-8 gap-8 text-center">
        <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200">
          <p className="font-semibold text-gray-700">Nombre</p>
          <p className="text-gray-800">
            {usuario.nombre} {usuario.apellido}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200">
          <p className="font-semibold text-gray-700">Email</p>
          <p className="text-gray-800">{usuario.email}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200">
          <p className="font-semibold text-gray-700">Creación</p>
          <p className="text-gray-800">
            {new Date(usuario.creacion).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Secciones 2x2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <button
          className="transition transform hover:scale-105 bg-blue-600 hover:bg-blue-500 p-6 rounded-xl shadow-md font-semibold text-white"
          onClick={() => navigate("/editar-perfil")}
        >
          Editar perfil
        </button>
        <button
          className="transition transform hover:scale-105 bg-blue-600 hover:bg-blue-500 p-6 rounded-xl shadow-md font-semibold text-white"
          onClick={() => navigate("/metodos-pago")}
        >
          Métodos de pago
        </button>
        <button
          className="transition transform hover:scale-105 bg-blue-600 hover:bg-blue-500 p-6 rounded-xl shadow-md font-semibold text-white"
          onClick={() => navigate("/direcciones")}
        >
          Direcciones
        </button>
        <button
          className="transition transform hover:scale-105 bg-blue-600 hover:bg-blue-500 p-6 rounded-xl shadow-md font-semibold text-white"
          onClick={() => navigate("/compras")}
        >
          Compras
        </button>
      </div>
    </div>
  );
}
