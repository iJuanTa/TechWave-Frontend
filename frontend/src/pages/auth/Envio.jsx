import { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

export default function MisEnvios() {
  const [envios, setEnvios] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchEnvios = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:8080/api/envios/usuario",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Ordenar por fecha más reciente primero
      const ordenados = res.data.sort(
        (a, b) => new Date(b.creacion_pedido) - new Date(a.creacion_pedido)
      );

      setEnvios(ordenados);
    } catch (err) {
      console.error("Error cargando envíos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnvios();
  }, []);

  const estadoColor = (estado) => {
    switch (estado) {
      case "ENTREGADO":
        return "text-green-600";
      case "EN_RUTA":
        return "text-blue-600";
      case "PENDIENTE":
        return "text-yellow-600";
      case "RETRASADO":
        return "text-red-600";
      default:
        return "text-gray-500";
    }
  };

  if (loading)
    return (
      <div className="p-6 text-center text-gray-700 text-lg">
        Cargando envíos...
      </div>
    );

  if (envios.length === 0)
    return (
      <div className="p-6 text-center text-gray-700 text-lg">
        No tienes envíos registrados
      </div>
    );

  return (
    <div className="bg-gray-100 min-h-screen px-4 sm:px-10 lg:px-20 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Mis Envíos</h1>

      <div className="flex flex-col gap-6">
        {envios.map((envio) => (
          <div
            key={envio.id_envio}
            className="bg-white border border-gray-200 rounded-2xl shadow-md p-6"
          >
            {/* CABECERA */}
            <div className="flex justify-between items-start flex-wrap gap-4 mb-4">
              <div className="flex flex-col gap-1">
                <p className="text-gray-500 text-sm">Envío ID: {envio.id_envio}</p>

                <p className={`font-bold ${estadoColor(envio.estadoEnvio)}`}>
                  Estado: {envio.estadoEnvio}
                </p>

                <p className="text-gray-900 font-bold">
                  Compra Total: ${envio.compra.total.toLocaleString()}
                </p>

                <p className="text-gray-500 text-sm">
                  Fecha del pedido:{" "}
                  {format(new Date(envio.creacion_pedido), "dd/MM/yyyy HH:mm")}
                </p>

                <p className="text-gray-500 text-sm">
                  Dirección: {envio.direccion.direccion},{" "}
                  {envio.direccion.ciudad.ciudad},{" "}
                  {envio.direccion.ciudad.departamento.departamento}
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                  onClick={() => navigate(`/rastreo/${envio.id_envio}`)}
                >
                  Ver detalles del envío
                </button>
              </div>
            </div>

            {/* PRODUCTOS */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Productos del pedido
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {envio.compra.items.map((item) => {
                  const imagenUrl = item.producto.imagenes?.[0]
                    ? `http://localhost:8080${item.producto.imagenes[0].url}`
                    : "https://via.placeholder.com/150x100?text=Sin+Imagen";

                  return (
                    <div
                      key={item.id}
                      className="bg-gray-50 rounded-xl p-4 shadow-sm flex flex-col items-center gap-2 hover:shadow-md transition"
                    >
                      <img
                        src={imagenUrl}
                        alt={item.producto.nombre}
                        className="h-28 object-contain cursor-pointer"
                        onClick={() =>
                          navigate(`/producto/${item.producto.id_producto}`)
                        }
                      />

                      <p className="text-gray-900 font-bold text-center">
                        {item.producto.nombre}
                      </p>

                      <p className="text-gray-500 text-sm">
                        Cantidad: {item.cantidad}
                      </p>

                      <p className="text-gray-700 font-semibold">
                        ${item.subtotal.toLocaleString()}
                      </p>

                      {item.producto.estado === "AGOTADO" && (
                        <p className="text-red-500 text-xs font-bold">
                          Producto agotado
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {envio.compra.detalles && (
              <p className="mt-4 text-gray-600 text-sm">
                Detalles: {envio.compra.detalles}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
