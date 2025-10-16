// server/migrate-user-fields.js
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function runMigration() {
  console.log('🚀 Starting User table migration...');

  try {
    // Migration SQL - Add missing columns to User table
    const migrationSQL = `
      DO $$ 
      BEGIN
        -- Add 'name' column if it doesn't exist
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name='User' AND column_name='name'
        ) THEN
          ALTER TABLE "User" ADD COLUMN "name" TEXT;
          RAISE NOTICE 'Added column: name';
        ELSE
          RAISE NOTICE 'Column name already exists';
        END IF;

        -- Add 'phone' column if it doesn't exist
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name='User' AND column_name='phone'
        ) THEN
          ALTER TABLE "User" ADD COLUMN "phone" TEXT;
          RAISE NOTICE 'Added column: phone';
        ELSE
          RAISE NOTICE 'Column phone already exists';
        END IF;

        -- Add 'address' column if it doesn't exist
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name='User' AND column_name='address'
        ) THEN
          ALTER TABLE "User" ADD COLUMN "address" TEXT;
          RAISE NOTICE 'Added column: address';
        ELSE
          RAISE NOTICE 'Column address already exists';
        END IF;

        -- Add 'createdAt' column if it doesn't exist
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name='User' AND column_name='createdAt'
        ) THEN
          ALTER TABLE "User" ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
          RAISE NOTICE 'Added column: createdAt';
        ELSE
          RAISE NOTICE 'Column createdAt already exists';
        END IF;

        -- Add 'updatedAt' column if it doesn't exist
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name='User' AND column_name='updatedAt'
        ) THEN
          ALTER TABLE "User" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
          RAISE NOTICE 'Added column: updatedAt';
        ELSE
          RAISE NOTICE 'Column updatedAt already exists';
        END IF;

      END $$;
    `;

    // Execute migration
    await prisma.$executeRawUnsafe(migrationSQL);
    
    console.log('✅ Migration completed successfully!');
    console.log('📊 User table now has: name, phone, address, createdAt, updatedAt');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run migration
runMigration()
  .then(() => {
    console.log('🎉 All done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Migration script failed:', error);
    process.exit(1);
  });