import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from "stripe";

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

export async function POST(request) {
    const userInfo = await request.json();

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
    
    const { data: { user }, error } = await supabase.auth.signUp({
        email: userInfo.email,
        password: userInfo.password,
    });

    if (error) throw new Error(error);

    const { data: agent, error: userError } = await supabase.from('agents').insert([
        {   
            id: user.id,
            email: user.email,
            first_name: userInfo.firstName,
            last_name: userInfo.lastName,
            phone_number: userInfo.phoneNumber,
            license: userInfo.licenses,
            role: [
                "referral_agent"
            ]
        }
    ])
    .select()

    if (userError) throw new Error(userError.message);

    const options = {
        method: 'POST',
        headers: {accept: 'application/json', 'content-type': 'application/json', 'api-key': process.env.BREVO_API_KEY},
        body: JSON.stringify({
          attributes: {FIRSTNAME: userInfo.firstName, LASTNAME: userInfo.last_name},
          updateEnabled: true,
          email: userInfo.email,
          listIds: [9]
        })
      };
      
    await fetch('https://api.brevo.com/v3/contacts', options)
        .then(response => response.json())
        .then(response => console.log(response))
        .catch(err => console.error(err));

    const customer = await stripe.customers.create({
        name: `${userInfo.firstName} ${userInfo.lastName}`,
        email: userInfo.email,
        phone: userInfo.phone_number
    })

    const { agents, error: idError } = await supabase
        .from('agents')
        .update({
            stripe_customer_id: customer.id
        })
        .eq('id', user.id)
        .select();

    if (idError) throw new Error(idError.message);

    const confirmOptions = {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            'api-key': process.env.BREVO_API_KEY
        },
        body: JSON.stringify({
            params: { firstName: userInfo.firstName },
            templateId: 3,
            to: [{ email: userInfo.email }]
        })
    };

    await fetch('https://api.brevo.com/v3/smtp/email', confirmOptions)
        .then(response => response.json())
        .then(response => console.log(response))
        .catch(err => console.error(err));

    return NextResponse.json({ success: true });
}