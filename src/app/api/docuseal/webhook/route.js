import routeHandlerAdminSupabase from "@/app/util/routeHandlerAdminSupabase";

export async function POST(request) {
    const data = await request.json();

    const supabase = routeHandlerAdminSupabase();

    if (data.event_type) {
        const { data: info, error } = await supabase
            .from('agent_agreements')
            .update({
                completed: true
            })
            .eq('submission_id', data.data.submission_id)
            .select('user_id')

        if (error) return new Response(`Error occured: ${error.message}`, {
            status: 400
        })

        const { update, error: updateError } = await supabase
            .from('agents')
            .update({
                signed_independent_contractor_agreement: true
            })
            .eq('id', info[0].user_id)

        if (updateError) return new Response(`Error occured: ${updateError.message}`, {
            status: 400
        })
    }

    return new Response("Success", {
        status: 200
    })
}