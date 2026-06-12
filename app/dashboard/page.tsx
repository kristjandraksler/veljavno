'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'

type Dokument = {
  id: string
  ime: string
  datum_poteka: string
  opomniki: number[]
}

const OPOMNIKI = [
  { vrednost: 7, oznaka: '1 teden prej' },
  { vrednost: 14, oznaka: '2 tedna prej' },
  { vrednost: 30, oznaka: '1 mesec prej' },
  { vrednost: 90, oznaka: '3 mesece prej' },
  { vrednost: 180, oznaka: '6 mesecev prej' },
  { vrednost: 365, oznaka: '1 leto prej' },
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

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [dokumenti, setDokumenti] = useState<Dokument[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editDoc, setEditDoc] = useState<Dokument | null>(null)

  const [imeDoc, setImeDoc] = useState('')
  const [datumDoc, setDatumDoc] = useState('')
  const [izbraniOpomniki, setIzbraniOpomniki] = useState<number[]>([30, 90])

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.push('/prijava'); return }
      setUser(data.user)
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
      await supabase.from('documents').update({
        ime: imeDoc,
        datum_poteka: datumDoc,
        opomniki: izbraniOpomniki,
      }).eq('id', editDoc.id)
    } else {
      await supabase.from('documents').insert({
        user_id: user.id,
        ime: imeDoc,
        datum_poteka: datumDoc,
        opomniki: izbraniOpomniki,
      })
    }

    setShowForm(false)
    setEditDoc(null)
    setImeDoc('')
    setDatumDoc('')
    setIzbraniOpomniki([30, 90])
    naloziDokumente(user.id)
  }

  async function izbrisiDokument(id: string) {
    await supabase.from('documents').delete().eq('id', id)
    naloziDokumente(user.id)
  }

  function urediDokument(doc: Dokument) {
    setEditDoc(doc)
    setImeDoc(doc.ime)
    setDatumDoc(doc.datum_poteka)
    setIzbraniOpomniki(doc.opomniki || [30, 90])
    setShowForm(true)
  }

  function toggleOpomnik(vrednost: number) {
    setIzbraniOpomniki(prev =>
      prev.includes(vrednost) ? prev.filter(v => v !== vrednost) : [...prev, vrednost]
    )
  }

  async function odjava() {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center">Nalagam...</div>

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
              <span className="text-xs text-muted-foreground hidden md:block">Sistem za pravočasne opomnike</span>
              <div className="w-8 h-0.5 bg-primary mt-1 hidden md:block" />
            </div>
          </a>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden md:block">{user?.email}</span>
            <Button variant="outline" onClick={odjava} className="rounded-full text-xs px-4 py-2">Odjava</Button>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Moji dokumenti</h1>
            <p className="text-muted-foreground text-sm mt-1">{dokumenti.length} {dokumenti.length === 1 ? 'dokument' : 'dokumentov'}</p>
          </div>
          <Button onClick={() => { setShowForm(true); setEditDoc(null); setImeDoc(''); setDatumDoc(''); setIzbraniOpomniki([30, 90]) }} className="rounded-full text-xs font-semibold uppercase tracking-[0.16em]">
            + Dodaj dokument
          </Button>
        </div>

        {showForm && (
          <div className="bg-card border border-border rounded-2xl p-6 mb-6">
            <h2 className="font-semibold mb-4">{editDoc ? 'Uredi dokument' : 'Nov dokument'}</h2>
            <form onSubmit={shraniDokument} className="flex flex-col gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Ime dokumenta</label>
                <Input value={imeDoc} onChange={e => setImeDoc(e.target.value)} placeholder="npr. Vozniško dovoljenje" required />
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
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-lg font-medium mb-2">Še nimate dokumentov</p>
            <p className="text-sm">Dodajte prvi dokument in nastavite opomnike.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {dokumenti.map(doc => {
              const dni = getDniDo(doc.datum_poteka)
              return (
                <div key={doc.id} className={`bg-card border rounded-2xl p-6 flex items-center justify-between gap-4 flex-wrap ${dni <= 30 ? 'border-red-200' : dni <= 90 ? 'border-orange-200' : 'border-border'}`}>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold">{doc.ime}</h3>
                      <StatusBadge dni={dni} />
                    </div>
                    <p className="text-sm text-muted-foreground">Poteče: {new Date(doc.datum_poteka).toLocaleDateString('sl-SI')}</p>
                    <p className="text-xs text-muted-foreground mt-1">Opomniki: {(doc.opomniki || []).map(o => OPOMNIKI.find(op => op.vrednost === o)?.oznaka).filter(Boolean).join(', ') || 'Ni nastavljenih'}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => urediDokument(doc)} className="rounded-full text-xs px-4">Uredi</Button>
                    <Button variant="outline" onClick={() => izbrisiDokument(doc.id)} className="rounded-full text-xs px-4 text-red-500 border-red-200 hover:bg-red-50">Izbriši</Button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}