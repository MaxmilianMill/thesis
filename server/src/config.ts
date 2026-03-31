// src/config.ts
import 'dotenv/config';

// Define an interface for your environment variables
interface Config {
  PORT: number;
  DATABASE_URL: string;
  JWT_SECRET: string;
}

// Helper function to ensure variables are defined
function getEnvVar(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}

// Export a validated config object
export const config: Config = {
  PORT: parseInt(process.env.PORT || '3000', 10),
  DATABASE_URL: getEnvVar('DATABASE_URL'),
  JWT_SECRET: getEnvVar('JWT_SECRET'),
};