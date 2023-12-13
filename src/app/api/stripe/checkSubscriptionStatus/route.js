import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY)

export async function GET() {
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

    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) throw new Error(error.message);

    if (!session) {
        NextResponse.error("Authentication required.")
    }

    async function GetUser() {
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error) return NextResponse.json({ error: error.message });

        return user;
    }

    const user = await GetUser();

    async function GetSubscription() {
        const { data: agents, error } = await supabase
            .from('agents')
            .select('subscription_id')
            .eq('id', user.id)

        console.log(agents)
        
        if (error) return NextResponse.json({ error: error.message });

        if (!agents[0].subscription_id) {
            return { active: false };
        }

        const subscription = await stripe.subscriptions.retrieve(
            agents[0].subscription_id
        )

        console.log(subscription.items.data[0].plan.active)

        if (subscription.items.data[0].plan.active) {
            return { active: true };
        } else {
            return { active: false };
        }

    }

    const subscription = await GetSubscription();

    console.log(subscription);

    return NextResponse.json(subscription);

}