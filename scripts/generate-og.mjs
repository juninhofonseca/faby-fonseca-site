import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const source = path.join(root, 'content', 'home', 'images', 'hero-home.jpg');
const outputDir = path.join(root, 'public', 'og');
const output = path.join(outputDir, 'default.jpg');

await mkdir(outputDir, { recursive: true });

const overlay = Buffer.from(`
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="rgba(43, 38, 34, 0.42)" />
  <rect x="64" y="238" width="72" height="2" fill="#B5715A" />
  <text x="64" y="210" font-family="Georgia, 'Times New Roman', serif" font-size="92" font-weight="600" fill="#F7F3EE">Faby Fonseca</text>
  <text x="66" y="286" font-family="Arial, Helvetica, sans-serif" font-size="20" letter-spacing="9" fill="#EFE8DE">FOTOGRAFIA</text>
  <text x="66" y="350" font-family="Georgia, 'Times New Roman', serif" font-size="30" fill="#F7F3EE">Histórias reais, registradas com sensibilidade</text>
</svg>
`);

await sharp(source)
  .resize(1200, 630, { fit: 'cover', position: 'attention' })
  .modulate({ brightness: 0.92 })
  .composite([{ input: overlay, top: 0, left: 0 }])
  .jpeg({ quality: 86, mozjpeg: true })
  .toFile(output);

console.log(`Imagem de compartilhamento gerada em ${path.relative(root, output)}.`);
