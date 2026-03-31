import { v4 } from "uuid";
import jwt from "jsonwebtoken";
import { config } from "../../config.js";
class JWTService {
    generateUUID = () => v4();
    createSignedJWT() {
        const uid = this.generateUUID();
        const payload = {
            uid,
            role: "tester"
        };
        // generate a token that is valid for 4h aka. one test session
        const token = jwt.sign(payload, config.JWT_SECRET, { expiresIn: "4h" });
        return {
            token,
            uid
        };
    }
    /**
     * Verifies a jwt token and returns the decoded payload.
     * @param token
     * @returns
     */
    verify(token) {
        try {
            const decoded = jwt.verify(token, config.JWT_SECRET);
            return decoded;
        }
        catch (error) {
            console.error(error.message);
            return;
        }
    }
}
export default new JWTService();
//# sourceMappingURL=jwt-service.js.map