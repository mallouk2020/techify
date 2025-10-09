// ===================================
// Test Cloudinary Configuration
// ===================================
// This script tests if Cloudinary credentials are correctly configured
// Run: node test-cloudinary.js

require('dotenv').config();
const cloudinary = require('cloudinary').v2;

console.log('\n🔍 Testing Cloudinary Configuration...\n');

// Check if environment variables are set
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

console.log('📋 Environment Variables:');
console.log('CLOUDINARY_CLOUD_NAME:', cloudName ? '✅ Set' : '❌ Missing');
console.log('CLOUDINARY_API_KEY:', apiKey ? '✅ Set' : '❌ Missing');
console.log('CLOUDINARY_API_SECRET:', apiSecret ? '✅ Set (hidden)' : '❌ Missing');

if (!cloudName || !apiKey || !apiSecret) {
  console.log('\n❌ ERROR: Missing Cloudinary credentials!');
  console.log('\n📝 Please update your .env file with:');
  console.log('CLOUDINARY_CLOUD_NAME=your_cloud_name');
  console.log('CLOUDINARY_API_KEY=your_api_key');
  console.log('CLOUDINARY_API_SECRET=your_api_secret');
  console.log('\n🔗 Get credentials from: https://cloudinary.com/console\n');
  process.exit(1);
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

console.log('\n🔗 Testing connection to Cloudinary...\n');

// Test API connection
cloudinary.api.ping()
  .then((result) => {
    console.log('✅ SUCCESS! Cloudinary connection is working!');
    console.log('📊 Response:', result);
    console.log('\n🎉 You can now upload images to Cloudinary!');
    console.log('🌐 Cloud Name:', cloudName);
    console.log('📁 Images will be stored in: techify/products/');
    console.log('\n✅ Next steps:');
    console.log('1. Add these same credentials to Railway environment variables');
    console.log('2. Push changes to GitHub: git push origin main');
    console.log('3. Test image upload in admin dashboard\n');
  })
  .catch((error) => {
    console.log('❌ ERROR: Failed to connect to Cloudinary!');
    console.log('\n🔍 Error details:', error.message);
    console.log('\n💡 Possible issues:');
    console.log('- Invalid Cloud Name, API Key, or API Secret');
    console.log('- Check for typos or extra spaces in .env file');
    console.log('- Make sure you copied credentials correctly from Cloudinary dashboard');
    console.log('\n🔗 Get correct credentials from: https://cloudinary.com/console\n');
    process.exit(1);
  });