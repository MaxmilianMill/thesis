import type { Request, Response } from "express";
import userService from "../../services/auth/user-service.js";

class AuthController {

    /**
     * Creates a new anonymous user with a random uuid and a study group assigned.
     * @param req 
     * @param res 
     * @returns 
     */
    async handleCreateUser(req: Request, res: Response) {
        
        const user = await userService.createAnonymousUser();
        
        return res.status(201).json({user});
    }
}

export default new AuthController();