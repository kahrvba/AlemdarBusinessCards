import { neon } from "@neondatabase/serverless";

const DATABASE_URL = 'postgresql://Cardsdb_owner:npg_yfuDmT0NVGs6@ep-long-mode-a8j4bzaz-pooler.eastus2.azure.neon.tech/Cardsdb?sslmode=require&channel_binding=require';

const sql = neon(DATABASE_URL);

async function readDatabase() {
  try {
    console.log('🔍 Connecting to your Neon database...\n');
    
    // Check what tables exist
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;
    
    console.log('📋 Tables in your database:');
    if (tables.length === 0) {
      console.log('No tables found.');
    } else {
      tables.forEach(table => {
        console.log(`- ${table.table_name}`);
      });
    }
    console.log('');
    
    // Check if business_cards table exists
    const businessCardsExists = tables.some(table => table.table_name === 'business_cards');
    
    if (!businessCardsExists) {
      console.log('📝 Creating business_cards table...');
      await sql`
        CREATE TABLE IF NOT EXISTS business_cards (
          id SERIAL PRIMARY KEY,
          first_name VARCHAR(255) NOT NULL,
          last_name VARCHAR(255) NOT NULL,
          phone_number VARCHAR(50) NOT NULL,
          note TEXT,
          front_image_url TEXT,
          back_image_url TEXT,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        )
      `;
      console.log('✅ business_cards table created successfully!\n');
    }
    
    // Get all business cards
    const cards = await sql`
      SELECT * FROM business_cards 
      ORDER BY created_at DESC
    `;
    
    console.log(`📊 Found ${cards.length} business cards in your database:\n`);
    
    if (cards.length === 0) {
      console.log('No business cards found. Your database is ready to store cards!');
    } else {
      cards.forEach((card, index) => {
        console.log(`--- Card ${index + 1} ---`);
        console.log(`ID: ${card.id}`);
        console.log(`Name: ${card.first_name} ${card.last_name}`);
        console.log(`Phone: ${card.phone_number}`);
        console.log(`Note: ${card.note || 'N/A'}`);
        console.log(`Front Image: ${card.front_image_url ? 'Yes' : 'No'}`);
        console.log(`Back Image: ${card.back_image_url ? 'Yes' : 'No'}`);
        console.log(`Created: ${new Date(card.created_at).toLocaleString()}`);
        console.log(`Updated: ${new Date(card.updated_at).toLocaleString()}`);
        console.log('');
      });
    }
    
    // Get table structure
    const tableInfo = await sql`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'business_cards' 
      ORDER BY ordinal_position
    `;
    
    console.log('📋 business_cards Table Structure:');
    tableInfo.forEach(col => {
      console.log(`- ${col.column_name}: ${col.data_type} ${col.is_nullable === 'YES' ? '(nullable)' : '(not null)'}`);
    });
    
  } catch (error) {
    console.error('❌ Error reading database:', error.message);
  }
}

readDatabase(); 