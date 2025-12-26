import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";

function AdminRoute({ children }) {
  const { user, role, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user || role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default AdminRoute;
