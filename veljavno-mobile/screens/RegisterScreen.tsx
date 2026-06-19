import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Linking } from 'react-native'
import { supabase } from '../lib/supabase'

const PAKETI = [
  { vrednost: 'samostojni', ime: 'Samostojni', cena: '4,99 €', opis: '1 oseba' },
  { vrednost: 'druzinski', ime: 'Družinski', cena: '9,99 €', opis: 'Do 6 oseb' },
]

export default function RegisterScreen({ navigation }: any) {
  const [ime, setIme] = useState('')
  const [email, setEmail] = useState('')
  const [geslo, setGeslo] = useState('')
  const [paket, setPaket] = useState('samostojni')
  const [referral, setReferral] = useState('')
  const [loading, setLoading] = useState(false)

  async function registracija() {
    setLoading(true)
    const { data, error } = await supabase.auth.signUp({
      email,
      password: geslo,
      options: { data: { ime, paket } }
    })

    if (error) {
      Alert.alert('Napaka', error.message)
      setLoading(false)
      return
    }

    if (data.user) {
      await supabase.from('profiles').insert({
        id: data.user.id,
        ime,
        paket,
        placilo_potrjeno: false,
      })

      setLoading(false)

      Alert.alert(
        'Račun ustvarjen!',
        'Sedaj boste preusmerjeni na plačilo da aktivirate svoj račun.',
        [
          {
            text: 'Nadaljuj na plačilo',
            onPress: () => {
              const ref = referral ? `&ref=${referral}` : ''
              Linking.openURL(`https://veljavno.si/registracija?paket=${paket}${ref}&userId=${data.user!.id}&email=${encodeURIComponent(email)}`)
              navigation.navigate('Login')
            }
          }
        ]
      )
    } else {
      setLoading(false)
    }
  }

  return (
    <ScrollView style={styles.container}>
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
      </View>

      <View style={styles.form}>
        <Text style={styles.title}>Registracija</Text>

        <TextInput
          style={styles.input}
          placeholder="Ime"
          value={ime}
          onChangeText={setIme}
        />
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Geslo (najmanj 6 znakov)"
          value={geslo}
          onChangeText={setGeslo}
          secureTextEntry
        />

        <Text style={styles.label}>Paket</Text>
        <View style={styles.paketiRow}>
          {PAKETI.map(p => (
            <TouchableOpacity
              key={p.vrednost}
              style={[styles.paketCard, paket === p.vrednost && styles.paketCardActive]}
              onPress={() => setPaket(p.vrednost)}
            >
              <Text style={[styles.paketIme, paket === p.vrednost && styles.paketImeActive]}>{p.ime}</Text>
              <Text style={[styles.paketCena, paket === p.vrednost && styles.paketCenaActive]}>{p.cena}</Text>
              <Text style={[styles.paketOpis, paket === p.vrednost && styles.paketOpisActive]}>{p.opis}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Referral koda <Text style={styles.opcijsko}>(opcijsko)</Text></Text>
        <TextInput
          style={styles.input}
          placeholder="npr. JANEZ30"
          value={referral}
          onChangeText={setReferral}
          autoCapitalize="characters"
        />

        <TouchableOpacity style={styles.btn} onPress={registracija} disabled={loading}>
          <Text style={styles.btnText}>{loading ? 'Ustvarjam...' : 'Ustvari račun'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.link}>Že imate račun? Prijavite se</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: {
    backgroundColor: '#2563eb',
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
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
  logo: { color: 'white', fontSize: 22, fontWeight: '800', letterSpacing: 3 },
  logoSub: { color: 'rgba(255,255,255,0.7)', fontSize: 11, marginTop: 2 },
  form: { padding: 24 },
  title: { fontSize: 24, fontWeight: '700', color: '#0f172a', marginBottom: 24 },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    marginBottom: 12,
  },
  label: { fontSize: 13, fontWeight: '600', color: '#0f172a', marginBottom: 8, marginTop: 4 },
  opcijsko: { fontWeight: '400', color: '#94a3b8' },
  paketiRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  paketCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 14,
    padding: 14,
    backgroundColor: 'white',
  },
  paketCardActive: { borderColor: '#2563eb', backgroundColor: '#eff6ff' },
  paketIme: { fontSize: 14, fontWeight: '700', color: '#0f172a' },
  paketImeActive: { color: '#2563eb' },
  paketCena: { fontSize: 18, fontWeight: '800', color: '#0f172a', marginTop: 4 },
  paketCenaActive: { color: '#2563eb' },
  paketOpis: { fontSize: 11, color: '#94a3b8', marginTop: 2 },
  paketOpisActive: { color: '#3b82f6' },
  btn: {
    backgroundColor: '#2563eb',
    borderRadius: 50,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  btnText: { color: 'white', fontWeight: '700', fontSize: 15 },
  link: { color: '#2563eb', textAlign: 'center', marginTop: 16, fontSize: 14 },
})