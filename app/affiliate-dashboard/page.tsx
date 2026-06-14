'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

type Konverzija = {
  id: string
  paket: string
  znesek: number
  datum: string
}

export default function AffiliateDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [profil, setProfil] = useState<any>(null)
  const [konverzije, setKonverzije] = useState<Konverzija[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { router.push('/prijava'); return }

      const { data: profilData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single()

      if (!profilData?.placilo_potrjeno) { router.push('/registracija'); return }
      if (!profilData?.affiliate_koda) { router.push('/nastavitve'); return }

      setUser(data.user)
      setProfil(profilData)

      const { data: konverzijeData } = await supabase
        .from('affiliate_konverzije')
        .select('*')
        .eq('ref_koda', profilData.affiliate_koda)
        .order('datum', { ascending: false })

      setKonverzije(konverzijeData || [])
      setLoading(false)
    })
  }, [])

  if (loading) return <div className="min-h-screen flex items-center justify-center">Nalagam...</div>

  const skupajZasluzek = konverzije.reduce((sum, k) => sum + (k.znesek * 0.3), 0)
  const skupajKonverzij = konverzije.length

  return (
    <main className="min-h-screen bg-background">
      <nav className="border-b border-border px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
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
          <a href="/nastavitve" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Nastavitve</a>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center gap-3 mb-8">
          <a href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Dashboard</a>
          <span className="text-muted-foreground">/</span>
          <span className="text-sm font-medium">Affiliate dashboard</span>
        </div>

        <h1 className="text-2xl font-bold mb-2">Affiliate dashboard</h1>
        <p className="text-muted-foreground mb-8">Vaša koda: <span className="font-bold text-primary">{profil?.affiliate_koda}</span></p>

        {/* Statistike */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-card border border-border rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold text-primary mb-1">{skupajKonverzij}</div>
            <div className="text-sm text-muted-foreground">Skupaj prodaj</div>
          </div>
          <div className="bg-card border border-border rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-1">{skupajZasluzek.toFixed(2)} €</div>
            <div className="text-sm text-muted-foreground">Skupaj zaslužek</div>
          </div>
          <div className="bg-card border border-border rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold text-orange-600 mb-1">30%</div>
            <div className="text-sm text-muted-foreground">Provizija</div>
          </div>
        </div>

        {/* Link */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-8">
          <h2 className="font-semibold mb-3">Vaš referral link</h2>
          <div className="flex items-center gap-3 bg-secondary/50 rounded-xl px-4 py-3">
            <span className="text-sm text-muted-foreground flex-1">veljavno.si?ref={profil?.affiliate_koda}</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(`https://veljavno.si?ref=${profil?.affiliate_koda}`)
                alert('Link kopiran!')
              }}
              className="text-xs border border-border px-3 py-1.5 rounded-full hover:bg-secondary transition-colors flex-shrink-0"
            >
              Kopiraj
            </button>
          </div>
        </div>

        {/* Konverzije */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="font-semibold mb-4">Zgodovina konverzij</h2>
          {konverzije.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-sm mb-2">Še nimate konverzij.</p>
              <p className="text-xs text-muted-foreground">Delite vaš link in začnite zaslužiti!</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {konverzije.map(k => (
                <div key={k.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm font-medium capitalize">{k.paket} paket</p>
                    <p className="text-xs text-muted-foreground">{new Date(k.datum).toLocaleDateString('sl-SI')}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{k.znesek} €</p>
                    <p className="text-xs text-green-600">+{(k.znesek * 0.3).toFixed(2)} € provizija</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}