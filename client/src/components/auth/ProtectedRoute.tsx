import { useAuthSelectors } from '@/contexts/useAuthStore'
import { Navigate, Outlet} from 'react-router-dom';

const ProtectedRoute = () => {

    const user = useAuthSelectors.use.user();

    if (!user) return <Navigate to="/" replace />;

    return <Outlet />;
}

export default ProtectedRoute