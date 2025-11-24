import { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

export default function Envios() {
  const [envios, setEnvios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroEnvio, setFiltroEnvio] = useState("");
  const navigate = useNavigate();

  const fetchEnvios = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:8080/api/envios", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEnvios(res.data);
    } catch (err) {
      console.error("Error cargando envíos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnvios();
  }, []);

  const actualizarEstado = async (id, tipo) => {
    try {
      const token = localStorage.getItem("token");
      if (tipo === "enRuta") {
        await axios.put(`http://localhost:8080/api/envios/${id}/en-ruta`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else if (tipo === "entregado") {
        await axios.put(`http://localhost:8080/api/envios/${id}/entregado`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      fetchEnvios();
    } catch (err) {
      console.error("Error actualizando estado:", err);
    }
  };

  const estadoColor = (estado) => {
    switch (estado) {
      case "PAGADO":
      case "ENTREGADO":
        return "text-green-700";
      case "PENDIENTE":
        return "text-yellow-700";
      case "RETRASADO":
        return "text-red-700";
      case "EN_RUTA":
        return "text-blue-700";
      case "AGOTADO":
        return "text-red-700";
      default:
        return "text-gray-800";
    }
  };

  const enviosFiltrados = envios.filter(e => !filtroEnvio || e.estadoEnvio === filtroEnvio);

  if (loading) return <div className="flex justify-center items-center h-screen text-purple-700 text-xl">Cargando envíos...</div>;

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white text-gray-900">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Gestión de Envíos</h1>

      {/* Filtros */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select
          className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={filtroEnvio}
          onChange={(e) => setFiltroEnvio(e.target.value)}
        >
          <option value="">Todos los estados</option>
          <option value="PENDIENTE">Pendiente</option>
          <option value="EN_RUTA">En Ruta</option>
          <option value="ENTREGADO">Entregado</option>
          <option value="RETRASADO">Retrasado</option>
        </select>
      </div>

      {/* Lista de envíos */}
      <div className="flex flex-col gap-6">
        {enviosFiltrados.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No hay envíos registrados</div>
        ) : (
          enviosFiltrados.map((envio) => (
            <div
              key={envio.id_envio}
              className="bg-gray-50 border border-gray-300 rounded-2xl shadow p-6 hover:shadow-lg transition"
            >
              <div className="flex justify-between items-start mb-4 flex-col md:flex-row gap-4">
                <div className="space-y-1">
                  <p className="text-gray-700 text-sm">Envío ID: {envio.id_envio}</p>
                  <p className={`text-sm font-bold ${estadoColor(envio.estadoEnvio)}`}>
                    Estado envío: {envio.estadoEnvio}
                  </p>
                  <p className={`text-sm font-bold ${estadoColor(envio.compra.estado)}`}>
                    Estado compra: {envio.compra.estado}
                  </p>
                  <p className="text-gray-800 text-sm">
                    Cliente: {envio.compra.usuario.nombre} ({envio.compra.usuario.email})
                  </p>
                  <p className="text-gray-800 text-sm">
                    Fecha pedido: {format(new Date(envio.creacion_pedido), "dd/MM/yyyy HH:mm")}
                  </p>
                  <p className="text-gray-800 text-sm">
                    Dirección: {envio.direccion.direccion}, {envio.direccion.ciudad.ciudad}, {envio.direccion.ciudad.departamento.departamento}
                  </p>
                </div>
                <p className="text-xl font-bold text-gray-900">Total: ${envio.compra.total.toLocaleString()}</p>
              </div>

              {/* Botones de estado */}
              <div className="flex flex-wrap gap-4 mb-4">
                {envio.estadoEnvio !== "EN_RUTA" && envio.estadoEnvio !== "ENTREGADO" && (
                  <button
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white font-semibold"
                    onClick={() => actualizarEstado(envio.id_envio, "enRuta")}
                  >
                    Marcar En Ruta
                  </button>
                )}
                {envio.estadoEnvio !== "ENTREGADO" && (
                  <button
                    className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-white font-semibold"
                    onClick={() => actualizarEstado(envio.id_envio, "entregado")}
                  >
                    Marcar Entregado
                  </button>
                )}
              </div>

              {/* Productos del envío */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {envio.compra.items.map((item) => {
                  const imagenUrl = item.producto.imagenes?.[0]
                    ? `http://localhost:8080${item.producto.imagenes[0].url}`
                    : "https://via.placeholder.com/150x100?text=Sin+Imagen";

                  return (
                    <div
                      key={item.id}
                      className="bg-gray-100 rounded-xl p-4 flex flex-col items-center gap-2 hover:bg-gray-200 transition"
                    >
                      <img
                        src={imagenUrl}
                        alt={item.producto.nombre}
                        className="h-28 object-contain cursor-pointer"
                        onClick={() => navigate(`/producto/${item.producto.id_producto}`)}
                      />
                      <p className="text-gray-900 font-semibold text-center">{item.producto.nombre}</p>
                      <p className="text-gray-700 text-sm text-center">Cantidad: {item.cantidad}</p>
                      <p className="text-gray-900 font-semibold">${item.subtotal.toLocaleString()}</p>
                      {item.producto.estado === "AGOTADO" && (
                        <p className="text-red-700 text-xs font-bold">Agotado</p>
                      )}
                    </div>
                  );
                })}
              </div>

              {envio.compra.detalles && (
                <p className="mt-4 text-gray-700 text-sm">{envio.compra.detalles}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
