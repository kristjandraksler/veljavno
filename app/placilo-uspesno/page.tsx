'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function PlaciloUspesno() {
  const router = useRouter()
  const [ime, setIme] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return
      const { data: profil } = await supabase
        .from('profiles')
        .select('ime')
        .eq('id', data.user.id)
        .single()
      if (profil?.ime) setIme(profil.ime)
    })
  }, [])

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-5">
      <div className="w-full max-w-md text-center">
        <a href="/" className="flex items-center gap-3 justify-center mb-10">
          <svg width="36" height="44" viewBox="0 0 60 72" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="60" height="72" rx="10" fill="#2563eb"/>
            <rect x="10" y="8" width="26" height="4" rx="2" fill="white" fillOpacity="0.5"/>
            <rect x="10" y="17" width="40" height="4" rx="2" fill="white" fillOpacity="0.35"/>
            <rect x="10" y="26" width="32" height="4" rx="2" fill="white" fillOpacity="0.35"/>
            <rect x="10" y="35" width="36" height="4" rx="2" fill="white" fillOpacity="0.35"/>
            <circle cx="43" cy="56" r="14" fill="white"/>
            <path d="M36 56 L41 61 L50 50" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div className="flex flex-col items-start">
            <span className="font-display text-xl font-bold tracking-[0.08em] leading-tight">VELJAVNO</span>
            <span className="text-xs text-muted-foreground">Sistem za pravočasne opomnike</span>
            <div className="w-8 h-0.5 bg-primary mt-1" />
          </div>
        </a>

        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        </div>

        <h1 className="text-3xl font-bold mb-2">
          {ime ? `Hvala, ${ime}!` : 'Plačilo uspešno!'}
        </h1>
        <p className="text-muted-foreground mb-2">Vaš račun je aktiviran.</p>
        <p className="text-sm text-muted-foreground mb-8">Prejeli boste potrditveni e-mail. Zdaj lahko dodate svoje prve dokumente.</p>

        <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto mb-8">
          {[
            { ime: 'Vozniško', ikona: '🚗' },
            { ime: 'Osebna', ikona: '🪪' },
            { ime: 'Potni list', ikona: '🌍' },
          ].map(doc => (
            <div key={doc.ime} className="bg-card border border-border rounded-xl px-3 py-3 text-xs text-muted-foreground flex flex-col items-center gap-1">
              <span className="text-2xl">{doc.ikona}</span>
              <span>{doc.ime}</span>
            </div>
          ))}
        </div>

        <Button onClick={() => router.push('/dashboard')} className="rounded-full px-8 py-6 text-xs font-semibold uppercase tracking-[0.16em] w-full">
          Dodaj prve dokumente →
        </Button>

        <p className="text-xs text-muted-foreground mt-4">
          Težave? <a href="mailto:info@veljavno.si" className="text-primary hover:underline">info@veljavno.si</a>
        </p>
      </div>
    </main>
  )
}