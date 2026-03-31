import jwtService from "../../services/auth/jwt-service.js";
class AuthController {
    handleCreateJWT(req, res) {
        const payload = jwtService.createSignedJWT();
        return res.status(201).json(payload);
    }
}
export default new AuthController();
//# sourceMappingURL=authController.js.map