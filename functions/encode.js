export async function onRequestPost(context) {
  try {
    const { base, message } = await context.request.json();
    
    if (!base || !message) {
      return new Response(
        JSON.stringify({ error: 'Missing base or message' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const encoded = encodeData(base, message);
    return new Response(
      JSON.stringify({ encoded }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ error: 'Encoding error' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

function byteToVariationSelector(byte) {
  if (byte < 16)
    return String.fromCodePoint(0xFE00 + byte);
  return String.fromCodePoint(0xE0100 + (byte - 16));
}

function encodeData(base, message) {
  const encoder = new TextEncoder();
  const buffer = encoder.encode(message);
  let result = base;
  for (const byte of buffer) {
    result += byteToVariationSelector(byte);
  }
  return result;
} 