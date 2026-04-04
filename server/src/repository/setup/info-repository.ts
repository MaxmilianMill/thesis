import { MongoError, ObjectId } from "mongodb";
import { getDB } from "../../db/config.js";
import type { UserInfo } from "../../types/setup/user-info.js";
import type { WithStatus } from "../../types/utils/with-status.js";

const INFO_COLLECTION = "info";

async function addInfoData(userInfo: UserInfo): Promise<WithStatus<"userInfo", UserInfo>> {
    const db = getDB();
    const response = await db
        .collection(INFO_COLLECTION)
        .insertOne(userInfo);

    if (!response.acknowledged)
        throw new MongoError("Unable to add info to db.");

    return {userInfo, status: 201};
};

async function updateInfoData(
    partialData: Partial<UserInfo>, id: string
): Promise<WithStatus<"data", Partial<UserInfo>>> {
    const db = getDB();
    const response = await db
        .collection(INFO_COLLECTION)
        .updateOne({_id: new ObjectId(id)}, {$set: partialData});

    if (response.matchedCount !== 1) 
        throw new MongoError("No document found to update.");

    return {data: partialData, status: 200};
};

async function getInfoData(
    uid: string
): Promise<WithStatus<"userInfo", UserInfo>> {
    const db = getDB();
    const response = await db
        .collection(INFO_COLLECTION)
        .findOne<UserInfo>({uid: uid})

    if (!response)
        throw new MongoError("Document does not exist.")

    return {userInfo: response, status: 200};
}

export {
    addInfoData,
    updateInfoData,
    getInfoData
}
