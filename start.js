const { spawn } = require('child_process');
const fs = require('fs');

// Ensure MongoDB data directory exists
const dataDir = '/tmp/mongodb';
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

console.log('Starting MongoDB and NestJS application...');

// Start MongoDB first
const mongodb = spawn('mongod', [
  '--dbpath', dataDir,
  '--port', '27017',
  '--bind_ip', '127.0.0.1'
], {
  stdio: 'pipe'
});

let mongoReady = false;

mongodb.stdout.on('data', (data) => {
  const output = data.toString();
  if (output.includes('waiting for connections')) {
    mongoReady = true;
    console.log('MongoDB ready for connections');
    startNestApp();
  }
});

mongodb.stderr.on('data', (data) => {
  console.error(`MongoDB stderr: ${data}`);
});

// Fallback: start NestJS after 5 seconds even if MongoDB isn't ready
setTimeout(() => {
  if (!mongoReady) {
    console.log('Starting NestJS application (MongoDB may not be ready)...');
    startNestApp();
  }
}, 5000);

function startNestApp() {
  const nestApp = spawn('npx', ['ts-node', 'src/main.ts'], {
    stdio: 'inherit',
    env: { 
      ...process.env, 
      MONGODB_URI: 'mongodb://localhost:27017/rewards-api',
      PORT: '8000'
    }
  });

  nestApp.on('close', (code) => {
    console.log(`Application process exited with code ${code}`);
    mongodb.kill();
  });
}