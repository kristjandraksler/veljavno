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
        <a href="/" className="font-display text-xl font-bold tracking-tight text-foreground">Veljavno</a>
        <h1 className="mt-8 text-3xl font-bold tracking-tight">Dobrodošli nazaj</h1>
        <p className="mt-2 text-muted-foreground">Nimate računa? <a href="/registracija" className="text-primary hover:underline">Registrirajte se</a></p>

        <form onSubmit={handlePrijava} className="mt-8 flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">E-mail</label>
            <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="janez@email.si" required />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Geslo</label>
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