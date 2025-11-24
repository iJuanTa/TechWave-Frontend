import { useEffect, useState } from "react";
import axios from "axios";

export default function Reportes() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios.get("http://localhost:8080/api/pagos-reportes/resumen", {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => setData(res.data))
    .catch((err) => console.error(err));
  }, []);

  if (!data) return <div className="text-center mt-20 text-xl font-semibold text-gray-700">Cargando información...</div>;

  const productosTop = [...(data.productos_top || [])].sort((a, b) => b.total - a.total);
  const usuariosTop = [...(data.usuarios_top || [])].sort((a, b) => b.total - a.total);

  return (
    <div className="p-6 bg-gray-100 min-h-screen space-y-10">
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Productos más vendidos</h3>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b">
              <th className="py-2 text-gray-700">Producto</th>
              <th className="text-gray-700">Cant.</th>
              <th className="text-gray-700">Total</th>
            </tr>
          </thead>
          <tbody>
            {productosTop.map((p, idx) => (
              <tr key={idx} className="border-b hover:bg-gray-100">
                <td className="py-2 text-gray-800">{p.nombre}</td>
                <td className="text-gray-800">{p.unidades}</td>
                <td className="text-gray-800">${p.total.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Usuarios con más compras</h3>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b">
              <th className="py-2 text-gray-700">Usuario</th>
              <th className="text-gray-700">Compras</th>
              <th className="text-gray-700">Total</th>
            </tr>
          </thead>
          <tbody>
            {usuariosTop.map((u, idx) => (
              <tr key={idx} className="border-b hover:bg-gray-100">
                <td className="py-2 text-gray-800">{u.usuario}</td>
                <td className="text-gray-800">{u.compras}</td>
                <td className="text-gray-800">${u.total.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
