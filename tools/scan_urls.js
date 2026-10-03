// 扫描 dist 目录下所有 JS 文件中的 URL/域名
const fs = require('fs');
const path = require('path');

const root = process.argv[2] || 'D:/Dazhaomofang/app_extracted/dist';
const urlRe = /https?:\/\/[a-zA-Z0-9._-]+(\/[a-zA-Z0-9._/-]*)?/g;
const domainCount = new Map();
const urlSamples = new Map();

function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.(js|json)$/.test(e.name)) {
      try {
        const c = fs.readFileSync(p, 'utf8');
        for (const m of c.matchAll(urlRe)) {
          const u = m[0];
          try {
            const host = new URL(u).host;
            domainCount.set(host, (domainCount.get(host) || 0) + 1);
            if (!urlSamples.has(host)) urlSamples.set(host, new Set());
            if (urlSamples.get(host).size < 4) urlSamples.get(host).add(u);
          } catch {}
        }
      } catch {}
    }
  }
}

walk(root);
const sorted = [...domainCount.entries()].sort((a, b) => b[1] - a[1]);
for (const [host, count] of sorted.slice(0, 40)) {
  console.log(`${count}\t${host}`);
  for (const s of urlSamples.get(host)) console.log(`   ${s}`);
}
