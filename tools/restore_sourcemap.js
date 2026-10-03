// 从 sourcemap 的 sourcesContent 还原原始源码
const fs = require('fs');
const path = require('path');

const mapFile = process.argv[2];
const outDir = process.argv[3];
const map = JSON.parse(fs.readFileSync(mapFile, 'utf8'));

for (let i = 0; i < map.sources.length; i++) {
  const src = map.sources[i];
  const content = map.sourcesContent ? map.sourcesContent[i] : null;
  if (!content) { console.log('NO CONTENT: ' + src); continue; }
  // 清理 webpack:// 前缀
  const rel = src.replace(/^webpack:\/\//, '').replace(/^[a-zA-Z_-]+\/~/, '').replace(/^\.\//, '');
  const out = path.join(outDir, rel);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, content);
  console.log('restored: ' + rel);
}
