import type { Request, Response } from "express";
import userService from "../../services/auth/user-service.js";
import { log } from "../../services/logger/activity-logger-service.js";

class AuthController {

    /**
     * Creates a new anonymous user with a random uuid and a study group assigned.
     * @param req 
     * @param res 
     * @returns 
     */
    async handleCreateUser(req: Request, res: Response) {
        
        const user = await userService.createAnonymousUser();

        log({
            action: "user_created",
            status: "success",
            uid: user.authToken.uid
        })
        
        return res.status(201).json({user});
    }
}

export default new AuthController();