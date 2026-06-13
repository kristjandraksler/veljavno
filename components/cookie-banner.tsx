'use client'

import { useState, useEffect } from 'react'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) setVisible(true)
  }, [])

  function sprejmi() {
    localStorage.setItem('cookie-consent', 'accepted')
    setVisible(false)
  }

  function zavrni() {
    localStorage.setItem('cookie-consent', 'declined')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900 text-white px-5 py-4 md:px-8">
      <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p className="text-sm text-slate-300">
          Veljavno uporablja piškotke za varno prijavo in nemoteno delovanje aplikacije.{' '}
          <a href="/zasebnost" className="text-blue-400 hover:underline">Več o zasebnosti</a>
        </p>
        <div className="flex gap-3 flex-shrink-0">
          <button onClick={zavrni} className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-400 border border-slate-700 px-4 py-2 rounded-full hover:border-slate-500 transition-colors">
            Zavrni
          </button>
          <button onClick={sprejmi} className="text-xs font-semibold uppercase tracking-[0.1em] text-white bg-blue-600 px-4 py-2 rounded-full hover:bg-blue-700 transition-colors">
            Sprejmi
          </button>
        </div>
      </div>
    </div>
  )
}