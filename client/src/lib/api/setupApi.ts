export interface SetupData {
  level: string;
  interests: string[];
}

export async function submitSetup(_data: SetupData): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), 500);
  });
}
