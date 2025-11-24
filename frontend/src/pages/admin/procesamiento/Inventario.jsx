import { useEffect, useState } from "react";
import axios from "axios";

export default function Inventario() {
  const [inventario, setInventario] = useState([]);
  const [loading, setLoading] = useState(true);


  const [modalOpen, setModalOpen] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [cantidad, setCantidad] = useState(0);
  const [accion, setAccion] = useState(""); 

  useEffect(() => {
    const fetchInventario = async () => {
      try {
        const res = await axios.get("http://localhost:8080/inventario/mostrar", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setInventario(res.data);
      } catch (err) {
        console.error("Error cargando inventario:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInventario();
  }, []);

  const abrirModal = (item, tipo) => {
    setProductoSeleccionado(item);
    setAccion(tipo);
    setCantidad(0);
    setModalOpen(true);
  };

  const manejarConfirmar = async () => {
    if (!cantidad || cantidad < 0) return;
    try {
      if (accion === "sumar") {
        await axios.put(`http://localhost:8080/inventario/sumar/${productoSeleccionado.id}`, null, {
          params: { stock: cantidad },
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
      } else {
        await axios.put(`http://localhost:8080/inventario/cambiar/${productoSeleccionado.id}`, null, {
          params: { stock: cantidad },
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
      }
 
      const res = await axios.get("http://localhost:8080/inventario/mostrar", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setInventario(res.data);
      setModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("Error al actualizar stock");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-purple-700 text-xl">
        Cargando inventario...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white text-gray-900">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Inventario de Productos</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Imagen</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Nombre</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Estado</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Activo</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Cantidad</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-300">
            {inventario.map((item) => (
              <tr key={item.id} className="hover:bg-gray-100 transition">
                <td className="px-6 py-4">
                  <img
                    src={`http://localhost:8080${item.producto.imagenes[0]?.url}`}
                    alt={item.producto.nombre}
                    className="w-16 h-16 object-cover rounded"
                  />
                </td>
                <td className="px-6 py-4 text-gray-900 font-semibold">{item.producto.nombre}</td>
                <td className="px-6 py-4 text-gray-700">{item.producto.estado}</td>
                <td className="px-6 py-4 text-gray-700">
                  {item.producto.activo ? "Sí" : "No"}
                </td>
                <td className="px-6 py-4 text-gray-900 font-bold">{item.cantidad}</td>
                <td className="px-6 py-4 flex gap-2">
                  <button
                    onClick={() => abrirModal(item, "sumar")}
                    className="px-3 py-1 bg-green-600 hover:bg-green-500 text-white rounded"
                  >
                    Agregar
                  </button>
                  <button
                    onClick={() => abrirModal(item, "cambiar")}
                    className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded"
                  >
                    Actualizar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-20 z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-80">
            <h2 className="text-gray-900 font-bold mb-4">
              {accion === "sumar" ? "Agregar cantidad" : "Actualizar cantidad"} <br />
              <span className="text-gray-600 text-sm">{productoSeleccionado.producto.nombre}</span>
            </h2>
            <input
              type="number"
              value={cantidad}
              onChange={(e) => setCantidad(Number(e.target.value))}
              className="w-full px-3 py-2 rounded border border-gray-300 text-gray-900 mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-200"
                onClick={() => setModalOpen(false)}
              >
                Cancelar
              </button>
              <button
                className={`px-3 py-1 rounded text-white ${
                  accion === "sumar" ? "bg-green-600 hover:bg-green-500" : "bg-purple-600 hover:bg-purple-500"
                }`}
                onClick={manejarConfirmar}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
