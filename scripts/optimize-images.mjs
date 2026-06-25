// Optimiza imágenes a WebP: recorta a 1920px de ancho máx, apunta a < 500 KB.
// Uso: npm install -D sharp && node scripts/optimize-images.mjs
import { readdir, stat, unlink } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const IMAGES_DIR = path.resolve("public/images");
const MAX_WIDTH = 1920;
const BUDGET_KB = 500;

async function optimize() {
  const files = await readdir(IMAGES_DIR);
  const jpgs = files.filter((f) => /\.(jpe?g|png)$/i.test(f));

  for (const file of jpgs) {
    const input = path.join(IMAGES_DIR, file);
    const out = path.join(IMAGES_DIR, file.replace(/\.(jpe?g|png)$/i, ".webp"));

    let quality = 82;
    let buffer;
    // Baja la calidad hasta cumplir el presupuesto de peso.
    for (; quality >= 50; quality -= 6) {
      buffer = await sharp(input)
        .rotate() // respeta EXIF orientation
        .resize({ width: MAX_WIDTH, withoutEnlargement: true })
        .webp({ quality, effort: 5 })
        .toBuffer();
      if (buffer.length / 1024 <= BUDGET_KB) break;
    }

    await sharp(buffer).toFile(out);
    const kb = (buffer.length / 1024).toFixed(0);
    const meta = await sharp(buffer).metadata();
    console.log(`✓ ${file} → ${path.basename(out)}  ${meta.width}px  ${kb} KB  (q${quality})`);
    await unlink(input); // elimina el original pesado
  }
}

optimize().catch((e) => {
  console.error(e);
  process.exit(1);
});
