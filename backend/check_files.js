import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(process.cwd(), 'uploads', 'menu');

console.log('Checking directory:', uploadDir);

if (fs.existsSync(uploadDir)) {
    console.log('Directory exists.');
    const files = fs.readdirSync(uploadDir);
    console.log(`Found ${files.length} files:`);
    files.forEach(f => console.log(' -', f));

    // Check for specific file
    const target = 'image-1768138879415-709869281.jpg';
    if (files.includes(target)) {
        console.log(`\nSUCCESS: Target file "${target}" FOUND!`);
    } else {
        console.log(`\nFAILURE: Target file "${target}" NOT found.`);
    }
} else {
    console.log('Directory does NOT exist.');
}
