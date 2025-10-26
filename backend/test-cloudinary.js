/**
 * Cloudinary Configuration Test Script
 * Run this to verify your Cloudinary credentials are set up correctly
 * 
 * Usage: node test-cloudinary.js
 */

require('dotenv').config();
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

console.log('🧪 Testing Cloudinary Configuration...\n');

// Check if credentials are set
if (!process.env.CLOUDINARY_CLOUD_NAME || 
    !process.env.CLOUDINARY_API_KEY || 
    !process.env.CLOUDINARY_API_SECRET) {
  console.error('❌ ERROR: Cloudinary credentials not found in .env file');
  console.log('\nPlease add the following to your .env file:');
  console.log('CLOUDINARY_CLOUD_NAME=your_cloud_name');
  console.log('CLOUDINARY_API_KEY=your_api_key');
  console.log('CLOUDINARY_API_SECRET=your_api_secret');
  process.exit(1);
}

console.log('✅ Environment variables found:');
console.log(`   Cloud Name: ${process.env.CLOUDINARY_CLOUD_NAME}`);
console.log(`   API Key: ${process.env.CLOUDINARY_API_KEY.substring(0, 5)}...`);
console.log(`   API Secret: ${process.env.CLOUDINARY_API_SECRET.substring(0, 5)}...\n`);

// Test API connection
cloudinary.api.ping()
  .then(result => {
    console.log('✅ Cloudinary API Connection: SUCCESS');
    console.log(`   Status: ${result.status}\n`);
    
    // Get account usage info
    return cloudinary.api.usage();
  })
  .then(usage => {
    console.log('📊 Account Usage:');
    console.log(`   Plan: ${usage.plan || 'Free'}`);
    console.log(`   Credits Used: ${usage.credits?.used || 0} / ${usage.credits?.limit || 'Unlimited'}`);
    console.log(`   Storage: ${(usage.storage?.used / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   Bandwidth: ${(usage.bandwidth?.used / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   Transformations: ${usage.transformations?.used || 0}\n`);
    
    console.log('🎉 Cloudinary is configured correctly!');
    console.log('✅ You can now upload images to your listings.\n');
  })
  .catch(error => {
    console.error('❌ Cloudinary Connection Failed:');
    console.error(`   Error: ${error.message}\n`);
    
    if (error.http_code === 401) {
      console.log('💡 Troubleshooting:');
      console.log('   - Check if your API credentials are correct');
      console.log('   - Verify you copied them from https://cloudinary.com/console');
      console.log('   - Make sure there are no extra spaces in the .env file');
    } else if (error.http_code === 404) {
      console.log('💡 Troubleshooting:');
      console.log('   - Check if your Cloud Name is correct');
      console.log('   - Verify your Cloudinary account is active');
    } else {
      console.log('💡 Troubleshooting:');
      console.log('   - Check your internet connection');
      console.log('   - Verify Cloudinary service is online');
      console.log('   - Review error message above for details');
    }
    
    process.exit(1);
  });
