import { authenticate as _authenticate } from "@/lib/api/authApi";

export const useAuth = () => {

    const authenticate = async (username: string) => {

        const user = await _authenticate(username);

        console.log(user)

        if (!user)
            return;

        // save user in local store 
        localStorage.setItem("token", user.authToken.token);
        localStorage.setItem("uid", user.authToken.uid);

        return user;
    }

    return {
        authenticate
    }
}