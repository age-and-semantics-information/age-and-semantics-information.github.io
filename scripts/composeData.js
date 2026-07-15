import yaml from 'js-yaml';
import fs from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const paper_dir = join(__dirname, '..', 'papers');
const publicDir = join(__dirname, '..', 'public');
const outputPath = join(publicDir, 'papers.json');
if (!fs.existsSync(paper_dir)) { console.log('no papers dir'); process.exit(0); }
if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, {recursive:true});
let papers = fs.readdirSync(paper_dir).filter(f=>f.endsWith('.yml')||f.endsWith('.yaml'));
console.info(`Found ${papers.length} paper files`);
const seenTitles = new Set();
const issues={duplicates:[], missing:[], parseErrors:[]};
const paper_objs = papers.map(file=>{
  const filePath = join(paper_dir, file);
  try {
    const content = fs.readFileSync(filePath,'utf-8');
    const data = yaml.load(content);
    if (!data || typeof data!=='object') return null;
    const required=['title','authors','publications','labels'];
    const missing=required.filter(f=>!data[f]);
    if (missing.length>0) issues.missing.push({file, missing});
    if (data.title && seenTitles.has(data.title)) issues.duplicates.push(file);
    if (data.title) seenTitles.add(data.title);
    // Deduplicate publications by URL to fix duplicate arXiv badges
    if (data.publications && Array.isArray(data.publications)) {
      const seenUrls = new Set();
      const deduped = [];
      for (const pub of data.publications) {
        const url = pub.url || '';
        if (url && seenUrls.has(url)) continue;
        if (url) seenUrls.add(url);
        deduped.push(pub);
      }
      data.publications = deduped;
    }
    const {abstract, ...rest} = data;
    return rest;
  } catch(e){ console.error(`Failed ${file}: ${e.message}`); issues.parseErrors.push(file); return null; }
}).filter(Boolean);
fs.writeFileSync(outputPath, JSON.stringify(paper_objs,null,2));
console.info(`Processed ${paper_objs.length} papers -> ${outputPath}`);
