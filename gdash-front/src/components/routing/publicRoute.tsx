import { useAuth } from "@/contexts/authContext";
import { Navigate, Outlet } from "react-router-dom";

interface ProtectedRouteProps {
    redirectTo?: string;
    children?: React.ReactNode;
}

export const PublicRoute: React.FC<ProtectedRouteProps> = ({
    redirectTo = '/dashboard',
    children
}) => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (isAuthenticated) {
        return <Navigate to={redirectTo} replace />;
    }

    return children ? <>{children}</> : <Outlet />;
};