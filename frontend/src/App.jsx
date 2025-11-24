import { Routes, Route } from "react-router-dom";
import Layout from "./layouts/Layout";
import Home from "./pages/public/Home";
import DetalleProducto from "./pages/auth/DetalleProducto";
import EditarPerfil from "./pages/auth/EditarPerfil";
import Login from "./pages/public/login";
import Registro from "./pages/public/Registro";
import Tienda from "./pages/auth/tienda";
import Carrito from "./pages/auth/Carrito";
import Perfil from "./pages/auth/Perfil";
import ProtectedRoute from "./components/ProtectedRoute";
import MetodosPago from "./pages/auth/MetodosPago";
import AgregarTarjeta from "./pages/auth/AgregarTarjeta";
import Direcciones from "./pages/auth/Direcciones";
import AgregarDireccion from "./pages/auth/AgregarDireccion";
import Compras from "./pages/auth/Compras";
import PanelAministrativo from "./pages/admin/PanelAdministrativo";
import HeaderGestor from "./layouts/HeaderGestor";
import Productos from "./pages/admin/gestor/Productos";
import CrearCategoria from "./pages/admin/gestor/CrearCategorias";
import CrearProducto from "./pages/admin/gestor/CrearProducto";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DetalleProductoGestor from "./pages/admin/gestor/DetallesProductoGestor";
import PaginaIndefinida from "./pages/public/Indefinido";
import AccesoDenegado from "./pages/public/NoAutorizado";
import LayoutProcesador from "./layouts/LayoutProcesador";
import Inventario from "./pages/admin/procesamiento/Inventario";
import ProcesoPago from "./pages/auth/ProcesoPago";
import Envios from "./pages/admin/procesamiento/Envios";
import MisEnvios from "./pages/auth/Envio";
import RastrearEnvio from "./pages/auth/RastrearPedido";
import SidebarVertical from "./layouts/SidebarVertical";
import Ventas from "./pages/admin/supervisor/Ventas";
import Reportes from "./pages/admin/supervisor/Reportes";
import AdminBar from "./layouts/adminBar";
import AdminEmpleados from "./pages/admin/admin/AdminEmpleados";
import ModificarUsuario from "./pages/admin/admin/ModificarUsuario";




export default function App() {
  const navigate = useNavigate();
useEffect(() => {
    const token = localStorage.getItem("token");
    const exp = localStorage.getItem("token_exp");
    
    if (!token || Date.now() > exp) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("username");
      localStorage.removeItem("token_exp");

    }
  }, [navigate]);


  return (
    
    
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/indefinido" element={<PaginaIndefinida />} />
      <Route path="/no-autorizado" element={< AccesoDenegado/>} />

      {/* Rutas protegidas con Layout */}
      <Route element={<Layout />}>
        {/* Rutas para cualquier usuario autenticado */}
        <Route
          path="/perfil"
          element={
            <ProtectedRoute
              allowedRoles={[
                "ROLE_USUARIO",
                "ROLE_GESTOR",
                "ROLE_PROCESADOR",
                "ROLE_SUPERVISOR",
                "ROLE_ADMIN",
              ]}
            >
              <Perfil />
            </ProtectedRoute>
          }
        />


        <Route
          path="/proceso-pago"
          element={
            <ProtectedRoute
              allowedRoles={[
                "ROLE_USUARIO",
                "ROLE_GESTOR",
                "ROLE_PROCESADOR",
                "ROLE_SUPERVISOR",
                "ROLE_ADMIN",
              ]}
            >
              <ProcesoPago />
            </ProtectedRoute>
          }
        />


        <Route
          path="/tienda"
          element={
            <ProtectedRoute
              allowedRoles={[
                "ROLE_USUARIO",
                "ROLE_GESTOR",
                "ROLE_PROCESADOR",
                "ROLE_SUPERVISOR",
                "ROLE_ADMIN",
              ]}
            >
              <Tienda />
            </ProtectedRoute>
          }
        />
        <Route
          path="/carrito"
          element={
            <ProtectedRoute
              allowedRoles={[
                "ROLE_USUARIO",
                "ROLE_GESTOR",
                "ROLE_PROCESADOR",
                "ROLE_SUPERVISOR",
                "ROLE_ADMIN",
              ]}
            >
              <Carrito />
            </ProtectedRoute>
          }
        />
        <Route
          path="/producto/:id"
          element={
            <ProtectedRoute
              allowedRoles={[
                "ROLE_USUARIO",
                "ROLE_GESTOR",
                "ROLE_PROCESADOR",
                "ROLE_SUPERVISOR",
                "ROLE_ADMIN",
              ]}
            >
              <DetalleProducto />
            </ProtectedRoute>
          }
        />


        <Route
          path="/pedidos"
          element={
            <ProtectedRoute
              allowedRoles={[
                "ROLE_USUARIO",
                "ROLE_GESTOR",
                "ROLE_PROCESADOR",
                "ROLE_SUPERVISOR",
                "ROLE_ADMIN",
              ]}
            >
              <MisEnvios />
            </ProtectedRoute>
          }
        />

        <Route
          path="/rastreo/:idEnvio"
          element={
            <ProtectedRoute
              allowedRoles={[
                "ROLE_USUARIO",
                "ROLE_GESTOR",
                "ROLE_PROCESADOR",
                "ROLE_SUPERVISOR",
                "ROLE_ADMIN",
              ]}
            >
              <RastrearEnvio />
            </ProtectedRoute>
          }
        />


        <Route
          path="/editar-perfil"
          element={
            <ProtectedRoute
              allowedRoles={[
                "ROLE_USUARIO",
                "ROLE_GESTOR",
                "ROLE_PROCESADOR",
                "ROLE_SUPERVISOR",
                "ROLE_ADMIN",
              ]}
            >
              <EditarPerfil />
            </ProtectedRoute>
          }
        />
        <Route
          path="/metodos-pago"
          element={
            <ProtectedRoute
              allowedRoles={[
                "ROLE_USUARIO",
                "ROLE_GESTOR",
                "ROLE_PROCESADOR",
                "ROLE_SUPERVISOR",
                "ROLE_ADMIN",
              ]}
            >
              <MetodosPago />
            </ProtectedRoute>
          }
        />

        <Route
          path="/agregar-tarjeta"
          element={
            <ProtectedRoute
              allowedRoles={[
                "ROLE_USUARIO",
                "ROLE_GESTOR",
                "ROLE_PROCESADOR",
                "ROLE_SUPERVISOR",
                "ROLE_ADMIN",
              ]}
            >
              <AgregarTarjeta />
            </ProtectedRoute>
          }
        />

        <Route
          path="/direcciones"
          element={
            <ProtectedRoute
              allowedRoles={[
                "ROLE_USUARIO",
                "ROLE_GESTOR",
                "ROLE_PROCESADOR",
                "ROLE_SUPERVISOR",
                "ROLE_ADMIN",
              ]}
            >
              <Direcciones/>
            </ProtectedRoute>
          }
        />

        <Route
          path="/agregar-direccion"
          element={
            <ProtectedRoute
              allowedRoles={[
                "ROLE_USUARIO",
                "ROLE_GESTOR",
                "ROLE_PROCESADOR",
                "ROLE_SUPERVISOR",
                "ROLE_ADMIN",
              ]}
            >
              <AgregarDireccion/>
            </ProtectedRoute>
          }
        />

        <Route
          path="/compras"
          element={
            <ProtectedRoute
              allowedRoles={[
                "ROLE_USUARIO",
                "ROLE_GESTOR",
                "ROLE_PROCESADOR",
                "ROLE_SUPERVISOR",
                "ROLE_ADMIN",
              ]}
            >
              <Compras/>
            </ProtectedRoute>
          }
        />

        <Route
          path="/mesa-de-trabajo"
          element={
            <ProtectedRoute
              allowedRoles={[
                "ROLE_GESTOR",
                "ROLE_PROCESADOR",
                "ROLE_SUPERVISOR",
                "ROLE_ADMIN",
              ]}
            >
              <PanelAministrativo/>
            </ProtectedRoute>
          }
        />
      </Route>
      
      <Route element={<HeaderGestor/>}>
      
      <Route
          path="/gestor/panel-gestor/productos"
          element={
            <ProtectedRoute
              allowedRoles={[
                "ROLE_GESTOR",
                "ROLE_ADMIN",
              ]}
            >
              <Productos/>
            </ProtectedRoute>
          }
        />

        <Route
          path="/gestor/panel-gestor/agregar-categoria"
          element={
            <ProtectedRoute
              allowedRoles={[
                "ROLE_GESTOR",
                "ROLE_ADMIN",
              ]}
            >
              <CrearCategoria/>
            </ProtectedRoute>
          }
        />

        <Route
          path="/gestor/panel-gestor/agregar-producto"
          element={
            <ProtectedRoute
              allowedRoles={[
                "ROLE_GESTOR",
                "ROLE_ADMIN",
              ]}
            >
              <CrearProducto/>
            </ProtectedRoute>
          }
        />

        <Route
          path="/gestor/panel-gestor/detalles-editar/:id"
          element={
            <ProtectedRoute
              allowedRoles={[
                "ROLE_GESTOR",
                "ROLE_ADMIN",
              ]}
            >
              <DetalleProductoGestor/>
            </ProtectedRoute>
          }
        />
   
      </Route>


      <Route element={<LayoutProcesador/>}>
      
      <Route
          path="/procesador/inventario"
          element={
            <ProtectedRoute
              allowedRoles={[
                "ROLE_PROCESADOR",
                "ROLE_ADMIN",
              ]}
            >
              <Inventario/>
            </ProtectedRoute>
          }
        />
      
      
      <Route
          path="/procesador/envios"
          element={
            <ProtectedRoute
              allowedRoles={[
                "ROLE_PROCESADOR",
                "ROLE_ADMIN",
              ]}
            >
              <Envios/>
            </ProtectedRoute>
          }
        />
      
      </Route>


      <Route element={<SidebarVertical/>}>

          <Route
          path="/ventas"
          element={
            <ProtectedRoute
              allowedRoles={[
                "ROLE_SUPERVISOR",
                "ROLE_ADMIN",
              ]}
            >
              <Ventas/>
            </ProtectedRoute>
          }
        />

        <Route
          path="/reportes"
          element={
            <ProtectedRoute
              allowedRoles={[
                "ROLE_SUPERVISOR",
                "ROLE_ADMIN",
              ]}
            >
              <Reportes/>
            </ProtectedRoute>
          }
        />
        

      </Route>

     <Route element={<AdminBar/>}>
        <Route
          path="/admin/admin"
          element={
            <ProtectedRoute
              allowedRoles={[
                "ROLE_SUPERVISOR",
                "ROLE_ADMIN",
              ]}
            >
              <AdminEmpleados/>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/modificar-usuario"
          element={
            <ProtectedRoute
              allowedRoles={[
                "ROLE_SUPERVISOR",
                "ROLE_ADMIN",
              ]}
            >
              <ModificarUsuario/>
            </ProtectedRoute>
          }
        />
     </Route>
    </Routes>
  );
}
