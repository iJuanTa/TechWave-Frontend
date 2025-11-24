import { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, BarChart, XAxis, YAxis, Tooltip, Bar, ResponsiveContainer } from "recharts";

export default function Ventas() {
  const [data, setData] = useState(null);

  const COLORS = ["#1F2937", "#10B981", "#F59E0B", "#EF4444", "#3B82F6"];

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios.get("http://localhost:8080/api/pagos-reportes/resumen", {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => setData(res.data))
    .catch((err) => console.error(err));
  }, []);

  if (!data) return <div className="text-center mt-20 text-xl font-semibold text-gray-700">Cargando dashboard...</div>;

  const metodosPago = Object.entries(data.metodos_pago || {}).map(([name, value]) => ({ name, value }));
  const ventasCategoria = Object.entries(data.ventas_por_categoria || {}).map(([categoria, info]) => ({
    categoria,
    total: info.total
  }));
  const totalVentas = data.total_ventas || 0;
  const totalTransacciones = data.transacciones || 0;
  const totalMetodos = Object.keys(data.metodos_pago || {}).length;

  return (
    <div className="p-6 bg-gray-100 min-h-screen space-y-10">
      <h1 className="text-4xl font-bold mb-6 text-gray-900">Resumen de Ventas</h1>

      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg text-center">
          <p className="text-gray-700">Total de ventas</p>
          <h2 className="text-3xl font-bold text-green-600">${totalVentas.toLocaleString()}</h2>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg text-center">
          <p className="text-gray-700">Transacciones</p>
          <h2 className="text-3xl font-bold text-blue-600">{totalTransacciones}</h2>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg text-center">
          <p className="text-gray-700">Métodos de pago usados</p>
          <h2 className="text-3xl font-bold text-purple-600">{totalMetodos}</h2>
        </div>
      </div>

      {/* Gráficas */}
      <div className="space-y-10">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Métodos de Pago</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={metodosPago}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                innerRadius={50}
                labelLine={true}
                label={({ name, value }) => `${name} (${value})`}
              >
                {metodosPago.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Ventas por Categoría</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ventasCategoria} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <XAxis dataKey="categoria" stroke="#1F2937" interval={0} angle={-20} textAnchor="end" />
              <YAxis stroke="#1F2937" />
              <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
              <Bar dataKey="total" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
