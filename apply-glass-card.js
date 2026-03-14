const fs = require('fs');
const path = require('path');

const regexList = [
  // Common full combinations (with or without opacity, different orderings)
  {
    regex: /bg-white dark:bg-slate-900(?:\/\d+)?\s+p-[a-z0-9]+\s+rounded-[a-z0-9]+\s+border border-slate-200 dark:border-slate-800/g,
    replacement: match => match.replace(/bg-white dark:bg-slate-900(?:\/\d+)?/, 'glass-card').replace(/border border-slate-200 dark:border-slate-800/, '').replace(/rounded-[a-z0-9]+/, '')
  },
  {
    regex: /bg-white dark:bg-slate-900(?:\/\d+)?\s+rounded-[a-z0-9]+\s+p-[a-z0-9]+\s+border border-slate-200 dark:border-slate-800/g,
    replacement: match => match.replace(/bg-white dark:bg-slate-900(?:\/\d+)?/, 'glass-card').replace(/border border-slate-200 dark:border-slate-800/, '').replace(/rounded-[a-z0-9]+/, '')
  },
  {
    regex: /bg-white dark:bg-slate-900(?:\/\d+)?\s+rounded-[a-z0-9]+\s+border border-slate-[0-9]+ dark:border-slate-[0-9]+/g,
    replacement: 'glass-card'
  },
  {
    regex: /bg-white dark:bg-slate-900(?:\/\d+)?\s+border border-slate-[0-9]+ dark:border-slate-[0-9]+\s+rounded-[a-z0-9]+/g,
    replacement: 'glass-card'
  },
  {
    regex: /bg-white dark:bg-slate-900(?:\/\d+)?\s+border border-slate-[0-9]+ dark:border-slate-[0-9]+/g,
    replacement: 'glass-card'
  },
  {
    regex: /bg-white dark:bg-slate-900(?:\/\d+)?\s+border border-\[var\(--color-border-light\)\]\s+rounded-[a-z0-9]+/g,
    replacement: 'glass-card'
  },
  {
    regex: /bg-white dark:bg-slate-900(?:\/\d+)?\s+border border-\[var\(--color-border-light\)\]/g,
    replacement: 'glass-card'
  },
  {
    regex: /bg-white dark:bg-slate-900(?:\/\d+)?\s+rounded-[a-z0-9]+\s+p-[a-z0-9]+\s+border border-\[var\(--color-border-light\)\]/g,
    replacement: 'glass-card p-6'
  },
  {
    regex: /rounded-[a-z0-9]+\s+p-[a-z0-9]+\s+bg-white dark:bg-slate-900(?:\/\d+)?\s+border border-\[var\(--color-primary\)\]\/10/g,
    replacement: match => 'glass-card ' + (match.match(/p-[a-z0-9]+/) ? match.match(/p-[a-z0-9]+/)[0] : '')
  },
  {
    regex: /bg-white dark:bg-slate-900/g,
    replacement: 'glass-card'
  },
  {
    regex: /glass-card\/50 border-b border-primary\/10/g, // because bg-white... gets replaced
    replacement: 'glass-surface px-6 md:px-10 border-b-0'
  },
  {
    regex: /text-slate-700 dark:text-slate-300/g,
    replacement: 'text-[var(--color-teal-700)] dark:text-[var(--color-teal-100)]'
  },
  {
    regex: /text-slate-900 dark:text-slate-100/g,
    replacement: 'text-[var(--color-teal-900)] dark:text-[var(--color-teal-100)]'
  },
  {
    regex: /text-slate-600 dark:text-slate-400/g,
    replacement: 'text-[var(--color-teal-700)] dark:text-[var(--color-teal-100)]'
  }
];

function walk(dir) {
  let results = [];
  try {
    const list = fs.readdirSync(dir);
    list.forEach(file => {
      file = path.join(dir, file);
      const stat = fs.statSync(file);
      if (stat && stat.isDirectory()) {
        results = results.concat(walk(file));
      } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        results.push(file);
      }
    });
  } catch(e) {}
  return results;
}

const files = walk('src/app').concat(walk('src/components'));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content;
  
  regexList.forEach(r => {
    newContent = newContent.replace(r.regex, r.replacement);
  });
  
  if (newContent.includes('glass-card')) {
    newContent = newContent.replace(/glass-card\s+rounded-[a-z0-9]+/g, 'glass-card');
    newContent = newContent.replace(/glass-card\s+shadow-[a-z0-9]+/g, 'glass-card');
    newContent = newContent.replace(/rounded-[a-z0-9]+\s+glass-card/g, 'glass-card');
    newContent = newContent.replace(/shadow-[a-z0-9]+\s+glass-card/g, 'glass-card');
  }

  const classRegex = /className="([^"]+)"/g;
  newContent = newContent.replace(classRegex, (match, classes) => {
      const cleaned = classes.replace(/\s+/g, ' ').trim();
      return `className="${cleaned}"`;
  });

  if (content !== newContent) {
    fs.writeFileSync(file, newContent);
    console.log(`Updated ${file}`);
  }
});
