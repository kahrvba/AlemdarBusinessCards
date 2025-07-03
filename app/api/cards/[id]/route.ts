import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://Cardsdb_owner:npg_yfuDmT0NVGs6@ep-long-mode-a8j4bzaz-pooler.eastus2.azure.neon.tech/Cardsdb?sslmode=require&channel_binding=require';
const sql = neon(DATABASE_URL);

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const startTime = Date.now();
  try {
    const { id: cardId } = await params;
    
    if (!cardId) {
      return NextResponse.json({ error: 'Card ID is required' }, { status: 400 });
    }

    const data = await req.json();
    const { first_name, last_name, phone_number, note, front_image_url, back_image_url, email } = data;
    
    if (!first_name || !last_name || !phone_number ) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    console.log('🔄 Updating business card in database...');
    const result = await sql`
      UPDATE business_cards 
      SET first_name = ${first_name}, 
          last_name = ${last_name}, 
          phone_number = ${phone_number}, 
          note = ${note}, 
          email = ${email},
          front_image_url = ${front_image_url}, 
          back_image_url = ${back_image_url}, 
          updated_at = NOW()
      WHERE id = ${cardId}
      RETURNING *
    `;
    
    if (result.length === 0) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 });
    }
    
    const endTime = Date.now();
    console.log(`✅ Updated card in ${endTime - startTime}ms`);
    
    return NextResponse.json(result[0]);
  } catch (error: unknown) {
    const endTime = Date.now();
    const message = error instanceof Error ? error.message : String(error);
    console.error(`❌ Error updating card after ${endTime - startTime}ms:`, message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
} 