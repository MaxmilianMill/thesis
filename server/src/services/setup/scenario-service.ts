import { getScenario } from "../../repository/setup/scenario-repository.js";
import type { UserInfo } from "../../types/setup/user-info.js";

export class ScenarioService {

    async getScenario(userInfo: UserInfo) {
        return await getScenario(userInfo);
    };
};