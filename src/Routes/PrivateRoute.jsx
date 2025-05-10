import { useContext } from "react";
import { Navigate } from "react-router";
import Loading from "../Components/Loading";
import { AuthContext } from "../Providers/AuthProvider";
const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <Loading />;
  if (user !== null) {
    return children;
  }
  return <Navigate to="/login" />;
};

export default PrivateRoute;
