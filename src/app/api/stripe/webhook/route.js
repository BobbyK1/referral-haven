import { createServerClient } from "@supabase/ssr";
import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);
const webhookSecret = process.env.NEXT_PUBLIC_WEBHOOK_SECRET;

// export async function POST(request) {
//     const body = await request.text();
//     const signature = headers().get("stripe-signature");
//     let event;

//     if (!signature) {
//         throw new Error(`No Stripe signature found.`);
//     }


//     const cookieStore = cookies();

//     const supabase = createServerClient(
//         process.env.NEXT_PUBLIC_SUPABASE_URL,
//         process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
//         {
//             cookies: {
//                 get(name) {
//                     return cookieStore.get(name)?.value
//                 },
//                 set(name, value, options) {
//                     cookieStore.set({ name, value, ...options })
//                 },
//                 remove(name, options) {
//                     cookieStore.set({ name, value: '', ...options })
//                 }
//             }
//         }
//     )

//     NextResponse({ status: })

//     try {
//         event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
        
//     } catch (error) {
//         return new Response(`Webhook Error: ${error}`, {
//             status: 400
//         });
//     }

//     console.log(event)

//     switch(event.type) {
//         case "invoice.payment_succeeded":
//             const invoice = event.data.object;
//             const customerId = invoice.customer.id;
//             const subscriptionId = invoice.lines.data[0].subscription

//             const { data: customer, error: customerError } = await supabase
//                 .from('agents')
//                 .select('id,stripe_customer_id,subscription_id')
//                 .eq('stripe_customer_id', customerId);

//             if (customerError) throw new Error(customerError.message);
            
//             const agent = customer[0];
//             const updatedAgent = { ...agent, subscription_id: subscriptionId } 
            
//             const { agents, error } = await supabase
//                 .from('agents')
//                 .update(updatedAgent)
//                 .eq('stripe_customer_id', customerId)

//             if (error) throw new Error(error.message);

//             new Response(`Success`, {
//                 status: "200"
//             })

//             break;

//         default:
//             return new Response(`Unhandled event type ${event.type}`, {
//                 status: 400
//             });
//     }
    
//     return new Response(`Unable to parse webhook. Unknown error occurred.`, {
//         status: 400
//     })
// }

// app/api/stripe-webhook/route.ts

export async function POST(request) {
    try {
        const sig = headers().get('stripe-signature');

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

        // Verify the webhook signature
        const event = stripe.webhooks.constructEvent(
            await request.text(),
            sig,
            process.env.NEXT_PUBLIC_WEBHOOK_SECRET
        );

        // Handle the event based on its type
        if (event.type === 'invoice.payment_succeeded') {
        

        // Respond with a 200 OK status
            return new NextResponse().statusText("Handled Event type.").status(200);
        } else {
        // Handle other webhook event types if needed
        // ...

        // Respond with a 200 OK status
        return new NextResponse("Unhandled event type.", { status: 200 });
        }
    } catch (error) {
        console.error('Webhook error:', error.message);
        return new NextResponse({ status: 400, text: `Webhook Error: ${error.message}` });
    }
}
