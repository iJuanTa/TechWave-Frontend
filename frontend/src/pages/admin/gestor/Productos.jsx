import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Productos() {
  const navigate = useNavigate();

  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const [busqueda, setBusqueda] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");


  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await axios.get("http://localhost:8080/productos", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setProductos(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar los productos");
      } finally {
        setLoading(false);
      }
    };
    fetchProductos();
  }, []);


  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const res = await axios.get("http://localhost:8080/productos/categorias", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setCategorias(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error cargando categorías:", err);
      }
    };
    fetchCategorias();
  }, []);

  const productosFiltrados = useMemo(() => {
    if (!Array.isArray(productos)) return [];
    return productos
      .filter((p) => p.nombre?.toLowerCase().includes(busqueda.toLowerCase()))
      .filter((p) =>
        categoriaSeleccionada ? p.categoria?.nombre === categoriaSeleccionada : true
      );
  }, [productos, busqueda, categoriaSeleccionada]);

 
  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-700 text-xl bg-white">
        Cargando productos...
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-500 text-xl bg-white">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* HEADER */}
      <header className="sticky top-0 bg-white z-10 p-4 mb-6 rounded-b-xl shadow-md flex flex-col sm:flex-row justify-between items-center gap-3">
        <div className="flex flex-col sm:flex-row items-center gap-2">
        </div>
        <p className="text-gray-600 text-sm">
          Visualiza todos los productos registrados en el sistema.
        </p>

        {/* BUSCADOR + FILTRO */}
        <div className="flex flex-col sm:flex-row gap-2 items-center w-full sm:w-auto">
          <input
            type="text"
            placeholder="Buscar por nombre..."
            className="w-full sm:w-64 px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-sm"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <select
            className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-sm"
            value={categoriaSeleccionada}
            onChange={(e) => setCategoriaSeleccionada(e.target.value)}
          >
            <option value="">Todas las categorías</option>
            {categorias.map((c) => (
              <option key={c.id ?? c.id_categoria} value={c.nombre}>
                {c.nombre}
              </option>
            ))}
          </select>
        </div>
      </header>

      {/* GRID DE PRODUCTOS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {productosFiltrados.map((p) => {
          const imagenPrincipal = p.imagenes?.[0]?.url
            ? `http://localhost:8080${p.imagenes[0].url}`
            : "https://via.placeholder.com/300x200?text=Sin+Imagen";

          return (
            <div
              key={p.id_producto ?? p.id}
              className="bg-white border border-gray-200 shadow-lg rounded-2xl overflow-hidden transform transition hover:scale-105 hover:shadow-2xl"
            >
              <figure className="bg-gray-100">
                <img
                  src={imagenPrincipal}
                  alt={p.nombre}
                  className="w-full h-48 object-contain"
                />
              </figure>

              <div className="p-4 space-y-2">
                <h2 className="text-lg font-bold text-gray-900">{p.nombre}</h2>
                <p className="text-gray-700 line-clamp-3">{p.descripcion}</p>
                <p className="text-gray-900 font-semibold text-lg">${p.precio}</p>

                <button
                  className="mt-4 w-full bg-yellow-500 hover:bg-yellow-400 text-black rounded-lg font-semibold shadow-md py-2 transition"
                  onClick={() =>
                    navigate(
                      `/gestor/panel-gestor/detalles-editar/${p.id_producto ?? p.id}`
                    )
                  }
                >
                  Ver detalles y editar
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
