import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../providers/AuthenticationProvider";

export default function PrivateRoute() {
    const user = useAuth();
    if (user.user.getId() === -1) {
        return (<Navigate to="/login" />);
    }
    return (<Outlet />);
}