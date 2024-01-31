import routeHandlerAdminSupabase from "@/app/util/routeHandlerAdminSupabase";


export async function POST(request) {
    const data = await request.json();

    if (!data) {
        return new Response(`No data provided`, {
            status: 400
        })
    }

    const supabase = await routeHandlerAdminSupabase();

    const { data: agents, error: agentError } = await supabase
        .from('agents')
        .select('id')
        .contains('role', ['admin']);

    if (agentError) return new Response(`Webook error: ${agentError.message}`, {
        status: 400
    })

    let admins = [];

    agents.forEach(agent => {
        admins.push(agent.id);
    })

    const { data: notifications, error } = await supabase
        .from('notifications')
        .insert({
            user_id: admins,
            message: {
                title: "New Referral Created",
                details: `A new referral has been created: ${data.record.first_name} ${data.record.last_name}`,
                metadata: {
                    id: data.record.id
                }
            }
        })
        .select();

    if (error) return new Response(`Error adding notification: ${error.message}`, {
        status: 400
    })

    return new Response(`Successfully added notification: ${notifications[0].id}`, {
        status: 200
    })
}