import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import { supabase } from '../lib/supabase'

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('')
  const [geslo, setGeslo] = useState('')
  const [loading, setLoading] = useState(false)

  async function prijava() {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password: geslo })
    if (error) Alert.alert('Napaka', error.message)
    setLoading(false)
  }

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
      </View>

      <View style={styles.form}>
        <Text style={styles.title}>Prijava</Text>

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
          placeholder="Geslo"
          value={geslo}
          onChangeText={setGeslo}
          secureTextEntry
        />

        <TouchableOpacity style={styles.btn} onPress={prijava} disabled={loading}>
          <Text style={styles.btnText}>{loading ? 'Prijavljam...' : 'Prijava'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.link}>Nimate računa? Registrirajte se</Text>
        </TouchableOpacity>
      </View>
    </View>
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
  form: { padding: 24, flex: 1, justifyContent: 'center' },
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