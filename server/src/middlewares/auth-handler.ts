import type { NextFunction, Request, Response } from "express"
import jwtService from "../services/auth/jwt-service.js";
import type { SignedJWT } from "@thesis/types";

export type AuthRequest = Request & {
    authToken: SignedJWT;
};

export const authHandler = (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    const authHeader = req.headers.authorization;

    if (!authHeader) 
        return res.status(401).json({error: "User is not authenticated"});

    const token = authHeader.split(" ")[1];

    if (!token)
        return res.status(401).json({error: "Malformed auth header"});

    try {
        
        const verifiedToken = jwtService.verify(token);

        if (!verifiedToken)
            throw new Error("Invalid or expired token");

        (req as AuthRequest).authToken = verifiedToken;

        next();
    } catch (error) {
        return res.status(403).json({error: (error as Error).message});
    }
}