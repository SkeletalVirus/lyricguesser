export async function onRequest(context) {
  const { request, env } = context;

  // Only allow POST
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    // Parse JSON body
    const { fileContent, fileID } = await request.json();

    // Check that fileContent and fileID exist
    if (!fileContent || !fileID) {
      return new Response(JSON.stringify({ error: "Missing fileContent or fileID" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // GitHub API URL
    const githubUrl = `https://api.github.com/repos/SkeletalVirus/lyricguesser/contents/data/${fileID}.json`;

    // Make the PUT request to GitHub
    const githubResponse = await fetch(githubUrl, {
      method: "PUT",
      headers: {
        Authorization: `token ${env.TOKEN}`,
        "Content-Type": "application/json",
        Accept: "application/vnd.github.v3+json"
      },
      body: JSON.stringify({
        message: `Added file ${fileID}.json via Cloudflare Pages`,
        content: btoa(fileContent),
        branch: "main"
      })
    });

    const data = await githubResponse.json();

    // Return GitHub response to frontend
    return new Response(JSON.stringify(data), {
      status: githubResponse.status,
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
