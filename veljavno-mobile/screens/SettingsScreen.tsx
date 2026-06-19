import { useState, useEffect } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Linking } from 'react-native'
import { supabase } from '../lib/supabase'

const PAKETI: Record<string, string> = {
  samostojni: 'Samostojni — 4,99 €',
  druzinski: 'Družinski — 9,99 €',
}

export default function SettingsScreen({ navigation }: any) {
  const [profil, setProfil] = useState<any>(null)
  const [loading, setLoading] = useState(true)

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
    }
    setLoading(false)
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
        </View>

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

        <TouchableOpacity style={styles.linkCard} onPress={() => Linking.openURL('https://veljavno.si/pozabljeno-geslo')}>
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
})