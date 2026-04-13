import { getScenario } from "../../repository/setup/scenario-repository.js";
import type { UserInfo } from "@thesis/types";

export class ScenarioService {

    async getScenario(userInfo: UserInfo) {
        return await getScenario(userInfo);
    };
};