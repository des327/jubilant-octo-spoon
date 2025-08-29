export async function onRequestPost(context) {
  try {
    const { request } = context;
    const { prompt } = await request.json();
    if (!prompt || typeof prompt !== 'string') {
      return new Response(JSON.stringify({ error: 'Missing or invalid "prompt"' }), {
        status: 400, headers: { 'Content-Type': 'application/json' }
      });
    }

    // TODO: replace with real logic/LLM call
    const text = '<strong>Yes, Reportable</strong><br>Meets the four-part test based on your inputs.';
    return new Response(JSON.stringify({ text }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500, headers: { 'Content-Type': 'application/json' }
    });
  }
}
