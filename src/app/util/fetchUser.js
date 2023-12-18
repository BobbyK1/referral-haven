import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export default async function fetchUser(shouldFetchRole) {
    const cookieStore = cookies()

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
        cookies: {
            get(name) {
            	return cookieStore.get(name)?.value
            },
        },
    })

    const { data: { user }, error } = await supabase.auth.getUser();

    if (!user) {
        return null;
    }

    if (shouldFetchRole) {
        async function GetRole() {
            const { data: agents, error } = await supabase
                .from('agents')
                .select('role')
                .eq('id', user.id);

            if (error) throw new Error(error.message);

            return agents[0].role;
        }

        const role = await GetRole();

        return { user, role };
    } else {
        return { user }
    }
    
    
}