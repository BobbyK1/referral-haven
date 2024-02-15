

export async function GET() {
    let headersList = {
        "Accept": "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
        "X-Auth-Token": "tUCPXyNUbdYCPbiAGvg1ekMLX7r2edYE2K4qznf9JsW"
    }
    
    let response = await fetch("https://api.docuseal.co/templates", { 
        method: "GET",
        headers: headersList
    });
    
    let data = await response.text();
    
    return new Response(data, {
        status: 200
    })
}