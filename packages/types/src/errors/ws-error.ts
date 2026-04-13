export type WSError = {
    type: "error";
    code: "VALIDATION_ERROR" | "AUTH_ERROR" | "INTERNAL_ERROR";
    payload: any;
};