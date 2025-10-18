export async function onRequestPost(context) {
  try {
    const { fileContent, fileID } = await context.request.json();
    const token = context.env.token; // your GitHub PAT

    const owner = "SkeletalVirus";
    const repo = "lyricguesser";
    const path = `data/${fileID}.json`;
    const branch = "main";

    const encodedContent = btoa(fileContent);

    const ghResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `Added ${fileID}.json via Cloudflare API`,
          content: encodedContent,
          branch,
        }),
      }
    );

    const text = await ghResponse.text();

    if (!ghResponse.ok) {
      return new Response(JSON.stringify({ error: text }), { status: 500 });
    }

    return new Response(text, {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
