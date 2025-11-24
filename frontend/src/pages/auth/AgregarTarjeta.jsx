import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiCreditCard, FiArrowLeftCircle } from "react-icons/fi";
import { FaCcVisa, FaWallet } from "react-icons/fa";
import { SiPaypal } from "react-icons/si";
import { MdAccountBalanceWallet } from "react-icons/md";

export default function AgregarTarjeta() {
  const navigate = useNavigate();

  const [cantidadMetodos, setCantidadMetodos] = useState(0);
  const [metodoPago, setMetodoPago] = useState("");
  const [form, setForm] = useState({
    nombrePropietario: "",
    numeroCuenta: "",
    cvv: "",
  });

  const [loading, setLoading] = useState(false);

  const cargarCantidad = async () => {
    try {
      const count = await axios.get("http://localhost:8080/pago", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setCantidadMetodos(count.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    cargarCantidad();
  }, []);

  const maximoAlcanzado = cantidadMetodos >= 3;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    if (maximoAlcanzado) return;

    if (!metodoPago) {
      alert("Selecciona un método de pago.");
      return;
    }

    if (!form.nombrePropietario || !form.numeroCuenta || !form.cvv) {
      alert("Completa todos los campos.");
      return;
    }

    setLoading(true);

    try {
      await axios.post(
        "http://localhost:8080/pago",
        {
          ...form,
          metodoPago,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("Método de pago agregado correctamente");
      navigate(-1);
    } catch (err) {
      console.error(err);
      alert("Error al agregar el método de pago");
    } finally {
      setLoading(false);
    }
  };


  const stylesPorMetodo = {
    TARJETA: {
      bg: "bg-gradient-to-r from-gray-900 to-gray-700",
      icon: <FaCcVisa size={40} />,
    },
    NEQUI: {
      bg: "bg-gradient-to-r from-gray-700 to-gray-600",
      icon: <FaWallet size={40} />,
    },
    DAVIPLATA: {
      bg: "bg-gradient-to-r from-gray-700 to-gray-500",
      icon: <MdAccountBalanceWallet size={40} />,
    },
    PAYPAL: {
      bg: "bg-gradient-to-r from-gray-800 to-gray-600",
      icon: <SiPaypal size={40} />,
    },
    DEFAULT: {
      bg: "bg-gray-700",
      icon: <FiCreditCard size={40} />,
    },
  };

  const currentStyle = stylesPorMetodo[metodoPago] || stylesPorMetodo.DEFAULT;

  // 🎨 Tarjeta visual
  const renderCardPreview = () => {
    if (!metodoPago) return null;

    return (
      <div
        className={`${currentStyle.bg} text-white rounded-2xl p-6 shadow-xl mb-6 border border-gray-600`}
      >
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold tracking-wide">
            {metodoPago === "TARJETA"
              ? "Tarjeta Bancaria"
              : metodoPago.charAt(0) + metodoPago.slice(1).toLowerCase()}
          </h3>

          {currentStyle.icon}
        </div>

        <div className="mt-4 opacity-90">
          <p className="text-sm">Titular</p>
          <p className="text-lg font-medium">{form.nombrePropietario || "---- ----"}</p>
        </div>

        <div className="mt-4 opacity-90">
          <p className="text-sm">Número</p>
          <p className="text-lg tracking-widest font-medium">
            {form.numeroCuenta || "XXXX XXXX XXXX XXXX"}
          </p>
        </div>
      </div>
    );
  };

  const renderCampos = () => {
    if (!metodoPago) return null;

    return (
      <>
        <label className="block mt-4 mb-1 text-gray-700 font-medium">Nombre del titular</label>
        <input
          type="text"
          name="nombrePropietario"
          value={form.nombrePropietario}
          onChange={handleChange}
          className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 
          focus:ring-2 focus:ring-gray-700 outline-none transition"
          placeholder="Ej: Juan Pérez"
        />

        <label className="block mt-4 mb-1 text-gray-700 font-medium">
          {metodoPago === "TARJETA" ? "Número de tarjeta" : "Número de cuenta"}
        </label>
        <input
          type="text"
          name="numeroCuenta"
          value={form.numeroCuenta}
          onChange={handleChange}
          className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 
          tracking-widest focus:ring-2 focus:ring-gray-700 outline-none transition"
          placeholder={
            metodoPago === "TARJETA"
              ? "XXXX XXXX XXXX XXXX"
              : "Número de cuenta Nequi/Daviplata"
          }
        />

        <label className="block mt-4 mb-1 text-gray-700 font-medium">
          {metodoPago === "TARJETA" ? "CVV" : "Código de verificación"}
        </label>
        <input
          type="password"
          name="cvv"
          value={form.cvv}
          onChange={handleChange}
          className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 
          focus:ring-2 focus:ring-gray-700 outline-none transition"
          placeholder="***"
        />
      </>
    );
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-100 to-gray-200 py-12 px-4 flex justify-center">
      <div className="max-w-2xl w-full bg-white rounded-2xl p-10 shadow-2xl border border-gray-100">

        {/* BOTÓN VOLVER */}
        <button
          className="flex items-center gap-2 mb-8 text-gray-700 hover:text-gray-900 transition font-medium"
          onClick={() => navigate(-1)}
        >
          <FiArrowLeftCircle size={22} />
          Volver
        </button>

        <h1 className="text-3xl font-semibold text-gray-900 mb-8 text-center tracking-tight">
          Agregar Método de Pago
        </h1>

        {maximoAlcanzado && (
          <div className="bg-red-600 text-white p-4 rounded-lg text-center font-semibold mb-6 shadow-md">
            Has alcanzado el máximo de 3 métodos de pago.
            <br />
            Elimina alguno para poder agregar otro.
          </div>
        )}

        {renderCardPreview()}

        <label className="block mb-2 text-gray-700 font-medium">
          Selecciona un método de pago
        </label>

        <select
          className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900
          focus:ring-2 focus:ring-gray-700 outline-none transition"
          value={metodoPago}
          disabled={maximoAlcanzado}
          onChange={(e) => setMetodoPago(e.target.value)}
        >
          <option value="">-- Selecciona --</option>
          <option value="TARJETA">Tarjeta de crédito / débito</option>
          <option value="NEQUI">Nequi</option>
          <option value="DAVIPLATA">Daviplata</option>
          <option value="PAYPAL">Paypal</option>
        </select>

        {renderCampos()}

        <button
          onClick={handleSubmit}
          disabled={loading || maximoAlcanzado}
          className={`mt-8 w-full py-3 rounded-lg text-white font-semibold shadow-lg 
          transition ${maximoAlcanzado
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-gray-900 hover:bg-black"
            }`}
        >
          {loading ? "Guardando..." : "Guardar método de pago"}
        </button>
      </div>
    </div>
  );
}
