import { createServerClient } from "@supabase/ssr";
import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);
const webhookSecret = process.env.NEXT_PUBLIC_WEBHOOK_SECRET;

export async function POST(request) {
    const body = await request.text();
    const signature = headers().get("stripe-signature");
    let event;

    if (!signature) {
        throw new Error(`No Stripe signature found.`);
    }

    const cookieStore = cookies();

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
            cookies: {
                get(name) {
                    return cookieStore.get(name)?.value
                },
                set(name, value, options) {
                    cookieStore.set({ name, value, ...options })
                },
                remove(name, options) {
                    cookieStore.set({ name, value: '', ...options })
                }
            }
        }
    )

    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (error) {
        return new Response(`Webhook Error: ${error}`, {
            status: 400
        });
    }

    switch(event.type) {
        case "invoice.payment_succeeded":
            const paymentIntent = event.data.object;
            const customerId = paymentIntent.customer.id;

            const { data: customer, error: customerError } = await supabase
                .from('agents')
                .select('id,stripe_customer_id,subscription_id')
                .eq('stripe_customer_id', customerId);

            if (customerError) throw new Error(customerError.message);
            
            const agent = customer[0];
            const updatedAgent = { ...agent, subscription_id: paymentIntent.invoice.subscription}
            
            const { agents, error } = await supabase
                .from('agents')
                .update(updatedAgent)
                .eq('stripe_customer_id', customerId)

            if (error) throw new Error(error.message);

            NextResponse.json({ success: true });
            break;

        default:
            return NextResponse.error(`Unhandled event type ${event.type}`)
    }

    return NextResponse.json();

}