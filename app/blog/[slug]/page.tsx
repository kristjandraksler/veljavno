import { Metadata } from 'next'
import { notFound } from 'next/navigation'

const clanki: Record<string, {
  naslov: string
  opis: string
  datum: string
  branje: string
  vsebina: string
}> = {
  'voznicko-dovoljenje-podaljsanje': {
    naslov: 'Kdaj poteče vozniško dovoljenje in kako ga podaljšati',
    opis: 'Vse kar morate vedeti o podaljšanju vozniškega dovoljenja v Sloveniji — roki, postopek, stroški.',
    datum: '15. junij 2026',
    branje: '4 min',
    vsebina: `
      <h2>Kdaj poteče vozniško dovoljenje?</h2>
      <p>V Sloveniji je vozniško dovoljenje veljavno <strong>10 let</strong> od datuma izdaje. Datum poteka je jasno naveden na sprednji strani dokumenta.</p>
      <p>Po novem zakonu morajo vsi vozniki ob podaljšanju opraviti tudi <strong>zdravniški pregled</strong>, ki potrdi, da so še vedno sposobni varno voziti.</p>

      <h2>Kaj se zgodi, če vozim s poteklim vozniškim dovoljenjem?</h2>
      <p>Vožnja s poteklim vozniškim dovoljenjem je prekršek. Policija vam lahko izreče <strong>globo do 1.200 €</strong> in odvzame točke. Poleg tega vaše zavarovanje morda ne bo krilo škode v primeru nesreče.</p>

      <h2>Kako podaljšati vozniško dovoljenje?</h2>

      <h3>1. Zdravniški pregled</h3>
      <p>Pred podaljšanjem morate opraviti zdravniški pregled pri pooblaščenem zdravniku za vozniška dovoljenja. Pregled vključuje pregled vida, splošni zdravstveni pregled in morebitne dodatne teste. Cena pregleda se giblje med <strong>30 in 60 €</strong>.</p>

      <h3>2. Vloga na upravni enoti</h3>
      <p>Po opravljenem zdravniškem pregledu odnesite na pristojno upravno enoto:</p>
      <ul>
        <li>Veljavno osebno izkaznico ali potni list</li>
        <li>Staro vozniško dovoljenje</li>
        <li>Potrdilo o zdravniškem pregledu</li>
        <li>Plačilo upravne takse (okoli <strong>20 €</strong>)</li>
      </ul>

      <h3>3. Čakalna doba</h3>
      <p>Novo vozniško dovoljenje prejmete v roku <strong>15 delovnih dni</strong>.</p>

      <h2>Kdaj začeti s postopkom?</h2>
      <p>Priporočamo, da začnete s podaljšanjem vsaj <strong>2 meseca pred potekom</strong> vozniškega dovoljenja. Tako imate dovolj časa za zdravniški pregled, oddajo vloge in čakanje na novi dokument.</p>

      <h2>Pogosta vprašanja</h2>
      <p><strong>Ali lahko vozim med čakanjem na novo vozniško dovoljenje?</strong><br/>Da — dokler imate potrdilo o oddani vlogi, smete voziti.</p>
      <p><strong>Ali moram opraviti vozniški izpit znova?</strong><br/>Ne, ob podaljšanju vozniškega izpita ni potrebno opravljati znova.</p>
      <p><strong>Kaj če sem pozabil podaljšati in je že poteklo?</strong><br/>Takoj prenehajte z vožnjo in čim prej uredite podaljšanje na upravni enoti.</p>
    `
  },
  'osebna-izkaznica-podaljsanje': {
    naslov: 'Osebna izkaznica — kdaj poteče in kaj potrebuješ za podaljšanje',
    opis: 'Popoln vodič za podaljšanje osebne izkaznice v Sloveniji — kje, kdaj in kako.',
    datum: '15. junij 2026',
    branje: '3 min',
    vsebina: `
      <h2>Kdaj poteče osebna izkaznica?</h2>
      <p>Osebna izkaznica v Sloveniji je veljavna <strong>10 let</strong> za odrasle. Za otroke do 3 let velja 2 leti, za otroke od 3 do 18 let pa 5 let.</p>

      <h2>Zakaj je važno imeti veljavno osebno izkaznico?</h2>
      <p>Osebna izkaznica je osnovni identifikacijski dokument v Sloveniji. Potrebujete jo pri:</p>
      <ul>
        <li>Potovanjih znotraj EU</li>
        <li>Odpiranju bančnega računa</li>
        <li>Obisku zdravnika</li>
        <li>Glasovanju na volitvah</li>
        <li>Podpisovanju pogodb</li>
      </ul>

      <h2>Kako podaljšati osebno izkaznico?</h2>

      <h3>1. Pojdite na upravno enoto</h3>
      <p>Vlogo za novo osebno izkaznico oddate osebno na pristojni upravni enoti. Potrebujete:</p>
      <ul>
        <li>Staro osebno izkaznico</li>
        <li>Fotografijo (v nekaterih primerih)</li>
        <li>Plačilo takse (okoli <strong>10 €</strong>)</li>
      </ul>

      <h3>2. Čakalna doba</h3>
      <p>Novo osebno izkaznico prejmete v roku <strong>30 dni</strong>, v nujnih primerih pa hitreje.</p>

      <h2>Kdaj začeti s podaljšanjem?</h2>
      <p>Priporočamo da začnete vsaj <strong>1 mesec pred potekom</strong>. Posebej pazite pred potovanji v tujino — nekatere destinacije zahtevajo veljavnost dokumenta še vsaj 6 mesecev po potovanju.</p>

      <h2>Pogosta vprašanja</h2>
      <p><strong>Ali lahko potujem z iztekajočo se osebno izkaznico?</strong><br/>Znotraj EU načeloma da, dokler je veljavna. Priporočamo pa, da jo podaljšate pred potovanjem.</p>
      <p><strong>Kaj storiti pri izgubi?</strong><br/>Takoj prijavite izgubo policiji in nato uredite novo izkaznico na upravni enoti.</p>
    `
  },
  'potni-list-vse-kar-moras-vedeti': {
    naslov: 'Potni list — vse kar moraš vedeti pred potovanjem',
    opis: 'Kdaj poteče potni list, kako ga podaljšati in zakaj je pomembno biti pravočasen.',
    datum: '15. junij 2026',
    branje: '4 min',
    vsebina: `
      <h2>Kdaj poteče potni list?</h2>
      <p>Slovenski potni list je veljaven <strong>10 let</strong> za odrasle in <strong>5 let</strong> za otroke do 18 let.</p>

      <h2>Zakaj je važno imeti veljaven potni list?</h2>
      <p>Za potovanja izven EU je potni list obvezen. Mnoge države zahtevajo, da je potni list veljaven še vsaj <strong>6 mesecev po datumu vrnitve</strong>. To pomeni, da morate preveriti veljavnost dolgo pred potovanjem.</p>

      <h2>Kako podaljšati potni list?</h2>

      <h3>1. Vloga na upravni enoti</h3>
      <p>Vlogo za nov potni list oddate na upravni enoti. Potrebujete:</p>
      <ul>
        <li>Star potni list</li>
        <li>Veljavno osebno izkaznico</li>
        <li>Fotografijo</li>
        <li>Plačilo takse (okoli <strong>35 €</strong>)</li>
      </ul>

      <h3>2. Čakalna doba</h3>
      <p>Standardna čakalna doba je <strong>30 dni</strong>. V nujnih primerih (potovanje v 3 dneh) lahko dobite potni list hitreje, a za doplačilo.</p>

      <h2>Kdaj začeti s podaljšanjem?</h2>
      <p>Priporočamo vsaj <strong>3 mesece pred potovanjem</strong>. Posebej v poletnih mesecih so čakalne dobe daljše.</p>

      <h2>Pogosta vprašanja</h2>
      <p><strong>Ali lahko z osebno izkaznico v vse države?</strong><br/>Ne — izven EU in Schengenskega prostora boste v večini držav potrebovali potni list.</p>
      <p><strong>Kaj storiti pri izgubi potnega lista v tujini?</strong><br/>Takoj kontaktirajte najbližje slovensko konzularno predstavništvo.</p>
      <p><strong>Ali otroci potrebujejo lastni potni list?</strong><br/>Da — vsak otrok mora imeti lasten potni list ali osebno izkaznico.</p>
    `
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const clanek = clanki[slug]
  if (!clanek) return {}
  return {
    title: `${clanek.naslov} — Veljavno`,
    description: clanek.opis,
  }
}

export default async function ClanekPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const clanek = clanki[slug]
  if (!clanek) notFound()

  return (
    <main className="min-h-screen bg-background text-foreground">
      <nav className="border-b border-border px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <svg width="32" height="40" viewBox="0 0 60 72" fill="none">
              <rect x="0" y="0" width="60" height="72" rx="10" fill="#2563eb"/>
              <rect x="10" y="8" width="26" height="4" rx="2" fill="white" fillOpacity="0.5"/>
              <rect x="10" y="17" width="40" height="4" rx="2" fill="white" fillOpacity="0.35"/>
              <rect x="10" y="26" width="32" height="4" rx="2" fill="white" fillOpacity="0.35"/>
              <rect x="10" y="35" width="36" height="4" rx="2" fill="white" fillOpacity="0.35"/>
              <circle cx="43" cy="56" r="14" fill="white"/>
              <path d="M36 56 L41 61 L50 50" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div className="flex flex-col">
              <span className="font-display text-lg font-bold tracking-[0.08em] leading-tight">VELJAVNO</span>
              <span className="text-xs text-muted-foreground">Sistem za pravočasne opomnike</span>
              <div className="w-8 h-0.5 bg-primary mt-1" />
            </div>
          </a>
          <a href="/registracija" className="text-sm font-semibold text-white bg-primary px-5 py-2 rounded-full hover:bg-primary/90 transition-colors">Registracija</a>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-16">
        <a href="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 inline-block">← Nazaj na blog</a>

        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
          <span>{clanek.datum}</span>
          <span>·</span>
          <span>{clanek.branje} branja</span>
        </div>

        <h1 className="font-display text-4xl font-bold tracking-[-0.04em] mb-8">{clanek.naslov}</h1>

        <div
          className="prose prose-lg max-w-none text-foreground
            [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:text-foreground
            [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-3 [&_h3]:text-foreground
            [&_p]:text-muted-foreground [&_p]:leading-relaxed [&_p]:mb-4
            [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:text-muted-foreground [&_ul]:mb-4
            [&_li]:mb-2 [&_strong]:text-foreground [&_strong]:font-semibold"
          dangerouslySetInnerHTML={{ __html: clanek.vsebina }}
        />

        <div className="mt-16 bg-primary/5 border border-primary/20 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-2">Ne pozabite na opomnik!</h2>
          <p className="text-muted-foreground mb-6">Veljavno vas avtomatsko opomni preden poteče vaš dokument.</p>
          <a href="/registracija" className="inline-block bg-primary text-white px-8 py-4 rounded-full text-sm font-semibold uppercase tracking-[0.16em] hover:bg-primary/90 transition-colors">
            Začni brezplačno →
          </a>
        </div>
      </div>

      <footer className="border-t border-border py-8 mt-20">
        <div className="max-w-3xl mx-auto px-6 flex justify-between items-center text-sm text-muted-foreground">
          <span>© 2026 Veljavno</span>
          <a href="/" className="hover:text-primary transition-colors">Domov</a>
        </div>
      </footer>
    </main>
  )
}