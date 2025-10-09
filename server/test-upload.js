// Test image upload to Cloudinary
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

async function testUpload() {
  try {
    console.log('\n🧪 Testing image upload to Cloudinary...\n');

    // Create a simple test image (1x1 pixel PNG)
    const testImagePath = path.join(__dirname, 'test-image.png');
    const testImageBuffer = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      'base64'
    );
    fs.writeFileSync(testImagePath, testImageBuffer);
    console.log('✅ Test image created:', testImagePath);

    // Create form data
    const formData = new FormData();
    formData.append('uploadedFile', fs.createReadStream(testImagePath));

    // Upload to local server
    console.log('📤 Uploading to http://localhost:3001/api/main-image...\n');
    
    const response = await axios.post('http://localhost:3001/api/main-image', formData, {
      headers: formData.getHeaders(),
      maxContentLength: Infinity,
      maxBodyLength: Infinity
    });

    console.log('✅ Upload successful!');
    console.log('📊 Response:', JSON.stringify(response.data, null, 2));
    console.log('\n🌐 Image URL:', response.data.filename);
    console.log('🆔 Public ID:', response.data.publicId);

    // Clean up test image
    fs.unlinkSync(testImagePath);
    console.log('\n🧹 Test image cleaned up');

    console.log('\n✅ Test completed successfully!');
    console.log('🎉 Cloudinary integration is working!\n');

  } catch (error) {
    console.error('\n❌ Test failed!');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
    console.log('\n💡 Make sure:');
    console.log('1. Server is running (node app.js)');
    console.log('2. Cloudinary credentials are set in .env');
    console.log('3. Port 3001 is not blocked\n');
  }
}

testUpload();