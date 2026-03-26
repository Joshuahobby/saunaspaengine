const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('1. Trying to kill dev server (skip if fails)...');
try {
    execSync('taskkill /F /IM node.exe', { stdio: 'ignore' });
} catch (e) {}

console.log('2. Deleting .next directory...');
try {
    const nextDir = path.join(__dirname, '.next');
    if (fs.existsSync(nextDir)) {
        fs.rmSync(nextDir, { recursive: true, force: true });
    }
} catch (e) {
    console.error('Failed to delete .next:', e.message);
}

console.log('3. Regenerating Prisma...');
try {
    execSync('npx prisma generate', { stdio: 'inherit' });
} catch (e) {}

console.log('Done! You can now run `npm run dev` again.');
