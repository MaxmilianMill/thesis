import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Scenario, Partner, TaskList, Chat } from '@thesis/types';
import { fetchOverviewData, generateTasks } from '@/lib/api/overviewApi';
import { useChatSelectors } from '@/contexts/useChatStore';
import { createChat } from '@/lib/api/chatApi';

type OverviewState = 'overview' | 'loading' | 'tasks';

export function useOverview() {
  const navigate = useNavigate();
  const [overviewState, setOverviewState] = useState<OverviewState>('overview');
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [partner, setPartner] = useState<Partner | null>(null);
  const [tasks, setTasks] = useState<TaskList | null>(null);
  const setChat = useChatSelectors.use.setChat();


  useEffect(() => {
    fetchOverviewData().then(({ scenario, partner }) => {
      setScenario(scenario);
      setPartner(partner);
    });
  }, []);

  async function handleGenerateTasks() {
    if (!scenario) return;
    setOverviewState('loading');
    const result = await generateTasks(scenario);
    setTasks(result);
    setOverviewState('tasks');
  }

  const handleStartSpeaking = useCallback(async () => {
    
    const newChat = await createChat({
      taskList: tasks,
      scenario: scenario
    } as Chat);

    if(!newChat) return;

    setChat(newChat);
    navigate("/chat");
  }, [scenario, tasks, setChat, navigate])

  return {
    overviewState,
    scenario,
    partner,
    tasks,
    handleGenerateTasks,
    handleStartSpeaking,
  };
}
