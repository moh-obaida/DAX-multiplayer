import sharp from "sharp";
import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const publicDir = join(root, "public");
const logosDir = join(publicDir, "logos");

const EMERALD = "#0f2818";
const EMERALD_DARK = "#0a1f12";

async function compressLogo(name) {
  const src = join(logosDir, name);
  const buf = await sharp(src).png({ quality: 80, compressionLevel: 9 }).toBuffer();
  await sharp(buf).toFile(src);
  console.log(`Compressed ${name}`);
}

async function generateFavicon() {
  const icon = join(logosDir, "dax-icon.png");
  const sizes = [16, 32];
  const pngs = await Promise.all(
    sizes.map((s) => sharp(icon).resize(s, s).png().toBuffer())
  );
  // Write 32x32 as favicon fallback (browsers accept PNG)
  await sharp(pngs[1]).toFile(join(publicDir, "favicon.ico"));
  console.log("Generated favicon.ico");
}

async function generateAppleTouchIcon() {
  await sharp(join(logosDir, "dax-icon.png"))
    .resize(180, 180, { fit: "contain", background: EMERALD })
    .png()
    .toFile(join(publicDir, "apple-touch-icon.png"));
  console.log("Generated apple-touch-icon.png");
}

async function generateSocialImage(width, height, filename) {
  const logo = await sharp(join(logosDir, "dax-full.png"))
    .resize(Math.round(width * 0.55), null, { fit: "inside" })
    .toBuffer();

  const gradient = Buffer.from(`
    <svg width="${width}" height="${height}">
      <defs>
        <radialGradient id="g" cx="50%" cy="0%" r="120%">
          <stop offset="0%" stop-color="#143324"/>
          <stop offset="55%" stop-color="${EMERALD}"/>
          <stop offset="100%" stop-color="${EMERALD_DARK}"/>
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#g)"/>
    </svg>
  `);

  const bg = await sharp(gradient).png().toBuffer();
  const logoMeta = await sharp(logo).metadata();

  await sharp(bg)
    .composite([
      {
        input: logo,
        top: Math.round((height - (logoMeta.height ?? 0)) / 2),
        left: Math.round((width - (logoMeta.width ?? 0)) / 2),
      },
    ])
    .png({ quality: 85 })
    .toFile(join(publicDir, filename));

  console.log(`Generated ${filename}`);
}

async function main() {
  for (const name of ["dax-full.png", "dax-icon.png", "dax-wordmark.png"]) {
    await compressLogo(name);
  }
  await generateFavicon();
  await generateAppleTouchIcon();
  await generateSocialImage(1200, 630, "og-image.png");
  await generateSocialImage(1200, 675, "twitter-image.png");
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
