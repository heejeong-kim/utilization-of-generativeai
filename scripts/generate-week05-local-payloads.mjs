import { readFile, writeFile } from 'node:fs/promises';

const jobs = [
  {
    json: new URL('../pages/week05-full.enc.json', import.meta.url),
    js: new URL('../pages/week05-full.enc.js', import.meta.url),
    global: 'WEEK05_FULL_PAYLOAD'
  },
  {
    json: new URL('../pages/week05-practice-bundle.enc.json', import.meta.url),
    js: new URL('../pages/week05-practice-bundle.enc.js', import.meta.url),
    global: 'WEEK05_PRACTICE_PAYLOAD'
  }
];

for (const job of jobs) {
  const raw = await readFile(job.json, 'utf8');
  const payload = JSON.parse(raw);
  const output = `/* Generated from ${job.json.pathname.split('/').pop()}. Do not edit manually. */\nwindow.${job.global}=${JSON.stringify(payload)};\n`;
  await writeFile(job.js, output, 'utf8');
  console.log(`generated ${job.js.pathname.split('/').pop()}`);
}

const pageUrl = new URL('../pages/lecture-week05.html', import.meta.url);
let html = await readFile(pageUrl, 'utf8');

if (!html.includes('week05-full.enc.js')) {
  const loaderScripts = '<script src="week05-full.enc.js"></script>\n<script src="week05-practice-bundle.enc.js"></script>\n';
  if (html.includes('</main>\n<script>')) {
    html = html.replace('</main>\n<script>', `</main>\n${loaderScripts}<script>`);
  } else {
    html = html.replace('<script>', `${loaderScripts}<script>`);
  }
}

html = html.replace(
  /const getPayload=\(\)=>payloadPromise\|\|\(payloadPromise=fetch\('week05-practice-bundle\.enc\.json',\{cache:'no-store'\}\)\.then\(r=>\{if\(!r\.ok\)throw new Error\('bundle'\);return r\.json\(\)\}\)\);/,
  "const getPayload=()=>payloadPromise||(payloadPromise=Promise.resolve(window.WEEK05_PRACTICE_PAYLOAD).then(p=>{if(!p)throw new Error('bundle');return p}));"
);

html = html.replace(
  "const r=await fetch('week05-full.enc.json',{cache:'no-store'});\n      if(!r.ok) throw new Error('load');\n      const payload=await r.json();",
  "const payload=window.WEEK05_FULL_PAYLOAD;\n      if(!payload) throw new Error('load');"
);

await writeFile(pageUrl, html, 'utf8');
console.log('updated lecture-week05.html for file:// compatibility');
