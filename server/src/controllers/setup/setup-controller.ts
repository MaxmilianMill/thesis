import type { Request, Response } from "express";
import infoService from "../../services/setup/info-service.js";

class SetupController {
    async handleCreateInfo(req: Request, res: Response) {

        const {
            data
        } = req.body;

        const response = await infoService.addUserData(data);

        return res.status(response.status).json({userInfo: response.userInfo});
    };

    async handleUpdateInfo(req: Request, res: Response) {

        const {
            data, 
            id
        } = req.body; 

        const response = await infoService.updateUserData(data, id);

        return res.status(response.status).json({data: response.data});
    }

    async handleGetInfo(req: Request, res: Response) {

    }
};

export default new SetupController();