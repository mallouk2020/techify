const prisma = require("./utills/db");

async function checkProduct() {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: "prodla" },
      include: { category: true }
    });
    
    if (product) {
      console.log("✅ Product found:");
      console.log(`  - Title: ${product.title}`);
      console.log(`  - Slug: ${product.slug}`);
      console.log(`  - Main Image: ${product.mainImage}`);
      console.log(`  - Price: ${product.price}`);
      console.log(`  - Category: ${product.category?.name}`);
      console.log(`  - Description: ${product.description}`);
    } else {
      console.log("❌ Product not found");
    }
    
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkProduct();