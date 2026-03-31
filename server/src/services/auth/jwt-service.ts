import { v4 } from "uuid";
import jwt from "jsonwebtoken"
import { config } from "../../config.js";

type SignedJWT = {
    token: string;
    uid: string;
};

class JWTService {

    private generateUUID = () => v4();

    createSignedJWT(): SignedJWT {

        const uid = this.generateUUID();

        const payload = {
            uid,
            role: "tester"
        };

        // generate a token that is valid for 4h aka. one test session
        const token = jwt.sign(
            payload,
            config.JWT_SECRET,
            { expiresIn: "4h" }
        )

        return {
            token,
            uid
        }
    }

    /**
     * Verifies a jwt token and returns the decoded payload.
     * @param token 
     * @returns 
     */
    verify(token: string): SignedJWT | undefined {

        try {
            const decoded = jwt.verify(token, config.JWT_SECRET);
            return decoded as SignedJWT;
        } catch (error) {
            console.error((error as Error).message);
            return;
        }
    }
}

export default new JWTService();