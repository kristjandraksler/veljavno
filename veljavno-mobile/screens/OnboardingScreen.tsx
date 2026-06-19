import { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

const { width } = Dimensions.get('window')

const SLIDI = [
  {
    emoji: '📋',
    naslov: 'Dodaj svoje dokumente',
    opis: 'Vnesite vozniško, osebno, potni list ali drug dokument z datumom poteka.',
  },
  {
    emoji: '⏰',
    naslov: 'Nastavi kdaj želiš opomnik',
    opis: 'Izberite opomnik 1 teden, 1 mesec, 3 mesece ali 6 mesecev prej.',
  },
  {
    emoji: '✉️',
    naslov: 'Prejmi e-mail ob pravem času',
    opis: 'Veljavno vas pravočasno opozori, še preden dokument poteče.',
  },
]

export default function OnboardingScreen({ navigation }: any) {
  const [trenutni, setTrenutni] = useState(0)

  async function naprej() {
    if (trenutni < SLIDI.length - 1) {
      setTrenutni(trenutni + 1)
    } else {
      await AsyncStorage.setItem('onboarding-koncan', 'true')
      navigation.replace('Login')
    }
  }

  async function preskoci() {
    await AsyncStorage.setItem('onboarding-koncan', 'true')
    navigation.replace('Login')
  }

  const slide = SLIDI[trenutni]

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.preskociBtn} onPress={preskoci}>
        <Text style={styles.preskociText}>Preskoči</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <View style={styles.emojiCircle}>
          <Text style={styles.emoji}>{slide.emoji}</Text>
        </View>

        <Text style={styles.naslov}>{slide.naslov}</Text>
        <Text style={styles.opis}>{slide.opis}</Text>
      </View>

      <View style={styles.bottom}>
        <View style={styles.pikeRow}>
          {SLIDI.map((_, i) => (
            <View key={i} style={[styles.pika, i === trenutni && styles.pikaActive]} />
          ))}
        </View>

        <TouchableOpacity style={styles.btn} onPress={naprej}>
          <Text style={styles.btnText}>
            {trenutni === SLIDI.length - 1 ? 'Začni' : 'Naprej'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#2563eb' },
  preskociBtn: { alignSelf: 'flex-end', padding: 20, paddingTop: 60 },
  preskociText: { color: 'rgba(255,255,255,0.7)', fontSize: 14 },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  emojiCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  emoji: { fontSize: 56 },
  naslov: { fontSize: 24, fontWeight: '700', color: 'white', textAlign: 'center', marginBottom: 12 },
  opis: { fontSize: 15, color: 'rgba(255,255,255,0.8)', textAlign: 'center', lineHeight: 22 },
  bottom: { padding: 32, paddingBottom: 50 },
  pikeRow: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 24 },
  pika: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.3)' },
  pikaActive: { backgroundColor: 'white', width: 24 },
  btn: { backgroundColor: 'white', borderRadius: 50, padding: 16, alignItems: 'center' },
  btnText: { color: '#2563eb', fontWeight: '700', fontSize: 15 },
})