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
  const [showGeslo, setShowGeslo] = useState(false)

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
    <main className="min-h-screen bg-background flex">

      {/* Leva stran — forma */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">

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

          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Dobrodošli nazaj 👋</h1>
            <p className="mt-2 text-muted-foreground text-sm">Nimate računa? <a href="/registracija" className="text-primary hover:underline font-medium">Registrirajte se</a></p>
          </div>

          <form onSubmit={handlePrijava} className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">E-mail</label>
              <Input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="janez@email.si"
                required
                className="h-12 rounded-xl"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium">Geslo</label>
                <a href="/pozabljeno-geslo" className="text-xs text-primary hover:underline">Pozabljeno geslo?</a>
              </div>
              <div className="relative">
                <Input
                  type={showGeslo ? 'text' : 'password'}
                  value={geslo}
                  onChange={e => setGeslo(e.target.value)}
                  placeholder="Vaše geslo"
                  required
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

            {napaka && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <p className="text-red-600 text-sm">{napaka}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="mt-2 h-12 rounded-xl text-xs font-semibold uppercase tracking-[0.16em]"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                  </svg>
                  Prijavljam...
                </span>
              ) : 'Prijava →'}
            </Button>
          </form>

          <p className="mt-8 text-center text-xs text-muted-foreground">
            Z prijavo se strinjate s{' '}
            <a href="/pogoji" className="hover:underline text-primary">splošnimi pogoji</a>
            {' '}in{' '}
            <a href="/zasebnost" className="hover:underline text-primary">politiko zasebnosti</a>.
          </p>
        </div>
      </div>

      {/* Desna stran — dekorativna */}
      <div className="hidden lg:flex flex-1 bg-primary items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10 px-12 text-white max-w-md">
          <div className="mb-10">
            <div className="text-5xl mb-6">🇸🇮</div>
            <h2 className="text-3xl font-bold mb-4 leading-tight">Nikoli več potekle vozniške ali osebne.</h2>
            <p className="text-blue-100 text-lg leading-relaxed">Veljavno vas opomni pravočasno — teden, mesec ali 6 mesecev prej.</p>
          </div>

          <div className="flex flex-col gap-4">
            {[
              { ikona: '🚗', tekst: 'Vozniško dovoljenje' },
              { ikona: '🪪', tekst: 'Osebna izkaznica' },
              { ikona: '🌍', tekst: 'Potni list' },
              { ikona: '🏥', tekst: 'Zdravstvena kartica' },
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

    </main>
  )
}