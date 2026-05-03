import { useAuthSelectors } from '@/contexts/useAuthStore'
import { Navigate, Outlet} from 'react-router-dom';

const ProtectedRoute = () => {

    const user = useAuthSelectors.use.user();

    if (!user) {
        const hasParticipated = localStorage.getItem("participated") === "true";
        return <Navigate to={hasParticipated ? "/expired" : "/"} replace />;
    }

    return <Outlet />;
}

export default ProtectedRoute