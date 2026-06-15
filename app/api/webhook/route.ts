import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const resend = new Resend(process.env.RESEND_API_KEY)

const paketImena: Record<string, string> = {
  samostojni: 'Samostojni — 4,99 €',
  druzinski: 'Družinski — 9,99 €',
}

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    return new Response('Webhook error', { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    const userId = session.metadata?.userId
    const paket = session.metadata?.paket
    const email = session.customer_email

    if (userId && paket) {
      await supabase
        .from('profiles')
        .update({ paket, placilo_potrjeno: true })
        .eq('id', userId)

      const ref = session.metadata?.ref
      if (ref) {
        await supabase.from('affiliate_konverzije').insert({
          ref_koda: ref,
          user_id: userId,
          paket,
          znesek: paket === 'samostojni' ? 4.99 : 9.99,
        })
      }
    }

    if (email && paket) {
      const znesek = paket === 'samostojni' ? '4,99 €' : '9,99 €'
      const tip = 'enkratno plačilo'

      await resend.emails.send({
        from: 'Veljavno <opomniki@veljavno.si>',
        to: email,
        subject: '✅ Potrdilo o plačilu — Veljavno',
        html: `
          <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <div style="background: #2563eb; border-radius: 12px; padding: 24px 32px; margin-bottom: 32px;">
              <span style="color: white; font-size: 18px; font-weight: 700; letter-spacing: 0.08em;">VELJAVNO</span>
            </div>
            <h1 style="font-size: 24px; font-weight: 700; color: #0f172a; margin-bottom: 8px;">Plačilo potrjeno!</h1>
            <p style="color: #64748b; font-size: 16px; margin-bottom: 32px;">Hvala za zaupanje. Vaš račun je aktiviran.</p>
            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
              <p style="font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: #16a34a; margin: 0 0 12px;">Podrobnosti plačila</p>
              <table style="width: 100%; font-size: 14px;">
                <tr>
                  <td style="color: #64748b; padding: 4px 0;">Paket</td>
                  <td style="text-align: right; font-weight: 600; color: #0f172a;">${paketImena[paket] || paket}</td>
                </tr>
                <tr>
                  <td style="color: #64748b; padding: 4px 0;">Znesek</td>
                  <td style="text-align: right; font-weight: 600; color: #0f172a;">${znesek}</td>
                </tr>
                <tr>
                  <td style="color: #64748b; padding: 4px 0;">Tip</td>
                  <td style="text-align: right; font-weight: 600; color: #0f172a;">${tip}</td>
                </tr>
              </table>
            </div>
            <a href="https://veljavno.si/dashboard" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; border-radius: 50px; text-decoration: none; font-weight: 600; font-size: 14px;">Odpri dashboard →</a>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 32px 0;" />
            <p style="color: #94a3b8; font-size: 12px;">Veljavno — Sistem za pravočasne opomnike</p>
          </div>
        `
      })
    }
  }

  if (event.type === 'charge.refunded') {
    const charge = event.data.object as Stripe.Charge
    const paymentIntentId = charge.payment_intent as string

    if (paymentIntentId) {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
      const sessions = await stripe.checkout.sessions.list({
        payment_intent: paymentIntentId,
      })

      const session = sessions.data[0]
      const userId = session?.metadata?.userId

      if (userId) {
        await supabase
          .from('profiles')
          .update({ placilo_potrjeno: false })
          .eq('id', userId)

        const email = charge.billing_details?.email || session?.customer_email
        if (email) {
          await resend.emails.send({
            from: 'Veljavno <opomniki@veljavno.si>',
            to: email,
            subject: 'Vračilo plačila — Veljavno',
            html: `
              <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                <div style="background: #2563eb; border-radius: 12px; padding: 24px 32px; margin-bottom: 32px;">
                  <span style="color: white; font-size: 18px; font-weight: 700; letter-spacing: 0.08em;">VELJAVNO</span>
                </div>
                <h1 style="font-size: 24px; font-weight: 700; color: #0f172a; margin-bottom: 8px;">Vračilo potrjeno</h1>
                <p style="color: #64748b; font-size: 16px; margin-bottom: 32px;">Vaše vračilo je bilo obdelano. Dostop do računa je bil začasno onemogočen.</p>
                <p style="color: #64748b; font-size: 14px;">Če menite da je prišlo do napake nas kontaktirajte na <a href="mailto:info@veljavno.si" style="color: #2563eb;">info@veljavno.si</a>.</p>
                <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 32px 0;" />
                <p style="color: #94a3b8; font-size: 12px;">Veljavno — Sistem za pravočasne opomnike</p>
              </div>
            `
          })
        }
      }
    }
  }

  return Response.json({ received: true })
}