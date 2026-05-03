import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Scenario, Partner, TaskList, Chat } from '@thesis/types';
import { fetchOverviewData, generateTasks } from '@/lib/api/overviewApi';
import { useChatSelectors } from '@/contexts/useChatStore';
import { createChat } from '@/lib/api/chatApi';
import { useSetupSelectors } from '@/contexts/useSetupStore';

type OverviewState = 'overview' | 'loading' | 'tasks';

export function useOverview() {
  const navigate = useNavigate();
  const [overviewState, setOverviewState] = useState<OverviewState>('overview');
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [partner, setPartner] = useState<Partner | null>(null);
  const [tasks, setTasks] = useState<TaskList | null>(null);
  const [preparedChat, setPreparedChat] = useState<Chat | null>(null);
  const setChat = useChatSelectors.use.setChat();
  const userInfo = useSetupSelectors.use.userInfo();

  useEffect(() => {
    if (!userInfo) return;

    console.log("Generate scenario...");

    fetchOverviewData(userInfo).then((data) => {
      if (!data) return;
      setScenario(data.scenario);
      console.log(data.scenario);
      setPartner(data.partner);
    });
  }, []);

  const handleGenerateTasks = useCallback(async () => {
    if (!scenario) return;
    setOverviewState('loading');

    const newChat = await createChat({ scenario } as Partial<Chat>);
    console.log(newChat);
    if (!newChat) return;

    const taskList = await generateTasks(newChat.id, scenario);
    console.log(taskList)
    if (!taskList) return;

    setTasks(taskList);
    setPreparedChat({ ...newChat, taskList });
    setOverviewState('tasks');
  }, [scenario]);

  const handleStartSpeaking = useCallback(() => {
    if (!preparedChat) return;
    setChat(preparedChat);
    navigate("/chat");
  }, [preparedChat, setChat, navigate]);

  return {
    overviewState,
    scenario,
    partner,
    tasks,
    handleGenerateTasks,
    handleStartSpeaking,
  };
}
