import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const resend = new Resend(process.env.RESEND_API_KEY)

export async function GET(request: Request) {
  // Preveri secret token da nihče drug ne more klicati tega endpointa
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  const danes = new Date()
  danes.setHours(0, 0, 0, 0)

  // Pridobi vse dokumente
  const { data: dokumenti, error } = await supabase
    .from('documents')
    .select('*, profiles(ime, id)')

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  let poslano = 0

  for (const doc of dokumenti || []) {
    const datumPoteka = new Date(doc.datum_poteka)
    const dniDo = Math.ceil((datumPoteka.getTime() - danes.getTime()) / 86400000)

    const opomniki: number[] = doc.opomniki || []

    for (const opomnik of opomniki) {
      if (dniDo !== opomnik) continue

      // Preveri ali smo že poslali ta opomnik
      const { data: obstojeciOpomnik } = await supabase
        .from('sent_reminders')
        .select('id')
        .eq('document_id', doc.id)
        .eq('days_before', opomnik)
        .single()

      if (obstojeciOpomnik) continue

      // Pridobi email uporabnika
      const { data: userData } = await supabase.auth.admin.getUserById(doc.user_id)
      if (!userData?.user?.email) continue

      const email = userData.user.email
      const ime = doc.profiles?.ime || 'Uporabnik'

      // Pošlji e-mail
      await resend.emails.send({
        from: 'Veljavno <opomniki@veljavno.si>',
        to: email,
        subject: `⏰ ${doc.ime} poteče čez ${dniDo} dni`,
        html: `
          <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <h1 style="font-size: 24px; font-weight: 700; color: #0f172a; margin-bottom: 8px;">Pozdravljeni, ${ime}!</h1>
            <p style="color: #64748b; font-size: 16px; margin-bottom: 24px;">Vaš dokument bo kmalu potekel.</p>
            
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
              <p style="font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: #94a3b8; margin: 0 0 8px;">Dokument</p>
              <p style="font-size: 20px; font-weight: 700; color: #0f172a; margin: 0 0 8px;">${doc.ime}</p>
              <p style="font-size: 16px; color: #2563eb; font-weight: 600; margin: 0;">Poteče čez ${dniDo} dni — ${new Date(doc.datum_poteka).toLocaleDateString('sl-SI')}</p>
            </div>

            <p style="color: #64748b; font-size: 14px;">Pravočasno uredite podaljšanje dokumenta.</p>
            
            <a href="https://veljavno.si/dashboard" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; border-radius: 50px; text-decoration: none; font-weight: 600; font-size: 14px; margin-top: 16px;">Odpri dashboard</a>
            
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 32px 0;" />
            <p style="color: #94a3b8; font-size: 12px;">Veljavno — Sistem za pravočasne opomnike</p>
          </div>
        `
      })

      // Zabeleži da smo poslali opomnik
      await supabase.from('sent_reminders').insert({
        document_id: doc.id,
        days_before: opomnik,
      })

      poslano++
    }
  }

  return Response.json({ success: true, poslano })
}