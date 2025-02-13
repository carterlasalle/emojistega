export async function onRequestPost(context) {
  try {
    const { encoded } = await context.request.json();
    
    if (!encoded) {
      return new Response(
        JSON.stringify({ error: 'Missing encoded data' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const decoded = decodeData(encoded);
    return new Response(
      JSON.stringify({ decoded }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ error: 'Decoding error' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

function variationSelectorToByte(ch) {
  const code = ch.codePointAt(0);
  if (code >= 0xFE00 && code <= 0xFE0F)
    return code - 0xFE00;
  if (code >= 0xE0100 && code <= 0xE01EF)
    return code - 0xE0100 + 16;
  return null;
}

function decodeData(encoded) {
  let bytes = [];
  let found = false;
  for (const ch of encoded) {
    const byte = variationSelectorToByte(ch);
    if (byte !== null) {
      bytes.push(byte);
      found = true;
    } else if (found) {
      break;
    }
  }
  const decoder = new TextDecoder();
  return decoder.decode(new Uint8Array(bytes));
} 