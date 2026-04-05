import type { Document, WithId } from "mongodb";

export function transformChatDoc<T>(response: WithId<Document>, schema: any): T {
    // Transform MongoDB document to match the schema
    const transformedDoc = {
        ...response,
        id: response._id.toString(),
        _id: undefined,
    };

    // Validate and type the document
    const parseResult = schema.safeParse(transformedDoc);
    if (!parseResult.success) {
        throw new Error(`Invalid chat document: ${parseResult.error.message}`);
    };

    return parseResult.data
}