export async function onRequestPost(context) {
    const { request, env } = context;
    const { fileContent, fileID } = await request.json();
  
    const owner = "SkeletalVirus";
    const repo = "lyricguesser";
    const path = `data/${fileID}.json`;
  
    // Convert to base64 (required by GitHub API)
    const encodedContent = btoa(fileContent);
  
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
      method: "PUT",
      headers: {
        "Authorization": `token ${env.GITHUB_TOKEN}`,
        "Accept": "application/vnd.github.v3+json"
      },
      body: JSON.stringify({
        message: `Updated ${fileID}.json via Cloudflare API`,
        content: encodedContent,
        branch: "main"
      })
    });
  
    const result = await response.json();
  
    return new Response(JSON.stringify(result), {
      headers: { "Content-Type": "application/json" },
      status: response.status
    });
  }
  
