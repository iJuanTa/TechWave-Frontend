import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function EditarPerfil() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    username: "",
    email: "",
    fotoUrl: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const cargarDatos = async () => {
    try {
      const res = await axios.get("http://localhost:8080/me", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      setForm({
        nombre: res.data.nombre || "",
        apellido: res.data.apellido || "",
        username: res.data.username || "",
        email: res.data.email || "",
        fotoUrl: res.data.fotoUrl || "",
      });
    } catch (err) {
      console.error(err);
      alert("No se pudo cargar la información.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGuardar = async () => {
    setSaving(true);
    try {
      await axios.put("http://localhost:8080/me/editar", form, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      alert("Perfil actualizado correctamente.");
      navigate("/perfil");
    } catch (err) {
      console.error(err);
      alert("Error al actualizar el perfil.");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 text-gray-500 text-lg">
        Cargando información...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-lg p-10 border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Editar Perfil
        </h1>

        <div className="space-y-4">
          {/** Nombre */}
          <div>
            <label className="block font-semibold text-gray-700">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              className="w-full p-3 mt-1 rounded-lg border border-gray-300 bg-gray-200 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
          </div>

          {/** Apellido */}
          <div>
            <label className="block font-semibold text-gray-700">Apellido</label>
            <input
              type="text"
              name="apellido"
              value={form.apellido}
              onChange={handleChange}
              className="w-full p-3 mt-1 rounded-lg border border-gray-300 bg-gray-200 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
          </div>

          {/** Username */}
          <div>
            <label className="block font-semibold text-gray-700">Username</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              className="w-full p-3 mt-1 rounded-lg border border-gray-300 bg-gray-200 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
          </div>

          {/** Email */}
          <div>
            <label className="block font-semibold text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full p-3 mt-1 rounded-lg border border-gray-300 bg-gray-200 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
          </div>
        </div>

        {/** Botones */}
        <div className="mt-6 flex flex-col gap-4">
          <button
            onClick={handleGuardar}
            disabled={saving}
            className={`w-full py-3 rounded-lg text-white font-semibold shadow-md transition ${
              saving ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-500"
            }`}
          >
            {saving ? "Guardando..." : "Guardar Cambios"}
          </button>

          <button
            onClick={() => navigate("/perfil")}
            className="w-full py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
