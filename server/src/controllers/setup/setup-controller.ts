import type { Request, Response } from "express";
import type { InfoService } from "../../services/setup/info-service.js";

export class SetupController {

    constructor(private infoService: InfoService) {};

    async handleCreateInfo(req: Request, res: Response) {
        const {
            data
        } = req.body;

        const response = await this.infoService.addUserData(data);

        return res.status(response.status).json({userInfo: response.userInfo});
    };

    async handleUpdateInfo(req: Request, res: Response) {
        const {
            data, 
            id
        } = req.body; 

        const response = await this.infoService.updateUserData(data, id);

        return res.status(response.status).json({userInfo: response.data});
    }

    async handleGetInfo(req: Request, res: Response) {
        const {
            id
        } = req.params;

        const response = await this.infoService.getUserData(id as string);

        return res.status(response.status).json({userInfo: response.userInfo})
    }
};