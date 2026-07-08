'use client'

import { useState, useEffect, Suspense } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter, useSearchParams } from 'next/navigation'

const Logo = () => (
  <a href="/" className="flex items-center gap-3 mb-12">
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
)

function RegistracijaForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [ime, setIme] = useState('')
  const [email, setEmail] = useState('')
  const [geslo, setGeslo] = useState('')
  const [showGeslo, setShowGeslo] = useState(false)
  const [paket, setPaket] = useState('samostojni')
  const [referral, setReferral] = useState('')
  const [napaka, setNapaka] = useState('')
  const [loading, setLoading] = useState(false)
  const [pogoji, setPogoji] = useState(false)
  const [obstojeciUserId, setObstojeciUserId] = useState('')

  useEffect(() => {
    const paketParam = searchParams.get('paket')
    if (paketParam) setPaket(paketParam)
    const ref = localStorage.getItem('affiliate-ref') || searchParams.get('ref') || ''
    if (ref) setReferral(ref)

    const userId = searchParams.get('userId')
    const emailParam = searchParams.get('email')
    if (userId && emailParam) {
      setObstojeciUserId(userId)
      setEmail(emailParam)
    }
  }, [searchParams])

  async function nadaljujNaPlacilo(userId: string, emailNaslov: string) {
    setLoading(true)
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paket, userId, email: emailNaslov, ref: referral })
    })
    const { url } = await res.json()
    window.location.href = url
  }

  const handleRegistracija = async (e: React.FormEvent) => {
    e.preventDefault()
    setNapaka('')
    setLoading(true)

    if (obstojeciUserId) {
      await nadaljujNaPlacilo(obstojeciUserId, email)
      return
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password: geslo,
      options: { data: { ime, paket } }
    })

    if (error) {
      setNapaka(error.message)
      setLoading(false)
      return
    }

    if (data.user) {
      await supabase.from('profiles').insert({ id: data.user.id, ime, paket })
      await fetch('/api/welcome', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, ime, paket })
      })

      if (!data.user.email_confirmed_at) {
        setLoading(false)
        router.push('/potrdi-email')
        return
      }

      await nadaljujNaPlacilo(data.user.id, email)
      return
    }

    setLoading(false)
  }

  const DekorativnaStran = () => (
    <div className="hidden lg:flex flex-1 bg-primary items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
      <div className="relative z-10 px-12 text-white max-w-md">
        <div className="mb-10">
          <div className="text-5xl mb-6">🔐</div>
          <h2 className="text-3xl font-bold mb-4 leading-tight">Enkrat plačate. Za vedno mirni.</h2>
          <p className="text-blue-100 text-lg leading-relaxed">Brez naročnine, brez skritih stroškov. Vaši dokumenti so varni z Veljavno.</p>
        </div>
        <div className="flex flex-col gap-4">
          {[
            { ikona: '✉️', tekst: 'E-mail opomnik pravočasno' },
            { ikona: '👨‍👩‍👧‍👦', tekst: 'Sledenje za celo družino' },
            { ikona: '📱', tekst: 'Dostop iz telefona' },
            { ikona: '🔒', tekst: 'Varno plačilo prek Stripe' },
          ].map(d => (
            <div key={d.tekst} className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3">
              <span className="text-xl">{d.ikona}</span>
              <span className="text-sm font-medium">{d.tekst}</span>
              <span className="ml-auto">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
              </span>
            </div>
          ))}
        </div>
        <div className="mt-10 pt-8 border-t border-white/20">
          <p className="text-blue-200 text-sm">Že <span className="text-white font-semibold">47+ uporabnikov</span> varuje svoje dokumente z Veljavno.</p>
        </div>
      </div>
    </div>
  )

  if (obstojeciUserId) {
    return (
      <main className="min-h-screen bg-background flex">
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-sm">
            <Logo />
            <h1 className="text-3xl font-bold tracking-tight">Dokončajte plačilo</h1>
            <p className="mt-2 text-muted-foreground text-sm">Vaš račun je ustvarjen v mobilni aplikaciji. Samo še plačajte da ga aktivirate.</p>

            <div className="mt-8 bg-secondary/50 border border-border rounded-2xl p-6">
              <p className="text-sm text-muted-foreground mb-1">E-mail</p>
              <p className="font-semibold mb-4">{email}</p>
              <p className="text-sm text-muted-foreground mb-1">Paket</p>
              <p className="font-semibold">{paket === 'samostojni' ? 'Samostojni — 4,99 €' : 'Družinski — 9,99 €'}</p>
            </div>

            <Button onClick={() => nadaljujNaPlacilo(obstojeciUserId, email)} disabled={loading} className="mt-6 w-full h-12 rounded-xl text-xs font-semibold uppercase tracking-[0.16em]">
              {loading ? 'Preusmerjam...' : 'Nadaljuj na plačilo →'}
            </Button>
          </div>
        </div>
        <DekorativnaStran />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background flex">
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <Logo />

          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Ustvari račun 🎉</h1>
            <p className="mt-2 text-muted-foreground text-sm">Že imate račun? <a href="/prijava" className="text-primary hover:underline font-medium">Prijavite se</a></p>
          </div>

          {/* Paket izbira */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { vrednost: 'samostojni', ime: 'Samostojni', cena: '4,99 €', opis: '1 oseba' },
              { vrednost: 'druzinski', ime: 'Družinski', cena: '9,99 €', opis: 'Do 6 oseb' },
            ].map(p => (
              <button
                key={p.vrednost}
                type="button"
                onClick={() => setPaket(p.vrednost)}
                className={`relative rounded-xl border-2 p-4 text-left transition-all ${paket === p.vrednost ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
              >
                {p.vrednost === 'druzinski' && (
                  <span className="absolute -top-2 left-3 bg-green-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">Popular</span>
                )}
                <p className="font-bold text-sm">{p.ime}</p>
                <p className="text-primary font-bold text-lg mt-1">{p.cena}</p>
                <p className="text-muted-foreground text-xs">{p.opis}</p>
              </button>
            ))}
          </div>

          <form onSubmit={handleRegistracija} className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Ime</label>
              <Input value={ime} onChange={e => setIme(e.target.value)} placeholder="Janez Novak" required className="h-12 rounded-xl" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">E-mail</label>
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="janez@email.si" required className="h-12 rounded-xl" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Geslo</label>
              <div className="relative">
                <Input
                  type={showGeslo ? 'text' : 'password'}
                  value={geslo}
                  onChange={e => setGeslo(e.target.value)}
                  placeholder="Najmanj 6 znakov"
                  required
                  minLength={6}
                  className="h-12 rounded-xl pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowGeslo(!showGeslo)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showGeslo ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Referral koda <span className="text-muted-foreground font-normal">(opcijsko)</span>
              </label>
              <Input value={referral} onChange={e => setReferral(e.target.value)} placeholder="npr. JANEZ30" className="h-12 rounded-xl" />
              {referral && <p className="text-xs text-green-600 mt-1">✓ Referral koda bo upoštevana</p>}
            </div>

            {napaka && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <p className="text-red-600 text-sm">{napaka}</p>
              </div>
            )}

            <div className="flex items-start gap-3">
              <input type="checkbox" id="pogoji" checked={pogoji} onChange={e => setPogoji(e.target.checked)} className="w-4 h-4 mt-0.5 cursor-pointer" required />
              <label htmlFor="pogoji" className="text-sm text-muted-foreground cursor-pointer">
                Strinjam se s <a href="/pogoji" target="_blank" className="text-primary hover:underline">splošnimi pogoji</a> in <a href="/zasebnost" target="_blank" className="text-primary hover:underline">politiko zasebnosti</a>
              </label>
            </div>

            <Button type="submit" disabled={loading || !pogoji} className="mt-2 h-12 rounded-xl text-xs font-semibold uppercase tracking-[0.16em]">
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                  </svg>
                  Ustvarjam račun...
                </span>
              ) : 'Ustvari račun →'}
            </Button>
          </form>
        </div>
      </div>
      <DekorativnaStran />
    </main>
  )
}

export default function Registracija() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Nalagam...</div>}>
      <RegistracijaForm />
    </Suspense>
  )
}