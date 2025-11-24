import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../api/auth";

export default function Registro() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    nombreUsuario: "",
    usuario: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
    setErrors((s) => ({ ...s, [name]: null }));
    setServerError(null);
    setSuccessMsg(null);
  };

  const validate = () => {
    const errs = {};
    if (!form.nombre.trim()) errs.nombre = "El nombre es obligatorio.";
    if (!form.apellido.trim()) errs.apellido = "El apellido es obligatorio.";
    if (!form.nombreUsuario.trim()) errs.nombreUsuario = "El nombre de usuario es obligatorio.";
    if (!form.email.trim()) errs.email = "El email es obligatorio.";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (form.email && !emailRegex.test(form.email))
      errs.email = "Formato de email no válido.";

    if (!form.password) errs.password = "La contraseña es obligatoria.";
    else if (form.password.length < 6)
      errs.password = "Debe tener mínimo 6 caracteres.";

    if (form.password !== form.confirmPassword)
      errs.confirmPassword = "Las contraseñas no coinciden.";

    return errs;
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const errs = validate();
    if (Object.keys(errs).length > 0) return setErrors(errs);

    setLoading(true);
    setServerError(null);
    setSuccessMsg(null);

    try {
      const payload = {
        nombre: form.nombre.trim(),
        apellido: form.apellido.trim(),
        username: form.nombreUsuario.trim(),
        email: form.email.trim(),
        password: form.password,
      };

      const res = await auth.post("/registrar", payload);

      if (res.status === 201 || res.status === 200) {
        setSuccessMsg("Registro exitoso. Redirigiendo al login...");

        setTimeout(() => navigate("/login"), 1000);
      }
    } catch (err) {
      if (err.response) {
        const { status, data } = err.response;

        if (status === 400 && data?.errors) {
          return setErrors(data.errors);
        }

        if (status === 409) {
          return setServerError("El email o nombre de usuario ya está registrado.");
        }

        if (status === 422) {
          return setServerError(data?.message || "Datos inválidos (422)");
        }

        return setServerError(data?.message || `Error del servidor (${status})`);
      }
      setServerError("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-purple-900 via-purple-800 to-indigo-900 p-6">
      <div className="w-full max-w-3xl bg-base-100/20 backdrop-blur-xl border border-purple-600 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8 md:flex">
          
          {/* -------- LADO IZQUIERDO -------- */}
          <div className="md:w-1/2 pr-6 border-r border-purple-600/40">
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-pink-300 via-purple-300 to-blue-200">
              Crea tu cuenta
            </h2>

            <p className="mt-3 text-purple-200">
              Únete para acceder a ofertas exclusivas, mejores precios y tu panel personal.
            </p>

            <ul className="mt-6 space-y-3 text-purple-200">
              <li className="flex gap-3">
                <span className="badge badge-primary badge-outline">✔</span>
                Registro rápido
              </li>

              <li className="flex gap-3">
                <span className="badge badge-secondary badge-outline">✔</span>
                Seguridad garantizada
              </li>

              <li className="flex gap-3">
                <span className="badge badge-accent badge-outline">✔</span>
                Beneficios exclusivos
              </li>
            </ul>
          </div>

          {/* -------- FORMULARIO -------- */}
          <div className="md:w-1/2 p-6">
            <form onSubmit={onSubmit} className="space-y-4">

              {/* Nombre - Apellido */}
              <div className="flex gap-3">
                <div className="form-control flex-1">
                  <label className="label text-purple-100">Nombre</label>
                  <input 
                    className={`input input-bordered ${errors.nombre ? "input-error" : ""}`}
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    placeholder="Juan"
                  />
                  {errors.nombre && <small className="text-error">{errors.nombre}</small>}
                </div>

                <div className="form-control flex-1">
                  <label className="label text-purple-100">Apellido</label>
                  <input 
                    className={`input input-bordered ${errors.apellido ? "input-error" : ""}`}
                    name="apellido"
                    value={form.apellido}
                    onChange={handleChange}
                    placeholder="Pérez"
                  />
                  {errors.apellido && <small className="text-error">{errors.apellido}</small>}
                </div>
              </div>

              {/* usuario - nombreUsuario */}
              <div className="flex gap-3">
                <div className="form-control flex-1">
                  <label className="label text-purple-100">Nombre de usuario</label>
                  <input 
                    className={`input input-bordered ${errors.nombreUsuario ? "input-error" : ""}`}
                    name="nombreUsuario"
                    value={form.nombreUsuario}
                    onChange={handleChange}
                    placeholder="juan123"
                  />
                  {errors.nombreUsuario && <small className="text-error">{errors.nombreUsuario}</small>}
                </div>
              </div>

              {/* Email */}
              <div className="form-control">
                <label className="label text-purple-100">Email</label>
                <input 
                  className={`input input-bordered ${errors.email ? "input-error" : ""}`}
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="email@ejemplo.com"
                />
                {errors.email && <small className="text-error">{errors.email}</small>}
              </div>

              {/* Contraseña */}
              <div className="flex gap-3">
                <div className="form-control flex-1">
                  <label className="label text-purple-100">Contraseña</label>

                  <div className="relative">
                    <input
                      className={`input input-bordered w-full ${errors.password ? "input-error" : ""}`}
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={handleChange}
                      placeholder="******"
                    />

                    <button
                      type="button"
                      className="btn btn-sm btn-ghost absolute right-2 top-2"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? "Ocultar" : "Mostrar"}
                    </button>
                  </div>

                  {errors.password && <small className="text-error">{errors.password}</small>}
                </div>

                <div className="form-control flex-1">
                  <label className="label text-purple-100">Confirmar</label>
                  <input
                    className={`input input-bordered ${errors.confirmPassword ? "input-error" : ""}`}
                    name="confirmPassword"
                    type="password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repite la contraseña"
                  />
                  {errors.confirmPassword && (
                    <small className="text-error">{errors.confirmPassword}</small>
                  )}
                </div>
              </div>

              {/* Mensajes */}
              {serverError && <div className="text-error">{serverError}</div>}
              {successMsg && <div className="text-success">{successMsg}</div>}

              {/* Botones */}
              <div className=" mt-4">
                <button className="btn btn-primary w-full" disabled={loading}>
                  {loading ? "Registrando..." : "Registrarse"}
                </button>

                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => navigate("/login")}
                >
                  Ya tengo cuenta
                </button>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => navigate("/")}
                >
                  cancelar
                </button>
              </div>

            </form>
          </div>
        </div>

        <div className="p-4 text-center text-purple-300 text-sm">
          © 2025 TechWave - Todos los derechos reservados.
        </div>
      </div>
    </div>
  );
}
