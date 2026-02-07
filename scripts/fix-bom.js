const fs = require('fs');
const path = require('path');

const files = [
  'package.json',
  'services/marketplace/product-service/package.json',
  'services/logistics/mission-service/package.json',
  'services/identity/user-service/package.json', 
  'services/identity/auth-service/package.json',
  'packages/common/package.json',
  'packages/config/package.json'
];

files.forEach(file => {
  const filePath = path.resolve(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    console.log(`Checking ${file}...`);
    let content = fs.readFileSync(filePath);
    
    // Check for BOM (EF BB BF)
    if (content[0] === 0xEF && content[1] === 0xBB && content[2] === 0xBF) {
      console.log(`[BOM DETECTED] Removing form ${file}`);
      content = content.slice(3);
      fs.writeFileSync(filePath, content);
      console.log(`[CLEANED] ${file}`);
    } else {
        // Also check if string starts with invisible char when read as utf8
        const text = content.toString('utf8');
        if (text.charCodeAt(0) === 0xFEFF) {
             console.log(`[BOM DETECTED (UTF16)] Removing form ${file}`);
             fs.writeFileSync(filePath, text.substring(1), 'utf8');
             console.log(`[CLEANED] ${file}`);
        } else {
            console.log(`[OK] ${file}`);
        }
    }
  } else {
    console.log(`[MISSING] ${file}`);
  }
});
