'use client'

import { useTheme } from 'next-themes'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

type Dokument = {
  id: string
  ime: string
  datum_poteka: string
  opomniki: number[]
  lastnik?: string
  kategorija?: string
}

const KATEGORIJE = [
  { vrednost: 'osebni', oznaka: '🪪 Osebni', barva: 'bg-blue-100 text-blue-700' },
  { vrednost: 'vozilo', oznaka: '🚗 Vozilo', barva: 'bg-orange-100 text-orange-700' },
  { vrednost: 'sluzbeni', oznaka: '💼 Službeni', barva: 'bg-purple-100 text-purple-700' },
  { vrednost: 'potovanja', oznaka: '✈️ Potovanja', barva: 'bg-green-100 text-green-700' },
]

const OPOMNIKI = [
  { vrednost: 7, oznaka: '1 teden prej' },
  { vrednost: 14, oznaka: '2 tedna prej' },
  { vrednost: 30, oznaka: '1 mesec prej' },
  { vrednost: 90, oznaka: '3 mesece prej' },
  { vrednost: 180, oznaka: '6 mesecev prej' },
  { vrednost: 365, oznaka: '1 leto prej' },
]

const HITRI_VNOS = [
  '🚗 Vozniško dovoljenje',
  '🪪 Osebna izkaznica',
  '🌍 Potni list',
  '🏥 Zdravstvena kartica',
  '🚌 Prometno dovoljenje',
]

function getDniDo(datum: string) {
  const danes = new Date()
  danes.setHours(0, 0, 0, 0)
  const poteka = new Date(datum)
  return Math.ceil((poteka.getTime() - danes.getTime()) / 86400000)
}

function dodajVKoledar(doc: Dokument) {
  const datum = new Date(doc.datum_poteka)
  const datumStr = datum.toISOString().split('T')[0].replace(/-/g, '')
  const ics = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'BEGIN:VEVENT',
    `UID:${doc.id}@veljavno.si`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
    `DTSTART:${datumStr}`, `DTEND:${datumStr}`,
    `SUMMARY:Poteče: ${doc.ime}`,
    `DESCRIPTION:Dokument ${doc.ime}${doc.lastnik ? ' (' + doc.lastnik + ')' : ''} poteče danes.`,
    'BEGIN:VALARM', 'ACTION:DISPLAY', 'DESCRIPTION:Opomnik: dokument poteče kmalu', 'TRIGGER:-P30D', 'END:VALARM',
    'END:VEVENT', 'END:VCALENDAR'
  ].join('\r\n')
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${doc.ime.replace(/[^a-zA-Z0-9]/g, '-')}.ics`
  a.click()
  URL.revokeObjectURL(url)
  toast.success('Dogodek pripravljen za koledar!')
}

function StatusBadge({ dni }: { dni: number }) {
  if (dni < 0) return <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-red-100 text-red-600">Poteklo pred {Math.abs(dni)} dni</span>
  if (dni === 0) return <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-red-100 text-red-600">Poteče danes!</span>
  if (dni <= 30) return <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-red-100 text-red-600">⚠ {dni} dni</span>
  if (dni <= 90) return <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-orange-100 text-orange-600">{dni} dni</span>
  return <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-100 text-green-600">✓ {dni} dni</span>
}

function ProgressBar({ dni }: { dni: number }) {
  const max = 365
  const percent = Math.max(0, Math.min(100, (dni / max) * 100))
  const color = dni <= 30 ? 'bg-red-400' : dni <= 90 ? 'bg-orange-400' : 'bg-green-400'
  return (
    <div className="w-full h-1 bg-muted rounded-full mt-3">
      <div className={`h-1 rounded-full transition-all ${color}`} style={{ width: `${percent}%` }} />
    </div>
  )
}

export default function Dashboard() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [user, setUser] = useState<any>(null)
  const [profil, setProfil] = useState<any>(null)
  const [dokumenti, setDokumenti] = useState<Dokument[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editDoc, setEditDoc] = useState<Dokument | null>(null)
  const [deleteDoc, setDeleteDoc] = useState<Dokument | null>(null)
  const [sortiranje, setSortiranje] = useState<'datum' | 'ime'>('datum')
  const [iskanje, setIskanje] = useState('')
  const [filtarKategorija, setFiltarKategorija] = useState<string>('vse')
  const [imeDoc, setImeDoc] = useState('')
  const [datumDoc, setDatumDoc] = useState('')
  const [lastnikDoc, setLastnikDoc] = useState('')
  const [izbraniOpomniki, setIzbraniOpomniki] = useState<number[]>([30, 90])
  const [kategorijaDoc, setKategorijaDoc] = useState('osebni')

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { router.push('/prijava'); return }
      const { data: profilData } = await supabase.from('profiles').select('*').eq('id', data.user.id).single()
      if (!profilData?.placilo_potrjeno) { router.push('/registracija'); return }
      setUser(data.user)
      setProfil(profilData)
      naloziDokumente(data.user.id)
    })
  }, [])

  async function naloziDokumente(userId: string) {
    const { data } = await supabase.from('documents').select('*').eq('user_id', userId).order('datum_poteka')
    setDokumenti(data || [])
    setLoading(false)
  }

  async function shraniDokument(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return
    if (editDoc) {
      await supabase.from('documents').update({ ime: imeDoc, datum_poteka: datumDoc, opomniki: izbraniOpomniki, lastnik: lastnikDoc, kategorija: kategorijaDoc }).eq('id', editDoc.id)
      toast.success('Dokument posodobljen!')
    } else {
      await supabase.from('documents').insert({ user_id: user.id, ime: imeDoc, datum_poteka: datumDoc, opomniki: izbraniOpomniki, lastnik: lastnikDoc, kategorija: kategorijaDoc })
      toast.success('Dokument dodan!')
    }
    setShowForm(false); setEditDoc(null); setImeDoc(''); setDatumDoc(''); setLastnikDoc(''); setIzbraniOpomniki([30, 90]); setKategorijaDoc('osebni')
    naloziDokumente(user.id)
  }

  async function izbrisiDokument() {
    if (!deleteDoc) return
    await supabase.from('documents').delete().eq('id', deleteDoc.id)
    setDeleteDoc(null)
    toast.success('Dokument izbrisan!')
    naloziDokumente(user.id)
  }

  function urediDokument(doc: Dokument) {
    setEditDoc(doc)
    setImeDoc(doc.ime)
    setDatumDoc(doc.datum_poteka)
    setLastnikDoc(doc.lastnik || '')
    setIzbraniOpomniki(doc.opomniki || [30, 90])
    setKategorijaDoc(doc.kategorija || 'osebni')
    setShowForm(true)
  }

  function toggleOpomnik(vrednost: number) {
    setIzbraniOpomniki(prev => prev.includes(vrednost) ? prev.filter(v => v !== vrednost) : [...prev, vrednost])
  }

  async function odjava() {
    await supabase.auth.signOut()
    router.push('/')
  }

  const sortiraneDokumenti = [...dokumenti]
    .filter(d => {
      const ujemaIskanje = d.ime.toLowerCase().includes(iskanje.toLowerCase()) || (d.lastnik || '').toLowerCase().includes(iskanje.toLowerCase())
      const ujemaKategorija = filtarKategorija === 'vse' || d.kategorija === filtarKategorija
      return ujemaIskanje && ujemaKategorija
    })
    .sort((a, b) => {
      if (sortiranje === 'ime') return a.ime.localeCompare(b.ime)
      return new Date(a.datum_poteka).getTime() - new Date(b.datum_poteka).getTime()
    })

  function izvozCSV() {
    const headers = ['Ime dokumenta', 'Lastnik', 'Kategorija', 'Datum poteka', 'Dni do poteka', 'Opomniki']
    const vrstice = sortiraneDokumenti.map(doc => {
      const dni = getDniDo(doc.datum_poteka)
      return [doc.ime, doc.lastnik || '', doc.kategorija || '', new Date(doc.datum_poteka).toLocaleDateString('sl-SI'), dni.toString(), (doc.opomniki || []).map(o => OPOMNIKI.find(op => op.vrednost === o)?.oznaka).filter(Boolean).join(' | ')]
    })
    const csv = [headers, ...vrstice].map(v => v.map(c => `"${c}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `veljavno-dokumenti-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Dokumenti izvoženi!')
  }

  const kmalu = dokumenti.filter(d => getDniDo(d.datum_poteka) <= 30).length
  const pozor = dokumenti.filter(d => { const d2 = getDniDo(d.datum_poteka); return d2 > 30 && d2 <= 90 }).length
  const veljavni = dokumenti.filter(d => getDniDo(d.datum_poteka) > 90).length

  function odpriForm() {
    setShowForm(true); setEditDoc(null); setImeDoc(''); setDatumDoc(''); setLastnikDoc(''); setIzbraniOpomniki([30, 90]); setKategorijaDoc('osebni')
  }

  if (loading) return (
    <main className="min-h-screen bg-background">
      <div className="h-16 border-b border-border bg-background" />
      <div className="bg-primary h-40 animate-pulse" />
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[1,2,3].map(i => <div key={i} className="rounded-2xl p-4 border border-border animate-pulse bg-muted h-20" />)}
        </div>
        <div className="flex flex-col gap-4">
          {[1,2,3].map(i => <div key={i} className="bg-muted border border-border rounded-2xl p-6 h-24 animate-pulse" />)}
        </div>
      </div>
    </main>
  )

  return (
    <main className="min-h-screen bg-background">

      {/* Sticky Nav */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-xl px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <svg width="28" height="34" viewBox="0 0 60 72" fill="none">
              <rect x="0" y="0" width="60" height="72" rx="10" fill="#2563eb"/>
              <rect x="10" y="8" width="26" height="4" rx="2" fill="white" fillOpacity="0.5"/>
              <rect x="10" y="17" width="40" height="4" rx="2" fill="white" fillOpacity="0.35"/>
              <rect x="10" y="26" width="32" height="4" rx="2" fill="white" fillOpacity="0.35"/>
              <rect x="10" y="35" width="36" height="4" rx="2" fill="white" fillOpacity="0.35"/>
              <circle cx="43" cy="56" r="14" fill="white"/>
              <path d="M36 56 L41 61 L50 50" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div className="flex flex-col">
              <span className="font-display text-base font-bold tracking-[0.08em] leading-tight">VELJAVNO</span>
              <div className="w-6 h-0.5 bg-primary mt-0.5" />
            </div>
          </a>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden md:block">{user?.email}</span>
            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2 rounded-full border border-border hover:bg-secondary transition-colors">
              {theme === 'dark' ? (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
              ) : (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
              )}
            </button>
            <a href="/nastavitve" className="p-2 rounded-full border border-border hover:bg-secondary transition-colors">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
              </svg>
            </a>
            <Button variant="outline" onClick={odjava} className="rounded-full text-xs px-4 py-2">Odjava</Button>
          </div>
        </div>
      </nav>

      {/* Hero Header */}
      <div className="bg-primary">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="text-white">
              <p className="text-blue-200 text-sm mb-1">Dober dan, {profil?.ime?.split(' ')[0] || 'uporabnik'} 👋</p>
              <h1 className="text-2xl font-bold">Moji dokumenti</h1>
              <p className="text-blue-200 text-sm mt-1">{dokumenti.length} {dokumenti.length === 1 ? 'dokument' : 'dokumentov'} skupaj</p>
            </div>
            <Button onClick={odpriForm} className="bg-white text-primary hover:bg-blue-50 rounded-full text-xs font-semibold uppercase tracking-[0.16em] px-6 w-fit">
              + Dodaj dokument
            </Button>
          </div>

          {/* Stats */}
          {dokumenti.length > 0 && (
            <div className="grid grid-cols-3 gap-4 mt-8">
              <div className="bg-white/10 rounded-2xl p-4 text-center">
                <div className="text-2xl font-bold text-white">{kmalu}</div>
                <div className="text-xs text-red-200 mt-1">⚠ Poteče kmalu</div>
              </div>
              <div className="bg-white/10 rounded-2xl p-4 text-center">
                <div className="text-2xl font-bold text-white">{pozor}</div>
                <div className="text-xs text-orange-200 mt-1">Pozor</div>
              </div>
              <div className="bg-white/10 rounded-2xl p-4 text-center">
                <div className="text-2xl font-bold text-white">{veljavni}</div>
                <div className="text-xs text-green-200 mt-1">✓ Veljavni</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* Bannerji */}
        {kmalu > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-5 flex items-center gap-3">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-red-700">{kmalu === 1 ? 'En dokument poteče v manj kot 30 dneh!' : `${kmalu} dokumenti potečejo v manj kot 30 dneh!`}</p>
              <p className="text-xs text-red-500 mt-0.5">Preverite in pravočasno podaljšajte.</p>
            </div>
          </div>
        )}

        {profil?.affiliate_koda && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-5 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm">💰</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-green-800">Vaša affiliate koda: <span className="tracking-widest">{profil.affiliate_koda}</span></p>
                <p className="text-xs text-green-600">Zaslužite 30% provizije za vsako prodajo.</p>
              </div>
            </div>
            <a href="/affiliate-dashboard" className="bg-green-600 text-white text-xs font-semibold px-4 py-2 rounded-full hover:bg-green-700 transition-colors flex-shrink-0">Dashboard →</a>
          </div>
        )}

        {dokumenti.length >= 1 && profil?.paket === 'samostojni' && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-5 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm">👨‍👩‍👧‍👦</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-blue-800">Sledite celotni družini</p>
                <p className="text-xs text-blue-600">Nadgradite na Družinski paket — do 6 oseb za 9,99 €.</p>
              </div>
            </div>
            <button onClick={async () => {
              const res = await fetch('/api/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ paket: 'druzinski', userId: user.id, email: user.email }) })
              const data = await res.json()
              if (data.url) window.location.href = data.url
            }} className="bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded-full hover:bg-blue-700 transition-colors flex-shrink-0">
              Nadgradi →
            </button>
          </div>
        )}

        {/* Filtri */}
        <div className="flex items-center gap-3 flex-wrap mb-6">
          <div className="flex items-center gap-2 border border-border rounded-full px-3 py-2 bg-background">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-muted-foreground">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input type="text" value={iskanje} onChange={e => setIskanje(e.target.value)} placeholder="Išči..." className="text-xs bg-transparent outline-none text-foreground placeholder:text-muted-foreground w-28" />
            {iskanje && <button onClick={() => setIskanje('')} className="text-muted-foreground hover:text-foreground"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>}
          </div>
          <div className="flex items-center gap-2 border border-border rounded-full px-3 py-2 bg-background">
            <span className="text-xs text-muted-foreground">Sortiraj:</span>
            <select value={sortiranje} onChange={e => setSortiranje(e.target.value as 'datum' | 'ime')} className="text-xs bg-transparent text-muted-foreground outline-none cursor-pointer">
              <option value="datum">po datumu</option>
              <option value="ime">po imenu</option>
            </select>
          </div>
          <div className="flex items-center gap-2 border border-border rounded-full px-3 py-2 bg-background">
            <span className="text-xs text-muted-foreground">Kategorija:</span>
            <select value={filtarKategorija} onChange={e => setFiltarKategorija(e.target.value)} className="text-xs bg-transparent text-muted-foreground outline-none cursor-pointer">
              <option value="vse">Vse</option>
              {KATEGORIJE.map(k => <option key={k.vrednost} value={k.vrednost}>{k.oznaka}</option>)}
            </select>
          </div>
          {dokumenti.length > 0 && (
            <button onClick={izvozCSV} className="flex items-center gap-1.5 text-xs border border-border rounded-full px-3 py-2 text-muted-foreground hover:bg-secondary transition-colors bg-background">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              CSV
            </button>
          )}
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-card border border-border rounded-2xl p-6 mb-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-lg">{editDoc ? '✏️ Uredi dokument' : '➕ Nov dokument'}</h2>
              <button onClick={() => { setShowForm(false); setEditDoc(null) }} className="text-muted-foreground hover:text-foreground">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            {!editDoc && (
              <div className="flex flex-wrap gap-2 mb-5">
                <p className="text-xs text-muted-foreground w-full">Hitri vnos:</p>
                {HITRI_VNOS.map(ime => (
                  <button key={ime} type="button" onClick={() => setImeDoc(ime)} className={`text-xs border rounded-full px-3 py-1.5 transition-colors ${imeDoc === ime ? 'border-primary text-primary bg-primary/5' : 'border-border text-muted-foreground hover:bg-secondary'}`}>
                    {ime}
                  </button>
                ))}
              </div>
            )}
            <form onSubmit={shraniDokument} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Ime dokumenta</label>
                <Input value={imeDoc} onChange={e => setImeDoc(e.target.value)} placeholder="npr. Vozniško dovoljenje" required className="rounded-xl" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Lastnik dokumenta</label>
                <Input value={lastnikDoc} onChange={e => setLastnikDoc(e.target.value)} placeholder="npr. Janez, Mama..." className="rounded-xl" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Datum poteka</label>
                <Input type="date" value={datumDoc} onChange={e => setDatumDoc(e.target.value)} required className="rounded-xl" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Kategorija</label>
                <div className="flex flex-wrap gap-2">
                  {KATEGORIJE.map(k => (
                    <button key={k.vrednost} type="button" onClick={() => setKategorijaDoc(k.vrednost)} className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${kategorijaDoc === k.vrednost ? 'border-primary bg-primary/5 text-primary' : 'border-border text-muted-foreground hover:bg-secondary'}`}>
                      {k.oznaka}
                    </button>
                  ))}
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium mb-2 block">Opomni me:</label>
                <div className="flex flex-wrap gap-3">
                  {OPOMNIKI.map(o => (
                    <label key={o.vrednost} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="checkbox" checked={izbraniOpomniki.includes(o.vrednost)} onChange={() => toggleOpomnik(o.vrednost)} className="w-4 h-4 accent-primary" />
                      {o.oznaka}
                    </label>
                  ))}
                </div>
              </div>
              <div className="md:col-span-2 flex gap-3">
                <Button type="submit" className="rounded-full text-xs font-semibold uppercase tracking-[0.16em]">
                  {editDoc ? 'Shrani spremembe' : 'Dodaj dokument'}
                </Button>
                <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditDoc(null) }} className="rounded-full text-xs font-semibold uppercase tracking-[0.16em]">Prekliči</Button>
              </div>
            </form>
          </div>
        )}

        {/* Dokumenti */}
        {dokumenti.length === 0 && !showForm ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg width="36" height="44" viewBox="0 0 60 72" fill="none">
                <rect x="0" y="0" width="60" height="72" rx="10" fill="#2563eb"/>
                <rect x="10" y="8" width="26" height="4" rx="2" fill="white" fillOpacity="0.5"/>
                <rect x="10" y="17" width="40" height="4" rx="2" fill="white" fillOpacity="0.35"/>
                <rect x="10" y="26" width="32" height="4" rx="2" fill="white" fillOpacity="0.35"/>
                <rect x="10" y="35" width="36" height="4" rx="2" fill="white" fillOpacity="0.35"/>
                <circle cx="43" cy="56" r="14" fill="white"/>
                <path d="M36 56 L41 61 L50 50" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">Dobrodošli v Veljavno!</h2>
            <p className="text-muted-foreground mb-8 max-w-sm mx-auto">Dodajte svoje dokumente in nikoli več ne zamudite datuma poteka.</p>
            <Button onClick={odpriForm} className="rounded-full text-xs font-semibold uppercase tracking-[0.16em] px-8">
              + Dodaj prvi dokument
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {sortiraneDokumenti.length === 0 && (iskanje || filtarKategorija !== 'vse') ? (
              <div className="text-center py-12 text-muted-foreground">
                <p className="text-sm">Ni rezultatov za iskanje</p>
                <button onClick={() => { setIskanje(''); setFiltarKategorija('vse') }} className="text-xs text-primary hover:underline mt-2">Počisti filtre</button>
              </div>
            ) : (
              sortiraneDokumenti.map(doc => {
                const dni = getDniDo(doc.datum_poteka)
                const kategorija = KATEGORIJE.find(k => k.vrednost === doc.kategorija)
                const borderColor = dni <= 30 ? 'border-red-200' : dni <= 90 ? 'border-orange-200' : 'border-border'
                const bgColor = dni <= 30 ? 'bg-red-50/30' : 'bg-card'
                return (
                  <div key={doc.id} className={`${bgColor} border ${borderColor} rounded-2xl p-5 transition-all hover:shadow-md`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                          <h3 className="font-semibold text-base">{doc.ime}</h3>
                          <StatusBadge dni={dni} />
                          {kategorija && (
                            <span className={`text-xs px-2 py-0.5 rounded-full ${kategorija.barva}`}>{kategorija.oznaka}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          {doc.lastnik && <span>👤 {doc.lastnik}</span>}
                          <span>📅 {new Date(doc.datum_poteka).toLocaleDateString('sl-SI')}</span>
                          <span className="hidden sm:inline">🔔 {(doc.opomniki || []).map(o => OPOMNIKI.find(op => op.vrednost === o)?.oznaka).filter(Boolean).join(', ') || 'Brez opomnikov'}</span>
                        </div>
                        <ProgressBar dni={dni} />
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button onClick={() => dodajVKoledar(doc)} className="p-2 rounded-xl border border-border hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground" title="Dodaj v koledar">
                          📅
                        </button>
                        <button onClick={() => urediDokument(doc)} className="p-2 rounded-xl border border-border hover:bg-secondary transition-colors text-muted-foreground hover:text-primary" title="Uredi">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        </button>
                        <button onClick={() => setDeleteDoc(doc)} className="p-2 rounded-xl border border-border hover:bg-red-50 hover:border-red-200 transition-colors text-muted-foreground hover:text-red-500" title="Izbriši">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        )}
      </div>

      <Dialog open={!!deleteDoc} onOpenChange={() => setDeleteDoc(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Izbriši dokument</DialogTitle>
            <DialogDescription>
              Ali ste prepričani da želite izbrisati <strong>{deleteDoc?.ime}</strong>? Tega dejanja ni mogoče razveljaviti.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDoc(null)} className="rounded-full text-xs font-semibold uppercase tracking-[0.16em]">Prekliči</Button>
            <Button onClick={izbrisiDokument} className="rounded-full text-xs font-semibold uppercase tracking-[0.16em] bg-red-500 hover:bg-red-600">Izbriši</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </main>
  )
}