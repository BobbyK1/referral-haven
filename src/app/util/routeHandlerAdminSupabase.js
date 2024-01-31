import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"


export default async function routeHandlerAdminSupabase() {
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

    return supabase;
}