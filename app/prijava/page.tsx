'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'

export default function Prijava() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [geslo, setGeslo] = useState('')
  const [napaka, setNapaka] = useState('')
  const [loading, setLoading] = useState(false)

  const handlePrijava = async (e: React.FormEvent) => {
    e.preventDefault()
    setNapaka('')
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({ email, password: geslo })

    if (error) {
      setNapaka('Napačen e-mail ali geslo.')
      setLoading(false)
      return
    }

    router.push('/dashboard')
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-5">
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

        <h1 className="mt-8 text-3xl font-bold tracking-tight">Dobrodošli nazaj</h1>
        <p className="mt-2 text-muted-foreground">Nimate računa? <a href="/registracija" className="text-primary hover:underline">Registrirajte se</a></p>

        <form onSubmit={handlePrijava} className="mt-8 flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">E-mail</label>
            <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="janez@email.si" required />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium">Geslo</label>
              <a href="/pozabljeno-geslo" className="text-xs text-primary hover:underline">Pozabljeno geslo?</a>
            </div>
            <Input type="password" value={geslo} onChange={e => setGeslo(e.target.value)} placeholder="Vaše geslo" required />
          </div>

          {napaka && <p className="text-red-500 text-sm">{napaka}</p>}

          <Button type="submit" disabled={loading} className="mt-2 rounded-full py-6 text-xs font-semibold uppercase tracking-[0.16em]">
            {loading ? 'Prijavljam...' : 'Prijava'}
          </Button>
        </form>
      </div>
    </main>
  )
}