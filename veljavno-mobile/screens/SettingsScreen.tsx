import { useState, useEffect } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Linking, Modal, TextInput } from 'react-native'
import { supabase } from '../lib/supabase'

const PAKETI: Record<string, string> = {
  samostojni: 'Samostojni — 4,99 €',
  druzinski: 'Družinski — 9,99 €',
}

type Clan = {
  id: string
  ime: string
  email: string
}

export default function SettingsScreen({ navigation }: any) {
  const [profil, setProfil] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showGesloModal, setShowGesloModal] = useState(false)
  const [novoGeslo, setNovoGeslo] = useState('')
  const [potrditevGesla, setPotrditevGesla] = useState('')
  const [shranjevanjeGesla, setShranjevanjeGesla] = useState(false)
  const [clani, setClani] = useState<Clan[]>([])
  const [showClanModal, setShowClanModal] = useState(false)
  const [novClanIme, setNovClanIme] = useState('')
  const [novClanEmail, setNovClanEmail] = useState('')
  const [clanLoading, setClanLoading] = useState(false)

  useEffect(() => {
    naloziProfil()
  }, [])

  async function naloziProfil() {
    const { data: userData } = await supabase.auth.getUser()
    if (userData.user) {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userData.user.id)
        .single()
      setProfil({ ...data, email: userData.user.email })

      if (data?.paket === 'druzinski') {
        naloziClane(userData.user.id)
      }
    }
    setLoading(false)
  }

  async function naloziClane(userId: string) {
    const { data } = await supabase.from('members').select('*').eq('owner_id', userId)
    setClani(data || [])
  }

  async function dodajClana() {
    if (!novClanIme || !novClanEmail) {
      Alert.alert('Napaka', 'Izpolnite ime in e-mail člana.')
      return
    }
    if (clani.length >= 5) {
      Alert.alert('Napaka', 'Dosežena je maksimalna omejitev 5 dodatnih članov.')
      return
    }

    setClanLoading(true)
    const { data: userData } = await supabase.auth.getUser()
    const { error } = await supabase.from('members').insert({
      owner_id: userData.user!.id,
      ime: novClanIme,
      email: novClanEmail,
    })
    setClanLoading(false)

    if (error) {
      Alert.alert('Napaka', 'Napaka pri dodajanju člana.')
    } else {
      setNovClanIme('')
      setNovClanEmail('')
      setShowClanModal(false)
      naloziClane(userData.user!.id)
    }
  }

  async function izbrisiClana(id: string) {
    Alert.alert('Odstrani člana', 'Ali ste prepričani?', [
      { text: 'Prekliči', style: 'cancel' },
      {
        text: 'Odstrani',
        style: 'destructive',
        onPress: async () => {
          await supabase.from('members').delete().eq('id', id)
          const { data: userData } = await supabase.auth.getUser()
          naloziClane(userData.user!.id)
        }
      }
    ])
  }

  async function odjava() {
    Alert.alert('Odjava', 'Ali se želite odjaviti?', [
      { text: 'Prekliči', style: 'cancel' },
      { text: 'Odjava', style: 'destructive', onPress: () => supabase.auth.signOut() }
    ])
  }

function odpriPlacilo() {
    Linking.openURL('https://veljavno.si/dashboard')
  }

async function nadgradi() {
  try {
    const res = await fetch('https://www.veljavno.si/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paket: 'druzinski', userId: profil.id, email: profil.email })
    })
    const data = await res.json()
    if (data.url) {
      Linking.openURL(data.url)
    } else {
      Alert.alert('Napaka', 'Prišlo je do napake pri plačilu.')
    }
  } catch (err: any) {
    Alert.alert('Napaka', 'Ni mogoče vzpostaviti povezave.')
  }
}
  async function spremeniGeslo() {
    if (!novoGeslo || novoGeslo.length < 6) {
      Alert.alert('Napaka', 'Geslo mora imeti najmanj 6 znakov.')
      return
    }
    if (novoGeslo !== potrditevGesla) {
      Alert.alert('Napaka', 'Gesli se ne ujemata.')
      return
    }

    setShranjevanjeGesla(true)
    const { error } = await supabase.auth.updateUser({ password: novoGeslo })
    setShranjevanjeGesla(false)

    if (error) {
      Alert.alert('Napaka', error.message)
    } else {
      setShowGesloModal(false)
      setNovoGeslo('')
      setPotrditevGesla('')
      Alert.alert('Uspeh', 'Geslo je bilo spremenjeno.')
    }
  }

  if (loading) return null

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← Nazaj</Text>
        </TouchableOpacity>
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
        <Text style={styles.headerNaslov}>Nastavitve</Text>
      </View>

      <ScrollView style={styles.content}>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Ime</Text>
          <Text style={styles.cardValue}>{profil?.ime || '—'}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>E-mail</Text>
          <Text style={styles.cardValue}>{profil?.email || '—'}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Trenutni paket</Text>
          <Text style={styles.cardValue}>{PAKETI[profil?.paket] || profil?.paket || '—'}</Text>
          <View style={[styles.statusBadge, profil?.placilo_potrjeno ? styles.statusActive : styles.statusInactive]}>
            <Text style={[styles.statusText, profil?.placilo_potrjeno ? styles.statusTextActive : styles.statusTextInactive]}>
              {profil?.placilo_potrjeno ? '✓ Aktivno' : '⚠ Plačilo ni potrjeno'}
            </Text>
          </View>

          {profil?.paket === 'samostojni' && (
            <TouchableOpacity style={styles.nadgradiBox} onPress={nadgradi}>
              <Text style={styles.nadgradiNaslov}>👨‍👩‍👧‍👦 Nadgradi na Družinski</Text>
              <Text style={styles.nadgradiOpis}>Dodajte do 6 članov družine in skupni pregled dokumentov.</Text>
              <Text style={styles.nadgradiBtn}>Nadgradi za 9,99 € →</Text>
            </TouchableOpacity>
          )}

          {profil?.paket === 'druzinski' && (
            <View style={styles.najboljsiBox}>
              <Text style={styles.najboljsiText}>✓ Imate najboljši paket</Text>
            </View>
          )}
        </View>

        {profil?.paket === 'druzinski' && (
          <View style={styles.card}>
            <View style={styles.clanHeader}>
              <Text style={styles.cardLabel}>Člani družine ({clani.length}/5)</Text>
              {clani.length < 5 && (
                <TouchableOpacity onPress={() => setShowClanModal(true)}>
                  <Text style={styles.dodajClanaText}>+ Dodaj</Text>
                </TouchableOpacity>
              )}
            </View>

            {clani.length === 0 ? (
              <Text style={styles.emptyClani}>Ni dodanih članov.</Text>
            ) : (
              clani.map(clan => (
                <View key={clan.id} style={styles.clanRow}>
                  <View>
                    <Text style={styles.clanIme}>{clan.ime}</Text>
                    <Text style={styles.clanEmail}>{clan.email}</Text>
                  </View>
                  <TouchableOpacity onPress={() => izbrisiClana(clan.id)}>
                    <Text style={styles.odstraniText}>Odstrani</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>
        )}

        {profil?.affiliate_koda && (
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Vaša affiliate koda</Text>
            <Text style={styles.cardValueBig}>{profil.affiliate_koda}</Text>
            <Text style={styles.cardHint}>veljavno.si?ref={profil.affiliate_koda}</Text>
          </View>
        )}

        {profil?.affiliate_koda && (
          <TouchableOpacity style={styles.linkCard} onPress={() => navigation.navigate('Affiliate')}>
            <Text style={styles.linkCardText}>Affiliate dashboard →</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.linkCard} onPress={() => setShowGesloModal(true)}>
          <Text style={styles.linkCardText}>Spremeni geslo →</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.linkCard} onPress={odpriPlacilo}>
          <Text style={styles.linkCardText}>Upravljaj naročnino na spletu →</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.linkCard} onPress={() => Linking.openURL('https://veljavno.si/pogoji')}>
          <Text style={styles.linkCardText}>Splošni pogoji →</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.linkCard} onPress={() => Linking.openURL('mailto:info@veljavno.si')}>
          <Text style={styles.linkCardText}>Kontaktirajte nas →</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.odjavaBtn} onPress={odjava}>
          <Text style={styles.odjavaBtnText}>Odjava</Text>
        </TouchableOpacity>

      </ScrollView>

      <Modal visible={showGesloModal} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalNaslov}>Spremeni geslo</Text>
            <TouchableOpacity onPress={() => setShowGesloModal(false)}>
              <Text style={styles.modalZapri}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <Text style={styles.label}>Novo geslo</Text>
            <TextInput
              style={styles.input}
              placeholder="Najmanj 6 znakov"
              value={novoGeslo}
              onChangeText={setNovoGeslo}
              secureTextEntry
            />

            <Text style={styles.label}>Potrdi novo geslo</Text>
            <TextInput
              style={styles.input}
              placeholder="Ponovite geslo"
              value={potrditevGesla}
              onChangeText={setPotrditevGesla}
              secureTextEntry
            />

            <TouchableOpacity style={styles.shraniBtn} onPress={spremeniGeslo} disabled={shranjevanjeGesla}>
              <Text style={styles.shraniBtnText}>{shranjevanjeGesla ? 'Shranjujem...' : 'Shrani novo geslo'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={showClanModal} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalNaslov}>Dodaj člana</Text>
            <TouchableOpacity onPress={() => setShowClanModal(false)}>
              <Text style={styles.modalZapri}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <Text style={styles.label}>Ime člana</Text>
            <TextInput
              style={styles.input}
              placeholder="npr. Mama, Janez..."
              value={novClanIme}
              onChangeText={setNovClanIme}
            />

            <Text style={styles.label}>E-mail člana</Text>
            <TextInput
              style={styles.input}
              placeholder="clan@email.si"
              value={novClanEmail}
              onChangeText={setNovClanEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <TouchableOpacity style={styles.shraniBtn} onPress={dodajClana} disabled={clanLoading}>
              <Text style={styles.shraniBtnText}>{clanLoading ? 'Dodajam...' : '+ Dodaj člana'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', height: '100vh' as any },
  header: {
    backgroundColor: '#2563eb',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  backBtn: { color: 'rgba(255,255,255,0.8)', fontSize: 14, marginBottom: 12 },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 4 },
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
  headerNaslov: { color: 'white', fontSize: 22, fontWeight: '700', marginTop: 8 },
  content: { flex: 1, padding: 16, overflow: 'scroll' as any },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cardLabel: { fontSize: 12, color: '#94a3b8', marginBottom: 4 },
  cardValue: { fontSize: 16, fontWeight: '600', color: '#0f172a' },
  cardValueBig: { fontSize: 20, fontWeight: '800', color: '#2563eb', marginBottom: 4 },
  cardHint: { fontSize: 12, color: '#94a3b8' },
  statusBadge: { marginTop: 8, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, alignSelf: 'flex-start' },
  statusActive: { backgroundColor: '#dcfce7' },
  statusInactive: { backgroundColor: '#fef2f2' },
  statusText: { fontSize: 11, fontWeight: '600' },
  statusTextActive: { color: '#16a34a' },
  statusTextInactive: { color: '#dc2626' },
  nadgradiBox: {
    marginTop: 12,
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 12,
    padding: 12,
  },
  nadgradiNaslov: { fontSize: 13, fontWeight: '700', color: '#1d4ed8', marginBottom: 4 },
  nadgradiOpis: { fontSize: 12, color: '#3b82f6', marginBottom: 8 },
  nadgradiBtn: { fontSize: 12, fontWeight: '700', color: '#2563eb' },
  najboljsiBox: {
    marginTop: 12,
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    borderRadius: 12,
    padding: 12,
  },
  najboljsiText: { fontSize: 13, fontWeight: '700', color: '#16a34a' },
  clanHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  dodajClanaText: { fontSize: 13, fontWeight: '700', color: '#2563eb' },
  emptyClani: { fontSize: 13, color: '#94a3b8' },
  clanRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  clanIme: { fontSize: 14, fontWeight: '600', color: '#0f172a' },
  clanEmail: { fontSize: 12, color: '#94a3b8', marginTop: 2 },
  odstraniText: { fontSize: 12, color: '#ef4444', fontWeight: '600' },
  linkCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  linkCardText: { fontSize: 14, fontWeight: '600', color: '#2563eb' },
  odjavaBtn: {
    backgroundColor: '#fef2f2',
    borderRadius: 50,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  odjavaBtnText: { color: '#dc2626', fontWeight: '700', fontSize: 15 },
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
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
  },
  shraniBtn: {
    backgroundColor: '#2563eb',
    borderRadius: 50,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  shraniBtnText: { color: 'white', fontWeight: '700', fontSize: 15 },
})