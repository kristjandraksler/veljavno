'use client'

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, Mail, Plus, Clock3, ShieldCheck } from 'lucide-react';

const plans = [
  {
    name: 'Samostojni',
    price: '4,99 €',
    cadence: 'enkratno',
    features: ['1 oseba', 'Neomejeni dokumenti', 'E-mail opomniki'],
    popular: false,
    variant: 'samostojni',
  },
  {
    name: 'Družinski',
    price: '9,99 €',
    cadence: 'enkratno',
    features: ['Do 6 oseb', 'Neomejeni dokumenti', 'E-mail opomniki', 'Skupni pregled'],
    popular: true,
    variant: 'druzinski',
  },
];

const steps = [
  { icon: Plus, title: 'Dodaj svoje dokumente', text: 'Vnesite vozniško, osebno, potni list ali drug dokument z datumom poteka.' },
  { icon: Clock3, title: 'Nastavi kdaj želiš opomnik', text: 'Izberite opomnik 1 teden, 1 mesec, 3 mesece ali 6 mesecev prej.' },
  { icon: Mail, title: 'Prejmi e-mail ob pravem času', text: 'Veljavno vas pravočasno opozori, še preden dokument poteče.' },
];

const faqs = [
  {
    q: 'Kateri dokumenti so podprti?',
    a: 'Vozniško dovoljenje, osebna izkaznica, potni list in katerikoli drug dokument z datumom poteka.',
  },
  {
    q: 'Kdaj točno dobim opomnik?',
    a: 'Vi izberete — 1 teden, 1 mesec, 3 mesece ali 6 mesecev pred potekom dokumenta.',
  },
  {
    q: 'Ali je plačilo varno?',
    a: 'Plačilo poteka prek Stripe, ki je eden najvarnejših plačilnih sistemov na svetu.',
  },
];

function scrollToPackages() {
  document.getElementById('paketi')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export default function Home() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [mobileMenu, setMobileMenu] = useState(false);

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
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <nav className="fixed left-0 right-0 top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
          <a href="#top" className="flex items-center gap-3">
            <svg width="36" height="44" viewBox="0 0 60 72" fill="none" xmlns="http://www.w3.org/2000/svg">
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

          <div className="hidden md:flex items-center gap-6">
            <button onClick={() => document.getElementById('paketi')?.scrollIntoView({ behavior: 'smooth' })} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Paketi</button>
            <button onClick={() => document.getElementById('cakalna-lista')?.scrollIntoView({ behavior: 'smooth' })} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">FAQ</button>
            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2 rounded-full border border-border hover:bg-secondary transition-colors" aria-label="Preklopi temo">
              {theme === 'dark' ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              )}
            </button>
            <a href="/prijava" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-4 py-2 rounded-full border border-border hover:border-primary">Prijava</a>
            <a href="/registracija" className="text-sm font-semibold text-white bg-primary px-5 py-2 rounded-full hover:bg-primary/90 transition-colors">Registracija</a>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2 rounded-full border border-border hover:bg-secondary transition-colors" aria-label="Preklopi temo">
              {theme === 'dark' ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              )}
            </button>
            <button onClick={() => setMobileMenu(!mobileMenu)} className="p-2 rounded-lg hover:bg-secondary transition-colors" aria-label="Meni">
              {mobileMenu ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
                </svg>
              )}
            </button>
          </div>
        </div>

        {mobileMenu && (
          <div className="md:hidden border-t border-border bg-background px-5 py-4 flex flex-col gap-3">
            <button onClick={() => { document.getElementById('paketi')?.scrollIntoView({ behavior: 'smooth' }); setMobileMenu(false) }} className="text-sm font-medium text-left py-2 text-muted-foreground hover:text-foreground transition-colors">Paketi</button>
            <button onClick={() => { document.getElementById('cakalna-lista')?.scrollIntoView({ behavior: 'smooth' }); setMobileMenu(false) }} className="text-sm font-medium text-left py-2 text-muted-foreground hover:text-foreground transition-colors">FAQ</button>
            <hr className="border-border" />
            <a href="/prijava" className="text-sm font-medium text-white bg-foreground px-5 py-2 rounded-full hover:bg-foreground/90 transition-colors text-center">Prijava</a>
            <a href="/registracija" className="text-sm font-semibold text-white bg-primary px-5 py-2 rounded-full hover:bg-primary/90 transition-colors text-center">Registracija</a>
          </div>
        )}
      </nav>

      <section id="top" className="relative pt-36 md:pt-44">
        <div className="absolute right-0 top-24 hidden h-[560px] w-[46vw] rounded-l-[5rem] bg-gradient-to-br from-secondary via-background to-accent md:block" />
        <div className="mx-auto grid max-w-7xl gap-12 px-5 pb-12 md:grid-cols-12 md:px-8 md:pb-16">
          <motion.div initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="relative z-10 md:col-span-9">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground shadow-sm">
              <span className="h-2 w-2 rounded-full bg-primary" /> Sistem za pravočasne opomnike
            </div>
           <h1 className="max-w-6xl font-display text-5xl font-bold leading-[1.05] tracking-[-0.06em] text-foreground md:text-8xl lg:text-[7.4rem]">
  Vsi vaši dokumenti. Vedno veljavni.
</h1>
<p className="mt-8 max-w-2xl text-lg leading-[1.65] text-muted-foreground md:text-xl">
  Vozniško, osebna, potni list — dodajte datume poteka in prejmite e-mail opomnik preden je prepozno.
</p>
            <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <Button onClick={scrollToPackages} size="lg" className="group relative overflow-hidden rounded-full px-8 py-7 text-sm font-semibold uppercase tracking-[0.16em] shadow-xl shadow-primary/20 focus:ring-4 focus:ring-primary focus:ring-offset-2">
                <span className="absolute inset-y-0 -left-8 w-px bg-primary-foreground/70 transition-all duration-700 group-hover:left-[115%]" />
                Poglej pakete
              </Button>
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-green-500" /> Enkratno plačilo · Brez naročnine
              </div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.15 }} className="relative z-10 md:col-span-3 md:pt-24">
  <div className="rounded-[2rem] border border-border bg-card/70 p-4 shadow-2xl shadow-primary/10 backdrop-blur-xl">
    <div className="rounded-[1.5rem] bg-background border border-border overflow-hidden">
      {/* Nav */}
      <div className="border-b border-border px-4 py-3 flex items-center gap-2">
        <div className="w-5 h-6 bg-primary rounded-md flex-shrink-0" />
        <div className="h-2 w-16 bg-foreground/80 rounded-full" />
      </div>
      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-red-50 border border-red-100 rounded-xl p-2 text-center">
            <div className="text-lg font-bold text-red-600">1</div>
            <div className="text-[9px] text-red-500">Kmalu</div>
          </div>
          <div className="bg-orange-50 border border-orange-100 rounded-xl p-2 text-center">
            <div className="text-lg font-bold text-orange-600">2</div>
            <div className="text-[9px] text-orange-500">Pozor</div>
          </div>
          <div className="bg-green-50 border border-green-100 rounded-xl p-2 text-center">
            <div className="text-lg font-bold text-green-600">3</div>
            <div className="text-[9px] text-green-500">Veljavni</div>
          </div>
        </div>
        {/* Documents */}
        {[
          { ime: '🚗 Vozniško dovoljenje', dni: 23, color: 'border-red-200', badge: 'bg-red-100 text-red-600', badgeText: '23 dni', progress: 'bg-red-400', width: '6%' },
          { ime: '🪪 Osebna izkaznica', dni: 67, color: 'border-orange-200', badge: 'bg-orange-100 text-orange-600', badgeText: '67 dni', progress: 'bg-orange-400', width: '18%' },
          { ime: '🌍 Potni list', dni: 280, color: 'border-border', badge: 'bg-green-100 text-green-600', badgeText: '280 dni', progress: 'bg-green-400', width: '77%' },
        ].map(doc => (
          <div key={doc.ime} className={`bg-card border ${doc.color} rounded-xl p-3`}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold">{doc.ime}</span>
              <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${doc.badge}`}>{doc.badgeText}</span>
            </div>
            <div className="w-full h-1 bg-muted rounded-full">
              <div className={`h-1 rounded-full ${doc.progress}`} style={{ width: doc.width }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
</motion.div>
        </div>
      </section>

      <section className="bg-secondary/55 py-24 md:py-36">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary">Kako deluje</p>
              <h2 className="max-w-2xl font-display text-4xl font-bold tracking-[-0.04em] md:text-6xl">Tri poteze do mirnega pregleda.</h2>
            </div>
            <div className="hidden h-px flex-1 bg-border md:block" />
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {steps.map((step, index) => (
              <motion.div key={step.title} whileHover={{ y: -8 }} className="group rounded-[2rem] border border-border bg-card p-8 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-primary/10">
                <div className="mb-10 flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-background text-primary transition-transform duration-500 group-hover:rotate-6">
                  <step.icon className="h-7 w-7" />
                </div>
                <div className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">0{index + 1}</div>
                <h3 className="mb-4 text-2xl font-bold tracking-tight">{step.title}</h3>
                <p className="text-lg leading-relaxed text-muted-foreground">{step.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="paketi" className="scroll-mt-24 py-24 md:py-40">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="mb-16 max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary">Paketi</p>
            <h2 className="font-display text-4xl font-bold tracking-[-0.04em] md:text-6xl"><h2 className="font-display text-4xl font-bold tracking-[-0.04em] md:text-6xl">Enkrat plačate. Za vedno mirni.</h2></h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 max-w-3xl mx-auto">
            {plans.map((plan) => (
              <motion.div key={plan.name} whileHover={{ y: -8 }} className={`relative rounded-[2rem] border p-10 backdrop-blur-xl transition-all ${plan.variant === 'druzinski' ? 'border-primary bg-card shadow-2xl shadow-primary/15' : 'border-border bg-card/80'}`}>
                {plan.popular && (
                  <div className="rounded-full bg-green-500 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-white inline-block mb-3">Najpopularnejši</div>
                )}
                <h3 className="text-2xl font-bold">{plan.name}</h3>
                <div className="mt-6 flex items-end gap-2">
                  <span className="font-display text-5xl font-bold tracking-[-0.05em]">{plan.price}</span>
                  <span className="pb-2 text-muted-foreground">{plan.cadence}</span>
                </div>
                <ul className="mt-8 space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-lg text-muted-foreground">
                      <Check className="mt-1 h-5 w-5 flex-none text-primary" /> {feature}
                    </li>
                  ))}
                </ul>
                <Button onClick={() => router.push(`/registracija?paket=${plan.variant}`)} className={`mt-10 w-full rounded-full py-6 text-xs font-semibold uppercase tracking-[0.16em] focus:ring-4 focus:ring-primary focus:ring-offset-2 ${plan.popular ? 'animate-[pulse_5s_ease-in-out_infinite]' : ''}`} variant={plan.popular ? 'default' : 'outline'}>
                  Izberi paket
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="cakalna-lista" className="bg-slate-900 py-24 text-white md:py-36">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 md:grid-cols-12 md:px-8">
          <div className="md:col-span-6">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-blue-200">Novice</p>
            <h2 className="font-display text-4xl font-bold tracking-[-0.04em] md:text-6xl">Ostanite v stiku</h2>
            <p className="mt-6 text-lg leading-relaxed text-slate-300 md:text-xl">Prijavite se in prvi izveste o novostih in posodobitvah.</p>
          </div>
          <form onSubmit={handleWaitlist} className="md:col-span-6 md:self-end">
            <div className="flex flex-col gap-5 sm:flex-row">
              <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="vas@email.si" style={{backgroundColor: 'transparent'}} className="h-16 rounded-none border-0 border-b border-slate-500 bg-transparent px-0 text-lg text-white placeholder:text-slate-500 focus-visible:ring-4 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-foreground" />
              <Button disabled={status === 'loading'} className="h-16 rounded-full px-8 text-xs font-semibold uppercase tracking-[0.16em] shadow-lg shadow-primary/30 focus:ring-4 focus:ring-primary focus:ring-offset-2 focus:ring-offset-foreground">
                {status === 'loading' ? 'Shranjujem ...' : 'Prijavi se na novice'}
              </Button>
            </div>
            {status === 'success' && <p className="mt-5 text-green-400">Hvala, prijava je shranjena.</p>}
            {status === 'error' && <p className="mt-5 text-red-400">Napaka pri prijavi. Poskusite znova.</p>}
          </form>
        </div>
      </section>

      <section className="py-24 md:py-36">
        <div className="mx-auto max-w-5xl px-5 md:px-8">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary">FAQ</p>
          <h2 className="mb-14 font-display text-4xl font-bold tracking-[-0.04em] md:text-6xl">Pogosta vprašanja</h2>
          <div className="divide-y divide-border border-y border-border">
            {faqs.map((faq) => (
              <details key={faq.q} className="group py-7">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-xl font-bold focus:outline-none focus:ring-4 focus:ring-primary focus:ring-offset-2">
                  <span>{faq.q}</span>
                  <span className="rounded-full border border-border px-3 py-1 text-xs font-semibold text-muted-foreground transition-colors group-hover:border-primary group-hover:text-primary">↓</span>
                </summary>
                <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-slate-900 text-white mt-20">
        <div className="mx-auto max-w-7xl px-5 md:px-8 py-12">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
            <div>
              <a href="/" className="flex items-center gap-2 mb-3">
                <svg width="28" height="34" viewBox="0 0 60 72" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="0" y="0" width="60" height="72" rx="10" fill="#2563eb"/>
                  <rect x="10" y="8" width="26" height="4" rx="2" fill="white" fillOpacity="0.5"/>
                  <rect x="10" y="17" width="40" height="4" rx="2" fill="white" fillOpacity="0.35"/>
                  <rect x="10" y="26" width="32" height="4" rx="2" fill="white" fillOpacity="0.35"/>
                  <rect x="10" y="35" width="36" height="4" rx="2" fill="white" fillOpacity="0.35"/>
                  <circle cx="43" cy="56" r="14" fill="white"/>
                  <path d="M36 56 L41 61 L50 50" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <div className="flex flex-col">
                  <span className="font-display text-lg font-bold text-white">VELJAVNO</span>
                  <span className="text-xs text-slate-300">Sistem za pravočasne opomnike</span>
                  <div className="w-8 h-0.5 bg-blue-400 mt-1" />
                </div>
              </a>
              <p className="text-sm text-slate-300 max-w-xs">Nikoli več potekle vozniške ali osebne izkaznice.</p>
            </div>

            <div className="flex flex-col gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 mb-1">Aplikacija</p>
              <a href="/registracija" className="text-sm text-slate-200 hover:text-white transition-colors">Registracija</a>
              <a href="/prijava" className="text-sm text-slate-200 hover:text-white transition-colors">Prijava</a>
              <a href="/dashboard" className="text-sm text-slate-200 hover:text-white transition-colors">Dashboard</a>
            </div>

            <div className="flex flex-col gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 mb-1">Pravno</p>
              <a href="/pogoji" className="text-sm text-slate-200 hover:text-white transition-colors">Splošni pogoji</a>
              <a href="/zasebnost" className="text-sm text-slate-200 hover:text-white transition-colors">Zasebnost</a>
              <a href="mailto:info@veljavno.si" className="text-sm text-slate-200 hover:text-white transition-colors">Kontakt</a>
            </div>
          </div>

          <div className="border-t border-slate-700 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-xs text-slate-400">© 2026 Veljavno. Vse pravice pridržane.</p>
            <p className="text-xs text-slate-400">Narejeno v Sloveniji 🇸🇮</p>
          </div>
        </div>
      </footer>
    </main>
  );
}