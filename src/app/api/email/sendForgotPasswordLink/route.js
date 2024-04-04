import routeHandlerAdminSupabase from "@/app/util/routeHandlerAdminSupabase";

export async function POST(request) {
    const info = await request.json();

    const supabase = routeHandlerAdminSupabase();

    const { data, error } = await supabase
        .auth
        .admin
        .generateLink({
            type: "recovery",
            email: info.email,
            options: {
                redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/resetPasswordConfirmation`
            }
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
          to: [{email: info.email}]
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