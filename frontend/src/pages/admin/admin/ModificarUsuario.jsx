import { useState } from "react";
import axios from "axios";

const ROLES = [
  { clave: "ROLE_USUARIO", label: "Usuario" },
  { clave: "ROLE_GESTOR", label: "Gestor" },
  { clave: "ROLE_PROCESADOR", label: "Procesador" },
  { clave: "ROLE_SUPERVISOR", label: "Supervisor" },
];

export default function CrearEmpleado() {
  const [username, setUsername] = useState("");
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");

 
  const roleActual = localStorage.getItem("role");

  const buscarUsuario = async () => {
    if (!username.trim()) return;

    setLoading(true);
    setUsuario(null);
    setMensaje("");

    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:8080/admin/usuarios/${username}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUsuario(res.data);
    } catch (err) {
      console.error(err);
      setMensaje("No se encontró un usuario con ese username.");
    } finally {
      setLoading(false);
    }
  };

  const cambiarRol = async (nuevoRol) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:8080/admin/usuarios/${usuario.username}/${nuevoRol}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsuario({ ...usuario, role: nuevoRol });
      setMensaje(`Rol cambiado a ${nuevoRol}`);
    } catch (err) {
      console.error(err);
      setMensaje("Error al cambiar rol.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Administración de Usuarios
      </h1>

      {/* Buscador */}
      <div className="flex gap-3 mb-4">
        <input
          type="text"
          placeholder="Buscar por username..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-800"
        />
        <button
          onClick={buscarUsuario}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500"
        >
          Buscar
        </button>
      </div>

      {loading && <p className="text-gray-600">Cargando...</p>}
      {mensaje && <p className="text-red-600 mb-4">{mensaje}</p>}

      {/* Información del usuario */}
      {usuario && (
        <div className="border border-gray-300 rounded-xl p-5 bg-white shadow-md">
          <div className="flex gap-4 items-center mb-4">
            {usuario.fotoUrl ? (
              <img
                src={`http://localhost:8080${usuario.fotoUrl}`}
                alt="Foto"
                className="w-20 h-20 object-cover rounded-full"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center text-3xl text-gray-700">
                ?
              </div>
            )}

            <div>
              <p className="text-lg font-semibold text-gray-800">
                {usuario.nombre} {usuario.apellido}
              </p>
              <p className="text-gray-600">@{usuario.username}</p>
              <p className="text-gray-600">{usuario.email}</p>
              <p className="text-purple-700 font-bold">Rol: {usuario.role}</p>
            </div>
          </div>

          {/* Botones de cambio de rol */}
          <div className="flex flex-wrap gap-3 mt-4">
            {/* VALIDACIÓN: si el usuario encontrado es ADMIN → no mostrar nada */}
            {usuario.role === "ROLE_ADMIN" ? (
              <p className="text-red-600 font-semibold">
                Este usuario es administrador. No se pueden modificar roles.
              </p>
            ) : (
              ROLES.map((r) => {

                if (usuario.role === r.clave) return null;


                if (roleActual === "ROLE_SUPERVISOR" && r.clave === "ROLE_SUPERVISOR")
                  return null;

                return (
                  <button
                    key={r.clave}
                    onClick={() => cambiarRol(r.clave)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500"
                  >
                    Convertir a {r.label}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
