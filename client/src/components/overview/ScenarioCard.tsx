import type { Scenario } from '@thesis/types';

interface ScenarioCardProps {
  scenario: Scenario;
}

export function ScenarioCard({ scenario }: ScenarioCardProps) {
  return (
    <div
      className="relative w-full h-40 md:h-48 rounded-t-xl overflow-hidden bg-accent"
      style={
        scenario.imgPath
          ? { backgroundImage: `url(${scenario.imgPath})`, backgroundSize: 'cover', backgroundPosition: 'center' }
          : undefined
      }
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />

      <div className="absolute inset-0 flex flex-col justify-between p-4">
        <span className="text-xs text-foreground/70 font-medium">Next Scenario</span>

        <div className="flex flex-col gap-2">
          <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">
            {scenario.title}
          </h2>
          <span className="inline-flex w-fit items-center rounded bg-secondary/90 px-2 py-0.5 text-xs font-semibold text-secondary-foreground">
            B1
          </span>
        </div>
      </div>
    </div>
  );
}
