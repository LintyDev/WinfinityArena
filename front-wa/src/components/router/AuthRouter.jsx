import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const AuthRouter = () => {
    const { auth } = useAuth();
  return (
    !auth?.accessToken ? <Outlet /> : <Navigate to="/" replace />
  )
}

export default AuthRouter