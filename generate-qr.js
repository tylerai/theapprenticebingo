// Save this as generate-qr.js
const qrcode = require('qrcode-terminal');

// The URL will be your Vercel deployment URL once deployed
// For now, using a placeholder
const url = 'https://theapprenticebingo.vercel.app';

console.log(`\nScan this QR code to access the Apprentice Bingo app on your mobile device:\n`);
qrcode.generate(url, { small: false });
console.log(`\nOr visit: ${url}\n`);
console.log(`Make sure your mobile device is connected to the internet.\n`); 