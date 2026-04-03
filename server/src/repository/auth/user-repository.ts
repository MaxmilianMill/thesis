import { MongoError } from "mongodb";
import { getDB } from "../../db/config.js";
import type { User } from "../../types/auth/user.js";

const USER_COLLECTION = "users";

async function addUser(_user: Omit<User, "createdAt">) {
    const user: User = {..._user, createdAt: new Date()};
    const db = getDB();
    const response = await db
        .collection(USER_COLLECTION)
        .insertOne(user);

    if (!response.acknowledged)
        throw new MongoError("Unable to create user.");

    return user;
};

/**
 * Ensures that an equal amount of users is in both groups. 
 * Therefore, we check the group of the latest created user and return the opposite group.
 * This way, we switch between both groups after each assignment.
 */
async function getLastUser() {
    const db = getDB();
    const result = await db
        .collection<User>(USER_COLLECTION)
        .findOne(
            {},
            { sort: {createdAt: -1}}
        );
    
    if (result === null)
        return; 

    return result;
};

export {
    addUser,
    getLastUser
}

