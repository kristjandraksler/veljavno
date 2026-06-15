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
  },
  {
    slug: 'osebna-izkaznica-podaljsanje',
    naslov: 'Osebna izkaznica — kdaj poteče in kaj potrebuješ za podaljšanje',
    opis: 'Popoln vodič za podaljšanje osebne izkaznice v Sloveniji — kje, kdaj in kako.',
    datum: '15. junij 2026',
    branje: '3 min',
  },
  {
    slug: 'potni-list-vse-kar-moras-vedeti',
    naslov: 'Potni list — vse kar moraš vedeti pred potovanjem',
    opis: 'Kdaj poteče potni list, kako ga podaljšati in zakaj je pomembno biti pravočasen.',
    datum: '15. junij 2026',
    branje: '4 min',
  },
]

export default function Blog() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <nav className="border-b border-border px-6 py-4">
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
          <a href="/registracija" className="text-sm font-semibold text-white bg-primary px-5 py-2 rounded-full hover:bg-primary/90 transition-colors">Registracija</a>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-16">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary mb-3">Blog</p>
        <h1 className="font-display text-4xl font-bold tracking-[-0.04em] mb-4">Nasveti o dokumentih</h1>
        <p className="text-muted-foreground text-lg mb-12">Vse kar morate vedeti o dokumentih v Sloveniji.</p>

        <div className="flex flex-col gap-6">
          {clanki.map(clanek => (
            <a key={clanek.slug} href={`/blog/${clanek.slug}`} className="bg-card border border-border rounded-2xl p-8 hover:border-primary transition-colors group">
              <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                <span>{clanek.datum}</span>
                <span>·</span>
                <span>{clanek.branje} branja</span>
              </div>
              <h2 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{clanek.naslov}</h2>
              <p className="text-muted-foreground">{clanek.opis}</p>
              <p className="text-primary text-sm mt-4 font-medium">Preberi več →</p>
            </a>
          ))}
        </div>
      </div>

      <footer className="border-t border-border py-8 mt-20">
        <div className="max-w-4xl mx-auto px-6 flex justify-between items-center text-sm text-muted-foreground">
          <span>© 2026 Veljavno</span>
          <a href="/" className="hover:text-primary transition-colors">Domov</a>
        </div>
      </footer>
    </main>
  )
}