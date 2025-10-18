export default async function (request, env) {
    if (request.method !== "POST") {
        return new Response("Method Not Allowed", { status: 405 });
    }

    try {
        const { fileContent, fileID } = await request.json();

        // Use env.TOKEN for your GitHub PAT
        const token = env.GITHUB_TOKEN;

        const res = await fetch(`https://api.github.com/repos/SkeletalVirus/lyricguesser/contents/data/${fileID}.json`, {
            method: "PUT",
            headers: {
                "Authorization": `token ${token}`,
                "Accept": "application/vnd.github.v3+json"
            },
            body: JSON.stringify({
                message: `Added file ${fileID}.json via Cloudflare Function`,
                content: btoa(fileContent),
                branch: "main"
            })
        });

        const data = await res.json();
        return new Response(JSON.stringify(data), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
