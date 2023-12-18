import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import Stripe from "stripe";

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

export async function POST(request) {
    const data = await request.json();
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

    const customer = await stripe.customers.create({
        name: `${data.record.first_name} ${data.record.last_name}`,
        email: data.record.email,
        phone: data.record.phone_number
    })

    const { agents, error } = await supabase
        .from('agents')
        .update({
            stripe_customer_id: customer.id
        })
        .eq('id', data.record.id)
        .select();

    if (error) return new Response(`Unhandled error: ${error.message}`, {
        status: 400
    })

    return new Response(`Successfully updated stripe_customer_id`, {
        status: 200
    })
}