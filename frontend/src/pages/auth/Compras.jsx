import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Compras() {
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompras = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:8080/me/compras", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCompras(res.data);
      } catch (err) {
        console.error("Error cargando compras:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompras();
  }, []);

  const fondo = "bg-[#f4f4f4]"; 
  if (loading)
    return (
      <div className={`min-h-screen flex justify-center items-center ${fondo}`}>
        <p className="text-gray-600 text-lg">Cargando compras...</p>
      </div>
    );

  if (compras.length === 0)
    return (
      <div className={`min-h-screen flex justify-center items-center ${fondo}`}>
        <p className="text-gray-600 text-lg">Aún no registras compras</p>
      </div>
    );

  return (
    <div className={`min-h-screen py-12 px-6 ${fondo}`}>
      
      <h1 className="text-3xl font-bold text-gray-900 mb-10 text-center">
        Mis Compras
      </h1>

      <div className="max-w-5xl mx-auto flex flex-col gap-10">

        {compras.map((compra) => (
          <div
            key={compra.id}
            className="bg-white border border-gray-300 rounded-xl 
              shadow-sm p-8 hover:shadow-md transition"
          >

            {/* === Encabezado === */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                <p className="text-gray-500 text-sm">
                  Fecha:{" "}
                  {new Date(compra.fecha).toLocaleDateString()} -{" "}
                  {new Date(compra.fecha).toLocaleTimeString()}
                </p>

                <p className="text-green-600 font-semibold mt-1">
                  Estado: {compra.estado} — Pago confirmado
                </p>
              </div>

              <p className="text-2xl font-extrabold text-indigo-600">
                ${compra.total.toLocaleString()}
              </p>
            </div>

            {/* === Productos === */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {compra.items.map((item) => {
                const imagenUrl = item.producto.imagenes?.[0]
                  ? `http://localhost:8080${item.producto.imagenes[0].url}`
                  : "https://via.placeholder.com/150x100?text=Sin+Imagen";

                return (
                  <div
                    key={item.id}
                    className="bg-white border border-gray-300 rounded-xl p-4 
                      flex flex-col items-center gap-3 shadow-sm hover:shadow-md 
                      transition cursor-pointer"
                    onClick={() =>
                      navigate(`/producto/${item.producto.id_producto}`)
                    }
                  >
                    <img
                      src={imagenUrl}
                      alt={item.producto.nombre}
                      className="h-28 w-full object-contain rounded-lg 
                        transition hover:scale-105"
                    />

                    <p className="text-gray-900 font-medium text-center">
                      {item.producto.nombre}
                    </p>

                    <p className="text-gray-500 text-sm">
                      Cantidad: {item.cantidad}
                    </p>

                    <p className="text-indigo-600 font-semibold">
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
        ))}

      </div>
    </div>
  );
}
