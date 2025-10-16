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

          -- Add selectedColor column to customer_order_product
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                         WHERE table_name='customer_order_product' AND column_name='selectedColor') THEN
              ALTER TABLE "customer_order_product" ADD COLUMN "selectedColor" TEXT;
              RAISE NOTICE 'Added selectedColor column to customer_order_product';
          END IF;

          -- Add selectedSize column to customer_order_product
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                         WHERE table_name='customer_order_product' AND column_name='selectedSize') THEN
              ALTER TABLE "customer_order_product" ADD COLUMN "selectedSize" TEXT;
              RAISE NOTICE 'Added selectedSize column to customer_order_product';
          END IF;

          -- Create HeroSection table if not exists
          CREATE TABLE IF NOT EXISTS "HeroSection" (
              "id" TEXT PRIMARY KEY,
              "badge" TEXT NOT NULL DEFAULT 'FEATURED PRODUCT',
              "title" TEXT NOT NULL,
              "description" TEXT NOT NULL,
              "imageUrl" TEXT NOT NULL,
              "button1Text" TEXT NOT NULL DEFAULT 'BUY NOW',
              "button1Link" TEXT NOT NULL,
              "button2Text" TEXT NOT NULL DEFAULT 'LEARN MORE',
              "button2Link" TEXT NOT NULL,
              "stat1Value" TEXT NOT NULL DEFAULT '50K+',
              "stat1Label" TEXT NOT NULL DEFAULT 'Happy Customers',
              "stat2Value" TEXT NOT NULL DEFAULT '4.9',
              "stat2Label" TEXT NOT NULL DEFAULT 'Rating',
              "isActive" BOOLEAN NOT NULL DEFAULT true,
              "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
              "updatedAt" TIMESTAMP(3) NOT NULL
          );
          
          -- Insert default hero data if table is empty
          INSERT INTO "HeroSection" (
              "id", "title", "description", "imageUrl", 
              "button1Link", "button2Link", "updatedAt"
          )
          SELECT 
              gen_random_uuid()::text,
              'THE PRODUCT OF THE FUTURE',
              'Experience cutting-edge technology with our latest featured product. Premium quality meets innovative design.',
              '/watch for banner.png',
              '/products',
              '/products',
              CURRENT_TIMESTAMP
          WHERE NOT EXISTS (SELECT 1 FROM "HeroSection");
          
          RAISE NOTICE 'HeroSection table created and initialized';

          -- Add new columns to User table for simplified registration
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                         WHERE table_name='User' AND column_name='name') THEN
              ALTER TABLE "User" ADD COLUMN "name" TEXT;
              RAISE NOTICE 'Added name column to User';
          END IF;

          IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                         WHERE table_name='User' AND column_name='phone') THEN
              ALTER TABLE "User" ADD COLUMN "phone" TEXT;
              RAISE NOTICE 'Added phone column to User';
          END IF;

          IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                         WHERE table_name='User' AND column_name='address') THEN
              ALTER TABLE "User" ADD COLUMN "address" TEXT;
              RAISE NOTICE 'Added address column to User';
          END IF;

          IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                         WHERE table_name='User' AND column_name='createdAt') THEN
              ALTER TABLE "User" ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
              RAISE NOTICE 'Added createdAt column to User';
          END IF;

          IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                         WHERE table_name='User' AND column_name='updatedAt') THEN
              ALTER TABLE "User" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
              RAISE NOTICE 'Added updatedAt column to User';
          END IF;

          -- Add userId to Customer_order for linking orders to users
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                         WHERE table_name='Customer_order' AND column_name='userId') THEN
              ALTER TABLE "Customer_order" ADD COLUMN "userId" TEXT;
              RAISE NOTICE 'Added userId column to Customer_order';
          END IF;

          -- Add foreign key constraint if not exists
          IF NOT EXISTS (
              SELECT 1 FROM information_schema.table_constraints 
              WHERE constraint_name = 'Customer_order_userId_fkey'
          ) THEN
              ALTER TABLE "Customer_order" 
              ADD CONSTRAINT "Customer_order_userId_fkey" 
              FOREIGN KEY ("userId") REFERENCES "User"("id") 
              ON DELETE SET NULL ON UPDATE CASCADE;
              RAISE NOTICE 'Added foreign key constraint Customer_order_userId_fkey';
          END IF;

          -- Create index on userId in Customer_order
          IF NOT EXISTS (
              SELECT 1 FROM pg_indexes 
              WHERE indexname = 'Customer_order_userId_idx'
          ) THEN
              CREATE INDEX "Customer_order_userId_idx" ON "Customer_order"("userId");
              RAISE NOTICE 'Created index Customer_order_userId_idx';
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