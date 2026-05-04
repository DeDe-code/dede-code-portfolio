import { v2 as cloudinary } from "cloudinary";
import { readdirSync, statSync, unlinkSync } from "fs";
import { join, relative } from "path";
import { tmpdir } from "os";
import { config } from "dotenv";
import sharp from "sharp";

config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const IMAGE_DIR = new URL("../public/image", import.meta.url).pathname;
const MAX_BYTES = 9 * 1024 * 1024; // 9MB safety margin (Cloudinary limit is 10MB)
const DELAY_MS = 500; // delay between uploads to avoid rate limiting

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getAllFiles(dir) {
  const files = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      files.push(...getAllFiles(full));
    } else {
      files.push(full);
    }
  }
  return files;
}

async function compressToLimit(file) {
  const tmpFile = join(tmpdir(), `cld-upload-${Date.now()}.jpg`);
  // Try progressively lower quality until under the limit
  for (const quality of [75, 60, 45, 30]) {
    await sharp(file).jpeg({ quality, progressive: true }).toFile(tmpFile);
    const size = statSync(tmpFile).size;
    if (size <= MAX_BYTES) return tmpFile;
    console.log(
      `  → quality ${quality} still ${(size / 1024 / 1024).toFixed(1)}MB, trying lower...`,
    );
  }
  // Last resort: also resize to 2400px wide
  await sharp(file)
    .resize({ width: 2400, withoutEnlargement: true })
    .jpeg({ quality: 30, progressive: true })
    .toFile(tmpFile);
  return tmpFile;
}

async function getUploadPath(file) {
  const size = statSync(file).size;
  if (size <= MAX_BYTES) return { path: file, tmp: false };

  console.log(`  Compressing ${(size / 1024 / 1024).toFixed(1)}MB file...`);
  const tmpFile = await compressToLimit(file);
  return { path: tmpFile, tmp: true };
}

const files = getAllFiles(IMAGE_DIR);
console.log(`Found ${files.length} files to upload...\n`);

for (const file of files) {
  const rel = relative(IMAGE_DIR, file);
  const publicId = rel.replace(/\.[^.]+$/, "");

  const { path: uploadPath, tmp } = await getUploadPath(file);

  try {
    const result = await cloudinary.uploader.upload(uploadPath, {
      public_id: publicId,
      overwrite: true,
      use_filename: false,
      resource_type: "image",
    });
    console.log(`✓ ${rel} → ${result.secure_url}`);
  } catch (err) {
    console.error(`✗ ${rel}: ${err.message}`);
  } finally {
    if (tmp) unlinkSync(uploadPath);
  }

  await sleep(DELAY_MS);
}

console.log("\nDone!");
