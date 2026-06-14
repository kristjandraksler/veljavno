'use client'

import { Button } from '@/components/ui/button'

const koraki = [
  {
    st: '01',
    naslov: 'Registrirajte se',
    opis: 'Ustvarite račun na Veljavno in nas kontaktirajte za vašo unikatno referral kodo.',
  },
  {
    st: '02',
    naslov: 'Delite s strankami',
    opis: 'Delite svojo kodo ali link z vašimi strankami, prijatelji ali sledilci.',
  },
  {
    st: '03',
    naslov: 'Zaslužite provizijo',
    opis: 'Za vsako uspešno prodajo prejmete 30% provizije — izplačilo vsak mesec.',
  },
]

const faqs = [
  {
    q: 'Koliko je provizija?',
    a: '30% od vsake prodaje ki pride prek vaše referral kode. Samostojni paket = 1,50 €, Družinski = 3,00 €.',
  },
  {
    q: 'Kdaj dobim izplačilo?',
    a: 'Izplačila so enkrat mesečno prek bančnega nakazila. Minimalni znesek za izplačilo je 10 €.',
  },
  {
    q: 'Kako dolgo velja referral?',
    a: 'Cookie traja 30 dni — če stranka kupi v 30 dneh od klika na vaš link, dobite provizijo.',
  },
  {
    q: 'Kdo se lahko prijavi?',
    a: 'Vsakdo — avtošole, agenti, blogerji, influencerji ali preprosto zadovoljne stranke ki priporočajo Veljavno.',
  },
]

export default function Affiliate() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <nav className="border-b border-border px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <svg width="32" height="40" viewBox="0 0 60 72" fill="none" xmlns="http://www.w3.org/2000/svg">
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
          <div className="flex items-center gap-6">
  <a href="/#paketi" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden md:block">Paketi</a>
  <a href="/#cakalna-lista" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden md:block">FAQ</a>
  <a href="/prijava" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-4 py-2 rounded-full border border-border hover:border-primary hidden md:block">Prijava</a>
  <a href="/registracija" className="text-sm font-semibold text-white bg-primary px-5 py-2 rounded-full hover:bg-primary/90 transition-colors">Registracija</a>
</div>
        </div>
      </nav>

      <section className="py-24 md:py-36 border-b border-border">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary">Affiliate program</p>
          <h1 className="font-display text-5xl font-bold tracking-[-0.04em] md:text-7xl mb-6">Zaslužite z Veljavno.</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">Priporočite Veljavno in zaslužite <span className="font-semibold text-foreground">30% provizije</span> za vsako uspešno prodajo. Brez omejitev, brez skritih pogojev.</p>
          <a href="#prijava" className="inline-block bg-primary text-white px-8 py-4 rounded-full text-sm font-semibold uppercase tracking-[0.16em] hover:bg-primary/90 transition-colors">
            Pridružite se →
          </a>
          <div className="flex justify-center gap-8 mt-12">
            {[
              { vrednost: '30%', opis: 'Provizija' },
              { vrednost: '30 dni', opis: 'Cookie trajanje' },
              { vrednost: '1x/mes', opis: 'Izplačilo' },
            ].map(s => (
              <div key={s.opis} className="text-center">
                <div className="text-3xl font-bold text-primary">{s.vrednost}</div>
                <div className="text-sm text-muted-foreground mt-1">{s.opis}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 border-b border-border">
        <div className="max-w-5xl mx-auto px-6">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary">Kako deluje</p>
          <h2 className="font-display text-4xl font-bold tracking-[-0.04em] mb-12">Tri preprosti koraki.</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {koraki.map(k => (
              <div key={k.st} className="bg-card border border-border rounded-2xl p-8">
                <div className="text-4xl font-bold text-primary/20 mb-4">{k.st}</div>
                <h3 className="text-xl font-bold mb-3">{k.naslov}</h3>
                <p className="text-muted-foreground">{k.opis}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-secondary/50 border-b border-border">
        <div className="max-w-5xl mx-auto px-6">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary">Idealni partnerji</p>
          <h2 className="font-display text-4xl font-bold tracking-[-0.04em] mb-12">Za koga je affiliate program?</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              { ikona: '🚗', naslov: 'Avtošole', opis: 'Vaši dijaki bodo kmalu potrebovali podaljšanje vozniške — priporočite jim Veljavno.' },
              { ikona: '📋', naslov: 'Agenti in posredniki', opis: 'Stranke ki urejajo registracije, zavarovanja ali potne liste.' },
              { ikona: '📱', naslov: 'Blogerji in influencerji', opis: 'Vsebina o potovanjih, avtih ali osebnih financah? Veljavno je idealen produkt.' },
              { ikona: '👥', naslov: 'Zadovoljne stranke', opis: 'Preprosto priporočite prijateljem in zaslužite za vsako prodajo.' },
            ].map(p => (
              <div key={p.naslov} className="bg-card border border-border rounded-2xl p-6 flex gap-4">
                <span className="text-3xl">{p.ikona}</span>
                <div>
                  <h3 className="font-semibold mb-1">{p.naslov}</h3>
                  <p className="text-sm text-muted-foreground">{p.opis}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="prijava" className="py-24 border-b border-border">
        <div className="max-w-xl mx-auto px-6">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary text-center">Prijava</p>
          <h2 className="font-display text-4xl font-bold tracking-[-0.04em] mb-4 text-center">Začnite danes.</h2>
          <p className="text-muted-foreground text-center mb-10">Registrirajte se in nas kontaktirajte za vašo unikatno referral kodo.</p>
          <div className="bg-card border border-border rounded-2xl p-8 text-center">
            <p className="text-muted-foreground mb-6">Za sodelovanje v affiliate programu potrebujete račun na Veljavno. Registrirajte se in nas kontaktirajte na <a href="mailto:info@veljavno.si" className="text-primary hover:underline">info@veljavno.si</a> za vašo referral kodo.</p>
            <a href="/registracija" className="inline-block bg-primary text-white px-8 py-4 rounded-full text-sm font-semibold uppercase tracking-[0.16em] hover:bg-primary/90 transition-colors">
              Registrirajte se →
            </a>
            <p className="text-xs text-muted-foreground mt-4">Že imate račun? <a href="/prijava" className="text-primary hover:underline">Prijavite se</a></p>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-3xl mx-auto px-6">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary">FAQ</p>
          <h2 className="font-display text-4xl font-bold tracking-[-0.04em] mb-12">Pogosta vprašanja.</h2>
          <div className="divide-y divide-border border-y border-border">
            {faqs.map(faq => (
              <details key={faq.q} className="group py-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-bold focus:outline-none">
                  <span>{faq.q}</span>
                  <span className="rounded-full border border-border px-3 py-1 text-xs font-semibold text-muted-foreground transition-colors group-hover:border-primary group-hover:text-primary">↓</span>
                </summary>
                <p className="mt-4 text-muted-foreground leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-8">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <span>© 2026 Veljavno. Vse pravice pridržane.</span>
          <div className="flex gap-6">
            <a href="/pogoji" className="hover:text-primary transition-colors">Splošni pogoji</a>
            <a href="/zasebnost" className="hover:text-primary transition-colors">Zasebnost</a>
            <a href="mailto:info@veljavno.si" className="hover:text-primary transition-colors">Kontakt</a>
          </div>
        </div>
      </footer>
    </main>
  )
}