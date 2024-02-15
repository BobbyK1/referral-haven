import routeHandlerAdminSupabase from "@/app/util/routeHandlerAdminSupabase";
import { headers } from "next/headers";
import Stripe from "stripe";

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);
const webhookSecret = process.env.NEXT_PUBLIC_WEBHOOK_SECRET;

export async function POST(request) {
    try {
        const sig = headers().get('stripe-signature');

        // Check for stripe signature
        if (!sig) {
            throw new Error(`No Stripe signature found.`);
        }

        const supabase = await routeHandlerAdminSupabase();

        // Verify the webhook signature
        const event = stripe.webhooks.constructEvent(
            await request.text(),
            sig,
            webhookSecret
        );

        // Handle the event based on its type
        if (event.type === 'invoice.payment_succeeded') {
            const invoice = event.data.object;
            const customerId = invoice.customer;
            const subscriptionId = invoice.lines.data[0].subscription;

            // Get customer's id
            const { data: customer, error: customerError } = await supabase
                .from('agents')
                .select('stripe_customer_id')
                .eq('stripe_customer_id', customerId);

            if (customerError) return new Response(`Customer retrieval error: ${customerError.message}`, {
                status: 400
            })
            
            const agent = customer[0];
            // const updatedAgent = { ...agent, subscription_id: subscriptionId,  } 

            const periodStart = new Date(invoice.lines.data[0].period.start * 1000).toISOString();
            const periodEnd = new Date(invoice.lines.data[0].period.end * 1000).toISOString();
            
            // Insert subscription to database
            const { data, error } = await supabase
                .from('subscriptions')
                .insert({
                    subscription_id: subscriptionId,
                    period_start: periodStart,
                    period_end: periodEnd
                })
                .select();

            if (error) return new Response(`Update stripe_customer_id error: ${error.message}`, {
                status: 400
            });

            if (data) {
                // Update agent subscription_id column
                const { data: update, error } = await supabase
                    .from('agents')
                    .update({
                        subscription_id: data[0].id
                    })
                    .eq('stripe_customer_id', agent.stripe_customer_id)

                if (error) return new Response(`Unable to update subscription_id column: ${error.message}`, {
                    status: 400
                })
            }

            return new Response("Webhook received and processed.", {
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
