// src/config.ts
import 'dotenv/config';
// Helper function to ensure variables are defined
function getEnvVar(key) {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Missing environment variable: ${key}`);
    }
    return value;
}
// Export a validated config object
export const config = {
    PORT: parseInt(process.env.PORT || '3000', 10),
    DATABASE_URL: getEnvVar('DATABASE_URL'),
    JWT_SECRET: getEnvVar('JWT_SECRET'),
};
//# sourceMappingURL=config.js.map