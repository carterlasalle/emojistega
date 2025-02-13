# Emoji Data Encoder/Decoder

A web application that allows hiding arbitrary data within emoji characters using variation selectors. This project demonstrates a novel way of encoding messages within seemingly normal emoji characters.

## Features

- Encode text messages within emoji characters
- Decode hidden messages from encoded emoji strings
- Simple web interface for encoding and decoding
- RESTful API endpoints for programmatic access

## Technical Details

The application uses variation selectors (Unicode range U+FE00 to U+FE0F and U+E0100 to U+E01EF) to encode data within emoji characters. Each byte of the input message is converted to a variation selector and appended to a base emoji character.

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

## Usage

1. Start the server:
   ```bash
   npm start
   ```
2. Visit http://localhost:3000 in your browser
3. Use the web interface to:
   - Encode: Enter a base emoji (default: 😊) and your message
   - Decode: Paste an encoded emoji string to reveal the hidden message

## API Endpoints

### POST /encode
Request body:
```json
{
  "base": "😊",
  "message": "Your secret message"
}
```

### POST /decode
Request body:
```json
{
  "encoded": "😊︀︁︂..." // Encoded emoji string
}
```

## Security Considerations

This encoding method is for educational purposes and should not be considered secure encryption. The hidden data can be detected by analyzing the presence of variation selectors.

## License

MIT License 