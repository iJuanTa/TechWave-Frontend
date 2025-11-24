import { createContext, useEffect, useContext, useState, useCallback } from "react";
import { getCarrito, postAgregarItem, postRestarItem } from "../api/carritoService";

const CarritoContext = createContext();

export function CarritoProvider({ children }) {
  const [carrito, setCarrito] = useState({ items: [] });
  const [loading, setLoading] = useState(false);

  const cargarCarrito = useCallback(async () => {
    const token = localStorage.getItem("token");
    const exp = localStorage.getItem("token_exp");

    if (!token || (exp && Date.now() > Number(exp))) {

      localStorage.removeItem("token");
      localStorage.removeItem("token_exp");
      setCarrito({ items: [] });
      return;
    }

    setLoading(true);
    try {
      const data = await getCarrito();
      setCarrito(data);
    } catch (err) {
      console.error("Error cargando carrito:", err);
      setCarrito({ items: [] });
    } finally {
      setLoading(false);
    }
  }, []);

  const agregarItem = async (productoId) => {
    setLoading(true);
    try {
      await postAgregarItem(productoId);
      await cargarCarrito();
    } finally {
      setLoading(false);
    }
  };

  const restarItem = async (productoId) => {
    setLoading(true);
    try {
      await postRestarItem(productoId);
      await cargarCarrito();
    } finally {
      setLoading(false);
    }
  };

  const cantidadTotal = carrito.items.reduce((sum, item)=>{return sum + item.cantidad},0);

  useEffect(() => {
    cargarCarrito();
  }, [cargarCarrito]);

  return (
    <CarritoContext.Provider
      value={{ carrito, cantidadTotal, loading, agregarItem, restarItem, cargarCarrito }}
    >
      {children}
    </CarritoContext.Provider>
  );
}

export function useCarrito() {
  return useContext(CarritoContext);
}




