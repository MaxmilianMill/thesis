import { HttpStatusCode } from "axios";
import { api } from "./config";
import type { LinguisticStore } from "@thesis/types";

export async function updateLinguisticStore(
    chatId: string | undefined
): Promise<LinguisticStore | undefined> {
    return api.post("/linguistics/update", {chatId}).then((res) => {
        if (res.status !== HttpStatusCode.Ok) 
            return undefined;

        console.log(res.data.store)

        return res.data.store;
    }).catch((error) => {
        console.error(error.message);
        return undefined;
    });
}