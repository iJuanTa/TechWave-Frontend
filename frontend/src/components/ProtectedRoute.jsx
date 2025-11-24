import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles }) {
  const userRole = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/login" replace />; 
  if (!userRole) return <Navigate to="/login" replace />;


  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/no-autorizado" replace />;
  }

  return children;
}

export default ProtectedRoute;
