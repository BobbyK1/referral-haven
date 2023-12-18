import algoliasearch from "algoliasearch";

export async function POST(request) {
    const data = await request.json();

    if (!data.record) {
        return new Response('No data included in webhook payload.', {
            status: 400
        })
    }

    const client = algoliasearch(process.env.NEXT_PUBLIC_ALGOLIA_APP_ID, process.env.NEXT_PUBLIC_ALGOLIA_API_KEY);

    const index = client.initIndex(process.env.NEXT_PUBLIC_ALGOLIA_AGENT_INDEX);

    const record = {
        objectID: data.record.id,
        firstName: data.record.first_name,
        lastName: data.record.last_name,
        phone: data.record.phone_number,
        email: data.record.email,
    }

    try {
        const res = await index.saveObject(record);
        
        return new Response('Successfully added agent to Algolia.', {
            status: 200
        });
    } catch (error) {
        
        return new Response(`Unable to save agent record to Algolia. Error: ${error}`, {
            status: 400
        });
    }
}
