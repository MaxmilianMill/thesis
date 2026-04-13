import type { Scenario } from "../../types/setup/scenario.js";
import type { UserInfo } from "../../types/setup/user-info.js";
import type { WithStatus } from "../../types/utils/with-status.js";

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

