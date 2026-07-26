import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const svgIcon = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#020617" />
    </linearGradient>
    <linearGradient id="walletGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#059669" />
      <stop offset="50%" stop-color="#10b981" />
      <stop offset="100%" stop-color="#14b8a6" />
    </linearGradient>
    <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="100%" stop-color="#0284c7" />
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#000000" flood-opacity="0.5"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="512" height="512" rx="112" fill="url(#bgGrad)"/>
  <rect x="16" y="16" width="480" height="480" rx="96" fill="none" stroke="#1e293b" stroke-width="4"/>

  <!-- Main Wallet Graphic -->
  <g filter="url(#shadow)">
    <!-- Credit Card Peeking Out -->
    <rect x="176" y="110" width="160" height="100" rx="16" fill="url(#cardGrad)" transform="rotate(-8 256 160)"/>
    <rect x="200" y="140" width="60" height="12" rx="4" fill="#ffffff" opacity="0.8" transform="rotate(-8 256 160)"/>
    
    <!-- Wallet Body -->
    <rect x="106" y="170" width="300" height="230" rx="36" fill="url(#walletGrad)"/>
    
    <!-- Wallet Flap & Clasp -->
    <path d="M 106 230 C 106 200, 406 200, 406 230 L 406 250 C 406 280, 106 280, 106 250 Z" fill="#047857" opacity="0.4"/>
    
    <!-- Flap Lock -->
    <rect x="306" y="245" width="80" height="80" rx="20" fill="#0f172a"/>
    <circle cx="346" cy="285" r="16" fill="#10b981"/>
    
    <!-- Trending Up Arrow Graphic on Wallet -->
    <path d="M 156 340 L 206 290 L 246 320 L 316 250" fill="none" stroke="#ffffff" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M 276 250 L 316 250 L 316 290" fill="none" stroke="#ffffff" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
</svg>
`;

const svgMaskable = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#020617" />
    </linearGradient>
    <linearGradient id="walletGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#059669" />
      <stop offset="50%" stop-color="#10b981" />
      <stop offset="100%" stop-color="#14b8a6" />
    </linearGradient>
    <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="100%" stop-color="#0284c7" />
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#000000" flood-opacity="0.5"/>
    </filter>
  </defs>

  <!-- Full Bleed Maskable Background -->
  <rect width="512" height="512" fill="url(#bgGrad)"/>

  <!-- Centered content within safe zone (80% / 409px circle safe area) -->
  <g transform="translate(25.6, 25.6) scale(0.9)" filter="url(#shadow)">
    <!-- Credit Card Peeking Out -->
    <rect x="176" y="110" width="160" height="100" rx="16" fill="url(#cardGrad)" transform="rotate(-8 256 160)"/>
    <rect x="200" y="140" width="60" height="12" rx="4" fill="#ffffff" opacity="0.8" transform="rotate(-8 256 160)"/>
    
    <!-- Wallet Body -->
    <rect x="106" y="170" width="300" height="230" rx="36" fill="url(#walletGrad)"/>
    
    <!-- Wallet Flap & Clasp -->
    <path d="M 106 230 C 106 200, 406 200, 406 230 L 406 250 C 406 280, 106 280, 106 250 Z" fill="#047857" opacity="0.4"/>
    
    <!-- Flap Lock -->
    <rect x="306" y="245" width="80" height="80" rx="20" fill="#0f172a"/>
    <circle cx="346" cy="285" r="16" fill="#10b981"/>
    
    <!-- Trending Up Arrow Graphic on Wallet -->
    <path d="M 156 340 L 206 290 L 246 320 L 316 250" fill="none" stroke="#ffffff" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M 276 250 L 316 250 L 316 290" fill="none" stroke="#ffffff" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
</svg>
`;

async function generate() {
  const publicDir = path.resolve('public');

  fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgIcon.trim());

  await sharp(Buffer.from(svgIcon))
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'icon-192.png'));

  await sharp(Buffer.from(svgIcon))
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'icon-512.png'));

  await sharp(Buffer.from(svgMaskable))
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'icon-512-maskable.png'));

  await sharp(Buffer.from(svgIcon))
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));

  console.log('Successfully generated PWA PNG icons!');
}

generate().catch(console.error);
