/**
 * One-time migration script to generate thumbnails for existing PDFs.
 *
 * Usage:
 *   npx tsx scripts/generate-pdf-thumbnails.ts
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
 * environment variables (reads from .env.local automatically).
 */

import { createClient } from '@supabase/supabase-js';
import { generatePdfThumbnail } from '../lib/pdf-thumbnail';
import fs from 'fs';
import path from 'path';

// Load .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIndex = trimmed.indexOf('=');
    if (eqIndex === -1) continue;
    const key = trimmed.substring(0, eqIndex).trim();
    const value = trimmed.substring(eqIndex + 1).trim();
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_APP_SUPABASE_URI;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_APP_SUPABASE_SECRET;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

function getStoragePath(publicUrl: string): string | null {
  const match = publicUrl.match(/\/object\/public\/images\/(.+)$/);
  return match ? match[1] : null;
}

function getThumbPath(storagePath: string): string {
  return storagePath.replace(/\.pdf$/i, '_thumb.png');
}

async function main() {
  console.log('Fetching portfolio items...');

  const { data: items, error } = await supabase
    .from('portfolio_items')
    .select('id, image_url');

  if (error) {
    console.error('Failed to fetch portfolio items:', error);
    process.exit(1);
  }

  // Collect all PDF URLs
  const pdfEntries: { itemId: string; url: string; storagePath: string }[] = [];

  for (const item of items || []) {
    if (!item.image_url) continue;

    let urls: string[];
    try {
      const parsed = JSON.parse(item.image_url);
      urls = Array.isArray(parsed) ? parsed : [item.image_url];
    } catch {
      urls = [item.image_url];
    }

    for (const url of urls) {
      if (typeof url !== 'string') continue;
      if (!url.toLowerCase().endsWith('.pdf')) continue;

      const storagePath = getStoragePath(url);
      if (storagePath) {
        pdfEntries.push({ itemId: item.id, url, storagePath });
      }
    }
  }

  console.log(`Found ${pdfEntries.length} PDF(s) to process.\n`);

  let success = 0;
  let skipped = 0;
  let failed = 0;

  for (const entry of pdfEntries) {
    const thumbPath = getThumbPath(entry.storagePath);
    console.log(`Processing: ${entry.storagePath}`);

    // Check if thumbnail already exists
    const { data: existing } = await supabase.storage
      .from('images')
      .download(thumbPath);

    if (existing && existing.size > 0) {
      console.log('  Thumbnail already exists, skipping.');
      skipped++;
      continue;
    }

    // Download the PDF
    const { data: pdfBlob, error: dlError } = await supabase.storage
      .from('images')
      .download(entry.storagePath);

    if (dlError || !pdfBlob) {
      console.error(`  Failed to download PDF: ${dlError?.message}`);
      failed++;
      continue;
    }

    const pdfBuffer = Buffer.from(await pdfBlob.arrayBuffer());
    const thumbBuffer = await generatePdfThumbnail(pdfBuffer);

    if (!thumbBuffer) {
      failed++;
      continue;
    }

    // Upload thumbnail
    const { error: upError } = await supabase.storage
      .from('images')
      .upload(thumbPath, thumbBuffer, {
        contentType: 'image/png',
        cacheControl: '3600',
        upsert: true,
      });

    if (upError) {
      console.error(`  Failed to upload thumbnail: ${upError.message}`);
      failed++;
      continue;
    }

    console.log(`  Thumbnail created: ${thumbPath}`);
    success++;
  }

  console.log(`\nDone! ${success} created, ${skipped} skipped, ${failed} failed.`);
}

main();
