import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Veljavno — Sistem za pravočasne opomnike'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0f172a',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '80px',
        }}
      >
        {/* Logotip */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '48px' }}>
          <div style={{
            background: '#2563eb',
            borderRadius: '12px',
            width: '56px',
            height: '68px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <svg width="36" height="44" viewBox="0 0 60 72" fill="none">
              <rect x="10" y="8" width="26" height="4" rx="2" fill="white" fillOpacity="0.5"/>
              <rect x="10" y="17" width="40" height="4" rx="2" fill="white" fillOpacity="0.35"/>
              <rect x="10" y="26" width="32" height="4" rx="2" fill="white" fillOpacity="0.35"/>
              <rect x="10" y="35" width="36" height="4" rx="2" fill="white" fillOpacity="0.35"/>
              <circle cx="43" cy="56" r="14" fill="white"/>
              <path d="M36 56 L41 61 L50 50" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
  <span style={{ color: 'white', fontSize: '28px', fontWeight: '700', letterSpacing: '0.08em' }}>VELJAVNO</span>
  <span style={{ color: '#94a3b8', fontSize: '14px', marginTop: '2px' }}>Sistem za pravočasne opomnike</span>
  <div style={{ width: '32px', height: '3px', background: '#60a5fa', marginTop: '6px' }} />
</div>
        </div>

        {/* Naslov */}
        <div style={{
          color: 'white',
          fontSize: '56px',
          fontWeight: '700',
          lineHeight: '1.1',
          maxWidth: '800px',
          marginBottom: '24px',
        }}>
          Vsi vaši dokumenti. Vedno veljavni.
        </div>

        {/* Podnaslov */}
        <div style={{
          color: '#94a3b8',
          fontSize: '24px',
          maxWidth: '700px',
          marginBottom: '48px',
        }}>
          Vozniško, osebna, potni list — prejmite e-mail opomnik preden je prepozno.
        </div>

        {/* Paketi */}
        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '16px 24px', color: 'white', fontSize: '16px' }}>
            Samostojni — 4,99 €
          </div>
          <div style={{ background: '#2563eb', borderRadius: '12px', padding: '16px 24px', color: 'white', fontSize: '16px', fontWeight: '600' }}>
            Družinski — 9,99 €
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}