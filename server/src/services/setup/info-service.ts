import { addInfoData, getInfoData, updateInfoData } from "../../repository/setup/info-repository.js";
import type { UserInfo } from "../../types/setup/user-info.js";

export class InfoService {

    async addUserData(data: UserInfo) {
        return await addInfoData(data);
    };

    async updateUserData(data: UserInfo, id: string) {
        return await updateInfoData(data, id);
    };

    async getUserData(id: string) {
        return await getInfoData(id);
    }
};