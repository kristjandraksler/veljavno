'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function PozabljanoGeslo() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-geslo`,
    })
    if (error) setStatus('error')
    else setStatus('success')
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-5">
      <div className="w-full max-w-md">
        <a href="/" className="font-display text-xl font-bold tracking-tight text-foreground">Veljavno</a>
        <h1 className="mt-8 text-3xl font-bold tracking-tight">Pozabljeno geslo</h1>
        <p className="mt-2 text-muted-foreground">Vnesite vaš e-mail in poslali vam bomo povezavo za ponastavitev gesla.</p>

        {status === 'success' ? (
          <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-xl">
            <p className="text-green-700 font-medium">E-mail poslan!</p>
            <p className="text-green-600 text-sm mt-1">Preverite vaš inbox in kliknite na povezavo za ponastavitev gesla.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">E-mail</label>
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="janez@email.si" required />
            </div>
            {status === 'error' && <p className="text-red-500 text-sm">Napaka pri pošiljanju. Poskusite znova.</p>}
            <Button type="submit" disabled={loading} className="mt-2 rounded-full py-6 text-xs font-semibold uppercase tracking-[0.16em]">
              {loading ? 'Pošiljam...' : 'Pošlji povezavo'}
            </Button>
            <a href="/prijava" className="text-sm text-center text-muted-foreground hover:text-foreground transition-colors">Nazaj na prijavo</a>
          </form>
        )}
      </div>
    </main>
  )
}