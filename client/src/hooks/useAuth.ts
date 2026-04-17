import { useAuthSelectors } from "@/contexts/useAuthStore";
import { authenticate as _authenticate } from "@/lib/api/authApi";

export const useAuth = () => {
    const setUser = useAuthSelectors.use.setUser();
    const resetUser = useAuthSelectors.use.resetUser();

    const authenticate = async (username: string) => {

        const user = await _authenticate(username);

        console.log(user)

        if (!user)
            return;

        // save user in local store 
        localStorage.setItem("token", user.authToken.token);
        localStorage.setItem("uid", user.authToken.uid);
        
        // keep the user in the store
        setUser(user);

        return user;
    };

    const logOut = async () => {
        localStorage.removeItem("token");
        localStorage.removeItem("uid");
        
        resetUser();
    }

    return {
        authenticate,
        logOut
    }
}