import { createServerClient } from "@supabase/ssr";
import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);
const webhookSecret = process.env.NEXT_PUBLIC_WEBHOOK_SECRET;

export async function POST(request) {
    try {
        const sig = headers().get('stripe-signature');

        if (!sig) {
            throw new Error(`No Stripe signature found.`);
        }

        const cookieStore = cookies();

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY,
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
                },
                auth: {
                    autoRefreshToken: false,
                    persistSession: false,
                }
            }
        )
        
        // Verify the webhook signature
        const event = stripe.webhooks.constructEvent(
            await request.text(),
            sig,
            webhookSecret
        );

        console.log("Event", event.type)
        // Handle the event based on its type
        if (event.type === 'invoice.payment_succeeded') {
            const invoice = event.data.object;
            const customerId = invoice.customer;
            const subscriptionId = invoice.lines.data[0].subscription

            const { data: customer, error: customerError } = await supabase
                .from('agents')
                .select('id,stripe_customer_id')
                .eq('stripe_customer_id', customerId);

            if (customerError) return new Response(`Customer retrieval error: ${customerError.message}`, {
                status: 400
            })
            
            const agent = customer[0];
            const updatedAgent = { ...agent, subscription_id: subscriptionId,  } 
            
            const { agents, error } = await supabase
                .from('agents')
                .update(updatedAgent)
                .eq('stripe_customer_id', customerId)

            if (error) return new Response(`Update stripe_customer_id error: ${error.message}`, {
                status: 400
            });

            return new Response("Payment succeeded webhook received and parsed.", {
                status: 200,
            })
        } else {
            return new Response("Unhandled event type received.", {
                status: 400,

            })
        }
    } catch (error) {
        console.error('Webhook error:', error.message);
        return new Response(`Webhook error: ${error}`, {
            status: 400
        })
    }
}
