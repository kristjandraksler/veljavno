'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'

export default function ResetGeslo() {
  const router = useRouter()
  const [geslo, setGeslo] = useState('')
  const [potrdiGeslo, setPotrdiGeslo] = useState('')
  const [status, setStatus] = useState('idle')
  const [loading, setLoading] = useState(false)
  const [napaka, setNapaka] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setNapaka('')

    if (geslo !== potrdiGeslo) {
      setNapaka('Gesli se ne ujemata.')
      return
    }

    if (geslo.length < 6) {
      setNapaka('Geslo mora imeti najmanj 6 znakov.')
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password: geslo })

    if (error) {
      setNapaka('Napaka pri ponastavitvi gesla. Poskusite znova.')
      setLoading(false)
      return
    }

    setStatus('success')
    setLoading(false)
    setTimeout(() => router.push('/prijava'), 2000)
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-5">
      <div className="w-full max-w-md">
        <a href="/" className="font-display text-xl font-bold tracking-tight text-foreground">Veljavno</a>
        <h1 className="mt-8 text-3xl font-bold tracking-tight">Novo geslo</h1>
        <p className="mt-2 text-muted-foreground">Vnesite novo geslo za vaš račun.</p>

        {status === 'success' ? (
          <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-xl">
            <p className="text-green-700 font-medium">Geslo uspešno posodobljeno!</p>
            <p className="text-green-600 text-sm mt-1">Preusmerjamo vas na prijavo...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Novo geslo</label>
              <Input type="password" value={geslo} onChange={e => setGeslo(e.target.value)} placeholder="Najmanj 6 znakov" required minLength={6} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Potrdi geslo</label>
              <Input type="password" value={potrdiGeslo} onChange={e => setPotrdiGeslo(e.target.value)} placeholder="Ponovite geslo" required />
            </div>
            {napaka && <p className="text-red-500 text-sm">{napaka}</p>}
            <Button type="submit" disabled={loading} className="mt-2 rounded-full py-6 text-xs font-semibold uppercase tracking-[0.16em]">
              {loading ? 'Shranjujem...' : 'Nastavi novo geslo'}
            </Button>
          </form>
        )}
      </div>
    </main>
  )
}