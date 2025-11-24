import { useMemo, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCarrito } from "../../context/CarritoContext";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { getStockByProductId } from "../../api/stockService";

const formatNumber = (num) =>
  num.toLocaleString("es-CO", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

export default function Carrito() {
  const { carrito, agregarItem, restarItem, loading } = useCarrito();
  const navigate = useNavigate();
  const [stocks, setStocks] = useState({});

  useEffect(() => {
    const fetchStock = async () => {
      const resultado = {};
      for (const item of carrito.items) {
        try {
          const inventario = await getStockByProductId(item.producto.id_producto);
          resultado[item.producto.id_producto] = inventario?.cantidad || 0;
        } catch (error) {
          console.error("Error consultando stock", error);
          resultado[item.producto.id_producto] = 0;
        }
      }
      setStocks(resultado);
    };
    if (carrito.items.length > 0) fetchStock();
  }, [carrito.items]);

  const total = useMemo(
    () => carrito.items?.reduce((acc, item) => acc + item.subtotal, 0) || 0,
    [carrito]
  );

  const handleAgregar = async (item) => {
    try {
      const inventario = await getStockByProductId(item.producto.id_producto);
      if (!inventario) {
        alert("Este producto no tiene inventario asociado.");
        return;
      }
      if (item.cantidad + 1 > inventario.cantidad) {
        alert(`Solo hay ${inventario.cantidad} unidades disponibles.`);
        return;
      }
      agregarItem(item.producto.id_producto);
    } catch (error) {
      console.error("Error al obtener stock:", error);
      alert("Error al consultar stock. Intenta nuevamente.");
    }
  };

  const handleRestar = (item) => {
    if (item.cantidad === 1) {
      if (window.confirm("La cantidad llegará a 0. ¿Deseas eliminar este producto?")) {
        restarItem(item.producto.id_producto);
        setTimeout(() => window.location.reload(), 150);
      }
      return;
    }
    restarItem(item.producto.id_producto);
  };

  if (!carrito.items || carrito.items.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen 
          bg-linear-to-br from-gray-100 via-gray-200 to-gray-300 
          text-gray-600 text-lg p-6">
        <button
          onClick={() => navigate("/tienda")}
          className="mb-6 flex items-center gap-2 text-gray-700 hover:text-gray-900 
              transition font-medium"
        >
          <ArrowLeftIcon className="h-5 w-5" /> Volver a tienda
        </button>
        <p className="font-semibold text-gray-700">Tu carrito está vacío</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-100 to-gray-200 py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">

        <button
          onClick={() => navigate("/tienda")}
          className="mb-8 flex items-center gap-2 text-gray-700 hover:text-gray-900 
              transition font-medium"
        >
          <ArrowLeftIcon className="h-5 w-5" /> Volver a tienda
        </button>

        <h1 className="text-3xl font-semibold text-gray-900 mb-8 text-center tracking-tight">
          Carrito de Compras
        </h1>

        <ul className="divide-y divide-gray-100">
          {carrito.items.map((item) => {
            const stockActual = stocks[item.producto.id_producto] ?? "...";

            return (
              <li
                key={item.producto.id_producto}
                className="flex flex-col sm:flex-row items-center justify-between py-6"
              >
                <div
                  onClick={() => navigate(`/producto/${item.producto.id_producto}`)}
                  className="flex items-center gap-6 w-full sm:w-auto cursor-pointer group"
                >
                  <img
                    src={`http://localhost:8080${item.producto.imagenes[0].url}`}
                    alt={item.producto.nombre}
                    className="w-24 h-24 object-cover rounded-xl shadow-md 
                      border border-gray-200 group-hover:shadow-xl transition"
                  />

                  <div className="flex flex-col">
                    <h2 className="text-lg font-semibold text-gray-900 group-hover:text-gray-700 transition">
                      {item.producto.nombre}
                    </h2>

                    <p className="text-gray-600 text-sm mt-1">
                      <span className="font-medium">Stock:</span> {stockActual}
                    </p>

                    <p className="text-gray-600 text-sm">
                      <span className="font-medium">En carrito:</span> {item.cantidad}
                    </p>

                    <p className="text-gray-700 text-sm mt-2">
                      Precio:{" "}
                      <span className="font-semibold">${formatNumber(item.producto.precio)}</span>
                    </p>
                  </div>
                </div>

                {/* Controles actualizados (Opción A) */}
                <div className="flex items-center gap-3 mt-4 sm:mt-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRestar(item);
                    }}
                    className="w-8 h-8 flex items-center justify-center 
                      border border-gray-500 rounded-full text-gray-700
                      hover:bg-gray-200 hover:border-gray-600 transition disabled:opacity-50"
                    disabled={loading}
                  >
                    <span className="text-xl leading-none">−</span>
                  </button>

                  <span className="text-gray-900 font-semibold text-lg">{item.cantidad}</span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAgregar(item);
                    }}
                    className="w-8 h-8 flex items-center justify-center 
                      border border-gray-500 rounded-full text-gray-700
                      hover:bg-gray-200 hover:border-gray-600 transition disabled:opacity-50"
                    disabled={loading}
                  >
                    <span className="text-xl leading-none">+</span>
                  </button>
                </div>

                <div className="mt-4 sm:mt-0 text-gray-900 font-semibold text-lg min-w-[120px] text-right">
                  ${formatNumber(item.subtotal)}
                </div>
              </li>
            );
          })}
        </ul>

        <div className="flex flex-col sm:flex-row justify-between items-center mt-10 
            border-t border-gray-200 pt-6">
          <span className="text-xl font-semibold text-gray-900">
            Total: <span>${formatNumber(total)}</span>
          </span>

          <button
            onClick={() => navigate("/proceso-pago")}
            className="mt-4 sm:mt-0 px-8 py-3 bg-gray-900 text-white font-semibold 
              rounded-lg shadow-lg hover:bg-black transition"
          >
            Proceder al pago
          </button>
        </div>
      </div>
    </div>
  );
}
