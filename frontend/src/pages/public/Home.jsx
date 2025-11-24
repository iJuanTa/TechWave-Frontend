import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const navigate = useNavigate();
  const [productosDestacados, setProductosDestacados] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/pagos-reportes/top3")
      .then((res) => setProductosDestacados(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-6 py-4 bg-gray-900/80 backdrop-blur-md sticky top-0 z-50 shadow-lg">
        <a className="text-3xl font-extrabold tracking-wide bg-linear-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
          TechWave
        </a>
        <div className="flex gap-4">
          <Link
            className="text-gray-300 hover:text-white font-semibold transition"
            to="/login"
          >
            Login
          </Link>
          <Link
            className="bg-purple-700 hover:bg-purple-800 text-white font-semibold px-4 py-2 rounded-xl shadow-md transition"
            to="/registro"
          >
            Registrarse
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="flex flex-col items-center text-center mt-20 px-6">
        <h1 className="text-6xl font-extrabold mb-6 leading-tight">
          <span className="bg-linear-to-r from-purple-400 via-pink-500 to-blue-500 text-transparent bg-clip-text">
            Explora productos únicos
          </span>
        </h1>

        <p className="text-lg max-w-3xl text-gray-300 mb-10">
          Bienvenido a TechWave, la tienda donde la tecnología y el diseño se
          encuentran en perfecta armonía.
        </p>

        <div className="flex gap-4">
          <button
            onClick={() => navigate("/login")}
            className="bg-purple-700 hover:bg-purple-800 px-6 py-3 rounded-xl shadow-lg font-semibold transition transform hover:scale-105"
          >
            Explorar productos
          </button>
          <button
            onClick={() => navigate("/registro")}
            className="bg-pink-700 hover:bg-pink-800 px-6 py-3 rounded-xl shadow-lg font-semibold transition transform hover:scale-105"
          >
            Crear cuenta
          </button>
        </div>
      </section>

      {/* BENEFICIOS */}
      <section className="mt-32 px-10">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-200">
          ¿Por qué elegirnos?
        </h2>

        <div className="grid md:grid-cols-3 gap-10">
          {[
            {
              title: "Calidad Premium",
              color: "text-pink-400",
              desc: "Productos seleccionados cuidadosamente para ofrecer la mejor experiencia.",
            },
            {
              title: "Soporte 24/7",
              color: "text-blue-400",
              desc: "Atención inmediata y personalizada en cualquier momento.",
            },
            {
              title: "Envío Rápido",
              color: "text-purple-400",
              desc: "Entrega veloz gracias a nuestra logística optimizada.",
            },
          ].map((b, idx) => (
            <div
              key={idx}
              className="p-8 bg-gray-800/70 backdrop-blur-md rounded-2xl shadow-lg hover:scale-105 transition"
            >
              <h3 className={`text-2xl font-semibold mb-3 ${b.color}`}>
                {b.title}
              </h3>
              <p className="text-gray-300">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRODUCTOS DESTACADOS */}
      <section className="mt-32 px-10">
        <div className="grid md:grid-cols-3 gap-8">
          {productosDestacados.length === 0 ? (
            <p className="text-center text-gray-400 col-span-3">
              Cargando productos...
            </p>
          ) : (
            productosDestacados.map((p, idx) => (
              <div
                key={idx}
                className="bg-gray-800/70 backdrop-blur-md rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition overflow-hidden"
              >
                <figure>
                  {p.imagenes && p.imagenes.length > 0 && (
                    <img
                      src={`http://localhost:8080${p.imagenes[0]}`}
                      alt={p.nombre}
                      className="h-48 w-full object-cover"
                    />
                  )}
                </figure>
                <div className="p-6 flex flex-col gap-3">
                  <h3 className="text-2xl font-bold text-gray-100">
                    {p.nombre}
                  </h3>
                  <p className="text-gray-300">
                    {p.descripcion.length > 150
                      ? `${p.descripcion.slice(0, 150)}...`
                      : p.descripcion}
                  </p>
                  <button className="bg-purple-700 hover:bg-purple-800 border-none text-white mt-2 px-4 py-2 rounded-xl" onClick={()=>navigate(`/producto/${p.id}`)}>
                    Ver más
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer footer-center mt-32 p-6 text-gray-400">
        <p>© 2025 TechWave — Diseñado con 💜 por JuanTa</p>
      </footer>
    </div>
  );
}
