import axios from "axios";

export async function getStockByProductId(id) {
  const res = await axios.get(`http://localhost:8080/inventario/stock/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return res.data;
}
