import { getDB } from "../../db/config.js";
import type { ActivityLog } from "../../services/logger/activity-logger-service.js";

const ACTIVITY_LOG_COLLECTION = "activity_logs";

async function saveAcitivtyLog(log: ActivityLog) {

    const db = getDB();
    // Fire and forget: We don't await this so it doesn't slow down the API response
    const response = await db.collection(ACTIVITY_LOG_COLLECTION).insertOne(log);

    if (!response.insertedId)
        console.error('MongoDB Insert Error');
}

export {
    saveAcitivtyLog
}