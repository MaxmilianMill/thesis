import type { Scenario, Partner, TaskList, UserInfo } from '@thesis/types';
import { api } from './config';
import { HttpStatusCode } from 'axios';

export type OverviewData = {
  scenario: Scenario;
  partner: Partner;
};

const MOCK_PARTNER: Partner = {
  voiceConfig: { voiceName: 'Samira', languageCode: 'en-US' },
  personalityDescription: 'Helpful',
  color: 'skin-medium',
  hair: 'hair-straight',
  eyes: 'eyes-round',
  nose: 'nose-button',
  mouth: 'mouth-smile',
};

export async function fetchOverviewData(userInfo: UserInfo): Promise<OverviewData | undefined> {

  return api.post("/setup/scenario", {userInfo}).then((res) => {
    if (res.status != HttpStatusCode.Ok)
      return undefined;

    return {scenario: res.data.scenario, partner: MOCK_PARTNER};
  }).catch((error) => {
    console.error(error.message);
    return undefined;
  });
}

export async function generateTasks(chatId: string, _scenario: Scenario): Promise<TaskList | undefined> {
  console.log(chatId);
  console.log(_scenario);
  return api.post("/chat/tasks/generate", {
    chatId,
    scenario: _scenario
  }).then((res) => {
    if (res.status != HttpStatusCode.Created)
      return undefined;

    return res.data.taskList;
  }).catch((error) => {
    console.error(error.message);
    return undefined;
  });
}
