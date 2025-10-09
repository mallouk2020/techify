const prisma = require("./utills/db");
const bcrypt = require("bcryptjs");

async function resetPassword() {
  try {
    const email = "msnmallouk2019@gmail.com";
    const newPassword = "admin123"; // Change this to your desired password
    
    console.log("🔄 Resetting password...");
    
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 14);
    
    // Update the user
    const user = await prisma.user.update({
      where: { email },
      data: { password: hashedPassword }
    });
    
    console.log("✅ Password reset successfully!");
    console.log(`  - Email: ${user.email}`);
    console.log(`  - New Password: ${newPassword}`);
    console.log(`  - Role: ${user.role}`);
    console.log("\n⚠️  IMPORTANT: Change this password after logging in!");
    
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

resetPassword();