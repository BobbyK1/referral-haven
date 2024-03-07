import routeHandlerAdminSupabase from "@/app/util/routeHandlerAdminSupabase";

export async function POST(request) {
    const data = await request.json();

    const supabase = routeHandlerAdminSupabase();
    
    await fetch('https://api.docuseal.co/submissions', {
        method: "POST",
        headers: {
            'X-Auth-Token': process.env.NEXT_PUBLIC_DOCUSEAL_API_KEY,
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            template_id: 47374,
            submitters: [data.submitters[0]]
        })
    })
    .then(response => response.json())
    .then(async response => {
        const { doc, error } = await supabase
            .from('agent_agreements')
            .insert({
                user_id: data.id,
                submission_id: response[0].submission_id,
                completed: false
            })

        if (error) throw new Error(error.message)
            
        return new Response(JSON.stringify(response), {
            status: 200
        })
    }).catch(error => {
        console.log(error)
        return new Response(`Error occurred. ${error}`, {
            status: 400
        })
    })

    return new Response(`Error occurred.`, {
        status: 400
    })
}