const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create categories first
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { name: 'Laptops' },
      update: {},
      create: { name: 'Laptops' },
    }),
    prisma.category.upsert({
      where: { name: 'Smartphones' },
      update: {},
      create: { name: 'Smartphones' },
    }),
    prisma.category.upsert({
      where: { name: 'Headphones' },
      update: {},
      create: { name: 'Headphones' },
    }),
    prisma.category.upsert({
      where: { name: 'Tablets' },
      update: {},
      create: { name: 'Tablets' },
    }),
  ]);

  console.log('✅ Categories created:', categories.length);

  // Create products
  const products = [
    {
      slug: 'macbook-pro-16',
      title: 'MacBook Pro 16"',
      mainImage: '/uploads/product1.webp',
      price: 2499,
      rating: 5,
      description: 'Powerful laptop with M2 Pro chip',
      manufacturer: 'Apple',
      categoryId: categories[0].id,
      inStock: 15,
    },
    {
      slug: 'dell-xps-15',
      title: 'Dell XPS 15',
      mainImage: '/uploads/product2.webp',
      price: 1899,
      rating: 4,
      description: 'Premium Windows laptop',
      manufacturer: 'Dell',
      categoryId: categories[0].id,
      inStock: 20,
    },
    {
      slug: 'iphone-15-pro',
      title: 'iPhone 15 Pro',
      mainImage: '/uploads/product3.webp',
      price: 1199,
      rating: 5,
      description: 'Latest iPhone with A17 Pro chip',
      manufacturer: 'Apple',
      categoryId: categories[1].id,
      inStock: 50,
    },
    {
      slug: 'samsung-galaxy-s24',
      title: 'Samsung Galaxy S24',
      mainImage: '/uploads/product4.webp',
      price: 999,
      rating: 4,
      description: 'Flagship Android smartphone',
      manufacturer: 'Samsung',
      categoryId: categories[1].id,
      inStock: 30,
    },
    {
      slug: 'airpods-pro',
      title: 'AirPods Pro (2nd Gen)',
      mainImage: '/uploads/product5.webp',
      price: 249,
      rating: 5,
      description: 'Premium wireless earbuds',
      manufacturer: 'Apple',
      categoryId: categories[2].id,
      inStock: 100,
    },
    {
      slug: 'sony-wh1000xm5',
      title: 'Sony WH-1000XM5',
      mainImage: '/uploads/product6.webp',
      price: 399,
      rating: 5,
      description: 'Industry-leading noise cancellation',
      manufacturer: 'Sony',
      categoryId: categories[2].id,
      inStock: 40,
    },
    {
      slug: 'ipad-pro-12',
      title: 'iPad Pro 12.9"',
      mainImage: '/uploads/product7.webp',
      price: 1099,
      rating: 5,
      description: 'Powerful tablet with M2 chip',
      manufacturer: 'Apple',
      categoryId: categories[3].id,
      inStock: 25,
    },
    {
      slug: 'samsung-tab-s9',
      title: 'Samsung Galaxy Tab S9',
      mainImage: '/uploads/product8.webp',
      price: 799,
      rating: 4,
      description: 'Premium Android tablet',
      manufacturer: 'Samsung',
      categoryId: categories[3].id,
      inStock: 35,
    },
    {
      slug: 'lenovo-thinkpad-x1',
      title: 'Lenovo ThinkPad X1 Carbon',
      mainImage: '/uploads/product9.webp',
      price: 1699,
      rating: 4,
      description: 'Business laptop with excellent keyboard',
      manufacturer: 'Lenovo',
      categoryId: categories[0].id,
      inStock: 18,
    },
    {
      slug: 'google-pixel-8-pro',
      title: 'Google Pixel 8 Pro',
      mainImage: '/uploads/product10.webp',
      price: 899,
      rating: 4,
      description: 'Best camera phone with AI features',
      manufacturer: 'Google',
      categoryId: categories[1].id,
      inStock: 45,
    },
    {
      slug: 'bose-qc45',
      title: 'Bose QuietComfort 45',
      mainImage: '/uploads/product11.webp',
      price: 329,
      rating: 4,
      description: 'Comfortable noise-cancelling headphones',
      manufacturer: 'Bose',
      categoryId: categories[2].id,
      inStock: 60,
    },
    {
      slug: 'microsoft-surface-pro-9',
      title: 'Microsoft Surface Pro 9',
      mainImage: '/uploads/product12.webp',
      price: 999,
      rating: 4,
      description: '2-in-1 laptop and tablet',
      manufacturer: 'Microsoft',
      categoryId: categories[3].id,
      inStock: 22,
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    });
  }

  console.log('✅ Products created:', products.length);
  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });