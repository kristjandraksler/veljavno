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
}

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

function StatusBadge({ dni }: { dni: number }) {
  if (dni < 0) return <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-600">Poteklo pred {Math.abs(dni)} dni</span>
  if (dni === 0) return <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-600">Poteče danes!</span>
  if (dni <= 30) return <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-600">Poteče čez {dni} dni</span>
  if (dni <= 90) return <span className="text-xs px-2 py-1 rounded-full bg-orange-100 text-orange-600">Poteče čez {dni} dni</span>
  return <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-600">Veljavno — {dni} dni</span>
}

function ProgressBar({ dni }: { dni: number }) {
  const max = 365
  const percent = Math.max(0, Math.min(100, (dni / max) * 100))
  const color = dni <= 30 ? 'bg-red-400' : dni <= 90 ? 'bg-orange-400' : 'bg-green-400'
  return (
    <div className="w-full h-1.5 bg-muted rounded-full mt-2">
      <div className={`h-1.5 rounded-full transition-all ${color}`} style={{ width: `${percent}%` }} />
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

  const [imeDoc, setImeDoc] = useState('')
  const [datumDoc, setDatumDoc] = useState('')
  const [lastnikDoc, setLastnikDoc] = useState('')
  const [izbraniOpomniki, setIzbraniOpomniki] = useState<number[]>([30, 90])

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
      await supabase.from('documents').update({ ime: imeDoc, datum_poteka: datumDoc, opomniki: izbraniOpomniki, lastnik: lastnikDoc }).eq('id', editDoc.id)
      toast.success('Dokument posodobljen!')
    } else {
      await supabase.from('documents').insert({ user_id: user.id, ime: imeDoc, datum_poteka: datumDoc, opomniki: izbraniOpomniki, lastnik: lastnikDoc })
      toast.success('Dokument dodan!')
    }
    setShowForm(false); setEditDoc(null); setImeDoc(''); setDatumDoc(''); setLastnikDoc(''); setIzbraniOpomniki([30, 90])
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
    setEditDoc(doc); setImeDoc(doc.ime); setDatumDoc(doc.datum_poteka); setLastnikDoc(doc.lastnik || ''); setIzbraniOpomniki(doc.opomniki || [30, 90]); setShowForm(true)
  }

  function toggleOpomnik(vrednost: number) {
    setIzbraniOpomniki(prev => prev.includes(vrednost) ? prev.filter(v => v !== vrednost) : [...prev, vrednost])
  }

  async function odjava() {
    await supabase.auth.signOut()
    router.push('/')
  }

  const sortiraneDokumenti = [...dokumenti]
    .filter(d => d.ime.toLowerCase().includes(iskanje.toLowerCase()) || (d.lastnik || '').toLowerCase().includes(iskanje.toLowerCase()))
    .sort((a, b) => {
      if (sortiranje === 'ime') return a.ime.localeCompare(b.ime)
      return new Date(a.datum_poteka).getTime() - new Date(b.datum_poteka).getTime()
    })

  function izvozCSV() {
    const headers = ['Ime dokumenta', 'Lastnik', 'Datum poteka', 'Dni do poteka', 'Opomniki']
    const vrstice = sortiraneDokumenti.map(doc => {
      const dni = getDniDo(doc.datum_poteka)
      return [doc.ime, doc.lastnik || '', new Date(doc.datum_poteka).toLocaleDateString('sl-SI'), dni.toString(), (doc.opomniki || []).map(o => OPOMNIKI.find(op => op.vrednost === o)?.oznaka).filter(Boolean).join(' | ')]
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

  if (loading) return (
    <main className="min-h-screen bg-background">
      <nav className="border-b border-border px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-10 bg-muted rounded-lg animate-pulse" />
            <div className="flex flex-col gap-1">
              <div className="w-24 h-4 bg-muted rounded animate-pulse" />
              <div className="w-32 h-3 bg-muted rounded animate-pulse" />
            </div>
          </div>
        </div>
      </nav>
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex justify-between mb-8">
          <div>
            <div className="w-40 h-7 bg-muted rounded animate-pulse mb-2" />
            <div className="w-24 h-4 bg-muted rounded animate-pulse" />
          </div>
          <div className="w-36 h-9 bg-muted rounded-full animate-pulse" />
        </div>
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
      <nav className="border-b border-border px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
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
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden md:block">{user?.email}</span>
            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2 rounded-full border border-border hover:bg-secondary transition-colors" aria-label="Preklopi temo">
              {theme === 'dark' ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              )}
            </button>
            <Button variant="outline" onClick={odjava} className="rounded-full text-xs px-4 py-2">Odjava</Button>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold">Moji dokumenti</h1>
              <p className="text-muted-foreground text-sm mt-1">{dokumenti.length} {dokumenti.length === 1 ? 'dokument' : 'dokumentov'}</p>
            </div>
            <Button onClick={() => { setShowForm(true); setEditDoc(null); setImeDoc(''); setDatumDoc(''); setLastnikDoc(''); setIzbraniOpomniki([30, 90]) }} className="rounded-full text-xs font-semibold uppercase tracking-[0.16em] w-fit">
              + Dodaj dokument
            </Button>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 border border-border rounded-full px-3 py-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input type="text" value={iskanje} onChange={e => setIskanje(e.target.value)} placeholder="Išči dokumente..." className="text-xs bg-transparent outline-none text-foreground placeholder:text-muted-foreground w-36" />
              {iskanje && (
                <button onClick={() => setIskanje('')} className="text-muted-foreground hover:text-foreground">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              )}
            </div>
            <div className="flex items-center gap-2 border border-border rounded-full px-3 py-2 w-fit">
              <span className="text-xs text-muted-foreground">Sortiraj:</span>
              <select value={sortiranje} onChange={e => setSortiranje(e.target.value as 'datum' | 'ime')} className="text-xs bg-transparent text-muted-foreground outline-none cursor-pointer">
                <option value="datum">po datumu</option>
                <option value="ime">po imenu</option>
              </select>
            </div>
            {dokumenti.length > 0 && (
              <button onClick={izvozCSV} className="flex items-center gap-1.5 text-xs border border-border rounded-full px-3 py-2 text-muted-foreground hover:bg-secondary transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Izvozi CSV
              </button>
            )}
          </div>
        </div>

        {/* Upsell banner za Samostojni paket */}
        {dokumenti.length >= 1 && profil?.paket === 'samostojni' && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm">👨‍👩‍👧‍👦</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-blue-800">Imate družino?</p>
                <p className="text-xs text-blue-600">Nadgradite na Družinski paket in zaščitite dokumente vseh članov.</p>
              </div>
            </div>
            <button onClick={async () => {
              const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ paket: 'druzinski', userId: user.id, email: user.email }),
              })
              const data = await res.json()
              if (data.url) window.location.href = data.url
            }} className="bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded-full hover:bg-blue-700 transition-colors flex-shrink-0">
              Nadgradi za 9,99 € →
            </button>
          </div>
        )}

        {dokumenti.filter(d => getDniDo(d.datum_poteka) <= 30).length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 flex items-center gap-3">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-red-700">
                {dokumenti.filter(d => getDniDo(d.datum_poteka) <= 30).length === 1 ? 'En dokument poteče v manj kot 30 dneh!' : `${dokumenti.filter(d => getDniDo(d.datum_poteka) <= 30).length} dokumenti potečejo v manj kot 30 dneh!`}
              </p>
              <p className="text-xs text-red-500 mt-0.5">Preverite in pravočasno podaljšajte.</p>
            </div>
          </div>
        )}

        {dokumenti.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-red-50 border border-red-100 rounded-2xl p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{dokumenti.filter(d => getDniDo(d.datum_poteka) <= 30).length}</div>
              <div className="text-xs text-red-500 mt-1">Poteče kmalu</div>
            </div>
            <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{dokumenti.filter(d => { const d2 = getDniDo(d.datum_poteka); return d2 > 30 && d2 <= 90 }).length}</div>
              <div className="text-xs text-orange-500 mt-1">Pozor</div>
            </div>
            <div className="bg-green-50 border border-green-100 rounded-2xl p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{dokumenti.filter(d => getDniDo(d.datum_poteka) > 90).length}</div>
              <div className="text-xs text-green-500 mt-1">Veljavni</div>
            </div>
          </div>
        )}

        {showForm && (
          <div className="bg-card border border-border rounded-2xl p-6 mb-6">
            <h2 className="font-semibold mb-4">{editDoc ? 'Uredi dokument' : 'Nov dokument'}</h2>
            {!editDoc && (
              <div className="flex flex-wrap gap-2 mb-4">
                <p className="text-xs text-muted-foreground w-full mb-1">Hitri vnos:</p>
                {HITRI_VNOS.map(ime => (
                  <button key={ime} type="button" onClick={() => setImeDoc(ime)} className={`text-xs border rounded-full px-3 py-1.5 transition-colors ${imeDoc === ime ? 'border-primary text-primary bg-primary/5' : 'border-border text-muted-foreground hover:bg-secondary'}`}>
                    {ime}
                  </button>
                ))}
              </div>
            )}
            <form onSubmit={shraniDokument} className="flex flex-col gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Ime dokumenta</label>
                <Input value={imeDoc} onChange={e => setImeDoc(e.target.value)} placeholder="npr. Vozniško dovoljenje" required />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Lastnik dokumenta</label>
                <Input value={lastnikDoc} onChange={e => setLastnikDoc(e.target.value)} placeholder="npr. Janez, Mama, Podjetje..." />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Datum poteka</label>
                <Input type="date" value={datumDoc} onChange={e => setDatumDoc(e.target.value)} required />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Opomni me:</label>
                <div className="flex flex-wrap gap-3">
                  {OPOMNIKI.map(o => (
                    <label key={o.vrednost} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="checkbox" checked={izbraniOpomniki.includes(o.vrednost)} onChange={() => toggleOpomnik(o.vrednost)} className="w-4 h-4" />
                      {o.oznaka}
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 mt-2">
                <Button type="submit" className="rounded-full text-xs font-semibold uppercase tracking-[0.16em]">Shrani</Button>
                <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditDoc(null) }} className="rounded-full text-xs font-semibold uppercase tracking-[0.16em]">Prekliči</Button>
              </div>
            </form>
          </div>
        )}

        {dokumenti.length === 0 && !showForm ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg width="36" height="44" viewBox="0 0 60 72" fill="none" xmlns="http://www.w3.org/2000/svg">
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
            <p className="text-muted-foreground mb-2">Začnite z dodajanjem vaših dokumentov.</p>
            <p className="text-sm text-muted-foreground mb-8">Vozniško dovoljenje, osebna izkaznica, potni list — dodajte vse in nastavite opomnike.</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg mx-auto mb-8">
              {[
                { ime: 'Vozniško dovoljenje', ikona: '🚗' },
                { ime: 'Osebna izkaznica', ikona: '🪪' },
                { ime: 'Potni list', ikona: '🌍' },
              ].map(doc => (
                <div key={doc.ime} className="bg-card border border-border rounded-xl px-4 py-3 text-sm text-muted-foreground flex items-center gap-2">
                  <span className="text-lg">{doc.ikona}</span>
                  <span>{doc.ime}</span>
                </div>
              ))}
            </div>
            <Button onClick={() => setShowForm(true)} className="rounded-full text-xs font-semibold uppercase tracking-[0.16em] px-8">
              + Dodaj prvi dokument
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {sortiraneDokumenti.length === 0 && iskanje ? (
              <div className="text-center py-12 text-muted-foreground">
                <p className="text-sm">Ni rezultatov za iskanje "{iskanje}"</p>
                <button onClick={() => setIskanje('')} className="text-xs text-primary hover:underline mt-2">Počisti iskanje</button>
              </div>
            ) : (
              sortiraneDokumenti.map(doc => {
                const dni = getDniDo(doc.datum_poteka)
                return (
                  <div key={doc.id} className={`bg-card border rounded-2xl p-6 flex items-center justify-between gap-4 flex-wrap ${dni <= 30 ? 'border-red-200' : dni <= 90 ? 'border-orange-200' : 'border-border'}`}>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold">{doc.ime}</h3>
                        <StatusBadge dni={dni} />
                      </div>
                      {doc.lastnik && <p className="text-xs text-muted-foreground mb-1">👤 {doc.lastnik}</p>}
                      <p className="text-sm text-muted-foreground">Poteče: {new Date(doc.datum_poteka).toLocaleDateString('sl-SI')}</p>
                      <p className="text-xs text-muted-foreground mt-1">Opomniki: {(doc.opomniki || []).map(o => OPOMNIKI.find(op => op.vrednost === o)?.oznaka).filter(Boolean).join(', ') || 'Ni nastavljenih'}</p>
                      <ProgressBar dni={dni} />
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => urediDokument(doc)} className="rounded-full text-xs px-4">Uredi</Button>
                      <Button variant="outline" onClick={() => setDeleteDoc(doc)} className="rounded-full text-xs px-4 text-red-500 border-red-200 hover:bg-red-50">Izbriši</Button>
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
       <a href="/affiliate" className="fixed bottom-6 right-20 bg-card border border-border text-foreground text-xs font-semibold px-4 py-3 rounded-full shadow-lg hover:bg-secondary transition-all hover:-translate-y-1">
  💰 Affiliate
</a>
      <a href="/nastavitve" className="fixed bottom-6 right-6 bg-primary text-white p-3 rounded-full shadow-lg hover:bg-primary/90 transition-all hover:-translate-y-1" aria-label="Nastavitve">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
        </svg>
      </a>
    </main>
  )
}