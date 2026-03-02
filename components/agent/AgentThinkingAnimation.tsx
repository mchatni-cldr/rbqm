'use client'

export function AgentThinkingAnimation({ message = 'Agent is processing...' }: { message?: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-violet-200 bg-violet-50 px-4 py-3">
      <div className="flex gap-1">
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className="h-2 w-2 rounded-full bg-violet-500"
            style={{
              animation: `bounce 1.2s ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>
      <span className="text-sm text-violet-700 font-medium">{message}</span>
      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 1; }
          30% { transform: translateY(-6px); opacity: 0.7; }
        }
      `}</style>
    </div>
  )
}
