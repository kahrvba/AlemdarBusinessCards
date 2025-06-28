import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export async function POST(request: NextRequest) {
  try {
    // Check if Blob token is configured
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json({ error: 'Blob storage not configured' }, { status: 500 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.name}`;

    console.log('🔄 Uploading to Vercel Blob:', filename);

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: 'public',
      // You can specify a store name if you created one
      // store: 'business-cards-images',
    });

    console.log('✅ Uploaded to Blob:', blob.url);

    return NextResponse.json({ url: blob.url });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('❌ Upload error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
} 