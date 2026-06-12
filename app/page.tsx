'use client'

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
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
  {
    name: 'Poslovni',
    price: '24,99 €',
    cadence: '/ mesec',
    features: ['Neomejeni zaposleni', 'Neomejeni dokumenti', 'E-mail opomniki', 'Admin nadzorna plošča', 'Izvoz poročil'],
    popular: false,
    variant: 'poslovni',
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
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');

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
    <span className="text-xs text-muted-foreground hidden md:block">Sistem za pravočasne opomnike</span>
    <div className="w-8 h-0.5 bg-primary mt-1 hidden md:block" />
  </div>
</a>
  <div className="flex items-center gap-6">
  <div className="hidden md:flex items-center gap-6">
    <button onClick={() => document.getElementById('paketi')?.scrollIntoView({ behavior: 'smooth' })} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Paketi</button>
    <button onClick={() => document.getElementById('cakalna-lista')?.scrollIntoView({ behavior: 'smooth' })} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">FAQ</button>
  </div>
  <div className="flex items-center gap-3">
    <a href="/prijava" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-4 py-2 rounded-full border border-border hover:border-primary">Prijava</a>
    <a href="/registracija" className="text-sm font-semibold text-white bg-primary px-5 py-2 rounded-full hover:bg-primary/90 transition-colors">Registracija</a>
  </div>
</div>
        </div>
      </nav>

      <section id="top" className="relative pt-36 md:pt-44">
        <div className="absolute right-0 top-24 hidden h-[560px] w-[46vw] rounded-l-[5rem] bg-gradient-to-br from-secondary via-background to-accent md:block" />
        <div className="mx-auto grid max-w-7xl gap-12 px-5 pb-12 md:grid-cols-12 md:px-8 md:pb-16">
          <motion.div initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="relative z-10 md:col-span-9">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground shadow-sm">
              <span className="h-2 w-2 rounded-full bg-primary" /> Sistem za pravočasne opomnike
            </div>
            <h1 className="max-w-6xl font-display text-5xl font-bold leading-[1.05] tracking-[-0.06em] text-foreground md:text-8xl lg:text-[7.4rem]">
              Nikoli več potekle vozniške ali osebne izkaznice
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-[1.65] text-muted-foreground md:text-xl">
              Vnesite datume poteka svojih dokumentov in prejmite e-mail opomnik pravočasno.
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
            <div className="rounded-[2rem] border border-border bg-card/70 p-5 shadow-2xl shadow-primary/10 backdrop-blur-xl">
              <div className="aspect-[4/5] rounded-[1.5rem] bg-gradient-to-br from-white via-secondary to-blue-100 p-6 shadow-inner">
                <div className="h-full rounded-2xl border border-white/80 bg-white/65 p-5 backdrop-blur">
                  <ShieldCheck className="mb-10 h-10 w-10 text-primary" />
                  <div className="space-y-3">
                    <div className="h-3 w-2/3 rounded-full bg-foreground/80" />
                    <div className="h-3 w-1/2 rounded-full bg-muted-foreground/30" />
                    <div className="mt-8 rounded-xl border border-primary/20 bg-primary/5 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Dokument</p>
                      <p className="text-sm font-bold text-foreground">Vozniško dovoljenje</p>
                      <p className="mt-2 text-sm font-medium text-primary">Poteče čez 47 dni</p>
                    </div>
                  </div>
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
            <h2 className="font-display text-4xl font-bold tracking-[-0.04em] md:text-6xl">Izberite paket, ki varuje vaše roke.</h2>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {plans.map((plan) => (
              <motion.div key={plan.name} whileHover={{ y: -8 }} className={`relative rounded-[2rem] border p-8 backdrop-blur-xl transition-all ${plan.variant === 'druzinski' ? 'border-primary bg-card shadow-2xl shadow-primary/15' : plan.variant === 'poslovni' ? 'border-border bg-secondary/70' : 'border-border bg-card/80'}`}>
                {plan.popular && (
                  <div className="absolute right-6 top-6 rounded-full bg-green-500 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-white">Najpopularnejši</div>
                )}
                <h3 className="text-2xl font-bold">{plan.name}</h3>
                <div className="mt-8 flex items-end gap-2">
                  <span className="font-display text-5xl font-bold tracking-[-0.05em]">{plan.price}</span>
                  <span className="pb-2 text-muted-foreground">{plan.cadence}</span>
                </div>
                <ul className="mt-9 space-y-4">
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

      <section id="cakalna-lista" className="bg-foreground py-24 text-background md:py-36">
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

      <footer className="border-t border-border py-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between md:px-8">
          <div className="font-display text-lg font-bold text-foreground">Veljavno</div>
          <div>© 2026 Veljavno</div>
          <a href="mailto:kontakt@veljavno.si" className="transition-colors hover:text-primary focus:outline-none focus:ring-4 focus:ring-primary focus:ring-offset-2">kontakt@veljavno.si</a>
        </div>
      </footer>
    </main>
  );
}