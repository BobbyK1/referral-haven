import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import routeHandlerAdminSupabase from '@/app/util/routeHandlerAdminSupabase'

export async function GET(request) {
    const { searchParams } = new URL(request.url)
    const token_hash = searchParams.get('access_token')
    const type = searchParams.get('type') 
    const next = searchParams.get('next') ?? '/'

    const redirectTo = request.nextUrl.clone()
    redirectTo.pathname = next
    redirectTo.searchParams.delete('token_hash')
    redirectTo.searchParams.delete('type')

    if (token_hash && type) {
        const supabase = routeHandlerAdminSupabase();

        const { error } = await supabase.auth.updateUser({
            password: ""
        })

        // const { error } = await supabase.auth.verifyOtp({
        // type,
        // token_hash,
        // })
        // if (!error) {
        // redirectTo.searchParams.delete('next')
        // return NextResponse.redirect(redirectTo)
        // }
    }

    // return the user to an error page with some instructions
    redirectTo.pathname = '/error'
    return NextResponse.redirect(redirectTo)
}