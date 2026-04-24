import type { Message, TutorResponse, UserInfo } from '@thesis/types';
import { api } from './config';

interface TutorRequest {
  userInfo: UserInfo;
  question: string;
  history?: Message[];
}

export async function generateTutorResponse(data: TutorRequest): Promise<TutorResponse> {
  const res = await api.post('/chat/tutor/generate', data);
  return res.data.answer;
}
