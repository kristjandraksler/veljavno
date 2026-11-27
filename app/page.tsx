'use client'

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, Mail, Plus, Clock3, ArrowRight } from 'lucide-react';

const plans = [
  {
    name: 'Samostojni',
    price: '4,99 €',
    note: 'enkratno, brez naročnine',
    features: ['1 oseba', 'Neomejeni dokumenti in roki', 'E-mail opomniki', 'Izvoz v koledar'],
    popular: false,
    variant: 'samostojni',
  },
  {
    name: 'Družinski',
    price: '9,99 €',
    note: 'enkratno, le 1,67 € na osebo',
    features: ['Do 6 oseb', 'Neomejeni dokumenti in roki', 'E-mail opomniki', 'Izvoz v koledar', 'Skupni pregled družine'],
    popular: true,
    variant: 'druzinski',
  },
];

const steps = [
  { icon: Plus, title: 'Dodaj rok', text: 'Tehnični pregled, zavarovanje, zdravstvena kartica, garancija, osebni dokumenti — karkoli ima datum poteka.' },
  { icon: Clock3, title: 'Nastavi opomnik', text: 'Izberite opomnik 1 teden, 1 mesec, 3 mesece ali 6 mesecev prej.' },
  { icon: Mail, title: 'Prejmi e-mail', text: 'Veljavno vas pravočasno opozori, še preden rok poteče.' },
];

const zaKoga = [
  { ikona: '🚗', naslov: 'Lastniki vozil', tekst: 'Tehnični pregled, registracija in zavarovanje na enem mestu, za vsako vozilo posebej.' },
  { ikona: '👨‍👩‍👧‍👦', naslov: 'Družine', tekst: 'Dokumenti in roki vseh članov družine v skupnem pregledu, do 6 oseb.' },
  { ikona: '💼', naslov: 'Samostojni podjetniki', tekst: 'Licence, potrdila, zavarovanja in pogodbe, ki jih ne smete zamuditi.' },
];

const faqs = [
  { q: 'Zakaj ne uporabim eUprave?', a: 'eUprava ponuja brezplačen e-opomnik o poteku osebnih dokumentov in je dobra izbira za to. Veljavno je namenjeno tistim, ki želijo vse roke na enem mestu: tudi vozilo, zavarovanje in garancije, ter pregled za celo družino. Prijava ne zahteva SI-PASS ali digitalnega potrdila.' },
  { q: 'Kateri dokumenti in roki so podprti?', a: 'Vsi z datumom poteka: vozniško dovoljenje, osebna izkaznica, potni list, zdravstvena kartica, tehnični pregled, registracija, zavarovanja, garancije in drugo.' },
  { q: 'Kdaj točno dobim opomnik?', a: 'Vi izberete: 1 teden, 1 mesec, 3 mesece ali 6 mesecev pred potekom.' },
  { q: 'Ali je plačilo varno?', a: 'Plačilo poteka prek Stripe, ki je eden najvarnejših plačilnih sistemov na svetu.' },
  { q: 'Ali deluje na mobitelu?', a: 'Da, deluje na računalniku, tablici in telefonu.' },
  { q: 'Ali moram plačevati vsako leto?', a: 'Ne. Plačate enkrat. Brez naročnine, brez skritih stroškov.' },
];

function scrollToPackages() {
  document.getElementById('paketi')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

const Kljukica = () => (
  <span className="w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center">
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
  </span>
)

const Krizec = () => (
  <span className="w-5 h-5 bg-red-500/20 rounded-full flex items-center justify-center">
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="3" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
  </span>
)

function Celica({ v }: { v: boolean | string }) {
  if (typeof v === 'string') return <span className="text-xs font-semibold text-center">{v}</span>
  return v ? <Kljukica /> : <Krizec />
}

const primerjava: { funkcija: string; veljavno: boolean | string; eUprava: boolean | string; koledar: boolean | string }[] = [
  { funkcija: 'Samodejni opomnik o poteku osebnih dokumentov', veljavno: true, eUprava: true, koledar: false },
  { funkcija: 'Poljubni roki (zavarovanje, tehnični pregled, garancije)', veljavno: true, eUprava: false, koledar: true },
  { funkcija: 'Pregled vse družine na enem mestu', veljavno: true, eUprava: false, koledar: false },
  { funkcija: 'Prijava brez SI-PASS ali digitalnega potrdila', veljavno: true, eUprava: false, koledar: true },
  { funkcija: 'Cena', veljavno: '4,99 € enkratno', eUprava: 'Brezplačno', koledar: 'Brezplačno' },
]

export default function Home() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [mobileMenu, setMobileMenu] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const ref = params.get('ref')
    if (ref) localStorage.setItem('affiliate-ref', ref)
    const seen = localStorage.getItem('welcome-seen')
    if (!seen) {
      const timer = setTimeout(() => setShowWelcome(true), 3000)
      return () => clearTimeout(timer)
    }
  }, [])

  function zapriWelcome() {
    localStorage.setItem('welcome-seen', 'true')
    setShowWelcome(false)
  }

  const handleWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('loading');
    const { error } = await supabase.from('waitlist').insert({ email: email.trim() });
    setEmail('');
    if (error) setStatus('error');
    else setStatus('success');
  };

  return (
    <main className="min-h-screen bg-background text-foreground overflow-hidden">

      {/* Nav */}
      <nav className="fixed left-0 right-0 top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 md:px-8">
         <a href="#top" className="flex items-center gap-3">
  <svg width="36" height="44" viewBox="0 0 60 72" fill="none">
    <rect x="0" y="0" width="60" height="72" rx="10" fill="#2563eb"/>
    <rect x="10" y="8" width="26" height="4" rx="2" fill="white" fillOpacity="0.5"/>
    <rect x="10" y="17" width="40" height="4" rx="2" fill="white" fillOpacity="0.35"/>
    <rect x="10" y="26" width="32" height="4" rx="2" fill="white" fillOpacity="0.35"/>
    <rect x="10" y="35" width="36" height="4" rx="2" fill="white" fillOpacity="0.35"/>
    <circle cx="43" cy="56" r="14" fill="white"/>
    <path d="M36 56 L41 61 L50 50" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
  <div className="flex flex-col">
    <span className="font-display text-xl font-bold tracking-[0.08em] leading-tight">VELJAVNO</span>
    <span className="text-xs text-muted-foreground">Sistem za pravočasne opomnike</span>
    <div className="w-8 h-0.5 bg-primary mt-1" />
  </div>
</a>
          <div className="hidden md:flex items-center gap-1">
            <button onClick={() => document.getElementById('paketi')?.scrollIntoView({ behavior: 'smooth' })} className="text-sm text-muted-foreground hover:text-foreground transition-colors px-4 py-2 rounded-full hover:bg-secondary">Paketi</button>
            <button onClick={() => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' })} className="text-sm text-muted-foreground hover:text-foreground transition-colors px-4 py-2 rounded-full hover:bg-secondary">FAQ</button>
            <a href="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors px-4 py-2 rounded-full hover:bg-secondary">Blog</a>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2 rounded-full hover:bg-secondary transition-colors text-muted-foreground">
              {theme === 'dark' ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg> : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>}
            </button>
            <a href="/prijava" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Prijava</a>
            <a href="/registracija" className="text-sm font-medium text-background bg-foreground px-4 py-2 rounded-full hover:bg-foreground/90 transition-colors">Začni →</a>
          </div>
          <div className="flex md:hidden items-center gap-2">
            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2 rounded-full hover:bg-secondary transition-colors text-muted-foreground">
              {theme === 'dark' ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg> : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>}
            </button>
            <button onClick={() => setMobileMenu(!mobileMenu)} className="p-2 rounded-full hover:bg-secondary transition-colors">
              {mobileMenu ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>}
            </button>
          </div>
        </div>
        {mobileMenu && (
          <div className="md:hidden border-t border-border bg-background px-5 py-4 flex flex-col gap-2">
            <button onClick={() => { document.getElementById('paketi')?.scrollIntoView({ behavior: 'smooth' }); setMobileMenu(false) }} className="text-sm text-left py-2 text-muted-foreground">Paketi</button>
            <button onClick={() => { document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' }); setMobileMenu(false) }} className="text-sm text-left py-2 text-muted-foreground">FAQ</button>
            <a href="/blog" className="text-sm py-2 text-muted-foreground">Blog</a>
            <hr className="border-border my-1" />
            <a href="/prijava" className="text-sm py-2 text-muted-foreground">Prijava</a>
           <a href="/registracija" className="text-sm font-medium text-background bg-foreground px-5 py-2.5 rounded-full text-center">Začni →</a>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section id="top" className="pt-32 md:pt-44 pb-20 md:pb-32">
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center max-w-4xl mx-auto">

            <div className="inline-flex items-center gap-2 border border-border rounded-full px-4 py-1.5 text-sm text-muted-foreground mb-8 bg-secondary/50">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Enkratno plačilo · Brez naročnine
            </div>

            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold tracking-[-0.04em] leading-[0.95] mb-6">
              Vsi vaši roki.<br />
              <span className="text-primary">Na enem mestu.</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Tehnični pregled, zavarovanje, registracija, zdravstvena kartica, garancije in osebni dokumenti. Za vso družino, z e-mail opomnikom pravočasno.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-16">
              <Button onClick={scrollToPackages} size="lg" className="rounded-full px-8 py-6 text-sm font-semibold bg-foreground text-background hover:bg-foreground/90 gap-2">
                Začni za 4,99 € <ArrowRight className="w-4 h-4" />
              </Button>
              <a href="/prijava" className="inline-flex items-center justify-center rounded-full px-8 py-3 text-sm font-medium border border-border hover:bg-secondary transition-colors">
                Že imam račun
              </a>
            </div>

            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground flex-wrap">
              <div className="flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                <span>Hitra nastavitev v 2 minutah</span>
              </div>
              <span>Brez naročnine</span>
              <span>Za vso družino</span>
            </div>
          </motion.div>

          {/* Dashboard preview */}
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="mt-20 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background z-10 pointer-events-none" style={{ top: '70%' }} />
            <div className="rounded-2xl border border-border bg-card shadow-2xl overflow-hidden mx-auto max-w-4xl">
              <div className="bg-secondary/80 px-4 py-3 flex items-center gap-2 border-b border-border">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 bg-background rounded-md px-3 py-1 text-xs text-muted-foreground text-center mx-8">veljavno.si/dashboard</div>
              </div>
              <div className="bg-primary px-6 py-5">
                <div className="flex items-center justify-between text-white mb-4">
                  <div>
                    <p className="text-blue-200 text-xs">Dober dan, Janez 👋</p>
                    <p className="font-bold">Moji roki</p>
                  </div>
                  <div className="bg-white text-primary text-xs font-semibold px-3 py-1.5 rounded-full">+ Dodaj</div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[{n:'1',l:'Poteče kmalu',c:'bg-red-500/20 text-red-200'},{n:'1',l:'Pozor',c:'bg-orange-500/20 text-orange-200'},{n:'1',l:'Veljavni',c:'bg-green-500/20 text-green-200'}].map(s => (
                    <div key={s.l} className={`${s.c} rounded-xl p-3 text-center`}>
                      <div className="text-xl font-bold">{s.n}</div>
                      <div className="text-xs mt-0.5">{s.l}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-4 space-y-3">
                {[
                  { ime: '🔧 Tehnični pregled', datum: '14. 12. 2026', dni: 25, barva: 'bg-red-400', w: '7%', badge: 'bg-red-100 text-red-600' },
                  { ime: '🛡️ Zavarovanje vozila', datum: '15. 2. 2027', dni: 88, barva: 'bg-orange-400', w: '24%', badge: 'bg-orange-100 text-orange-600' },
                  { ime: '🌍 Potni list', datum: '19. 3. 2027', dni: 120, barva: 'bg-green-400', w: '33%', badge: 'bg-green-100 text-green-600' },
                ].map(doc => (
                  <div key={doc.ime} className="bg-background rounded-xl p-4 border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{doc.ime}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${doc.badge}`}>{doc.dni} dni</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">Poteče: {doc.datum}</p>
                    <div className="h-1 bg-muted rounded-full">
                      <div className={`h-1 ${doc.barva} rounded-full`} style={{ width: doc.w }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Kako deluje */}
      <section className="py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary mb-3">Kako deluje</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-[-0.03em]">Trije koraki do miru.</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {steps.map((step, index) => (
              <motion.div key={step.title} whileHover={{ y: -4 }} className="relative rounded-2xl border border-border bg-card p-8 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-6 text-primary">
                  <step.icon className="w-5 h-5" />
                </div>
                <div className="absolute top-6 right-6 text-4xl font-bold text-border">0{index + 1}</div>
                <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Za koga */}
      <section className="py-24 md:py-32 bg-secondary/30">
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary mb-3">Za koga</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-[-0.03em]">Narejeno za vsakdanje roke.</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {zaKoga.map(z => (
              <div key={z.naslov} className="bg-card border border-border rounded-2xl p-8">
                <div className="text-3xl mb-4">{z.ikona}</div>
                <h3 className="text-lg font-bold mb-2">{z.naslov}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{z.tekst}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Primerjava */}
      <section className="py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <div className="mb-12">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary mb-3">Primerjava</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-[-0.03em]">Kaj izbrati?</h2>
            <p className="text-muted-foreground mt-3 max-w-2xl">eUprava je brezplačna in dobra za opomnik o poteku osebnih dokumentov. Veljavno pokriva vse ostale roke in celo družino.</p>
          </div>
          <div className="rounded-2xl border border-border overflow-hidden bg-card">
            <div className="grid grid-cols-4 bg-secondary/50 border-b border-border">
              <div className="p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Funkcija</div>
              <div className="p-4 text-xs font-semibold text-center border-l border-border text-primary uppercase tracking-wider">Veljavno</div>
              <div className="p-4 text-xs font-semibold text-center border-l border-border text-muted-foreground uppercase tracking-wider">eUprava</div>
              <div className="p-4 text-xs font-semibold text-center border-l border-border text-muted-foreground uppercase tracking-wider">Koledar / Excel</div>
            </div>
            {primerjava.map((v, i) => (
              <div key={v.funkcija} className={`grid grid-cols-4 border-t border-border ${i % 2 === 0 ? '' : 'bg-secondary/20'}`}>
                <div className="p-4 text-sm text-muted-foreground flex items-center">{v.funkcija}</div>
                <div className="p-4 border-l border-border flex items-center justify-center"><Celica v={v.veljavno} /></div>
                <div className="p-4 border-l border-border flex items-center justify-center"><Celica v={v.eUprava} /></div>
                <div className="p-4 border-l border-border flex items-center justify-center"><Celica v={v.koledar} /></div>
              </div>
            ))}
          </div>
        </div>
      </section>

            {/* Paketi */}
      <section id="paketi" className="scroll-mt-20 py-24 md:py-32 bg-secondary/30">
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary mb-3">Paketi</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-[-0.03em] mb-4">Enkrat plačate. Za vedno mirni.</h2>
            <p className="text-muted-foreground">Brez naročnine in brez skritih stroškov.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 max-w-3xl mx-auto items-stretch">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-2xl bg-card p-8 md:p-9 ${
                  plan.popular ? 'border-2 border-primary' : 'border border-border'
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-6 whitespace-nowrap rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
                    Najbolj priljubljeno
                  </span>
                )}

                <h3 className="text-lg font-bold">{plan.name}</h3>
                <p className="mt-5 font-display text-5xl font-bold leading-none tracking-tight">{plan.price}</p>
                <p className="mt-2 mb-7 text-sm text-muted-foreground">{plan.note}</p>

                <ul className="mb-8 flex-1 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm">
                      <span className="flex h-5 w-5 flex-none items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Check className="h-3 w-3" />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => router.push(`/registracija?paket=${plan.variant}`)}
                  variant={plan.popular ? 'default' : 'outline'}
                  className="h-12 w-full rounded-full text-sm font-semibold"
                >
                  Izberi {plan.name}
                </Button>
              </div>
            ))}
          </div>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Varno plačilo prek Stripe. Račun in dostop takoj po plačilu.
          </p>
        </div>
      </section>

      {/* Mobilna app */}
      <section className="py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <div className="grid md:grid-cols-2">
              <div className="p-10 md:p-14 flex flex-col justify-center">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary mb-4">Mobilna aplikacija</p>
                <h2 className="font-display text-3xl md:text-4xl font-bold tracking-[-0.03em] mb-4">Veljavno kjerkoli.</h2>
                <p className="text-muted-foreground mb-8 leading-relaxed">Dostopajte do svojih rokov na telefonu. Vse je sinhronizirano s spletom.</p>
                <div className="flex flex-col gap-3 mb-10">
                  {['Sinhronizirano s spletom', 'Brezplačno z vsakim paketom'].map(f => (
                    <div key={f} className="flex items-center gap-3 text-sm text-muted-foreground">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                      {f}
                    </div>
                  ))}
                </div>
                <div className="inline-flex items-center gap-2 border border-border rounded-full px-5 py-2.5 text-sm text-muted-foreground w-fit">
                  <span className="w-2 h-2 rounded-full bg-orange-400" />
                  Prihaja kmalu na App Store in Google Play
                </div>
              </div>
              <div className="bg-primary p-10 md:p-14 flex flex-col justify-center">
                <div className="space-y-4">
                  {[
                    { ime: '🔧 Tehnični pregled', dni: 25, barva: 'bg-red-400', w: '7%', badge: 'text-red-200 bg-red-500/20' },
                    { ime: '🛡️ Zavarovanje vozila', dni: 88, barva: 'bg-orange-400', w: '24%', badge: 'text-orange-200 bg-orange-500/20' },
                    { ime: '🌍 Potni list', dni: 120, barva: 'bg-green-400', w: '33%', badge: 'text-green-200 bg-green-500/20' },
                  ].map(doc => (
                    <div key={doc.ime} className="bg-white/10 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white text-sm font-medium">{doc.ime}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${doc.badge}`}>{doc.dni} dni</span>
                      </div>
                      <div className="h-1 bg-white/20 rounded-full">
                        <div className={`h-1 ${doc.barva} rounded-full`} style={{ width: doc.w }} />
                      </div>
                    </div>
                  ))}
                  <div className="bg-white rounded-xl p-3 text-center">
                    <span className="text-primary text-sm font-semibold">+ Dodaj rok</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Waitlist */}
      <section id="cakalna-lista" className="py-24 md:py-32 bg-secondary/30">
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary mb-3">Novice</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-[-0.03em] mb-4">Ostanite v stiku</h2>
            <p className="text-muted-foreground">Prijavite se in prvi izveste o novostih.</p>
          </div>
          <form onSubmit={handleWaitlist} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="vas@email.si" className="h-12 rounded-full px-5 flex-1" />
            <Button disabled={status === 'loading'} className="h-12 rounded-full px-6 text-xs font-semibold uppercase tracking-[0.16em]">
              {status === 'loading' ? 'Shranjujem...' : 'Prijavi se'}
            </Button>
          </form>
          {status === 'success' && <p className="text-center text-green-600 text-sm mt-4">Hvala, prijava je shranjena!</p>}
          {status === 'error' && <p className="text-center text-red-500 text-sm mt-4">Napaka. Poskusite znova (morda ste se že prijavili).</p>}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-20 py-24 md:py-32">
        <div className="max-w-3xl mx-auto px-5 md:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary mb-3">FAQ</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-[-0.03em]">Pogosta vprašanja</h2>
          </div>
          <div className="divide-y divide-border border-y border-border">
            {faqs.map((faq) => (
              <details key={faq.q} className="group py-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-base font-semibold focus:outline-none">
                  <span>{faq.q}</span>
                  <span className="text-muted-foreground group-open:rotate-180 transition-transform">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
                  </span>
                </summary>
                <p className="mt-3 text-muted-foreground text-sm leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-24 md:py-32 bg-primary">
        <div className="max-w-4xl mx-auto px-5 md:px-8 text-center text-white">
          <h2 className="font-display text-4xl md:text-6xl font-bold tracking-[-0.03em] mb-6">Začnite danes.</h2>
          <p className="text-blue-100 text-lg mb-10 max-w-xl mx-auto">Nikoli več zamujenega roka. Enkrat nastavite, za vedno mirni.</p>
          <Button onClick={scrollToPackages} size="lg" className="bg-white text-primary hover:bg-blue-50 rounded-full px-10 py-6 text-sm font-semibold uppercase tracking-[0.16em]">
            Začni za 4,99 € →
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 mb-10">
            <div>
              <a href="/" className="flex items-center gap-2 mb-3">
                <svg width="24" height="28" viewBox="0 0 60 72" fill="none">
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
              <p className="text-sm text-muted-foreground max-w-xs">Sistem za pravočasne opomnike.</p>
            </div>
            <div className="flex gap-16">
              <div className="flex flex-col gap-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Aplikacija</p>
                <a href="/registracija" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Registracija</a>
                <a href="/prijava" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Prijava</a>
                <a href="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Blog</a>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Pravno</p>
                <a href="/pogoji" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pogoji</a>
                <a href="/zasebnost" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Zasebnost</a>
                <a href="mailto:info@veljavno.si" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Kontakt</a>
              </div>
            </div>
          </div>
          <div className="border-t border-border pt-6 flex justify-between items-center text-xs text-muted-foreground">
            <span>© 2026 Veljavno</span>
            <span>Enkratno plačilo · Brez naročnine</span>
          </div>
        </div>
      </footer>

      {/* Welcome modal */}
      {showWelcome && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-5 bg-black/50 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-background border border-border rounded-2xl p-8 max-w-sm w-full shadow-2xl relative">
            <button onClick={zapriWelcome} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground p-1">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
            <div className="text-3xl mb-4">🛡️</div>
            <h2 className="text-xl font-bold mb-2">Ne zamudite nobenega roka</h2>
            <p className="text-muted-foreground text-sm mb-6 leading-relaxed">Veljavno vas opomni pred potekom tehničnega pregleda, zavarovanja, registracije in osebnih dokumentov.</p>
            <div className="space-y-2 mb-6">
              {['🔧 Tehnični pregled', '🛡️ Zavarovanje', '🌍 Osebni dokumenti'].map(d => (
                <div key={d} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  {d}
                </div>
              ))}
            </div>
            <Button onClick={() => { zapriWelcome(); scrollToPackages() }} className="w-full rounded-full text-xs font-semibold uppercase tracking-[0.16em]">
              Začni za 4,99 € →
            </Button>
            <button onClick={zapriWelcome} className="w-full text-xs text-muted-foreground mt-3 hover:text-foreground transition-colors">Ne, hvala</button>
          </motion.div>
        </div>
      )}

    </main>
  );
}