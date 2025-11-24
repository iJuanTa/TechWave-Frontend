import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FiCreditCard,
  FiArrowLeftCircle,
  FiPlusCircle,
  FiMapPin,
} from "react-icons/fi";
import { FaPaypal } from "react-icons/fa";
import { MdAccountBalanceWallet } from "react-icons/md"; // Daviplata
import { BsBank2 } from "react-icons/bs"; // Nequi

const formatearPrecio = (valor) => {
  if (!valor && valor !== 0) return "0";
  return Number(valor).toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  });
};

function Modal({ mensaje, onConfirm, onCancel, mostrarCancelar }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl max-w-md w-full shadow-lg">
        <p className="text-gray-900 mb-4 whitespace-pre-line">{mensaje}</p>
        <div className="flex justify-end gap-4">
          {mostrarCancelar && (
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-gray-300 hover:bg-gray-200 rounded transition"
            >
              Cancelar
            </button>
          )}
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded text-white transition"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProcesoPago() {
  const navigate = useNavigate();
  const [tarjetas, setTarjetas] = useState([]);
  const [direcciones, setDirecciones] = useState([]);
  const [carrito, setCarrito] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTarjeta, setSelectedTarjeta] = useState(null);
  const [selectedDireccion, setSelectedDireccion] = useState(null);
  const [modal, setModal] = useState({ show: false, mensaje: "", onConfirm: null, mostrarCancelar: true });
  const token = localStorage.getItem("token");

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [tarjetaRes, direccionRes, carritoRes] = await Promise.all([
        axios.get("http://localhost:8080/me/tarjeta", { headers: { Authorization: `Bearer ${token}` } }),
        axios.get("http://localhost:8080/me/direcciones", { headers: { Authorization: `Bearer ${token}` } }),
        axios.get("http://localhost:8080/compra/carrito/ver", { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      const activas = (tarjetaRes.data || []).filter(t => t.activa);
      setTarjetas(activas);
      const direccionesActivas = (direccionRes.data || []).filter(t => t.activa);
      setDirecciones(direccionesActivas);
      setCarrito(carritoRes.data || null);
      if (activas.length > 0) setSelectedTarjeta(activas[0].id);
      if ((direccionRes.data || []).length > 0) setSelectedDireccion(direccionRes.data[0].id);
    } catch (err) {
      console.error(err);
      setTarjetas([]);
      setDirecciones([]);
      setCarrito(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();

    const handleBeforeUnload = async () => {
      if (carrito?.id) {
        await axios.post(
          `http://localhost:8080/compra/cancelar/${carrito.id}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  const iconoMetodo = (metodo) => {
    switch (metodo) {
      case "TARJETA": return <FiCreditCard size={32} className="text-purple-600" />;
      case "NEQUI": return <BsBank2 size={32} className="text-pink-400" />;
      case "DAVIPLATA": return <MdAccountBalanceWallet size={32} className="text-red-400" />;
      case "PAYPAL": return <FaPaypal size={32} className="text-blue-400" />;
      default: return <FiCreditCard size={32} className="text-gray-400" />;
    }
  };

  const iniciarCompra = async () => {
    if (!selectedTarjeta || !selectedDireccion || !carrito?.items?.length) {
      setModal({
        show: true,
        mensaje: !selectedTarjeta || !selectedDireccion ? "Debes seleccionar un método de pago y una dirección." : "Tu carrito está vacío.",
        onConfirm: () => setModal({ show: false }),
        mostrarCancelar: true,
      });
      return;
    }

    const resumen = carrito.items
      .map((item) => `${item.producto.nombre} x${item.cantidad} - ${formatearPrecio(item.subtotal)}`)
      .join("\n");

    setModal({
      show: true,
      mensaje: `Resumen de tu compra:\n${resumen}\n\nTotal: ${formatearPrecio(carrito.total)}\n\n¿Deseas proceder con el pago?`,
      onConfirm: async () => {
        setModal({ show: false });
        try {
          const resCompra = await axios.post(
            `http://localhost:8080/compra/comprar`,
            {},
            { params: { direccion: selectedDireccion, id_pago: selectedTarjeta }, headers: { Authorization: `Bearer ${token}` } }
          );

          const compraId = resCompra.data.id;
          await axios.post(`http://localhost:8080/compra/confirmar/${compraId}`, {}, { headers: { Authorization: `Bearer ${token}` } });

          setModal({
            show: true,
            mensaje: `Compra realizada con éxito, ${resCompra.data.usuario.nombre}!`,
            onConfirm: () => {
              setModal({ show: false });
              window.location.reload();
            },
            mostrarCancelar: false,
          });
        } catch (err) {
          console.error(err);
          setModal({
            show: true,
            mensaje: err.response?.data || "Error al procesar la compra.",
            onConfirm: () => setModal({ show: false }),
            mostrarCancelar: true,
          });
        }
      },
      mostrarCancelar: true,
    });
  };

  if (loading) return <div className="flex justify-center items-center h-screen text-gray-700 text-xl">Cargando proceso de pago...</div>;

  return (
    <div className="bg-gray-100 min-h-screen px-4 sm:px-10 lg:px-20 py-8">
      {modal.show && <Modal {...modal} onCancel={() => setModal({ show: false })} />}
      <button
        className="flex items-center gap-2 mb-6 text-gray-800 hover:text-gray-600"
        onClick={() => navigate("/carrito")}
      >
        <FiArrowLeftCircle size={22} />
        Volver
      </button>

      <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Proceso de Pago</h1>

      {/* Carrito */}
      {carrito?.items?.length > 0 ? (
        <div className="bg-white p-6 rounded-xl mb-6 border border-gray-200 shadow-md">
          <h2 className="text-xl font-bold mb-4 text-gray-900">Detalles del Carrito</h2>
          {carrito.items.map((item) => (
            <div key={item.id} className="flex justify-between mb-2 items-center">
              <div className="flex items-center gap-4">
                <img
                  src={`http://localhost:8080${item.producto.imagenes[0]?.url}`}
                  alt={item.producto.nombre}
                  className="w-16 h-16 object-cover rounded"
                />
                <div>
                  <p className="font-bold text-gray-900">{item.producto.nombre}</p>
                  <p className="text-gray-500">Cantidad: {item.cantidad}</p>
                </div>
              </div>
              <span className="font-bold text-gray-900">{formatearPrecio(item.subtotal)}</span>
            </div>
          ))}
          <div className="flex justify-between font-bold mt-4 border-t border-gray-300 pt-2 text-gray-900">
            <span>Total</span>
            <span>{formatearPrecio(carrito.total)}</span>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-500 bg-white p-6 rounded-xl shadow-md border border-gray-200">
          No tienes productos en el carrito.
        </div>
      )}

      {/* Métodos de pago */}
      <h2 className="text-2xl font-bold mb-4 text-gray-900">Selecciona un método de pago</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {tarjetas.map((t) => (
          <div
            key={t.id}
            className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
              selectedTarjeta === t.id
                ? "border-purple-400 shadow-lg scale-105"
                : "border-gray-300 hover:border-purple-300 hover:shadow-md"
            }`}
            onClick={() => setSelectedTarjeta(t.id)}
          >
            {iconoMetodo(t.metodo)}
            <div>
              <p className="font-bold text-gray-900">
                {t.metodo === "TARJETA"
                  ? `Tarjeta •••• ${t.numeroCuenta?.slice(-4)}`
                  : t.metodo.charAt(0).toUpperCase() + t.metodo.slice(1).toLowerCase()}
              </p>
              <p className="text-gray-500">{t.nombrePropietario}</p>
            </div>
          </div>
        ))}
        {tarjetas.length < 3 && (
          <button
            className="flex items-center justify-center gap-2 p-4 bg-green-600 hover:bg-green-500 rounded-xl font-semibold text-white"
            onClick={() => navigate("/agregar-tarjeta")}
          >
            <FiPlusCircle size={24} />
            Agregar método de pago
          </button>
        )}
      </div>

      {/* Direcciones */}
      <h2 className="text-2xl font-bold mb-4 text-gray-900">Selecciona una dirección</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {direcciones.map((d) => (
          <div
            key={d.id}
            className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
              selectedDireccion === d.id
                ? "border-purple-400 shadow-lg scale-105"
                : "border-gray-300 hover:border-purple-300 hover:shadow-md"
            }`}
            onClick={() => setSelectedDireccion(d.id)}
          >
            <FiMapPin size={32} className="text-purple-600" />
            <div>
              <p className="font-bold text-gray-900">{d.nombre || "Dirección"}</p>
              <p className="text-gray-500">{d.direccion}</p>
            </div>
          </div>
        ))}
        {direcciones.length < 3 && (
          <button
            className="flex items-center justify-center gap-2 p-4 bg-green-600 hover:bg-green-500 rounded-xl font-semibold text-white"
            onClick={() => navigate("/agregar-direccion")}
          >
            <FiPlusCircle size={24} />
            Agregar dirección
          </button>
        )}
      </div>

      <div className="flex justify-end">
        <button
          onClick={iniciarCompra}
          className="px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-lg font-bold text-white"
        >
          Confirmar Compra
        </button>
      </div>
    </div>
  );
}
