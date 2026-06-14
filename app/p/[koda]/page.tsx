import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'

export default async function PartnerPage({ params }: { params: Promise<{ koda: string }> }) {
  const { koda } = await params

  const { data: profil } = await supabase
    .from('profiles')
    .select('ime, affiliate_koda')
    .eq('affiliate_koda', koda.toUpperCase())
    .single()

  if (!profil) notFound()

  const ime = profil.ime?.split(' ')[0] || 'Partner'
  const affiliateKoda = profil.affiliate_koda

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col">
      <nav className="border-b border-border px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
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
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="max-w-lg w-full text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">👋</span>
          </div>

          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary mb-3">Posebno priporočilo</p>
          <h1 className="font-display text-4xl font-bold tracking-[-0.04em] mb-4">
            {ime} vam priporoča Veljavno.
          </h1>
          <p className="text-muted-foreground text-lg mb-8">
            Nikoli več potekle vozniške, osebne ali potnega lista. Dodajte dokumente enkrat in prejmite e-mail opomnik pravočasno.
          </p>

          <div className="flex flex-col gap-3 mb-8">
            {['🚗 Vozniško dovoljenje', '🪪 Osebna izkaznica', '🌍 Potni list'].map(d => (
              <div key={d} className="flex items-center gap-3 text-sm text-muted-foreground bg-card border border-border rounded-xl px-4 py-3">
                <span className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </span>
                {d}
              </div>
            ))}
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 mb-6">
            <p className="text-sm text-muted-foreground mb-1">Vaša referral koda</p>
            <p className="text-2xl font-bold tracking-widest text-primary mb-4">{affiliateKoda}</p>
            <a href={`/registracija?ref=${affiliateKoda}`} className="block w-full bg-primary text-white text-center py-4 rounded-full text-sm font-semibold uppercase tracking-[0.16em] hover:bg-primary/90 transition-colors">
              Začni z Veljavno →
            </a>
            <p className="text-xs text-muted-foreground mt-3">Enkratno plačilo · Brez naročnine · Od 4,99 €</p>
          </div>

          <a href="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            Izvedite več o Veljavno →
          </a>
        </div>
      </div>
    </main>
  )
}