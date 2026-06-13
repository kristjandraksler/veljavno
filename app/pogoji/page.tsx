export default function Pogoji() {
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
        <h1 className="text-3xl font-bold mb-2">Splošni pogoji uporabe</h1>
        <p className="text-muted-foreground text-sm mb-10">Zadnja posodobitev: junij 2026</p>

        <div className="prose prose-slate max-w-none space-y-8">

          <section>
            <h2 className="text-xl font-semibold mb-3">1. Splošno</h2>
            <p className="text-muted-foreground leading-relaxed">Veljavno je spletna storitev za upravljanje in sledenje veljavnosti osebnih dokumentov. Z uporabo storitve se strinjate s temi pogoji. Storitev zagotavlja Veljavno, s sedežem v Sloveniji.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">2. Storitev</h2>
            <p className="text-muted-foreground leading-relaxed">Veljavno omogoča shranjevanje datumov poteka dokumentov in pošiljanje e-mail opomnikov. Ne prevzemamo odgovornosti za morebitne posledice zamude pri podaljšanju dokumentov. Storitev je informativne narave.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">3. Račun in plačilo</h2>
            <p className="text-muted-foreground leading-relaxed">Za uporabo storitve je potrebna registracija in plačilo izbranega paketa. Plačila so enkratna (Samostojni, Družinski) ali mesečna (Poslovni). Plačila so nepreklicna razen v primerih predpisanih z zakonom. Plačila se izvajajo prek Stripe.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">4. Zasebnost</h2>
            <p className="text-muted-foreground leading-relaxed">Vaše osebne podatke obdelujemo v skladu z našo <a href="/zasebnost" className="text-primary hover:underline">Politiko zasebnosti</a>. Podatkov ne prodajamo tretjim osebam.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">5. Odgovornost</h2>
            <p className="text-muted-foreground leading-relaxed">Veljavno ne prevzema odgovornosti za morebitne škode nastale zaradi nedelovanja storitve, zamude pri dostavi e-mail opomnikov ali napak v sistemu. Storitev se zagotavlja "kot je" brez jamstev.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">6. Spremembe pogojev</h2>
            <p className="text-muted-foreground leading-relaxed">Pridržujemo si pravico do spremembe teh pogojev. O pomembnih spremembah vas bomo obvestili po e-pošti. Nadaljnja uporaba storitve po objavi sprememb pomeni strinjanje z novimi pogoji.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">7. Kontakt</h2>
            <p className="text-muted-foreground leading-relaxed">Za vprašanja v zvezi s pogoji nas kontaktirajte na <a href="mailto:info@veljavno.si" className="text-primary hover:underline">info@veljavno.si</a>.</p>
          </section>

        </div>
      </div>

      <footer className="border-t border-border py-8 mt-12">
        <div className="max-w-3xl mx-auto px-6 flex gap-6 text-sm text-muted-foreground">
          <a href="/" className="hover:text-foreground transition-colors">Domov</a>
          <a href="/zasebnost" className="hover:text-foreground transition-colors">Politika zasebnosti</a>
          <a href="mailto:info@veljavno.si" className="hover:text-foreground transition-colors">Kontakt</a>
        </div>
      </footer>
    </main>
  )
}