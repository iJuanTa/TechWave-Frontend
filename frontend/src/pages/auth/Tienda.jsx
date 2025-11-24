import { useEffect, useState, useMemo } from "react";
import { inventario } from "../../api/inventario";
import { useNavigate } from "react-router-dom";
import { useCarrito } from "../../context/CarritoContext";
import axios from "axios";
import { ShoppingCartIcon } from "@heroicons/react/24/solid";
import Swal from "sweetalert2";

export default function Tienda() {
  const navigate = useNavigate();
  const { agregarItem, carrito, cargarCarrito, loading: carritoLoading } =
    useCarrito();

  const [productos, setProductos] = useState([]);
  const [productosMostrados, setProductosMostrados] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [pagina, setPagina] = useState(1);

  const ITEMS_POR_PAGINA = 30;

  // Cargar productos
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await inventario.get("/productos", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        const productosConImagenesFijas = res.data.map((p) => ({
          ...p,
          imagenPrincipal: p.imagenes?.[0]
            ? `http://localhost:8080${p.imagenes[0]}`
            : "https://via.placeholder.com/300x200?text=Sin+Imagen",
        }));

        // Ordenar por stock
        const productosConStock = productosConImagenesFijas.filter(
          (p) => p.stock > 0
        );
        const productosSinStock = productosConImagenesFijas.filter(
          (p) => p.stock <= 0
        );

        setProductos([...productosConStock, ...productosSinStock]);
        setProductosMostrados(
          [...productosConStock, ...productosSinStock].slice(0, ITEMS_POR_PAGINA)
        );
      } catch (err) {
        console.error("Error cargando productos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  // Cargar categorías
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const res = await axios.get("http://localhost:8080/productos/categorias", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setCategorias(res.data);
      } catch (err) {
        console.error("Error cargando categorías:", err);
      }
    };

    fetchCategorias();
  }, []);

  useEffect(() => {
    cargarCarrito();
  }, [cargarCarrito]);

  // Filtrar productos
  const productosFiltrados = useMemo(() => {
    return productosMostrados
      .filter((p) => p.nombre.toLowerCase().includes(busqueda.toLowerCase()))
      .filter((p) =>
        categoriaSeleccionada ? p.categoria === categoriaSeleccionada : true
      );
  }, [productosMostrados, busqueda, categoriaSeleccionada]);

  // Ver más
  const verMas = () => {
    const nuevaPagina = pagina + 1;
    setPagina(nuevaPagina);
    setProductosMostrados(productos.slice(0, nuevaPagina * ITEMS_POR_PAGINA));
  };

  if (loading)
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 animate-pulse">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white p-4 rounded-xl shadow-md border">
            <div className="w-full h-40 bg-gray-200 rounded-md"></div>
            <div className="h-4 bg-gray-200 rounded mt-4"></div>
            <div className="h-4 bg-gray-200 rounded mt-2 w-2/3"></div>
            <div className="h-4 bg-gray-200 rounded mt-4 w-1/3"></div>
          </div>
        ))}
      </div>
    );

  return (
    <div className="px-4 sm:px-8 lg:px-16 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <header className="sticky top-0 backdrop-blur-lg bg-white/95 z-10 p-4 mb-6 rounded-xl shadow-md flex flex-col sm:flex-row items-center justify-between gap-4 border border-gray-300">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-wide">
          TechWave
        </h1>
        <div className="flex flex-col sm:flex-row gap-3 items-center w-full sm:w-auto">
          <input
            type="text"
            placeholder="🔍 Buscar productos..."
            className="w-full sm:w-72 px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-yellow-400 transition"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <select
            className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-yellow-400 transition"
            value={categoriaSeleccionada}
            onChange={(e) => setCategoriaSeleccionada(e.target.value)}
          >
            <option value="">Todas las categorías</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.nombre}>
                {c.nombre}
              </option>
            ))}
          </select>
        </div>
      </header>

      {/* GRID DE PRODUCTOS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
        {productosFiltrados.map((p) => (
          <div
            key={p.id}
            className="relative bg-white border border-gray-300 hover:border-yellow-400 rounded-xl shadow-lg overflow-hidden cursor-pointer hover:shadow-2xl transition-all"
            onClick={() => navigate(`/producto/${p.id}`)}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (p.stock <= 0) return;

                const itemEnCarrito = carrito.items.find(
                  (i) => i.producto.id_producto === p.id
                );
                const cantidadActual = itemEnCarrito ? itemEnCarrito.cantidad : 0;

                if (cantidadActual + 1 > p.stock) {
                  Swal.fire({
                    icon: "warning",
                    title: "Stock insuficiente",
                    text: `No puedes agregar más de ${p.stock} unidades.`,
                    confirmButtonColor: "#FF9900",
                  });
                  return;
                }

                agregarItem(p.id);
              }}
              className={`absolute top-2 right-2 p-3 rounded-full shadow-md transition ${
                p.stock > 0
                  ? "bg-yellow-400 hover:bg-yellow-500"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
              disabled={carritoLoading || p.stock <= 0}
            >
              <ShoppingCartIcon className="h-5 w-5 text-gray-900" />
              {carrito.items.find((i) => i.producto.id_producto === p.id)?.cantidad >
                0 && (
                <span className="absolute -bottom-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {
                    carrito.items.find((i) => i.producto.id_producto === p.id)
                      ?.cantidad
                  }
                </span>
              )}
            </button>

            <div className="w-full h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
              <img
                src={p.imagenPrincipal}
                alt={p.nombre}
                className="max-h-44 object-contain transition-transform hover:scale-105"
              />
            </div>

            <div className="p-4">
              <h2 className="text-lg font-bold text-gray-900">{p.nombre}</h2>
              <p className="text-gray-600 mt-1 line-clamp-2 text-sm">{p.descripcion}</p>
              <p className="text-xl font-extrabold mt-3 text-gray-900">
                ${p.precio.toLocaleString()}
              </p>
              <p
                className={`mt-2 text-sm font-bold ${
                  p.stock > 0 ? "text-green-600" : "text-red-500"
                }`}
              >
                {p.stock > 0
                  ? `Stock disponible: ${p.stock}`
                  : "Stock no disponible"}
              </p>
            </div>
          </div>
        ))}
      </div>

      {productosMostrados.length < productos.length && (
        <div className="flex justify-center mt-10">
          <button
            onClick={verMas}
            className="px-8 py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-xl shadow-md text-lg transition"
          >
            Ver más productos ↓
          </button>
        </div>
      )}
    </div>
  );
}
