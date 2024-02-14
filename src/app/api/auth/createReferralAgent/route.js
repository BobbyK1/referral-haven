import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
//
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

    async function SetUserInfo() {
        const { agent, error } = await supabase.from('agents').upsert([
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
    
        if (error) throw new Error(error.message);

        return;
    }

    await SetUserInfo();

    return NextResponse.json({ success: true });
}