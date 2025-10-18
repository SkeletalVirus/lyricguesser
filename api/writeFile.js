export default async function (request, env) {
    // Only accept POST requests
    if (request.method !== "POST") {
        return new Response("Method Not Allowed", { status: 405 });
    }

    try {
        const { fileContent, fileID } = await request.json();

        // Use your GitHub PAT stored as a Pages Secret
        // Go to Pages dashboard > Settings > Variables & Secrets > Add GITHUB_TOKEN
        const token = env.GITHUB_TOKEN;

        if (!token) {
            return new Response(JSON.stringify({ error: "GitHub token not found in env" }), { status: 500 });
        }

        const path = `data/${fileID}.json`;
        const res = await fetch(`https://api.github.com/repos/SkeletalVirus/lyricguesser/contents/${path}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Accept": "application/vnd.github.v3+json"
            },
            body: JSON.stringify({
                message: `Added file ${fileID}.json via Cloudflare Pages Function`,
                content: btoa(fileContent),
                branch: "main"
            })
        });

        const data = await res.json();

        if (!res.ok) {
            return new Response(JSON.stringify({ error: data }), { status: res.status });
        }

        return new Response(JSON.stringify({ success: true, data }), { status: 200 });

    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
