import { HttpStatusCode } from "axios";
import { api } from "./config";
import type { User } from "@thesis/types";

async function authenticate(): Promise<User | undefined> {
    return api.post("/auth/create").then((res) => {
        if (res.status != HttpStatusCode.Created)
            return undefined;

        return res.data.user as User;
    }).catch((error) => {
        console.error(error.message);
        return undefined;
    })
};

export {
    authenticate
}