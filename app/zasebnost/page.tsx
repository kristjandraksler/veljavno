export default function Zasebnost() {
  return (
    <main className="min-h-screen bg-background">
      <nav className="border-b border-border px-6 py-4">
        <div className="max-w-3xl mx-auto">
          <a href="/" className="flex items-center gap-3 w-fit">
            <svg width="32" height="40" viewBox="0 0 60 72" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="0" y="0" width="60" height="72" rx="10" fill="#2563eb"/>
              <rect x="10" y="8" width="26" height="4" rx="2" fill="white" fillOpacity="0.5"/>
              <rect x="10" y="17" width="40" height="4" rx="2" fill="white" fillOpacity="0.35"/>
              <rect x="10" y="26" width="32" height="4" rx="2" fill="white" fillOpacity="0.35"/>
              <rect x="10" y="35" width="36" height="4" rx="2" fill="white" fillOpacity="0.35"/>
              <circle cx="43" cy="56" r="14" fill="white"/>
              <path d="M36 56 L41 61 L50 50" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="font-display text-lg font-bold tracking-[0.08em]">VELJAVNO</span>
          </a>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-2">Politika zasebnosti</h1>
        <p className="text-muted-foreground text-sm mb-10">Zadnja posodobitev: junij 2026</p>

        <div className="prose prose-slate max-w-none space-y-8">

          <section>
            <h2 className="text-xl font-semibold mb-3">1. Katere podatke zbiramo</h2>
            <p className="text-muted-foreground leading-relaxed">Zbiramo naslednje osebne podatke: ime, e-mail naslov, datume poteka dokumentov ki jih vnesete, ter podatke o izbranem paketu. Podatkov o plačilnih karticah ne shranjujemo — plačila se izvajajo prek Stripe.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">2. Kako uporabljamo podatke</h2>
            <p className="text-muted-foreground leading-relaxed">Vaše podatke uporabljamo izključno za zagotavljanje storitve: pošiljanje e-mail opomnikov, upravljanje vašega računa in komunikacijo z vami. Podatkov ne prodajamo, ne posredujemo tretjim osebam niti ne uporabljamo za oglaševanje.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">3. Shranjevanje podatkov</h2>
            <p className="text-muted-foreground leading-relaxed">Podatki so shranjeni na strežnikih Supabase v Evropski uniji. Dostop do podatkov imajo samo pooblaščeni sodelavci Veljavno. Podatke hranimo dokler imate aktiven račun.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">4. Vaše pravice</h2>
            <p className="text-muted-foreground leading-relaxed">V skladu z GDPR imate pravico do dostopa, popravka, izbrisa in prenosa svojih podatkov. Za uveljavljanje pravic nas kontaktirajte na <a href="mailto:info@veljavno.si" className="text-primary hover:underline">info@veljavno.si</a>. Na zahtevo bomo vaše podatke izbrisali v 30 dneh.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">5. Piškotki</h2>
            <p className="text-muted-foreground leading-relaxed">Uporabljamo samo nujne piškotke za delovanje avtentikacije. Ne uporabljamo sledilnih ali oglaševalskih piškotkov.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">6. Tretje osebe</h2>
            <p className="text-muted-foreground leading-relaxed">Za delovanje storitve uporabljamo naslednje zunaje ponudnike: Supabase (baza podatkov), Stripe (plačila), Resend (e-mail), Vercel (gostovanje). Vsak ponudnik ima svojo politiko zasebnosti.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">7. Kontakt</h2>
            <p className="text-muted-foreground leading-relaxed">Za vprašanja glede zasebnosti nas kontaktirajte na <a href="mailto:info@veljavno.si" className="text-primary hover:underline">info@veljavno.si</a>.</p>
          </section>

        </div>
      </div>

      <footer className="border-t border-border py-8 mt-12">
        <div className="max-w-3xl mx-auto px-6 flex gap-6 text-sm text-muted-foreground">
          <a href="/" className="hover:text-foreground transition-colors">Domov</a>
          <a href="/pogoji" className="hover:text-foreground transition-colors">Splošni pogoji</a>
          <a href="mailto:info@veljavno.si" className="hover:text-foreground transition-colors">Kontakt</a>
        </div>
      </footer>
    </main>
  )
}