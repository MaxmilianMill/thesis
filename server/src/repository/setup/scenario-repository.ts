import type { Scenario } from "@thesis/types";
import type { UserInfo } from "@thesis/types";
import type { WithStatus } from "@thesis/types";

async function getScenario(
    userInfo: UserInfo
): Promise<WithStatus<"scenario", Scenario>> {

    return {
        status: 200,
        scenario: {
            title: "Ordering coffee",
            aiDescription: "Act like a coffee barista",
            userDescription: "Practice ordering coffee"
        }
    };
};

export {
    getScenario
};

