const prisma = require("./utills/db");

async function checkUser() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: "msnmallouk2019@gmail.com" }
    });
    
    if (user) {
      console.log("✅ User found:");
      console.log(`  - Email: ${user.email}`);
      console.log(`  - Role: ${user.role}`);
      console.log(`  - Has password: ${user.password ? 'Yes' : 'No'}`);
      if (user.password) {
        console.log(`  - Password hash: ${user.password.substring(0, 20)}...`);
      }
    } else {
      console.log("❌ User not found");
    }
    
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkUser();