import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog — Veljavno',
  description: 'Nasveti in informacije o dokumentih v Sloveniji.',
}

const clanki = [
  {
    slug: 'voznicko-dovoljenje-podaljsanje',
    naslov: 'Kdaj poteče vozniško dovoljenje in kako ga podaljšati',
    opis: 'Vse kar morate vedeti o podaljšanju vozniškega dovoljenja v Sloveniji — roki, postopek, stroški.',
    datum: '15. junij 2026',
    branje: '4 min',
    ikona: '🚗',
    kategorija: 'Vozilo',
  },
  {
    slug: 'osebna-izkaznica-podaljsanje',
    naslov: 'Osebna izkaznica — kdaj poteče in kaj potrebuješ za podaljšanje',
    opis: 'Popoln vodič za podaljšanje osebne izkaznice v Sloveniji — kje, kdaj in kako.',
    datum: '15. junij 2026',
    branje: '3 min',
    ikona: '🪪',
    kategorija: 'Osebni dokumenti',
  },
  {
    slug: 'potni-list-vse-kar-moras-vedeti',
    naslov: 'Potni list — vse kar moraš vedeti pred potovanjem',
    opis: 'Kdaj poteče potni list, kako ga podaljšati in zakaj je pomembno biti pravočasen.',
    datum: '15. junij 2026',
    branje: '4 min',
    ikona: '🌍',
    kategorija: 'Potovanja',
  },
]

export default function Blog() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <nav className="border-b border-border px-6 py-4 sticky top-0 z-50 bg-background/85 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <svg width="32" height="40" viewBox="0 0 60 72" fill="none">
              <rect x="0" y="0" width="60" height="72" rx="10" fill="#2563eb"/>
              <rect x="10" y="8" width="26" height="4" rx="2" fill="white" fillOpacity="0.5"/>
              <rect x="10" y="17" width="40" height="4" rx="2" fill="white" fillOpacity="0.35"/>
              <rect x="10" y="26" width="32" height="4" rx="2" fill="white" fillOpacity="0.35"/>
              <rect x="10" y="35" width="36" height="4" rx="2" fill="white" fillOpacity="0.35"/>
              <circle cx="43" cy="56" r="14" fill="white"/>
              <path d="M36 56 L41 61 L50 50" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div className="flex flex-col">
              <span className="font-display text-lg font-bold tracking-[0.08em] leading-tight">VELJAVNO</span>
              <span className="text-xs text-muted-foreground">Sistem za pravočasne opomnike</span>
              <div className="w-8 h-0.5 bg-primary mt-1" />
            </div>
          </a>
          <div className="flex items-center gap-3">
            <a href="/prijava" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-4 py-2 rounded-full border border-border hover:border-primary">Prijava</a>
            <a href="/registracija" className="text-sm font-semibold text-white bg-primary px-5 py-2 rounded-full hover:bg-primary/90 transition-colors">Registracija</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="bg-primary">
        <div className="max-w-4xl mx-auto px-6 py-16 text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-200 mb-3">Blog</p>
          <h1 className="font-display text-4xl font-bold tracking-[-0.04em] mb-4 md:text-5xl">Nasveti o dokumentih 📋</h1>
          <p className="text-blue-100 text-lg max-w-xl">Vse kar morate vedeti o dokumentih v Sloveniji — roki, postopki, nasveti.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-16">
          {[
            { stevilo: '3', opis: 'Članki' },
            { stevilo: '11', opis: 'Minut branja' },
            { stevilo: '100%', opis: 'Brezplačno' },
          ].map(s => (
            <div key={s.opis} className="bg-card border border-border rounded-2xl p-5 text-center">
              <p className="text-2xl font-bold text-primary">{s.stevilo}</p>
              <p className="text-sm text-muted-foreground mt-1">{s.opis}</p>
            </div>
          ))}
        </div>

        {/* Članki */}
        <div className="flex flex-col gap-6">
          {clanki.map((clanek, i) => (
            
              key={clanek.slug}
              href={`/blog/${clanek.slug}`}
              className="group bg-card border border-border rounded-2xl p-8 hover:border-primary hover:shadow-lg hover:shadow-primary/5 transition-all"
            >
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-2xl">
                  {clanek.ikona}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <span className="text-xs font-semibold bg-primary/10 text-primary px-3 py-1 rounded-full">{clanek.kategorija}</span>
                    <span className="text-xs text-muted-foreground">{clanek.datum}</span>
                    <span className="text-xs text-muted-foreground">·</span>
                    <span className="text-xs text-muted-foreground">{clanek.branje} branja</span>
                  </div>
                  <h2 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors leading-snug">{clanek.naslov}</h2>
                  <p className="text-muted-foreground leading-relaxed">{clanek.opis}</p>
                  <div className="mt-4 flex items-center gap-2 text-primary text-sm font-medium">
                    <span>Preberi več</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="group-hover:translate-x-1 transition-transform">
                      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                    </svg>
                  </div>
                </div>
                <div className="hidden md:flex flex-shrink-0 w-8 h-8 rounded-full border border-border items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-all">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                  </svg>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 bg-primary rounded-[2rem] p-10 text-white text-center">
          <p className="text-2xl font-bold mb-3">Ne pozabite na opomnike 🔔</p>
          <p className="text-blue-100 mb-6">Preberete vodič in takoj nastavite opomnik — preden pozabite.</p>
          <a href="/registracija" className="inline-block bg-white text-primary font-semibold px-8 py-3 rounded-full hover:bg-blue-50 transition-colors text-sm uppercase tracking-[0.16em]">
            Začni za 4,99 € →
          </a>
        </div>
      </div>

      <footer className="border-t border-border py-8 mt-8">
        <div className="max-w-4xl mx-auto px-6 flex justify-between items-center text-sm text-muted-foreground">
          <span>© 2026 Veljavno</span>
          <a href="/" className="hover:text-primary transition-colors">Domov</a>
        </div>
      </footer>
    </main>
  )
}