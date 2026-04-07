import type { infer as ZodInfer, ZodTypeAny } from "zod";

export function validateSchema<S extends ZodTypeAny>(rawData: any, schema: S): ZodInfer<S> {
    const jsonResponse = JSON.parse(rawData);
    const validatedResponse = schema.safeParse(jsonResponse);

    if (!validatedResponse.success)
        throw new Error(validatedResponse.error.message);

    return validatedResponse.data;
};