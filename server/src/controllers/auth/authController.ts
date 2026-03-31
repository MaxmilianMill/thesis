import jwtService from "../../services/auth/jwt-service.js";
import type { Request, Response } from "express";

class AuthController {

    handleCreateJWT(req: Request, res: Response) {
        
        const payload = jwtService.createSignedJWT();
        
        return res.status(201).json(payload);
    }
}

export default new AuthController();