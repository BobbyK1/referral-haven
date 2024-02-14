export async function POST(request) {
    const data = await request.json();

    const options = {
        method: 'POST',
        headers: {accept: 'application/json', 'content-type': 'application/json'},
        body: JSON.stringify({
          attributes: {FIRSTNAME: data.record.first_name, LASTNAME: data.record.last_name, SMS: data.record.phone_number},
          updateEnabled: true,
          email: data.record.email,
          listIds: [9]
        })
      };
      
    await fetch('https://api.brevo.com/v3/contacts', options)
        .then(response => response.json())
        .then(response => {
            return new Response(`${response}`, {
                status: 200
            })
        })
        .catch(err => {
            return new Response(`Error: ${err}`, {
                status: 400
            })
        });


    return new Response(`Unknown error has occurred.`, {
        status: 400
    })
}