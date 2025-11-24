import { useState, useEffect } from "react";

import axios from "axios";

export default function CrearProducto() {

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoria, setCategoria] = useState("");
  const [precio, setPrecio] = useState("");
  const [imagenes, setImagenes] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const [error, setError] = useState(null);


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

  const handleImagenes = (e) => {
    setImagenes([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje(null);
    setError(null);

    if (!nombre || !descripcion || !categoria || !precio) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("descripcion", descripcion);
    formData.append("categoria", categoria);
    formData.append("precio", precio);

    imagenes.forEach((img) => formData.append("imagenes", img));

    try {
      setCargando(true);
      const res = await axios.post("http://localhost:8080/productos/crear", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setMensaje(`Producto "${res.data.nombre}" creado exitosamente!`);
      setNombre("");
      setDescripcion("");
      setCategoria("");
      setPrecio("");
      setImagenes([]);
    } catch (err) {
      console.error(err);
      setError("No se pudo crear el producto.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-center bg-gray-100 py-10">
      <div className="w-full max-w-3xl bg-white p-10 rounded-2xl border border-gray-200 shadow-xl space-y-6">

        <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">
          Crear Producto
        </h1>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Nombre */}
          <div>
            <label className="block mb-2 text-gray-700 font-medium text-lg">Nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Nombre del producto"
              className="w-full px-5 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-900 text-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-sm transition"
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block mb-2 text-gray-700 font-medium text-lg">Descripción</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Descripción del producto"
              className="w-full px-5 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-900 text-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-sm transition"
            />
          </div>

          {/* Categoría */}
          <div>
            <label className="block mb-2 text-gray-700 font-medium text-lg">Categoría</label>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="w-full px-5 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-900 text-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-sm transition"
            >
              <option value="">Seleccione una categoría</option>
              {categorias.map((c) => (
                <option key={c.id} value={c.nombre}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Precio */}
          <div>
            <label className="block mb-2 text-gray-700 font-medium text-lg">Precio</label>
            <input
              type="number"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              placeholder="Precio del producto"
              className="w-full px-5 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-900 text-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-sm transition"
            />
          </div>

          {/* Imágenes */}
          <div>
            <label className="block mb-2 text-gray-700 font-medium text-lg">Imágenes</label>
            <input
              type="file"
              multiple
              onChange={handleImagenes}
              className="w-full text-gray-700"
            />
          </div>

          {/* Mensajes */}
          {mensaje && (
            <div className="p-4 bg-green-100 text-green-800 rounded-lg text-center border border-green-200 shadow-sm">
              {mensaje}
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-100 text-red-800 rounded-lg text-center border border-red-200 shadow-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={cargando}
            className={`w-full py-4 rounded-lg text-white font-bold text-lg shadow-md transition ${
              cargando
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-yellow-400 hover:bg-yellow-500"
            }`}
          >
            {cargando ? "Creando..." : "Crear Producto"}
          </button>
        </form>
      </div>
    </div>
  );
}
