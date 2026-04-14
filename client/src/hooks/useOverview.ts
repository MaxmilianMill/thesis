import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Scenario, Partner, TaskList } from '@thesis/types';
import { fetchOverviewData, generateTasks } from '@/lib/api/overviewApi';

type OverviewState = 'overview' | 'loading' | 'tasks';

export function useOverview() {
  const navigate = useNavigate();
  const [overviewState, setOverviewState] = useState<OverviewState>('overview');
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [partner, setPartner] = useState<Partner | null>(null);
  const [tasks, setTasks] = useState<TaskList | null>(null);

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

  function handleStartSpeaking() {
    navigate('/chat');
  }

  return {
    overviewState,
    scenario,
    partner,
    tasks,
    handleGenerateTasks,
    handleStartSpeaking,
  };
}
