// /functions/api/writeFile.js

export async function onRequestPost(context) {
  try {
    const { fileContent, fileID } = await context.request.json();

    // Validate required inputs
    if (!fileContent || fileID === undefined) {
      return new Response(JSON.stringify({ error: "Missing fileContent or fileID" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const token = context.env.token; // From Cloudflare Pages secret
    const owner = "SkeletalVirus";
    const repo = "lyricguesser";
    const path = `data/${fileID}.json`;
    const branch = "main";

    // Encode content for GitHub API
    const encodedContent = btoa(fileContent);

    const ghResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
      body: JSON.stringify({
        message: `Added ${fileID}.json via Cloudflare API`,
        content: encodedContent,
        branch,
      }),
    });

    const ghData = await ghResponse.json();

    if (!ghResponse.ok) {
      console.error("GitHub API Error:", ghData);
      return new Response(JSON.stringify({ error: "GitHub API Error", details: ghData }), {
        status: ghResponse.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true, ghData }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("Server error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
