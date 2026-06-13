import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const paketImena: Record<string, string> = {
  samostojni: 'Samostojni — 4,99 €',
  druzinski: 'Družinski — 9,99 €',
}

export async function POST(request: Request) {
  const { email, ime, paket } = await request.json()

  await resend.emails.send({
    from: 'Veljavno <opomniki@veljavno.si>',
    to: email,
    subject: '👋 Dobrodošli v Veljavno!',
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        
        <div style="background: #2563eb; border-radius: 12px; padding: 24px 32px; margin-bottom: 32px;">
          <span style="color: white; font-size: 18px; font-weight: 700; letter-spacing: 0.08em;">VELJAVNO</span>
        </div>

        <h1 style="font-size: 24px; font-weight: 700; color: #0f172a; margin-bottom: 8px;">Dobrodošli, ${ime}!</h1>
        <p style="color: #64748b; font-size: 16px; margin-bottom: 32px;">Vaš račun je uspešno ustvarjen. Nikoli več ne boste pozabili na potek dokumentov.</p>

        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin-bottom: 32px;">
          <p style="font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: #94a3b8; margin: 0 0 8px;">Vaš paket</p>
          <p style="font-size: 20px; font-weight: 700; color: #0f172a; margin: 0;">${paketImena[paket] || paket}</p>
        </div>

        <p style="color: #64748b; font-size: 15px; margin-bottom: 8px;">Začnite z dodajanjem vaših dokumentov:</p>
        <ul style="color: #64748b; font-size: 14px; padding-left: 20px; margin-bottom: 24px;">
          <li style="margin-bottom: 6px;">Vozniško dovoljenje</li>
          <li style="margin-bottom: 6px;">Osebna izkaznica</li>
          <li style="margin-bottom: 6px;">Potni list</li>
          <li>in ostale dokumente z datumom poteka</li>
        </ul>

        <a href="https://veljavno.si/dashboard" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; border-radius: 50px; text-decoration: none; font-weight: 600; font-size: 14px;">Dodaj prve dokumente →</a>

        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 32px 0;" />
        <p style="color: #94a3b8; font-size: 12px;">Veljavno — Sistem za pravočasne opomnike</p>
      </div>
    `
  })

  return Response.json({ success: true })
}