'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'

const paketImena: Record<string, string> = {
  samostojni: 'Samostojni — 4,99 € enkratno',
  druzinski: 'Družinski — 9,99 € enkratno',
  poslovni: 'Poslovni — 24,99 € / mesec',
}

export default function Nastavitve() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [profil, setProfil] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const [novoGeslo, setNovoGeslo] = useState('')
  const [potrdiGeslo, setPotrdiGeslo] = useState('')
  const [gesloNapaka, setGesloNapaka] = useState('')
  const [gesloUspeh, setGesloUspeh] = useState(false)
  const [gesloLoading, setGesloLoading] = useState(false)

  useEffect(() => {
  supabase.auth.getUser().then(async ({ data }) => {
    if (!data.user) { router.push('/prijava'); return }

    const { data: profilData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single()

    if (!profilData?.placilo_potrjeno) {
      router.push('/registracija')
      return
    }

    setUser(data.user)
    setProfil(profilData)
    setLoading(false)
  })
}, [])

  async function spremembaGesla(e: React.FormEvent) {
    e.preventDefault()
    setGesloNapaka('')
    setGesloUspeh(false)

    if (novoGeslo !== potrdiGeslo) {
      setGesloNapaka('Gesli se ne ujemata.')
      return
    }

    if (novoGeslo.length < 6) {
      setGesloNapaka('Geslo mora imeti najmanj 6 znakov.')
      return
    }

    setGesloLoading(true)
    const { error } = await supabase.auth.updateUser({ password: novoGeslo })

    if (error) {
      setGesloNapaka('Napaka pri spremembi gesla.')
    } else {
      setGesloUspeh(true)
      setNovoGeslo('')
      setPotrdiGeslo('')
    }
    setGesloLoading(false)
  }

  async function odjava() {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center">Nalagam...</div>

  return (
    <main className="min-h-screen bg-background">
      <nav className="border-b border-border px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <a href="/dashboard" className="flex items-center gap-3">
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
          <Button variant="outline" onClick={odjava} className="rounded-full text-xs px-4 py-2">Odjava</Button>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="flex items-center gap-3 mb-8">
          <a href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Dashboard</a>
          <span className="text-muted-foreground">/</span>
          <span className="text-sm font-medium">Nastavitve</span>
        </div>

        <h1 className="text-2xl font-bold mb-8">Nastavitve računa</h1>

        {/* Profil */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-6">
          <h2 className="font-semibold mb-4">Profil</h2>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-sm text-muted-foreground">Ime</span>
              <span className="text-sm font-medium">{profil?.ime || '—'}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-sm text-muted-foreground">E-mail</span>
              <span className="text-sm font-medium">{user?.email}</span>
            </div>
            <div className="flex justify-between items-center py-2">
  <span className="text-sm text-muted-foreground">Paket</span>
  <span className="text-sm font-medium text-primary">{paketImena[profil?.paket] || profil?.paket || '—'}</span>
</div>

{profil?.paket === 'samostojni' && (
  <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4">
    <p className="text-sm font-semibold text-blue-800 mb-1">Nadgradi na Družinski</p>
    <p className="text-xs text-blue-600 mb-3">Dodajte do 6 članov družine in skupni pregled dokumentov.</p>
    <a href="/registracija?paket=druzinski" className="inline-block bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded-full hover:bg-blue-700 transition-colors">
      Nadgradi za 9,99 € →
    </a>
  </div>
)}
{profil?.paket === 'druzinski' && (
  <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-4">
    <p className="text-sm font-semibold text-green-800">Imate najboljši paket ✓</p>
    <p className="text-xs text-green-600 mt-1">Uživate v vseh funkcijah Veljavno.</p>
  </div>
)}

          </div>
        </div>

        {/* Sprememba gesla */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-6">
          <h2 className="font-semibold mb-4">Sprememba gesla</h2>
          <form onSubmit={spremembaGesla} className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Novo geslo</label>
              <Input type="password" value={novoGeslo} onChange={e => setNovoGeslo(e.target.value)} placeholder="Najmanj 6 znakov" required minLength={6} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Potrdi geslo</label>
              <Input type="password" value={potrdiGeslo} onChange={e => setPotrdiGeslo(e.target.value)} placeholder="Ponovite geslo" required />
            </div>
            {gesloNapaka && <p className="text-red-500 text-sm">{gesloNapaka}</p>}
            {gesloUspeh && <p className="text-green-500 text-sm">Geslo uspešno spremenjeno!</p>}
            <Button type="submit" disabled={gesloLoading} className="rounded-full text-xs font-semibold uppercase tracking-[0.16em] w-fit">
              {gesloLoading ? 'Shranjujem...' : 'Spremeni geslo'}
            </Button>
          </form>
        </div>

        {/* Nevarno območje */}
        <div className="bg-card border border-red-200 rounded-2xl p-6">
          <h2 className="font-semibold mb-2 text-red-600">Nevarno območje</h2>
          <p className="text-sm text-muted-foreground mb-4">Odjava iz vseh naprav.</p>
          <Button variant="outline" onClick={odjava} className="rounded-full text-xs font-semibold uppercase tracking-[0.16em] text-red-500 border-red-200 hover:bg-red-50">
            Odjava
          </Button>
        </div>
      </div>
    </main>
  )
}