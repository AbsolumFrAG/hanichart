import 'cross-fetch';

// eslint-disable-next-line import/no-anonymous-default-export
export default async function (query, vars) {
    var options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        body: JSON.stringify({
            query: query,
            variables: vars
        })
    },

        { data, errors } = await (await fetch('https://graphql.anilist.co/', options)).json();
    if (errors) { console.error(errors) }
    return data;
}