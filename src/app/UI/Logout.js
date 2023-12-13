'use client'

import { Button, MenuItem } from "@chakra-ui/react"
import { createBrowserClient } from "@supabase/ssr"
import { useRouter } from "next/navigation"

export function LogoutSignInForm() {
    const router = useRouter();

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )

    const logout = async () => {
		let { error } = await supabase.auth.signOut();

        if (error) throw new Error(error.message);

        return router.refresh();
	}

    return <Button onClick={logout} w="full" mt="2" size="sm" variant="solid" colorScheme="blue">Logout</Button>
}

export function LogoutMenuButton() {
    const router = useRouter();

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )

    const logout = async () => {
		let { error } = await supabase.auth.signOut();

        if (error) throw new Error(error.message);

        router.refresh();
		return router.push('/');
	}

    return <MenuItem onClick={logout}>Logout</MenuItem>
}