import { useState, useEffect } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal, TextInput, Platform, Linking } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { supabase } from '../lib/supabase'

type Dokument = {
  id: string
  ime: string
  datum_poteka: string
  opomniki: number[]
  lastnik?: string
}

const HITRI_VNOS = [
  '🚗 Vozniško dovoljenje',
  '🪪 Osebna izkaznica',
  '🌍 Potni list',
  '🏥 Zdravstvena kartica',
  '🚌 Prometno dovoljenje',
]

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

export default function DashboardScreen({ navigation }: any) {
  const [dokumenti, setDokumenti] = useState<Dokument[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [profil, setProfil] = useState<any>(null)
  const [showModal, setShowModal] = useState(false)
  const [urejaniId, setUrejaniId] = useState<string | null>(null)
  const [imeDoc, setImeDoc] = useState('')
  const [datumDoc, setDatumDoc] = useState('')
  const [lastnikDoc, setLastnikDoc] = useState('')
  const [saving, setSaving] = useState(false)
  const [datumObj, setDatumObj] = useState(new Date())
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [izbraniOpomniki, setIzbraniOpomniki] = useState<number[]>([30, 90])

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUser(data.user)
        naloziDokumente(data.user.id)
        naloziProfil(data.user.id)
      }
    })
  }, [])

  async function naloziProfil(userId: string) {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
    setProfil(data)
  }

  async function naloziDokumente(userId: string) {
    const { data } = await supabase
      .from('documents')
      .select('*')
      .eq('user_id', userId)
      .order('datum_poteka')
    setDokumenti(data || [])
    setLoading(false)
  }

  function odpriZaUrejanje(doc: Dokument) {
    setUrejaniId(doc.id)
    setImeDoc(doc.ime)
    setDatumDoc(doc.datum_poteka)
    setDatumObj(new Date(doc.datum_poteka))
    setLastnikDoc(doc.lastnik || '')
    setIzbraniOpomniki(doc.opomniki || [30, 90])
    setShowModal(true)
  }

  function odpriZaDodajanje() {
    setUrejaniId(null)
    setImeDoc('')
    setDatumDoc('')
    setDatumObj(new Date())
    setLastnikDoc('')
    setIzbraniOpomniki([30, 90])
    setShowModal(true)
  }

  async function shraniDokument() {
    if (!imeDoc || !datumDoc) {
      Alert.alert('Napaka', 'Izpolnite ime in datum poteka!')
      return
    }
    setSaving(true)

    if (urejaniId) {
      const { error } = await supabase
        .from('documents')
        .update({
          ime: imeDoc,
          datum_poteka: datumDoc,
          opomniki: izbraniOpomniki,
          lastnik: lastnikDoc,
        })
        .eq('id', urejaniId)

      if (error) {
        Alert.alert('Napaka', error.message)
      } else {
        zapriModal()
        naloziDokumente(user.id)
      }
    } else {
      const { error } = await supabase.from('documents').insert({
        user_id: user.id,
        ime: imeDoc,
        datum_poteka: datumDoc,
        opomniki: izbraniOpomniki,
        lastnik: lastnikDoc,
      })
      if (error) {
        Alert.alert('Napaka', error.message)
      } else {
        zapriModal()
        naloziDokumente(user.id)
      }
    }
    setSaving(false)
  }

  function zapriModal() {
    setShowModal(false)
    setUrejaniId(null)
    setImeDoc('')
    setDatumDoc('')
    setLastnikDoc('')
    setIzbraniOpomniki([30, 90])
  }

  async function izbrisiDokument(id: string) {
    Alert.alert('Izbriši dokument', 'Ali ste prepričani?', [
      { text: 'Prekliči', style: 'cancel' },
      {
        text: 'Izbriši',
        style: 'destructive',
        onPress: async () => {
          await supabase.from('documents').delete().eq('id', id)
          naloziDokumente(user.id)
        }
      }
    ])
  }

  function toggleOpomnik(vrednost: number) {
    setIzbraniOpomniki(prev =>
      prev.includes(vrednost) ? prev.filter(v => v !== vrednost) : [...prev, vrednost]
    )
  }

  async function odjava() {
    await supabase.auth.signOut()
  }

  const kmalu = dokumenti.filter(d => getDniDo(d.datum_poteka) <= 30).length
  const pozor = dokumenti.filter(d => { const d2 = getDniDo(d.datum_poteka); return d2 > 30 && d2 <= 90 }).length
  const veljavni = dokumenti.filter(d => getDniDo(d.datum_poteka) > 90).length

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoRow}>
          <View style={styles.logoIkona}>
            <View style={styles.logoLinija1} />
            <View style={styles.logoLinija2} />
            <View style={styles.logoLinija3} />
            <View style={styles.logoLinija4} />
            <View style={styles.logoKrog}>
              <View style={styles.logoKljukica} />
            </View>
          </View>
          <View>
            <Text style={styles.logo}>VELJAVNO</Text>
            <Text style={styles.logoSub}>Sistem za pravočasne opomnike</Text>
            <View style={styles.logoCrta} />
          </View>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Text style={styles.odjava}>⚙️ Nastavitve</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.naslov}>Moji dokumenti</Text>
        <Text style={styles.podNaslov}>{dokumenti.length} dokumentov</Text>

        <View style={styles.statsRow}>
          <View style={[styles.statCard, styles.statRed]}>
            <Text style={[styles.statNum, { color: '#dc2626' }]}>{kmalu}</Text>
            <Text style={[styles.statLabel, { color: '#dc2626' }]}>Kmalu</Text>
          </View>
          <View style={[styles.statCard, styles.statOrange]}>
            <Text style={[styles.statNum, { color: '#ea580c' }]}>{pozor}</Text>
            <Text style={[styles.statLabel, { color: '#ea580c' }]}>Pozor</Text>
          </View>
          <View style={[styles.statCard, styles.statGreen]}>
            <Text style={[styles.statNum, { color: '#16a34a' }]}>{veljavni}</Text>
            <Text style={[styles.statLabel, { color: '#16a34a' }]}>Veljavni</Text>
          </View>
        </View>

        {profil?.paket === 'samostojni' && (
          <TouchableOpacity style={styles.upsellBanner} onPress={() => Linking.openURL('https://veljavno.si/dashboard')}>
            <Text style={styles.upsellNaslov}>👨‍👩‍👧‍👦 Nadgradi na Družinski paket</Text>
            <Text style={styles.upsellOpis}>Sledite dokumentom do 6 oseb za samo 9,99 €</Text>
          </TouchableOpacity>
        )}

        {profil?.affiliate_koda ? (
          <TouchableOpacity style={styles.affiliateBanner} onPress={() => navigation.navigate('Affiliate')}>
            <Text style={styles.affiliateNaslov}>💰 Vaša affiliate koda: {profil.affiliate_koda}</Text>
            <Text style={styles.affiliateOpis}>Delite veljavno.si?ref={profil.affiliate_koda} in zaslužite 30%</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.affiliateBanner} onPress={() => Linking.openURL('https://veljavno.si/affiliate')}>
            <Text style={styles.affiliateNaslov}>💰 Zaslužite z Veljavno</Text>
            <Text style={styles.affiliateOpis}>Priporočite prijateljem in zaslužite 30% provizije</Text>
          </TouchableOpacity>
        )}

        {loading ? (
          <Text style={styles.loading}>Nalagam...</Text>
        ) : dokumenti.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Še nimate dokumentov.</Text>
            <Text style={styles.emptySubText}>Dodajte prvi dokument!</Text>
          </View>
        ) : (
          dokumenti.map(doc => {
            const dni = getDniDo(doc.datum_poteka)
            const barva = dni <= 30 ? '#ef4444' : dni <= 90 ? '#f97316' : '#22c55e'
            const badgeBg = dni <= 30 ? '#fee2e2' : dni <= 90 ? '#ffedd5' : '#dcfce7'
            const badgeText = dni <= 30 ? '#dc2626' : dni <= 90 ? '#ea580c' : '#16a34a'
            const borderColor = dni <= 30 ? '#fecaca' : dni <= 90 ? '#fed7aa' : '#e2e8f0'

            return (
              <TouchableOpacity key={doc.id} style={[styles.docCard, { borderColor }]} onPress={() => odpriZaUrejanje(doc)}>
                <View style={styles.docHeader}>
                  <Text style={styles.docIme}>{doc.ime}</Text>
                  <View style={[styles.badge, { backgroundColor: badgeBg }]}>
                    <Text style={[styles.badgeText, { color: badgeText }]}>{dni} dni</Text>
                  </View>
                </View>
                {doc.lastnik && <Text style={styles.lastnik}>👤 {doc.lastnik}</Text>}
                <Text style={styles.datum}>Poteče: {new Date(doc.datum_poteka).toLocaleDateString('sl-SI')}</Text>
                <Text style={styles.opomniki}>
                  Opomniki: {(doc.opomniki || []).map(o => OPOMNIKI.find(op => op.vrednost === o)?.oznaka).filter(Boolean).join(', ') || 'Ni nastavljenih'}
                </Text>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, {
                    width: `${Math.max(0, Math.min(100, (dni / 365) * 100))}%`,
                    backgroundColor: barva
                  }]} />
                </View>
                <View style={styles.akcijeRow}>
                  <TouchableOpacity onPress={() => odpriZaUrejanje(doc)}>
                    <Text style={styles.urediText}>Uredi</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => izbrisiDokument(doc.id)}>
                    <Text style={styles.izbrisiText}>Izbriši</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            )
          })
        )}
      </ScrollView>

      <TouchableOpacity style={styles.addBtn} onPress={odpriZaDodajanje}>
        <Text style={styles.addBtnText}>+ Dodaj dokument</Text>
      </TouchableOpacity>

      <Modal visible={showModal} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalNaslov}>{urejaniId ? 'Uredi dokument' : 'Nov dokument'}</Text>
            <TouchableOpacity onPress={zapriModal}>
              <Text style={styles.modalZapri}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {!urejaniId && (
              <>
                <Text style={styles.label}>Hitri vnos</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.hitriBtnRow}>
                  {HITRI_VNOS.map(ime => (
                    <TouchableOpacity
                      key={ime}
                      style={[styles.hitriBtn, imeDoc === ime && styles.hitriBtnActive]}
                      onPress={() => setImeDoc(ime)}
                    >
                      <Text style={[styles.hitriBtnText, imeDoc === ime && styles.hitriBtnTextActive]}>{ime}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </>
            )}

            <Text style={styles.label}>Ime dokumenta</Text>
            <TextInput
              style={styles.input}
              placeholder="npr. Vozniško dovoljenje"
              value={imeDoc}
              onChangeText={setImeDoc}
            />

            <Text style={styles.label}>Lastnik (opcijsko)</Text>
            <TextInput
              style={styles.input}
              placeholder="npr. Janez, Mama..."
              value={lastnikDoc}
              onChangeText={setLastnikDoc}
            />

            <Text style={styles.label}>Datum poteka</Text>
            <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
              <Text style={{ fontSize: 15, color: datumDoc ? '#0f172a' : '#94a3b8' }}>
                {datumDoc ? new Date(datumDoc).toLocaleDateString('sl-SI') : 'Izberi datum...'}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={datumObj}
                mode="date"
                display="default"
                minimumDate={new Date()}
                onChange={(event, date) => {
                  setShowDatePicker(false)
                  if (date) {
                    setDatumObj(date)
                    setDatumDoc(date.toISOString().split('T')[0])
                  }
                }}
              />
            )}

            <Text style={styles.label}>Opomni me</Text>
            <View style={styles.opomnikiBtnRow}>
              {OPOMNIKI.map(o => (
                <TouchableOpacity
                  key={o.vrednost}
                  style={[styles.opomnikBtn, izbraniOpomniki.includes(o.vrednost) && styles.opomnikBtnActive]}
                  onPress={() => toggleOpomnik(o.vrednost)}
                >
                  <Text style={[styles.opomnikBtnText, izbraniOpomniki.includes(o.vrednost) && styles.opomnikBtnTextActive]}>
                    {o.oznaka}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.shraniBtn} onPress={shraniDokument} disabled={saving}>
              <Text style={styles.shraniBtnText}>{saving ? 'Shranjujem...' : urejaniId ? 'Shrani spremembe' : 'Shrani dokument'}</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: {
    backgroundColor: '#2563eb',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  logoIkona: {
    width: 32,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 7,
    padding: 5,
    justifyContent: 'space-between',
  },
  logoLinija1: { height: 3, width: '70%', backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: 2 },
  logoLinija2: { height: 3, width: '100%', backgroundColor: 'rgba(255,255,255,0.35)', borderRadius: 2 },
  logoLinija3: { height: 3, width: '80%', backgroundColor: 'rgba(255,255,255,0.35)', borderRadius: 2 },
  logoLinija4: { height: 3, width: '90%', backgroundColor: 'rgba(255,255,255,0.35)', borderRadius: 2 },
  logoKrog: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 16,
    height: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoKljukica: {
    width: 6,
    height: 4,
    borderLeftWidth: 1.5,
    borderBottomWidth: 1.5,
    borderColor: '#2563eb',
    transform: [{ rotate: '-45deg' }],
    marginTop: -1,
  },
  logoCrta: { width: 32, height: 2, backgroundColor: 'white', marginTop: 3, borderRadius: 1 },
  logo: { color: 'white', fontSize: 20, fontWeight: '800', letterSpacing: 3 },
  logoSub: { color: 'rgba(255,255,255,0.7)', fontSize: 11, marginTop: 2 },
  odjava: { color: 'rgba(255,255,255,0.8)', fontSize: 13 },
  content: { flex: 1, padding: 16 },
  naslov: { fontSize: 22, fontWeight: '700', color: '#0f172a', marginBottom: 4 },
  podNaslov: { fontSize: 13, color: '#94a3b8', marginBottom: 16 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  statCard: { flex: 1, borderRadius: 16, padding: 14, alignItems: 'center' },
  statRed: { backgroundColor: '#fef2f2', borderWidth: 1, borderColor: '#fecaca' },
  statOrange: { backgroundColor: '#fff7ed', borderWidth: 1, borderColor: '#fed7aa' },
  statGreen: { backgroundColor: '#f0fdf4', borderWidth: 1, borderColor: '#bbf7d0' },
  statNum: { fontSize: 24, fontWeight: '700' },
  statLabel: { fontSize: 10, marginTop: 2 },
  upsellBanner: {
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  upsellNaslov: { fontSize: 14, fontWeight: '700', color: '#1d4ed8', marginBottom: 4 },
  upsellOpis: { fontSize: 12, color: '#3b82f6' },
  affiliateBanner: {
    backgroundColor: '#2563eb',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  affiliateNaslov: { fontSize: 14, fontWeight: '700', color: 'white', marginBottom: 4 },
  affiliateOpis: { fontSize: 12, color: 'rgba(255,255,255,0.8)' },
  loading: { textAlign: 'center', color: '#94a3b8', marginTop: 40 },
  empty: { alignItems: 'center', marginTop: 60 },
  emptyText: { fontSize: 16, fontWeight: '600', color: '#0f172a' },
  emptySubText: { fontSize: 13, color: '#94a3b8', marginTop: 4 },
  docCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
  },
  docHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  docIme: { fontSize: 14, fontWeight: '600', color: '#0f172a', flex: 1 },
  lastnik: { fontSize: 11, color: '#94a3b8', marginBottom: 4 },
  datum: { fontSize: 12, color: '#94a3b8', marginBottom: 4 },
  opomniki: { fontSize: 11, color: '#94a3b8', marginBottom: 8 },
  progressBar: { height: 4, backgroundColor: '#f1f5f9', borderRadius: 2 },
  progressFill: { height: 4, borderRadius: 2 },
  badge: { borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3 },
  badgeText: { fontSize: 10, fontWeight: '600' },
  akcijeRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 16, marginTop: 10 },
  urediText: { fontSize: 12, color: '#2563eb', fontWeight: '600' },
  izbrisiText: { fontSize: 12, color: '#ef4444', fontWeight: '600' },
  addBtn: {
    backgroundColor: '#2563eb',
    margin: 16,
    padding: 16,
    borderRadius: 50,
    alignItems: 'center',
  },
  addBtnText: { color: 'white', fontWeight: '700', fontSize: 14 },
  modal: { flex: 1, backgroundColor: '#f8fafc' },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  modalNaslov: { fontSize: 18, fontWeight: '700', color: '#0f172a' },
  modalZapri: { fontSize: 20, color: '#94a3b8' },
  modalContent: { padding: 20 },
  label: { fontSize: 13, fontWeight: '600', color: '#0f172a', marginBottom: 8, marginTop: 16 },
  hitriBtnRow: { marginBottom: 8 },
  hitriBtn: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 50,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
    backgroundColor: 'white',
  },
  hitriBtnActive: { borderColor: '#2563eb', backgroundColor: '#eff6ff' },
  hitriBtnText: { fontSize: 12, color: '#64748b' },
  hitriBtnTextActive: { color: '#2563eb' },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    marginBottom: 4,
    justifyContent: 'center',
  },
  opomnikiBtnRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  opomnikBtn: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 50,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'white',
  },
  opomnikBtnActive: { borderColor: '#2563eb', backgroundColor: '#eff6ff' },
  opomnikBtnText: { fontSize: 11, color: '#64748b' },
  opomnikBtnTextActive: { color: '#2563eb' },
  shraniBtn: {
    backgroundColor: '#2563eb',
    borderRadius: 50,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 40,
  },
  shraniBtnText: { color: 'white', fontWeight: '700', fontSize: 15 },
})