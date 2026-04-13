export type SignedJWT = {
    token: string;
    uid: string;
};

export type User = {
    authToken: SignedJWT;
    /** The study group assigned to the user. This field determines the system version the user sees. */
    group: "control" | "experiment";
    createdAt: Date;
};