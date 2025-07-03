import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://Cardsdb_owner:npg_yfuDmT0NVGs6@ep-long-mode-a8j4bzaz-pooler.eastus2.azure.neon.tech/Cardsdb?sslmode=require&channel_binding=require';
const sql = neon(DATABASE_URL);

export async function GET() {
  const startTime = Date.now();
  try {
    console.log('🔄 Fetching business cards from database...');
    const cards = await sql`SELECT * FROM business_cards ORDER BY created_at DESC`;
    const endTime = Date.now();
    console.log(`✅ Fetched ${cards.length} cards in ${endTime - startTime}ms`);
    
    return NextResponse.json(cards, {
      headers: {
        'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=59',
      },
    });
  } catch (error: unknown) {
    const endTime = Date.now();
    const message = error instanceof Error ? error.message : String(error);
    console.error(`❌ Error fetching cards after ${endTime - startTime}ms:`, message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  try {
    const data = await req.json();
    const { first_name, last_name, phone_number, note, front_image_url, back_image_url,email } = data;
    if (!first_name || !last_name || !phone_number) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    console.log('🔄 Saving business card to database...');
    const result = await sql`
      INSERT INTO business_cards (id, first_name, last_name, phone_number,email,  note, front_image_url, back_image_url, created_at, updated_at)
      VALUES (gen_random_uuid()::text, ${first_name}, ${last_name}, ${phone_number}, ${email}, ${note}, ${front_image_url}, ${back_image_url}, NOW(), NOW())
      RETURNING *
    `;
    const endTime = Date.now();
    console.log(`✅ Saved card in ${endTime - startTime}ms`);
    
    return NextResponse.json(result[0]);
  } catch (error: unknown) {
    const endTime = Date.now();
    const message = error instanceof Error ? error.message : String(error);
    console.error(`❌ Error saving card after ${endTime - startTime}ms:`, message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
} 