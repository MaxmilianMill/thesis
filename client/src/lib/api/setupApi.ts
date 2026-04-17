import { HttpStatusCode } from "axios";
import { api } from "./config";
import type { Level, UserInfo } from "@thesis/types";

export interface SetupData {
  level: Level;
  interests: string[];
}

export async function submitSetup(
  data: Partial<UserInfo>
): Promise<UserInfo | undefined> {
  return api.post("/setup/create", {data}).then((res) => {

    if (res.status !== HttpStatusCode.Created)
      return;

    return res.data.userInfo;
  }).catch((error) => {
    console.error(error.message);
    return;
  })
}

/** Returns the updatedFields if update was successful */
export async function updateSetup(
  data: Partial<UserInfo>,
  /**Id of the userInfo doc */
  docId: string
): Promise<Partial<UserInfo> | undefined> {
  return api.post("/setup/update", {data, id: docId}).then((res) => {

    if (res.status !== HttpStatusCode.Ok)
      return; 

    return res.data.data;
  }).catch((error) => {
    console.error(error.message);
    return;
  })
}
