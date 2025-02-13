const express = require('express')
const app = express()
const port = 3000
app.use(express.json())
app.use(express.static('public'))

function byteToVariationSelector(byte) {
  if (byte < 16)
    return String.fromCodePoint(0xFE00 + byte)
  return String.fromCodePoint(0xE0100 + (byte - 16))
}

function variationSelectorToByte(ch) {
  const code = ch.codePointAt(0)
  if (code >= 0xFE00 && code <= 0xFE0F)
    return code - 0xFE00
  if (code >= 0xE0100 && code <= 0xE01EF)
    return code - 0xE0100 + 16
  return null
}

function encodeData(base, message) {
  const buffer = Buffer.from(message, 'utf8')
  let result = base
  for (const byte of buffer)
    result += byteToVariationSelector(byte)
  return result
}

function decodeData(encoded) {
  let bytes = []
  let found = false
  for (const ch of encoded) {
    const byte = variationSelectorToByte(ch)
    if (byte !== null) {
      bytes.push(byte)
      found = true
    } else if (found) {
      break
    }
  }
  return Buffer.from(bytes).toString('utf8')
}

app.post('/encode', (req, res) => {
  const { base, message } = req.body
  if (!base || !message)
    return res.status(400).json({ error: 'Missing base or message' })
  try {
    const encoded = encodeData(base, message)
    res.json({ encoded })
  } catch (e) {
    res.status(500).json({ error: 'Encoding error' })
  }
})

app.post('/decode', (req, res) => {
  const { encoded } = req.body
  if (!encoded)
    return res.status(400).json({ error: 'Missing encoded data' })
  try {
    const decoded = decodeData(encoded)
    res.json({ decoded })
  } catch (e) {
    res.status(500).json({ error: 'Decoding error' })
  }
})

app.listen(port, () => console.log(`Server running on port ${port}`)) 