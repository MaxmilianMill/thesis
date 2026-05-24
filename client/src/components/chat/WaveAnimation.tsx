const DELAYS = ['0ms', '120ms', '240ms', '120ms', '0ms'];

export function WaveAnimation() {
  return (
    <div className="flex items-center gap-[3px] h-5">
      {DELAYS.map((delay, i) => (
        <div
          key={i}
          className="w-1 rounded-full bg-primary-foreground"
          style={{
            height: '100%',
            transformOrigin: 'center',
            animation: 'wave-bar 0.8s ease-in-out infinite',
            animationDelay: delay,
          }}
        />
      ))}
    </div>
  );
}
