import { useState, useEffect } from "react";
import { useParams} from "react-router-dom";
import axios from "axios";

export default function DetalleProductoGestorTabs() {
  const { id } = useParams();

  const [activeTab, setActiveTab] = useState("editar");

  const [categorias, setCategorias] = useState([]);
  const [formProducto, setFormProducto] = useState({
    nombre: "",
    descripcion: "",
    categoria: "",
    precio: "",
    imagenes: [],
    eliminarImagenesId: [],
  });

  const [productoOriginal, setProductoOriginal] = useState(null);
  const [caracteristicas, setCaracteristicas] = useState([]);
  const [nuevaCaracteristica, setNuevaCaracteristica] = useState({
    caracteristica: "",
    descripcion: "",
  });

  const [loading, setLoading] = useState(true);

  // =============================
  // Cargar categorías
  // =============================
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

  // =============================
  // Cargar producto y características
  // =============================
  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/productos/mostrar/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setProductoOriginal(res.data);
        setFormProducto({
          nombre: res.data.nombre,
          descripcion: res.data.descripcion,
          categoria: res.data.categoria.nombre,
          precio: res.data.precio,
          imagenes: [],
          eliminarImagenesId: [],
        });

        const resCarac = await axios.get(
          `http://localhost:8080/productos/caracteristas/${id}`,
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
        setCaracteristicas(resCarac.data);
      } catch (err) {
        console.error("Error cargando producto o características:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducto();
  }, [id]);

  // =============================
  // Manejadores de formulario
  // =============================
  const handleInputChange = (e) => {
    setFormProducto({ ...formProducto, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormProducto({ ...formProducto, imagenes: [...e.target.files] });
  };

  const handleEliminarImagen = (idImagen) => {
    setFormProducto({
      ...formProducto,
      eliminarImagenesId: [...formProducto.eliminarImagenesId, idImagen],
    });
  };

  const handleGuardar = async () => {
    const formData = new FormData();
    formData.append("nombre", formProducto.nombre);
    formData.append("descripcion", formProducto.descripcion);
    formData.append("categoria", formProducto.categoria);
    formData.append("precio", formProducto.precio);

    formProducto.eliminarImagenesId.forEach((id) =>
      formData.append("eliminarImagenesId", id)
    );

    formProducto.imagenes.forEach((img) => formData.append("imagenes", img));

    try {
      await axios.put(`http://localhost:8080/productos/editar/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Producto actualizado!");
      window.location.reload();
    } catch (err) {
      console.error("Error actualizando producto:", err);
      alert("No se pudo actualizar el producto");
    }
  };

  // =============================
  // Características
  // =============================
  const handleCaracteristicaChange = (e) => {
    setNuevaCaracteristica({
      ...nuevaCaracteristica,
      [e.target.name]: e.target.value,
    });
  };

  const handleAgregarCaracteristica = async () => {
    try {
      const res = await axios.post(
        `http://localhost:8080/productos/crearcaracteristica/${id}`,
        null,
        {
          params: {
            caracteristica: nuevaCaracteristica.caracteristica,
            descripcion: nuevaCaracteristica.descripcion,
          },
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setCaracteristicas(res.data);
      setNuevaCaracteristica({ caracteristica: "", descripcion: "" });
    } catch (err) {
      console.error("Error agregando característica:", err);
    }
  };

  const handleEliminarCaracteristica = async (caracId) => {
    try {
      await axios.delete(`http://localhost:8080/productos/caracteristica/${caracId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setCaracteristicas(caracteristicas.filter((c) => c.id !== caracId));
    } catch (err) {
      console.error("Error eliminando característica:", err);
    }
  };

  // =============================
  // Loading
  // =============================
  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-800 text-xl bg-white">
        Cargando producto...
      </div>
    );

  // =============================
  // RENDER
  // =============================
  return (
    <div className="max-w-7xl mx-auto p-6 bg-white min-h-screen">


      {/* Tabs */}
      <div className="flex mb-6 border-b border-gray-300">
        <button
          onClick={() => setActiveTab("editar")}
          className={`px-4 py-2 font-bold ${
            activeTab === "editar"
              ? "border-b-2 border-yellow-500 text-yellow-600"
              : "text-gray-500"
          }`}
        >
          Editar Producto
        </button>
        <button
          onClick={() => setActiveTab("vista")}
          className={`px-4 py-2 font-bold ${
            activeTab === "vista"
              ? "border-b-2 border-yellow-500 text-yellow-600"
              : "text-gray-500"
          }`}
        >
          Vista Previa
        </button>
      </div>

      {/* TAB EDITAR */}
      {activeTab === "editar" && (
        <div className="bg-white p-6 rounded-xl shadow-lg space-y-6">
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            value={formProducto.nombre}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-sm text-gray-900"
          />

          <select
            name="categoria"
            value={formProducto.categoria}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-sm text-gray-900"
          >
            <option value="">Seleccione categoría</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.nombre}>
                {cat.nombre}
              </option>
            ))}
          </select>

          <input
            type="number"
            name="precio"
            placeholder="Precio"
            value={formProducto.precio}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-sm text-gray-900"
          />

          <textarea
            name="descripcion"
            placeholder="Descripción"
            value={formProducto.descripcion}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-sm text-gray-900"
          />

          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="w-full text-gray-900"
          />

          {productoOriginal.imagenes?.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              {productoOriginal.imagenes
                .filter((img) => !formProducto.eliminarImagenesId.includes(img.id))
                .map((img, idx) => (
                  <div
                    key={`orig-${idx}`}
                    className="relative overflow-hidden rounded-xl border border-yellow-500 shadow-lg"
                  >
                    <img
                      src={`http://localhost:8080${img.url}`}
                      alt=""
                      className="w-full h-48 object-contain bg-gray-100"
                    />
                    <button
                      onClick={() => handleEliminarImagen(img.id)}
                      className="absolute top-1 right-1 bg-red-600 text-white px-2 py-1 rounded"
                    >
                      Eliminar
                    </button>
                  </div>
                ))}
            </div>
          )}

          <button
            onClick={handleGuardar}
            className="w-full py-3 bg-yellow-500 hover:bg-yellow-400 text-gray-900 rounded-xl font-bold mt-4 shadow"
          >
            Guardar Cambios
          </button>

          {/* Características */}
          <div className="bg-gray-50 p-4 rounded-xl shadow">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Características</h3>
            {caracteristicas.map((c) => (
              <div key={c.id} className="flex justify-between text-gray-800 mb-1">
                <span>
                  <strong>{c.caracteristica}:</strong> {c.decripcionCaracteristica}
                </span>
                <button
                  onClick={() => handleEliminarCaracteristica(c.id)}
                  className="bg-red-600 hover:bg-red-500 px-2 py-0.5 rounded text-white"
                >
                  Eliminar
                </button>
              </div>
            ))}

            <div className="mt-4 flex flex-col space-y-2">
              <input
                type="text"
                name="caracteristica"
                placeholder="Característica"
                value={nuevaCaracteristica.caracteristica}
                onChange={handleCaracteristicaChange}
                className="px-3 py-2 rounded border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              <input
                type="text"
                name="descripcion"
                placeholder="Descripción"
                value={nuevaCaracteristica.descripcion}
                onChange={handleCaracteristicaChange}
                className="px-3 py-2 rounded border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              <button
                onClick={handleAgregarCaracteristica}
                className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 px-3 py-2 rounded font-semibold shadow"
              >
                Agregar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB VISTA PREVIA */}
      {activeTab === "vista" && (
        <div className="bg-gray-50 p-6 rounded-xl shadow-lg space-y-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Vista Previa</h2>

          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-gray-900">
              {formProducto.nombre || productoOriginal.nombre}
            </h3>

            <p className="text-gray-700 italic">
              {formProducto.categoria || productoOriginal.categoria.nombre}
            </p>

            <p className="text-gray-900 font-semibold text-xl">
              ${formProducto.precio || productoOriginal.precio}
            </p>

            <p className="text-gray-800">
              {formProducto.descripcion || productoOriginal.descripcion}
            </p>
          </div>

          {formProducto.imagenes.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              {Array.from(formProducto.imagenes).map((img, idx) => (
                <div
                  key={idx}
                  className="overflow-hidden rounded-xl border border-yellow-500 shadow-lg"
                >
                  <img src={URL.createObjectURL(img)} alt="" className="w-full h-48 object-cover" />
                </div>
              ))}
            </div>
          )}

          {productoOriginal.imagenes?.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              {productoOriginal.imagenes
                .filter((img) => !formProducto.eliminarImagenesId.includes(img.id))
                .map((img, idx) => (
                  <div
                    key={`orig-${idx}`}
                    className="overflow-hidden rounded-xl border border-yellow-500 shadow-lg"
                  >
                    <img src={`http://localhost:8080${img.url}`} alt="" className="w-full h-48 object-contain bg-gray-100" />
                  </div>
                ))}
            </div>
          )}

          <div className="bg-gray-50 p-4 rounded-xl shadow mt-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Características</h3>
            {caracteristicas.map((c) => (
              <div key={c.id} className="text-gray-800">
                <strong>{c.caracteristica}:</strong> {c.decripcionCaracteristica}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
