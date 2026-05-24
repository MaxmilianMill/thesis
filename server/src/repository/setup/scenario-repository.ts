import type { Scenario } from "@thesis/types";
import type { UserInfo } from "@thesis/types";
import type { WithStatus } from "@thesis/types";
import { countChats } from "../chat/chat-repository.js";
import { STATIC_SCENARIOS } from "../../data/static-data.js";

async function getScenario(
    userInfo: UserInfo
): Promise<WithStatus<"scenario", Scenario>> {

    const chatCount = await countChats(userInfo.uid);
    const index = Math.min(chatCount, STATIC_SCENARIOS.length - 1);
    const scenario = STATIC_SCENARIOS[index] ?? STATIC_SCENARIOS[0]!;

    return { status: 200, scenario };
};

export {
    getScenario
};
