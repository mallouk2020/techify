const prisma = require("./utills/db");

async function checkData() {
  try {
    console.log("🔍 Checking database connection...");
    
    // Check products
    const products = await prisma.product.findMany({
      include: {
        category: true
      }
    });
    console.log(`\n✅ Found ${products.length} products:`);
    products.forEach(p => {
      console.log(`  - ${p.title} (${p.category?.name || 'No category'})`);
    });
    
    // Check categories
    const categories = await prisma.category.findMany();
    console.log(`\n✅ Found ${categories.length} categories:`);
    categories.forEach(c => {
      console.log(`  - ${c.name}`);
    });
    
    // Check users
    const users = await prisma.user.findMany();
    console.log(`\n✅ Found ${users.length} users:`);
    users.forEach(u => {
      console.log(`  - ${u.email} (${u.role})`);
    });
    
  } catch (error) {
    console.error("❌ Error:", error.message);
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

checkData();