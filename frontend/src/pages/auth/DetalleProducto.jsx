import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useCarrito } from "../../context/CarritoContext";
import { inventario } from "../../api/inventario";
import axios from "axios";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import GaleriaImagenes from "../../components/GaleriaImagenes";

export default function DetalleProducto() {
  const { id } = useParams();
  const {
    carrito,
    agregarItem,
    restarItem,
    loading: carritoLoading,
  } = useCarrito();
  const [producto, setProducto] = useState(null);
  const [caracteristicas, setCaracteristicas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const productoEnCarrito = carrito?.items?.find(
    (item) => item.producto.id === Number(id)
  );

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const resProducto = await inventario.get(`/productos`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const prod = resProducto.data.find((p) => p.id === parseInt(id));
        setProducto(prod);

        const resCaracteristicas = await axios.get(
          `http://localhost:8080/productos/caracteristas/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setCaracteristicas(resCaracteristicas.data);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar los detalles del producto");
      } finally {
        setLoading(false);
      }
    };

    fetchDatos();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-700 text-xl">
        Cargando producto...
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-500 text-xl">
        {error}
      </div>
    );
  if (!producto)
    return (
      <div className="flex justify-center items-center h-screen text-gray-700 text-xl">
        Producto no encontrado
      </div>
    );

  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-6">
      {/* Título y categoría */}
      <div className="text-center mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
          {producto.nombre}
        </h1>
        <p className="text-gray-600 italic mt-1">
          Categoría: {producto.categoria?.nombre ?? producto.categoria}
        </p>
      </div>

      {/* Galería de imágenes estilo Amazon */}
      <div className="mb-8">
        {producto.imagenes?.length > 0 ? (
          <GaleriaImagenes
            imagenes={producto.imagenes}
            nombre={producto.nombre}
          />
        ) : (
          <div className="rounded-xl w-full h-64 sm:h-80 md:h-96 bg-white flex items-center justify-center text-gray-400 text-2xl shadow-inner">
            Sin imágenes disponibles
          </div>
        )}
      </div>

      {/* Descripción y precio */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <p className="text-gray-700 mb-4 leading-relaxed">
          {producto.descripcion}
        </p>
        <p className="text-2xl sm:text-3xl font-bold text-gray-900 text-center">
          Precio: ${producto.precio.toLocaleString()}
        </p>
      </div>

      {/* Características */}
      <h2 className="text-2xl font-bold mb-4 border-b border-gray-300 pb-2 text-gray-900">
        Características
      </h2>
      {caracteristicas.length > 0 ? (
        <div className="overflow-x-auto mb-8 rounded-xl border border-gray-300 shadow-sm bg-white">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="px-6 py-3 border-b border-gray-300 text-left text-gray-700 font-semibold">
                  Característica
                </th>
                <th className="px-6 py-3 border-b border-gray-300 text-left text-gray-700 font-semibold">
                  Descripción
                </th>
              </tr>
            </thead>
            <tbody>
              {caracteristicas.map((c) => (
                <tr key={c.id} className="hover:bg-gray-100 transition">
                  <td className="px-6 py-3 border-b border-gray-300 text-gray-800">
                    {c.caracteristica}
                  </td>
                  <td className="px-6 py-3 border-b border-gray-300 text-gray-800">
                    {c.decripcionCaracteristica}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500 italic mb-8">
          Sin características disponibles
        </p>
      )}

      {/* Botones de carrito */}
      {!productoEnCarrito ? (
        <button
          className={`w-full py-4 rounded-xl text-lg font-bold transition-transform duration-300 ${
            producto.stock > 0
              ? "bg-yellow-500 hover:bg-yellow-400 text-gray-900 shadow-md"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          onClick={() => producto.stock > 0 && agregarItem(producto.id)}
          disabled={producto.stock === 0 || carritoLoading}
        >
          {producto.stock === 0
            ? "Agotado"
            : carritoLoading
            ? "Añadiendo..."
            : "Añadir al carrito"}
        </button>
      ) : (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
          <button
            onClick={() => restarItem(producto.id)}
            className="px-6 py-3 bg-red-500 hover:bg-red-400 rounded-xl text-white text-xl font-bold"
            disabled={carritoLoading}
          >
            –
          </button>

          <span className="text-2xl font-bold text-gray-900">
            {productoEnCarrito.cantidad}
          </span>

          <button
            onClick={() => agregarItem(producto.id)}
            className="px-6 py-3 bg-green-500 hover:bg-green-400 rounded-xl text-white text-xl font-bold"
            disabled={carritoLoading}
          >
            +
          </button>
        </div>
      )}
    </div>
  );
}
