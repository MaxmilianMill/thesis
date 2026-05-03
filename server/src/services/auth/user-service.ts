import { addUser, getLastUser } from "../../repository/auth/user-repository.js";
import type { User } from "@thesis/types";
import jwtService from "./jwt-service.js";

class UserService {

    async createAnonymousUser() {

        const authToken = jwtService.createSignedJWT();
        
        const group = await this.assignGroup();

        const user = {
            authToken,
            group
        } as Omit<User, "createdAt">;

        return await addUser(user);
    };

    async assignGroup(): Promise<User["group"]> {
        const latestUser = await getLastUser();

        // if no user exist, we start with the control group
        if (!latestUser)
            return "control_first";

        if (latestUser.group === "control_first")
            return "experiment_first";

        return "control_first";
    };
};

export default new UserService();