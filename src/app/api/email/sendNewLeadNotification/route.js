

export async function POST(request) {
    const data = await request.json();

    if (!data.record) {
        return new Response('No data included in webhook payload.', {
            status: 400
        })
    }


    const options = {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          'api-key': process.env.BREVO_API_KEY
        },
        body: JSON.stringify({
            subject: "A new lead has been registered",
            params: {
                fullName: `${data.record.first_name} ${data.record.last_name}`,
                first_name: data.record.first_name,
                last_name: data.record.last_name,
                email: data.record.email,
                phoneNumber: data.record.phone_number,
                preferred: data.record.referral_type === "hasAgent" ? "No" : "Yes",
                link: `http://localhost:3000/dashboard/referrals/${data.record.id}`
            },
            templateId: 12,
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