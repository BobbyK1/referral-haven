import routeHandlerAdminSupabase from "@/app/util/routeHandlerAdminSupabase";

export async function POST() {
    const supabase = await routeHandlerAdminSupabase();

    const { data, error } = await supabase
        .auth
        .admin
        .generateLink({
            type: "recovery",
            email: "bobby@havenrealtyhomes.com"
        })

    if (error) return new Response(`${error.message}`, {
        status: 400
    })

    const options = {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          'api-key': process.env.BREVO_API_KEY
        },
        body: JSON.stringify({
          params: {passwordResetLink: data.properties.action_link},
          templateId: 11,
          to: [{email: 'bobby@havenrealtyhomes.com'}]
        })
      };
      
    await fetch('https://api.brevo.com/v3/smtp/email', options)
        .then(response => response.json())
        .then(response => console.log(response))
        .catch(err => console.error(err));

    return new Response(`Success`, {
        status: 200
    })
}