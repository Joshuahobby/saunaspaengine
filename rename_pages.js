const fs = require('fs');
const path = require('path');

const dashboardDir = path.join(__dirname, 'src', 'app', '(dashboard)');
const legacyDirs = [path.join(dashboardDir, 'admin'), path.join(dashboardDir, 'executive')];

function walkSync(dir, filelist = []) {
    if (fs.existsSync(dir)) {
        fs.readdirSync(dir).forEach(file => {
            const dirFile = path.join(dir, file);
            if (fs.statSync(dirFile).isDirectory()) {
                filelist = walkSync(dirFile, filelist);
            } else {
                filelist.push(dirFile);
            }
        });
    }
    return filelist;
}

const allLegacyFiles = [];
legacyDirs.forEach(dir => {
    allLegacyFiles.push(...walkSync(dir));
});

const legacyPages = allLegacyFiles.filter(f => path.basename(f) === 'page.tsx');

// Rename legacy page.tsx to _page.tsx
legacyPages.forEach(file => {
    const newPath = path.join(path.dirname(file), '_page.tsx');
    fs.renameSync(file, newPath);
    console.log(Renamed:  -> );
});

// Update all TypeScript/TSX files in (dashboard) that proxy to these pages
const allFiles = walkSync(dashboardDir);
const tsFiles = allFiles.filter(f => f.endsWith('.ts') || f.endsWith('.tsx'));

tsFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    const originalContent = content;

    // Replace absolute imports to these pages
    const regex = /(from\s+['"]@\/app\/\(dashboard\)\/(?:admin|executive)\/(?:(?:[^'"]*)\/)?)[^'"]*page(['"])/g;
    
    // Custom replacer logic to ensure only page becomes _page
    content = content.replace(regex, (match, prefix, suffix) => {
        // match example: from "@/app/(dashboard)/admin/branches/page"
        // prefix: from "@/app/(dashboard)/admin/branches/
        // suffix: "
        if (match.endsWith('page"') || match.endsWith("page'")) {
           return prefix + '_page' + suffix;
        }
        return match;
    });

    if (content !== originalContent) {
        fs.writeFileSync(file, content);
        console.log(Updated imports in: );
    }
});
console.log('Done.');
