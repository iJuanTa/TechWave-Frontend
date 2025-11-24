import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiCreditCard, FiPlusCircle, FiArrowLeftCircle } from "react-icons/fi";
import { FaPaypal } from "react-icons/fa";
import { MdAccountBalanceWallet } from "react-icons/md"; // Daviplata
import { BsBank2 } from "react-icons/bs"; // Nequi

export default function MetodosPago() {
  const navigate = useNavigate();
  const [tarjetas, setTarjetas] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargarTarjetas = async () => {
    try {
      const res = await axios.get("http://localhost:8080/me/tarjeta", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      const activas = (res.data || []).filter((t) => t.activa);
      setTarjetas(activas);
    } catch (err) {
      console.error(err);
      setTarjetas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarTarjetas();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-700 text-xl">
        Cargando métodos de pago...
      </div>
    );

  const iconoMetodo = (metodo) => {
    switch (metodo) {
      case "TARJETA":
        return <FiCreditCard size={32} className="text-purple-600" />;
      case "NEQUI":
        return <BsBank2 size={32} className="text-pink-500" />;
      case "DAVIPLATA":
        return <MdAccountBalanceWallet size={32} className="text-red-500" />;
      case "PAYPAL":
        return <FaPaypal size={32} className="text-blue-500" />;
      default:
        return <FiCreditCard size={32} className="text-gray-400" />;
    }
  };

  const eliminarTarjeta = async (id) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este método de pago?")) return;

    try {
      await axios.delete(`http://localhost:8080/pago/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      setTarjetas(tarjetas.filter((t) => t.id !== id));
      alert("Método de pago eliminado correctamente");
    } catch (err) {
      console.error(err);
      alert("Error al eliminar el método de pago");
    }
  };

  const maxTarjetasActivas = 3;
  const puedeAgregar = tarjetas.length < maxTarjetasActivas;

  return (
    <div className="bg-gray-100 min-h-screen px-4 sm:px-10 lg:px-20 py-8">
      {/* Volver */}
      <button
        className="flex items-center gap-2 mb-6 text-gray-700 hover:text-gray-900"
        onClick={() => navigate("/perfil")}
      >
        <FiArrowLeftCircle size={22} />
        Volver al perfil
      </button>

      <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
        Métodos de Pago
      </h1>

      {/* Agregar método */}
      <div className="flex justify-end mb-5">
        <button
          onClick={() => puedeAgregar && navigate("/agregar-tarjeta")}
          disabled={!puedeAgregar}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-white transition ${
            puedeAgregar
              ? "bg-green-600 hover:bg-green-500"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          <FiPlusCircle size={20} />
          Agregar método de pago
        </button>
      </div>

      {!puedeAgregar && (
        <div className="text-center text-yellow-600 mb-5 font-medium">
          Has alcanzado el límite de {maxTarjetasActivas} métodos de pago activos.
        </div>
      )}

      {/* Lista de métodos */}
      {tarjetas.length === 0 ? (
        <div className="text-center text-gray-500 bg-white p-6 rounded-xl shadow-md border border-gray-200">
          No tienes métodos de pago activos.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {tarjetas.map((t) => {
            const ultimos4 = t.numeroCuenta ? t.numeroCuenta.slice(-4) : "****";
            return (
              <div
                key={t.id}
                className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition"
              >
                <div className="flex items-center gap-3 mb-4">
                  {iconoMetodo(t.metodo)}
                  <h2 className="text-lg font-bold text-gray-900">
                    {t.metodo === "TARJETA"
                      ? `Tarjeta •••• ${ultimos4}`
                      : t.metodo.charAt(0).toUpperCase() +
                        t.metodo.slice(1).toLowerCase()}
                  </h2>
                </div>

                <p className="text-gray-700">
                  <span className="font-semibold">Titular:</span> {t.nombrePropietario}
                </p>
                <p className="text-gray-700 mt-1">
                  <span className="font-semibold">Número:</span> •••• {ultimos4}
                </p>

                <div className="flex justify-end mt-5">
                  <button
                    onClick={() => eliminarTarjeta(t.id)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg font-semibold text-white transition"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
