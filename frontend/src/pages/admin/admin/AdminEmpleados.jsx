import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminEmpleados() {
  const [empleados, setEmpleados] = useState([]);
  const [search, setSearch] = useState("");
  const [rolFiltro, setRolFiltro] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmpleados = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:8080/admin/admins", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEmpleados(res.data);
      } catch (err) {
        console.error("Error al obtener empleados:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmpleados();
  }, []);

  const empleadosFiltrados = empleados.filter((e) => {
    const coincideNombre = e.nombre.toLowerCase().includes(search.toLowerCase());
    const coincideRol = rolFiltro ? e.role === rolFiltro : true;
    return coincideNombre && coincideRol;
  });

  return (
    <div className="p-6 bg-white text-gray-900">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Empleados</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          className="p-2 rounded-lg border border-gray-400 w-full max-w-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={rolFiltro}
          onChange={(e) => setRolFiltro(e.target.value)}
          className="p-2 rounded-lg border border-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
        >
          <option value="">Todos los roles</option>
          <option value="ROLE_ADMIN">Admin</option>
          <option value="ROLE_GESTOR">Gestor</option>
          <option value="ROLE_PROCESADOR">Procesador</option>
          <option value="ROLE_SUPERVISOR">Supervisor</option>
        </select>
      </div>

      {loading ? (
        <p className="text-gray-700">Cargando empleados...</p>
      ) : empleadosFiltrados.length === 0 ? (
        <p className="text-gray-700">No hay empleados que coincidan con los filtros.</p>
      ) : (
        <table className="min-w-full bg-gray-100 text-gray-900 rounded-lg overflow-hidden shadow-md">
          <thead className="bg-gray-300 text-gray-800">
            <tr>
              <th className="py-3 px-4 text-left">Foto</th>
              <th className="py-3 px-4 text-left">Nombre</th>
              <th className="py-3 px-4 text-left">Apellido</th>
              <th className="py-3 px-4 text-left">Rol</th>
              <th className="py-3 px-4 text-left">Activo</th>
            </tr>
          </thead>
          <tbody>
            {empleadosFiltrados.map((e) => (
              <tr
                key={e.id}
                className="border-b border-gray-300 hover:bg-gray-200 transition"
              >
                <td className="py-3 px-4">
                  {e.fotoUrl ? (
                    <img
                      src={`http://localhost:8080${e.fotoUrl}`}
                      alt={e.nombre}
                      className="w-12 h-12 object-cover rounded-full"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-400 rounded-full flex items-center justify-center text-gray-700 font-bold">
                      ?
                    </div>
                  )}
                </td>
                <td className="py-3 px-4">{e.nombre}</td>
                <td className="py-3 px-4">{e.apellido}</td>
                <td className="py-3 px-4">{e.role.replace("ROLE_", "")}</td>
                <td className="py-3 px-4">{e.activo ? "Sí" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
