'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

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

  function kopirajLink() {
    navigator.clipboard.writeText('https://veljavno.si')
    toast.success('Link kopiran!')
  }

  const waUrl = `https://wa.me/?text=${encodeURIComponent('Priporocam Veljavno - aplikacijo za opomnike dokumentov! https://veljavno.si')}`
  const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://veljavno.si')}`

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

        <Button onClick={() => router.push('/dashboard')} className="rounded-full px-8 py-6 text-xs font-semibold uppercase tracking-[0.16em] w-full mb-8">
          Dodaj prve dokumente →
        </Button>

        <div className="border border-border rounded-2xl p-6">
          <p className="text-sm font-semibold mb-1">Všeč vam je Veljavno?</p>
          <p className="text-xs text-muted-foreground mb-4">Priporočite ga prijateljem in družini!</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <a href={waUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-green-500 text-white text-xs font-semibold px-4 py-2 rounded-full hover:bg-green-600 transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp
            </a>
            <a href={fbUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded-full hover:bg-blue-700 transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </a>
            <button onClick={kopirajLink} className="flex items-center gap-2 border border-border text-xs font-semibold px-4 py-2 rounded-full hover:bg-secondary transition-colors text-muted-foreground">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
              </svg>
              Kopiraj
            </button>
          </div>
        </div>

        <p className="text-xs text-muted-foreground mt-6">
          Težave? <a href="mailto:info@veljavno.si" className="text-primary hover:underline">info@veljavno.si</a>
        </p>
      </div>
    </main>
  )
}