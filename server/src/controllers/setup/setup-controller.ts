import type { Request, Response } from "express";
import type { InfoService } from "../../services/setup/info-service.js";
import type { ScenarioService } from "../../services/setup/scenario-service.js";
import type { AuthRequest } from "../../middlewares/auth-handler.js";

export class SetupController {

    constructor(
        private infoService: InfoService,
        private scenarioService: ScenarioService
    ) {};

    async handleCreateInfo(req: AuthRequest, res: Response) {
        const {
            data
        } = req.body;

        const {uid} = req.authToken;

        const response = await this.infoService.addUserData({...data, uid});

        return res.status(response.status).json({userInfo: response.userInfo});
    };

    async handleUpdateInfo(req: AuthRequest, res: Response) {
        const {
            data
        } = req.body; 

        const {uid} = req.authToken;

        const response = await this.infoService.updateUserData(data, uid);

        return res.status(response.status).json({userInfo: response.data});
    }

    async handleGetInfo(req: AuthRequest, res: Response) {
        const {
            uid
        } = req.authToken;

        const response = await this.infoService.getUserData(uid);

        return res.status(response.status).json({userInfo: response.userInfo})
    }

    async handleGetScenario(req: Request, res: Response) {

        const {
            userInfo
        } = req.body;

        const {status, scenario} = await this.scenarioService.getScenario(userInfo);

        return res.status(status).json({scenario});
    }
};