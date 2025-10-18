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

        const token = env.GITHUB_TOKEN;
        if (!token) {
            return new Response(JSON.stringify({ error: "GITHUB_TOKEN not set" }), {
                status: 500,
                headers: { "Content-Type": "application/json" }
            });
        }

        // GitHub API URL
        const url = `https://api.github.com/repos/SkeletalVirus/lyricguesser/contents/data/${fileID}.json`;

        // Encode content to base64
        const encodedContent = btoa(fileContent);

        // Check if file exists (GET request)
        const checkRes = await fetch(url, {
            headers: {
                "Authorization": `token ${token}`,
                "Accept": "application/vnd.github.v3+json"
            }
        });

        let sha = undefined;
        if (checkRes.ok) {
            const existingFile = await checkRes.json();
            sha = existingFile.sha; // needed for updating file
        }

        // PUT request to create/update the file
        const putRes = await fetch(url, {
            method: "PUT",
            headers: {
                "Authorization": `token ${token}`,
                "Accept": "application/vnd.github.v3+json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: `Added/Updated file ${fileID}.json via Cloudflare Pages`,
                content: encodedContent,
                branch: "main",
                ...(sha ? { sha } : {}) // include sha if updating
            })
        });

        const data = await putRes.json();

        if (!putRes.ok) {
            return new Response(JSON.stringify({ error: data }), {
                status: putRes.status,
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
