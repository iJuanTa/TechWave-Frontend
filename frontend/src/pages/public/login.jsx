import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../api/auth";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState(null);

  const [form, setForm] = useState({
    userOrEmail: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
    setServerError(null);
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post("http://localhost:8080/auth/google", {
        token: credentialResponse.credential,
      });

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }
      if (res.data.username) {
        localStorage.setItem("username", res.data.username);
      }
      if (res.data.role) {
        localStorage.setItem("role", res.data.role);
      }
      const expiration = Date.now() + 60 * 60 * 1000;
        localStorage.setItem("token_exp", expiration);

      navigate("/tienda");
    } catch (e) {

      console.error(e);
      setServerError("Error al iniciar sesión con Google");
    }
  };

  const validate = () => {
    if (!form.userOrEmail.trim())
      return "Debe ingresar email o nombre de usuario.";
    if (!form.password.trim()) return "La contraseña es obligatoria.";
    return null;
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const validationError = validate();
    if (validationError) {
      setServerError(validationError);
      return;
    }

    setLoading(true);
    setServerError(null);

    try {
      const payload = {
        identificador: form.userOrEmail.trim(),
        password: form.password,
      };

      const res = await auth.post("/login", payload);

      if (res.status === 200) {
        // Guardar token si lo devuelves
        if (res.data.token) {
          localStorage.setItem("token", res.data.token);
        }
        if (res.data.username) {
          localStorage.setItem("username", res.data.username);
        }
        if (res.data.role) {
          localStorage.setItem("role", res.data.role);
        }
        const expiration = Date.now() + 60 * 60 * 1000;
        localStorage.setItem("token_exp", expiration);

        navigate("/tienda");
      }
    } catch (err) {
      if (err.response) {
        const { status, data } = err.response;

        if (status === 401) {
          return setServerError("Credenciales incorrectas.");
        }

        if (status === 422) {
          return setServerError(data?.message || "Datos inválidos (422)");
        }

        if (status === 400) {
          return setServerError(data?.message || "Faltan datos.");
        }

        return setServerError(
          data?.message || `Error del servidor (${status})`
        );
      }

      setServerError("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-purple-900 via-purple-800 to-indigo-900 p-6">
      <div className="w-full max-w-2xl bg-base-100/20 backdrop-blur-xl border border-purple-600 rounded-2xl shadow-xl p-10">
        <h1 className="text-4xl font-bold text-center bg-linear-to-r from-pink-300 to-blue-300 bg-clip-text text-transparent">
          Iniciar Sesión
        </h1>

        <p className="text-purple-200 text-center mt-3">
          Accede a tu cuenta para ver tus compras y productos favoritos.
        </p>

        <form onSubmit={onSubmit} className="mt-10 space-y-6">
          {/* Usuario o Email */}
          <div className="form-control">
            <label className="label text-purple-100">
              Email o nombre de usuario
            </label>
            <input
              type="text"
              name="userOrEmail"
              value={form.userOrEmail}
              onChange={handleChange}
              placeholder="juan@example.com o juan123"
              className="input input-bordered w-full"
            />
          </div>

          {/* Contraseña */}
          <div className="form-control">
            <label className="label text-purple-100">Contraseña</label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="******"
                className="input input-bordered w-full"
              />

              <button
                type="button"
                className="btn btn-sm btn-ghost absolute right-2 top-1/2 -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Ocultar" : "Mostrar"}
              </button>
            </div>
          </div>

          {/* Errores */}
          {serverError && (
            <div className="text-error text-center">{serverError}</div>
          )}

          {/* Botón */}
          <button className="btn btn-primary w-full mt-4" disabled={loading}>
            {loading ? "Ingresando..." : "Ingresar"}
          </button>

          <div className="mt-6 flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() =>
                setServerError("Error al iniciar sesión con Google")
              }
            />
          </div>

          {/* Link registro */}
          <p className="mt-4 text-center text-purple-200">
            ¿No tienes cuenta?{" "}
            <button
              type="button"
              onClick={() => navigate("/registro")}
              className="text-pink-300 underline hover:text-pink-200"
            >
              Regístrate aquí
            </button>
          </p>

          <div className="text-center">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => navigate("/")}
            >
              cancelar
            </button>
          </div>
        </form>

        <div className="mt-6 text-center text-purple-300 text-sm">
          © 2025 TechWave - Todos los derechos reservados.
        </div>
      </div>
    </div>
  );
}
