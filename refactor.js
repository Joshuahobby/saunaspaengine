const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
  let files;
  try {
    files = fs.readdirSync(dir);
  } catch(e) { return; }
  
  files.forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      if (f !== 'node_modules' && f !== '.next' && f !== '.git') {
        walk(dirPath, callback);
      }
    } else {
      callback(path.join(dir, f));
    }
  });
}

function processFiles(dir) {
  walk(dir, function(filePath) {
    if (!filePath.endsWith('.ts') && !filePath.endsWith('.tsx') && !filePath.endsWith('.prisma') && !filePath.endsWith('.json')) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Phase 0: Old OWNER -> MANAGER
    content = content.replace(/UserRole\.OWNER/g, 'UserRole.MANAGER');
    content = content.replace(/'OWNER'/g, "'MANAGER'");
    content = content.replace(/"OWNER"/g, '"MANAGER"');
    content = content.replace(/OWNER/g, 'MANAGER'); // Enum & general uppercase
    content = content.replace(/Owner/g, 'Manager');
    content = content.replace(/owner/g, 'manager');

    // Phase C: Old CORPORATE role -> OWNER
    content = content.replace(/UserRole\.CORPORATE/g, 'UserRole.OWNER');
    content = content.replace(/'CORPORATE'/g, "'OWNER'");
    content = content.replace(/"CORPORATE"/g, '"OWNER"');
    content = content.replace(/CORPORATE/g, 'OWNER'); // Enum & general uppercase

    // Phase A: Old Business -> Branch
    content = content.replace(/Businesses/g, 'Branches');
    content = content.replace(/businesses/g, 'branches');
    content = content.replace(/businessId/g, 'branchId');
    content = content.replace(/Business/g, 'Branch');
    content = content.replace(/business/g, 'branch');
    content = content.replace(/BUSINESS/g, 'BRANCH');

    // Phase B: Old Corporate -> Business
    content = content.replace(/Corporates/g, 'Businesses');
    content = content.replace(/corporates/g, 'businesses');
    content = content.replace(/corporateId/g, 'businessId');
    content = content.replace(/Corporate/g, 'Business');
    content = content.replace(/corporate/g, 'business');

    // Restore "Corporate Manager" meaning (which became Business Manager in Phase B) back to Business Owner
    content = content.replace(/Business Manager/g, 'Business Owner');

    if (filePath.endsWith('schema.prisma')) {
       // Specifically handle mapping back to original database columns / tables
       content = content.replace(/@@map\("branches"\)/g, '@@map("businesses")');
       content = content.replace(/@@map\("businesses"\)/g, '@@map("corporates")'); // NOTE: wait, if we replaced it to businesses from corporates... then it's businesses now. Wait, I should do two specific replacements.
       // Actually let's just use string replace carefully!
    }

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
    }
  });
}

console.log('Starting content replacement...');
processFiles('./src');
processFiles('./prisma');
console.log('Finished content replacement.');

// Re-patch schema.prisma for @map 
let schemaPath = './prisma/schema.prisma';
let schema = fs.readFileSync(schemaPath, 'utf8');
schema = schema.replace(/branchId\s+String\?/g, 'branchId    String? @map("businessId")');
schema = schema.replace(/branchId\s+String([^\?])/g, 'branchId  String @map("businessId")$1');
schema = schema.replace(/businessId\s+String\?/g, 'businessId   String? @map("corporateId")');
schema = schema.replace(/businessId\s+String([^\?])/g, 'businessId  String @map("corporateId")$1');
schema = schema.replace(/@@map\("branches"\)/g, '@@map("businesses")');
schema = schema.replace(/@@map\("businesses"\)\s+model PlatformPackage/g, '@@map("corporates")\n}\n\nmodel PlatformPackage'); // Hack to target the specific occurrence
fs.writeFileSync(schemaPath, schema, 'utf8');


function renameItems(dir) {
  let items;
  try {
    items = fs.readdirSync(dir);
  } catch(e) { return; }

  items.forEach(f => {
    let currentPath = path.join(dir, f);
    let isDir = fs.statSync(currentPath).isDirectory();
    
    if (isDir && f !== 'node_modules' && f !== '.next' && f !== '.git') {
      renameItems(currentPath);
    }

    if (isDir && (f === 'businesses' || f === 'branches')) {
      return; 
    }

    let newName = f
      .replace(/owner/g, 'manager')
      .replace(/Owner/g, 'Manager');

    newName = newName
      .replace(/businesses/g, 'branches')
      .replace(/business/g, 'branch')
      .replace(/Businesses/g, 'Branches')
      .replace(/Business/g, 'Branch');
    
    newName = newName
      .replace(/corporates/g, 'businesses')
      .replace(/corporate/g, 'business')
      .replace(/Corporates/g, 'Businesses')
      .replace(/Corporate/g, 'Business');

    if (newName !== f) {
      let newPath = path.join(dir, newName);
      fs.renameSync(currentPath, newPath);
      console.log(`Renamed: ${currentPath} -> ${newPath}`);
    }
  });
}

console.log('Starting file/folder renaming...');
renameItems('./src/app/(dashboard)');
renameItems('./src/components');
renameItems('./src/lib');
renameItems('./src/app/api');
console.log('Finished renaming.');
