export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== "string") {
      return new Response(JSON.stringify({ error: "Missing or invalid prompt" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const apiKey = env.GOOGLE_API_KEY;

    // Google Gemini endpoint
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

    const body = {
      contents: [
        {
          parts: [
            {
              text: `Explain the financial or real estate compliance term "${prompt}" in simple, easy-to-understand language for a general audience, in the context of FinCEN's real estate reporting rules. Keep the explanation concise.`
            }
          ]
        }
      ]
    };

    const aiResponse = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const data = await aiResponse.json();

    let text = "No explanation available.";
    if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      text = data.candidates[0].content.parts[0].text;
    }

    return new Response(JSON.stringify({ text }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (e) {
    console.error("explain-jargon error:", e);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
