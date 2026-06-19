import { useState, useEffect } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Share } from 'react-native'
import { supabase } from '../lib/supabase'

type Konverzija = {
  id: string
  paket: string
  znesek: number
  datum: string
}

export default function AffiliateScreen({ navigation }: any) {
  const [profil, setProfil] = useState<any>(null)
  const [konverzije, setKonverzije] = useState<Konverzija[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    naloziPodatke()
  }, [])

  async function naloziPodatke() {
    const { data: userData } = await supabase.auth.getUser()
    if (userData.user) {
      const { data: profilData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userData.user.id)
        .single()
      setProfil(profilData)

      if (profilData?.affiliate_koda) {
        const { data: konverzijeData } = await supabase
          .from('affiliate_konverzije')
          .select('*')
          .eq('ref_koda', profilData.affiliate_koda)
          .order('datum', { ascending: false })
        setKonverzije(konverzijeData || [])
      }
    }
    setLoading(false)
  }

  async function deliKodo() {
    if (!profil?.affiliate_koda) return
    await Share.share({
      message: `Pravočasno opomni dokumente z Veljavno! Uporabi mojo kodo ${profil.affiliate_koda} na veljavno.si?ref=${profil.affiliate_koda}`,
    })
  }

  const skupniZaslunek = konverzije.reduce((vsota, k) => vsota + k.znesek * 0.3, 0)

  if (loading) return null

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← Nazaj</Text>
        </TouchableOpacity>
        <Text style={styles.headerNaslov}>Affiliate dashboard</Text>
      </View>

      <ScrollView style={styles.content}>

        {!profil?.affiliate_koda ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyNaslov}>Nimate še affiliate kode</Text>
            <Text style={styles.emptyOpis}>Aktivirajte jo v nastavitvah na spletni strani da začnete zaslužiti 30% provizije.</Text>
          </View>
        ) : (
          <>
            <View style={styles.kodaCard}>
              <Text style={styles.kodaLabel}>Vaša koda</Text>
              <Text style={styles.kodaVrednost}>{profil.affiliate_koda}</Text>
              <TouchableOpacity style={styles.deliBtn} onPress={deliKodo}>
                <Text style={styles.deliBtnText}>Deli kodo →</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={styles.statNum}>{konverzije.length}</Text>
                <Text style={styles.statLabel}>Konverzij</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNum}>{skupniZaslunek.toFixed(2)} €</Text>
                <Text style={styles.statLabel}>Zaslužek</Text>
              </View>
            </View>

            <Text style={styles.sekcijaNaslov}>Zgodovina konverzij</Text>

            {konverzije.length === 0 ? (
              <Text style={styles.emptyText}>Še ni konverzij. Delite svojo kodo!</Text>
            ) : (
              konverzije.map(k => (
                <View key={k.id} style={styles.konverzijaCard}>
                  <View>
                    <Text style={styles.konverzijaPaket}>{k.paket === 'samostojni' ? 'Samostojni' : 'Družinski'}</Text>
                    <Text style={styles.konverzijaDatum}>{new Date(k.datum).toLocaleDateString('sl-SI')}</Text>
                  </View>
                  <Text style={styles.konverzijaZnesek}>+{(k.znesek * 0.3).toFixed(2)} €</Text>
                </View>
              ))
            )}
          </>
        )}

      </ScrollView>
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
  },
  backBtn: { color: 'rgba(255,255,255,0.8)', fontSize: 14, marginBottom: 12 },
  headerNaslov: { color: 'white', fontSize: 22, fontWeight: '700' },
  content: { flex: 1, padding: 16 },
  emptyCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginTop: 20,
  },
  emptyNaslov: { fontSize: 16, fontWeight: '700', color: '#0f172a', marginBottom: 8 },
  emptyOpis: { fontSize: 13, color: '#94a3b8', textAlign: 'center', lineHeight: 20 },
  kodaCard: {
    backgroundColor: '#2563eb',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  kodaLabel: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginBottom: 4 },
  kodaVrednost: { fontSize: 28, fontWeight: '800', color: 'white', marginBottom: 16 },
  deliBtn: { backgroundColor: 'white', borderRadius: 50, padding: 12, alignItems: 'center' },
  deliBtnText: { color: '#2563eb', fontWeight: '700', fontSize: 14 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  statNum: { fontSize: 24, fontWeight: '800', color: '#0f172a' },
  statLabel: { fontSize: 12, color: '#94a3b8', marginTop: 4 },
  sekcijaNaslov: { fontSize: 16, fontWeight: '700', color: '#0f172a', marginBottom: 12 },
  emptyText: { fontSize: 13, color: '#94a3b8', textAlign: 'center', marginTop: 20 },
  konverzijaCard: {
    backgroundColor: 'white',
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  konverzijaPaket: { fontSize: 14, fontWeight: '600', color: '#0f172a' },
  konverzijaDatum: { fontSize: 12, color: '#94a3b8', marginTop: 2 },
  konverzijaZnesek: { fontSize: 16, fontWeight: '700', color: '#16a34a' },
})