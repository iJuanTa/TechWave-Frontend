import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiArrowLeftCircle } from "react-icons/fi";

export default function AgregarDireccion() {
  const navigate = useNavigate();

  const [departamentos, setDepartamentos] = useState([]);
  const [ciudades, setCiudades] = useState([]);

  const [form, setForm] = useState({
    departamento: "",
    ciudad: "",
    direccion: "",
    codigo_postal: "",
    descripcion: "",
  });

  const [loading, setLoading] = useState(false);

  const cargarDepartamentos = async () => {
    try {
      const res = await axios.get("http://localhost:8080/departamento", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setDepartamentos(res.data.map((d) => d.departamento));
    } catch (err) {
      console.error(err);
      setDepartamentos([]);
    }
  };

  useEffect(() => {
    cargarDepartamentos();
  }, []);

  const cargarCiudades = async (departamento) => {
    if (!departamento) {
      setCiudades([]);
      return;
    }

    try {
      const res = await axios.get(
        `http://localhost:8080/departamento/ciudades?departamento=${departamento}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setCiudades(res.data.map((c) => c.ciudad));
    } catch (err) {
      console.error(err);
      setCiudades([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === "departamento") {
      setForm((prev) => ({ ...prev, ciudad: "" }));
      cargarCiudades(value);
    }
  };

  const handleSubmit = async () => {
    if (!form.departamento || !form.ciudad || !form.direccion || !form.codigo_postal) {
      alert("Completa todos los campos obligatorios.");
      return;
    }

    setLoading(true);

    try {
      await axios.post(
        "http://localhost:8080/me/direccion/agregar",
        form,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("Dirección agregada correctamente");
      navigate(-1);
    } catch (err) {
      console.error(err);
      alert("Error al agregar la dirección");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-100 to-gray-200 py-12 px-4 flex justify-center">
      <div className="max-w-2xl w-full bg-white rounded-2xl p-10 shadow-2xl border border-gray-100">

        {/* BOTÓN VOLVER */}
        <button
          className="flex items-center gap-2 mb-8 text-gray-700 hover:text-gray-900 transition font-medium"
          onClick={() => navigate(-1)}
        >
          <FiArrowLeftCircle size={22} />
          Volver
        </button>

        {/* TÍTULO */}
        <h1 className="text-3xl font-semibold text-gray-900 mb-8 text-center tracking-tight">
          Agregar Dirección
        </h1>

        {/* DEPARTAMENTO */}
        <label className="block mt-4 mb-1 text-gray-700 font-medium">Departamento *</label>
        <select
          name="departamento"
          value={form.departamento}
          onChange={handleChange}
          className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900
            focus:ring-2 focus:ring-gray-700 focus:outline-none"
        >
          <option value="">-- Selecciona un departamento --</option>
          {departamentos.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        {/* CIUDAD */}
        <label className="block mt-4 mb-1 text-gray-700 font-medium">Ciudad *</label>
        <select
          name="ciudad"
          value={form.ciudad}
          onChange={handleChange}
          className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900
            focus:ring-2 focus:ring-gray-700 focus:outline-none"
        >
          <option value="">-- Selecciona ciudad --</option>
          {ciudades.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {/* DIRECCIÓN */}
        <label className="block mt-4 mb-1 text-gray-700 font-medium">Dirección *</label>
        <input
          type="text"
          name="direccion"
          value={form.direccion}
          onChange={handleChange}
          className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900
            focus:ring-2 focus:ring-gray-700 focus:outline-none"
          placeholder="Calle, número, etc."
        />

        {/* CÓDIGO POSTAL */}
        <label className="block mt-4 mb-1 text-gray-700 font-medium">Código Postal *</label>
        <input
          type="text"
          name="codigo_postal"
          value={form.codigo_postal}
          onChange={handleChange}
          className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900
            focus:ring-2 focus:ring-gray-700 focus:outline-none"
          placeholder="Código postal"
        />

        {/* DESCRIPCIÓN */}
        <label className="block mt-4 mb-1 text-gray-700 font-medium">Descripción (opcional)</label>
        <input
          type="text"
          name="descripcion"
          value={form.descripcion}
          onChange={handleChange}
          className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900
            focus:ring-2 focus:ring-gray-700 focus:outline-none"
          placeholder="Ej: Apartamento, oficina, etc."
        />

        {/* BOTÓN GUARDAR */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`mt-8 w-full py-3 rounded-lg text-white font-semibold shadow-lg 
            transition focus:outline-none
            ${loading 
              ? "bg-gray-500 cursor-not-allowed" 
              : "bg-gray-900 hover:bg-black"
            }`}
        >
          {loading ? "Guardando..." : "Guardar Dirección"}
        </button>

      </div>
    </div>
  );
}
