import type { Request, Response } from "express";
import type { InfoService } from "../../services/setup/info-service.js";
import type { ScenarioService } from "../../services/setup/scenario-service.js";
import type { AuthRequest } from "../../middlewares/auth-handler.js";
import type { LinguisticStateService } from "../../services/linguistics/linguistic-state-service.js";
import { log } from "../../services/logger/activity-logger-service.js";

export class SetupController {

    constructor(
        private infoService: InfoService,
        private scenarioService: ScenarioService,
        private linguisticStoreService: LinguisticStateService
    ) {};

    async handleCreateInfo(req: AuthRequest, res: Response) {
        const {
            data
        } = req.body;

        const {uid} = req.authToken;

        const response = await this.infoService.addUserData({...data, uid});

        // trigger the linguistic store creation
        this.linguisticStoreService.update({uid});

        log({
            action: "info_created",
            status: "success",
            uid
        })

        return res.status(response.status).json({userInfo: response.userInfo});        
    };

    async handleUpdateInfo(req: AuthRequest, res: Response) {
        const {
            data
        } = req.body; 

        const {uid} = req.authToken;

        const response = await this.infoService.updateUserData(data, uid);

        log({
            action: "info_updated",
            status: "success",
            uid
        })

        return res.status(response.status).json({userInfo: response.data});
    }

    async handleGetInfo(req: AuthRequest, res: Response) {
        const {
            uid
        } = req.authToken;

        const response = await this.infoService.getUserData(uid);

        log({
            action: "get_info",
            status: "success",
            uid
        })

        return res.status(response.status).json({userInfo: response.userInfo})
    }

    async handleGetScenario(req: Request, res: Response) {

        const {
            userInfo
        } = req.body;

        const {status, scenario} = await this.scenarioService.getScenario(userInfo);

        log({
            action: "get_scenario",
            status: "success",
            uid: userInfo.uid
        })

        return res.status(status).json({scenario});
    }
};