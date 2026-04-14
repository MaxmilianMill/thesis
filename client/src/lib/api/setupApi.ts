import { HttpStatusCode } from "axios";
import { api } from "./config";
import type { UserInfo } from "@thesis/types";

export interface SetupData {
  level: string;
  interests: string[];
}

export async function submitSetup(
  _data: SetupData
): Promise<UserInfo | undefined> {
  return api.post("/setup/create", {..._data}).then((res) => {

    if (res.status !== HttpStatusCode.Created)
      return;

    return res.data.userInfo;
  }).catch((error) => {
    console.error(error.message);
    return;
  })
}
