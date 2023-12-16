import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

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

    if (error) return new Response(`Get session error: ${error}`, {
        status: 400
    })

    if (!session) {
        return new Response(`Authentication required.`, {
            status: 400
        })
    }

    async function GetUser() {
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error) return new Response(`User retrieval error: ${error.message}`, {
            status: 400
        });

        return user;
    }

    const user = await GetUser();
    
    const { data: agents, error: agentError } = await supabase
        .from('agents')
        .select('subscription_id')
        .eq('id', user.id)
    
    if (agentError) return new Response(`Unable to retrieve subscription_id. Error: ${agentError.message}`, {
        status: 400
    })

    if (agents[0].subscription_id) {
        return new Response(JSON.stringify({
            status: 200,
            active: true,
        }), {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } else {
        return new Response(JSON.stringify({
            status: 200,
            active: false,
        }), {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

}