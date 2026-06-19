'use client'

import { useState, useEffect, Suspense } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter, useSearchParams } from 'next/navigation'

function RegistracijaForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [ime, setIme] = useState('')
  const [email, setEmail] = useState('')
  const [geslo, setGeslo] = useState('')
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
      options: {
        data: { ime, paket }
      }
    })

    if (error) {
      setNapaka(error.message)
      setLoading(false)
      return
    }

    if (data.user) {
      await supabase.from('profiles').insert({
        id: data.user.id,
        ime,
        paket,
      })

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

  if (obstojeciUserId) {
    return (
      <div className="w-full max-w-md">
        <a href="/" className="flex items-center gap-3">
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

        <h1 className="mt-8 text-3xl font-bold tracking-tight">Dokončajte plačilo</h1>
        <p className="mt-2 text-muted-foreground">Vaš račun je ustvarjen v mobilni aplikaciji. Samo še plačajte da ga aktivirate.</p>

        <div className="mt-8 bg-secondary/50 border border-border rounded-2xl p-6">
          <p className="text-sm text-muted-foreground mb-1">E-mail</p>
          <p className="font-semibold mb-4">{email}</p>
          <p className="text-sm text-muted-foreground mb-1">Paket</p>
          <p className="font-semibold">{paket === 'samostojni' ? 'Samostojni — 4,99 €' : 'Družinski — 9,99 €'}</p>
        </div>

        <Button onClick={() => nadaljujNaPlacilo(obstojeciUserId, email)} disabled={loading} className="mt-6 w-full rounded-full py-6 text-xs font-semibold uppercase tracking-[0.16em]">
          {loading ? 'Preusmerjam...' : 'Nadaljuj na plačilo'}
        </Button>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md">
      <a href="/" className="flex items-center gap-3">
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

      <h1 className="mt-8 text-3xl font-bold tracking-tight">Ustvari račun</h1>
      <p className="mt-2 text-muted-foreground">Že imate račun? <a href="/prijava" className="text-primary hover:underline">Prijavite se</a></p>

      <form onSubmit={handleRegistracija} className="mt-8 flex flex-col gap-4">
        <div>
          <label className="text-sm font-medium mb-1 block">Ime</label>
          <Input value={ime} onChange={e => setIme(e.target.value)} placeholder="Janez Novak" required />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">E-mail</label>
          <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="janez@email.si" required />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Geslo</label>
          <Input type="password" value={geslo} onChange={e => setGeslo(e.target.value)} placeholder="Najmanj 6 znakov" required minLength={6} />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Paket</label>
          <select value={paket} onChange={e => setPaket(e.target.value)} className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-background">
            <option value="samostojni">Samostojni — 4,99 € enkratno</option>
            <option value="druzinski">Družinski — 9,99 € enkratno</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">
            Referral koda <span className="text-muted-foreground font-normal">(opcijsko)</span>
          </label>
          <Input value={referral} onChange={e => setReferral(e.target.value)} placeholder="npr. JANEZ30" />
          {referral && <p className="text-xs text-green-600 mt-1">✓ Referral koda bo upoštevana</p>}
        </div>

        {napaka && <p className="text-red-500 text-sm">{napaka}</p>}

        <div className="flex items-start gap-3">
          <input type="checkbox" id="pogoji" checked={pogoji} onChange={e => setPogoji(e.target.checked)} className="w-4 h-4 mt-0.5 cursor-pointer" required />
          <label htmlFor="pogoji" className="text-sm text-muted-foreground cursor-pointer">
            Strinjam se s <a href="/pogoji" target="_blank" className="text-primary hover:underline">splošnimi pogoji</a> in <a href="/zasebnost" target="_blank" className="text-primary hover:underline">politiko zasebnosti</a>
          </label>
        </div>

        <Button type="submit" disabled={loading || !pogoji} className="mt-2 rounded-full py-6 text-xs font-semibold uppercase tracking-[0.16em]">
          {loading ? 'Ustvarjam račun...' : 'Ustvari račun'}
        </Button>
      </form>
    </div>
  )
}

export default function Registracija() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-5">
      <Suspense fallback={<div>Nalagam...</div>}>
        <RegistracijaForm />
      </Suspense>
    </main>
  )
}