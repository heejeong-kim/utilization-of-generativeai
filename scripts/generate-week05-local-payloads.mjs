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
