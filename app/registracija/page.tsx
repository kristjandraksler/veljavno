'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'

export default function Registracija() {
  const router = useRouter()
  const [ime, setIme] = useState('')
  const [email, setEmail] = useState('')
  const [geslo, setGeslo] = useState('')
  const [paket, setPaket] = useState('samostojni')
  const [napaka, setNapaka] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRegistracija = async (e: React.FormEvent) => {
    e.preventDefault()
    setNapaka('')
    setLoading(true)

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
      router.push('/dashboard')
    }

    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-5">
      <div className="w-full max-w-md">
        <a href="/" className="font-display text-xl font-bold tracking-tight text-foreground">Veljavno</a>
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
              <option value="poslovni">Poslovni — 24,99 € / mesec</option>
            </select>
          </div>

          {napaka && <p className="text-red-500 text-sm">{napaka}</p>}

          <Button type="submit" disabled={loading} className="mt-2 rounded-full py-6 text-xs font-semibold uppercase tracking-[0.16em]">
            {loading ? 'Ustvarjam račun...' : 'Ustvari račun'}
          </Button>
        </form>
      </div>
    </main>
  )
}