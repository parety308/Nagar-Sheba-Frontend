export function AnimatedCheck({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" className="opacity-30" />
      <path d="M7 12.5l3.2 3.2L17 9" pathLength={30} className="animate-draw" />
    </svg>
  );
}