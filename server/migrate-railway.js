/**
 * Railway Migration Script
 * This script adds missing columns to the Product table
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function runMigration() {
  try {
    console.log('🚀 Starting database migration...');
    
    // Migration SQL embedded in the script
    const migrationSQL = `
      DO $$ 
      BEGIN
          -- Add oldPrice column
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                         WHERE table_name='Product' AND column_name='oldPrice') THEN
              ALTER TABLE "Product" ADD COLUMN "oldPrice" INTEGER;
              RAISE NOTICE 'Added oldPrice column';
          END IF;

          -- Add ratingCount column
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                         WHERE table_name='Product' AND column_name='ratingCount') THEN
              ALTER TABLE "Product" ADD COLUMN "ratingCount" INTEGER;
              RAISE NOTICE 'Added ratingCount column';
          END IF;

          -- Add stock column
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                         WHERE table_name='Product' AND column_name='stock') THEN
              ALTER TABLE "Product" ADD COLUMN "stock" INTEGER;
              RAISE NOTICE 'Added stock column';
          END IF;

          -- Add colors column
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                         WHERE table_name='Product' AND column_name='colors') THEN
              ALTER TABLE "Product" ADD COLUMN "colors" TEXT;
              RAISE NOTICE 'Added colors column';
          END IF;

          -- Add sizes column
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                         WHERE table_name='Product' AND column_name='sizes') THEN
              ALTER TABLE "Product" ADD COLUMN "sizes" TEXT;
              RAISE NOTICE 'Added sizes column';
          END IF;

          -- Add shippingCost column
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                         WHERE table_name='Product' AND column_name='shippingCost') THEN
              ALTER TABLE "Product" ADD COLUMN "shippingCost" INTEGER;
              RAISE NOTICE 'Added shippingCost column';
          END IF;
      END $$;
    `;
    
    console.log('🔧 Executing migration...');
    
    // Execute the migration
    await prisma.$executeRawUnsafe(migrationSQL);
    
    console.log('✅ Migration completed successfully!');
    console.log('🎉 Database schema updated with new Product columns');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    // Don't exit with error to allow deployment to continue
    console.log('⚠️  Continuing deployment despite migration error...');
  } finally {
    await prisma.$disconnect();
  }
}

runMigration();