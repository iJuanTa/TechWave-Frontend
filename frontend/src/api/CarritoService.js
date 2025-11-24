import axios from "axios";

const API_BASE = "http://localhost:8080/compra";

export const headers = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const getCarrito = async () => {
  const res = await axios.get(`${API_BASE}/carrito/ver`, { headers: headers() });
  return res.data;
};

export const postAgregarItem = async (productoId) => {
  await axios.post(`${API_BASE}/agregar-item/${productoId}`, {}, { headers: headers() });
};

export const postRestarItem = async (productoId) => {
  await axios.post(`${API_BASE}/restar-item/${productoId}`, {}, { headers: headers() });
};

