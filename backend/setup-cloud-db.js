#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🚀 Maddy App Cloud Database Setup\n');

console.log('Choose your cloud database provider:');
console.log('1. Supabase (Recommended - 500MB free)');
console.log('2. Railway ($5 credit monthly)');
console.log('3. Render (750 hours/month free)');
console.log('4. Skip - I\'ll set up manually\n');

rl.question('Enter your choice (1-4): ', (choice) => {
  switch(choice) {
    case '1':
      setupSupabase();
      break;
    case '2':
      setupRailway();
      break;
    case '3':
      setupRender();
      break;
    case '4':
      console.log('\n📝 Manual setup instructions:');
      console.log('1. Copy env.example to .env');
      console.log('2. Add your DATABASE_URL to .env');
      console.log('3. Run: npm run migration:run');
      console.log('4. Run: npm run seed');
      rl.close();
      break;
    default:
      console.log('Invalid choice. Please run the script again.');
      rl.close();
  }
});

function setupSupabase() {
  console.log('\n📋 Supabase Setup Instructions:');
  console.log('1. Go to https://supabase.com and sign up');
  console.log('2. Create a new project');
  console.log('3. Go to Settings → Database');
  console.log('4. Copy the connection string (looks like: postgresql://postgres:[password]@[host]:5432/postgres)');
  console.log('5. Make sure to enable the "uuid-ossp" extension in your Supabase database\n');
  
  rl.question('Paste your Supabase connection string: ', (connectionString) => {
    if (connectionString.trim()) {
      createEnvFile(connectionString);
    } else {
      console.log('No connection string provided. Please run the script again.');
    }
    rl.close();
  });
}

function setupRailway() {
  console.log('\n📋 Railway Setup Instructions:');
  console.log('1. Go to https://railway.app and sign up');
  console.log('2. Create a new project');
  console.log('3. Add a PostgreSQL database');
  console.log('4. Copy the connection string from database settings\n');
  
  rl.question('Paste your Railway connection string: ', (connectionString) => {
    if (connectionString.trim()) {
      createEnvFile(connectionString);
    } else {
      console.log('No connection string provided. Please run the script again.');
    }
    rl.close();
  });
}

function setupRender() {
  console.log('\n📋 Render Setup Instructions:');
  console.log('1. Go to https://render.com and sign up');
  console.log('2. Create a new PostgreSQL database');
  console.log('3. Copy the connection string\n');
  
  rl.question('Paste your Render connection string: ', (connectionString) => {
    if (connectionString.trim()) {
      createEnvFile(connectionString);
    } else {
      console.log('No connection string provided. Please run the script again.');
    }
    rl.close();
  });
}

function createEnvFile(connectionString) {
  const envContent = `# Database Configuration
DATABASE_URL=${connectionString}

# Environment
NODE_ENV=production

# Server Configuration
PORT=3001

# JWT Secret (for authentication if needed)
JWT_SECRET=your-secret-key-here
`;

  const envPath = path.join(__dirname, '.env');
  
  try {
    fs.writeFileSync(envPath, envContent);
    console.log('\n✅ .env file created successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Run: npm run migration:run');
    console.log('2. Run: npm run seed');
    console.log('3. Test your connection: npm start');
    console.log('\n🔗 Your database is now ready for cloud deployment!');
  } catch (error) {
    console.error('❌ Error creating .env file:', error.message);
  }
} 