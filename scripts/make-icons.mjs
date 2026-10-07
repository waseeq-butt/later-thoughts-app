import sharp from 'sharp'
import { readFileSync } from 'node:fs'

const svg = readFileSync('public/icon.svg')
const maskable = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" fill="#0A0A0A"/><g transform="translate(256 256) scale(0.8) translate(-256 -256)"><circle cx="256" cy="256" r="84" fill="none" stroke="#D0D0D0" stroke-width="28"/><path d="M256 202v54l34 22" fill="none" stroke="#D0D0D0" stroke-width="28" stroke-linecap="round" stroke-linejoin="round"/></g></svg>`,
)
await sharp(svg).resize(192).png().toFile('public/pwa-192.png')
await sharp(svg).resize(512).png().toFile('public/pwa-512.png')
await sharp(svg).resize(180).png().toFile('public/apple-touch-icon.png')
await sharp(maskable).resize(512).png().toFile('public/pwa-maskable-512.png')
console.log('icons done')
