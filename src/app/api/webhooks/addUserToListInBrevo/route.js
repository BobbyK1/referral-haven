import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(request) {
    const data = await request.json();
    const cookieStore = cookies();

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY,
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

    const options = {
        method: 'POST',
        headers: {accept: 'application/json', 'content-type': 'application/json'},
        body: JSON.stringify({
          attributes: {FIRSTNAME: data.record.first_name, LASTNAME: data.record.last_name, SMS: data.record.phone_number},
          updateEnabled: true,
          email: data.record.email,
          listIds: [9]
        })
      };
      
    await fetch('https://api.brevo.com/v3/contacts', options)
        .then(response => response.json())
        .then(response => {
            return new Response(`${response}`, {
                status: 200
            })
        })
        .catch(err => {
            return new Response(`Error: ${err}`, {
                status: 400
            })
        });


    return new Response(`Unknown error has occurred.`, {
        status: 400
    })
}