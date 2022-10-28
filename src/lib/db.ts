// your-app-name/src/fetchGraphQL.js
export async function fetchGraphQL(text: any, variables: any) {
    // Fetch data from GitHub's GraphQL API:
    const response = await fetch('http://localhost:5000/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query: text,
            variables,
        }),
    });

    // Get the response as JSON
    return await response.json();
}
