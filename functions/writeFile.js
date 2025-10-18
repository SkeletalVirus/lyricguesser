// functions/writeFile.js

export default async function (request, env) {
    // Only allow POST
    if (request.method !== "POST") {
        return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
            status: 405,
            headers: { "Content-Type": "application/json" }
        });
    }

    try {
        // Parse incoming JSON
        const { fileContent, fileID } = await request.json();

        if (!fileContent || !fileID) {
            return new Response(JSON.stringify({ error: "Missing fileContent or fileID" }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

        // Use GitHub token from Cloudflare environment variables
        const token = env.GITHUB_TOKEN;

        if (!token) {
            return new Response(JSON.stringify({ error: "GitHub token not set in environment variables" }), {
                status: 500,
                headers: { "Content-Type": "application/json" }
            });
        }

        // Convert file content to base64
        const base64Content = btoa(fileContent);

        // GitHub API endpoint
        const githubUrl = `https://api.github.com/repos/SkeletalVirus/lyricguesser/contents/data/${fileID}.json`;

        // PUT request to GitHub
        const res = await fetch(githubUrl, {
            method: "PUT",
            headers: {
                "Authorization": `token ${token}`,
                "Accept": "application/vnd.github.v3+json"
            },
            body: JSON.stringify({
                message: `Added file ${fileID}.json via Cloudflare Function`,
                content: base64Content,
                branch: "main"
            })
        });

        const data = await res.json();

        // Handle GitHub errors
        if (!res.ok) {
            return new Response(JSON.stringify({ error: data.message || "GitHub write failed" }), {
                status: res.status,
                headers: { "Content-Type": "application/json" }
            });
        }

        return new Response(JSON.stringify({ success: true, data }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });

    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
