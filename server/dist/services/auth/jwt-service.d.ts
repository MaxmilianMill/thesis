type SignedJWT = {
    token: string;
    uid: string;
};
declare class JWTService {
    private generateUUID;
    createSignedJWT(): SignedJWT;
    /**
     * Verifies a jwt token and returns the decoded payload.
     * @param token
     * @returns
     */
    verify(token: string): SignedJWT | undefined;
}
declare const _default: JWTService;
export default _default;
//# sourceMappingURL=jwt-service.d.ts.map