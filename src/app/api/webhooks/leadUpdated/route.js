import routeHandlerAdminSupabase from "@/app/util/routeHandlerAdminSupabase";


export async function POST(request) {
    const data = await request.json();

    if (!data) {
        return new Response(`No data provided`, {
            status: 400
        })
    }

    const supabase = await routeHandlerAdminSupabase();

    




    

    if (error) return new Response(`Error adding notification: ${error.message}`, {
        status: 400
    })

    return new Response(`Successfully added notification: ${notifications[0].id}`, {
        status: 200
    })
}