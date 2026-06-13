export default function NotFound() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-5">
      <div className="w-full max-w-md text-center">
        <a href="/" className="flex items-center gap-3 justify-center mb-10">
          <svg width="36" height="44" viewBox="0 0 60 72" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="60" height="72" rx="10" fill="#2563eb"/>
            <rect x="10" y="8" width="26" height="4" rx="2" fill="white" fillOpacity="0.5"/>
            <rect x="10" y="17" width="40" height="4" rx="2" fill="white" fillOpacity="0.35"/>
            <rect x="10" y="26" width="32" height="4" rx="2" fill="white" fillOpacity="0.35"/>
            <rect x="10" y="35" width="36" height="4" rx="2" fill="white" fillOpacity="0.35"/>
            <circle cx="43" cy="56" r="14" fill="white"/>
            <path d="M36 56 L41 61 L50 50" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div className="flex flex-col items-start">
            <span className="font-display text-xl font-bold tracking-[0.08em] leading-tight">VELJAVNO</span>
            <span className="text-xs text-muted-foreground">Sistem za pravočasne opomnike</span>
            <div className="w-8 h-0.5 bg-primary mt-1" />
          </div>
        </a>

        <div className="text-8xl font-bold text-primary mb-4">404</div>
        <h1 className="text-2xl font-bold mb-2">Stran ni najdena</h1>
        <p className="text-muted-foreground mb-8">Stran ki jo iščete ne obstaja ali je bila premaknjena.</p>

        <div className="flex gap-3 justify-center">
          <a href="/" className="bg-primary text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-primary/90 transition-colors">
            Domov
          </a>
          <a href="/dashboard" className="border border-border px-6 py-2 rounded-full text-sm font-semibold hover:bg-secondary transition-colors">
            Dashboard
          </a>
        </div>
      </div>
    </main>
  )
}