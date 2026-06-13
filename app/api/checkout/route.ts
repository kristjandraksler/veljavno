import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const priceIds: Record<string, string> = {
  samostojni: process.env.NEXT_PUBLIC_STRIPE_SAMOSTOJNI!,
  druzinski: process.env.NEXT_PUBLIC_STRIPE_DRUZINSKI!,
  poslovni: process.env.NEXT_PUBLIC_STRIPE_POSLOVNI!,
}

export async function POST(request: Request) {
  const { paket, userId, email } = await request.json()

  const priceId = priceIds[paket]
  if (!priceId) {
    return Response.json({ error: 'Neveljaven paket' }, { status: 400 })
  }

  const isRecurring = paket === 'poslovni'

  const session = await stripe.checkout.sessions.create({
    mode: isRecurring ? 'subscription' : 'payment',
    payment_method_types: ['card'],
    customer_email: email,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    metadata: {
      userId,
      paket,
    },
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?placilo=uspesno`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/registracija?paket=${paket}`,
  })

  return Response.json({ url: session.url })
}