import { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import {  useParams } from "react-router-dom";

export default function RastrearEnvio() {
  const { idEnvio } = useParams();
  const [envio, setEnvio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  const fetchEnvio = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const res = await axios.get(
        `http://localhost:8080/api/envios/${idEnvio}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEnvio(res.data);
    } catch (err) {
      setError("No se encontró el envío.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnvio();
  }, [idEnvio]);

  const pasos = [
    { label: "Pedido recibido", estado: "PENDIENTE" },
    { label: "En camino", estado: "EN_RUTA" },
    { label: "Entregado", estado: "ENTREGADO" },
  ];

  const estadoActualIndex = envio
    ? pasos.findIndex((p) => p.estado === envio.estadoEnvio)
    : -1;

  if (loading)
    return (
      <div className="px-6 text-center text-gray-500">Cargando envío...</div>
    );

  if (error)
    return (
      <div className="px-6 text-center text-red-400 text-lg">{error}</div>
    );

  return (
    <div className="px-4 sm:px-10 lg:px-20 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
        Seguimiento del Envío
      </h1>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
        {/* CABECERA */}
        <div className="mb-6">
          <p className="text-gray-500">Envío ID: {envio.id_envio}</p>
          <p className="text-gray-400 text-sm">
            Pedido realizado el{" "}
            {format(new Date(envio.creacion_pedido), "dd/MM/yyyy HH:mm")}
          </p>
          <p className="text-gray-900 font-bold mt-1">
            Total compra: ${envio.compra.total.toLocaleString()}
          </p>
          <p className="text-gray-500 mt-2">
            Dirección: {envio.direccion.direccion},{" "}
            {envio.direccion.ciudad.ciudad},{" "}
            {envio.direccion.ciudad.departamento.departamento}
          </p>
        </div>

        {/* TRACKER */}
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Estado del envío
        </h2>
        <div className="relative flex items-center justify-between gap-6">
          {pasos.map((paso, index) => {
            const completado = index <= estadoActualIndex;

            return (
              <div key={index} className="flex flex-col items-center w-full">
                {index !== 0 && (
                  <div
                    className={`h-1 w-full ${
                      completado ? "bg-purple-500" : "bg-gray-300"
                    }`}
                  ></div>
                )}
                <div
                  className={`w-7 h-7 rounded-full border-2 ${
                    completado
                      ? "bg-purple-500 border-purple-400"
                      : "bg-gray-200 border-gray-400"
                  }`}
                ></div>
                <p
                  className={`text-sm mt-2 ${
                    completado ? "text-purple-600" : "text-gray-400"
                  }`}
                >
                  {paso.label}
                </p>
              </div>
            );
          })}
        </div>

        {envio.estadoEnvio === "RETRASADO" && (
          <div className="mt-4 text-red-500 font-bold">
            ⚠ El envío presenta retrasos.
          </div>
        )}
      </div>
    </div>
  );
}
