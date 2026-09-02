const fs = require('fs');
const crypto = require('crypto');

const ITERATIONS = 600000;

function newPassword() {
  return crypto.randomBytes(12).toString('base64url');
}

function encryptText(text, password) {
  const salt = crypto.randomBytes(16);
  const iv = crypto.randomBytes(12);
  const key = crypto.pbkdf2Sync(password, salt, ITERATIONS, 32, 'sha256');
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const ciphertext = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return {
    version: 1,
    algorithm: 'AES-GCM',
    kdf: 'PBKDF2-SHA256',
    iterations: ITERATIONS,
    salt: salt.toString('base64'),
    iv: iv.toString('base64'),
    data: Buffer.concat([ciphertext, tag]).toString('base64')
  };
}

const pw = {
  '2주차 교재 써머리': newPassword(),
  '3주차 교재 써머리': newPassword(),
  '3주차 개인별 실습': newPassword(),
  '4주차 전체 교안': newPassword()
};

const protectedFiles = [
  ['pages/week02-summary.html', 'pages/week02-summary.enc.json', pw['2주차 교재 써머리']],
  ['pages/week03-summary.html', 'pages/week03-summary.enc.json', pw['3주차 교재 써머리']],
  ['pages/week03-lab.html', 'pages/week03-lab.enc.json', pw['3주차 개인별 실습']]
];

for (const [src, out, password] of protectedFiles) {
  const plain = fs.readFileSync(src, 'utf8');
  fs.writeFileSync(out, JSON.stringify(encryptText(plain, password)));
  fs.unlinkSync(src);
}

function patchLecture(path, replacements) {
  let html = fs.readFileSync(path, 'utf8');
  for (const [from, to] of replacements) {
    if (!html.includes(from)) throw new Error(`Expected pattern not found in ${path}: ${from}`);
    html = html.replace(from, to);
  }
  html = html.replace(
    "document.querySelectorAll('.lc-lock')",
    "document.querySelectorAll('.lc-lock[data-lock-password]')"
  );
  if (!html.includes('../js/secure-lock.js')) {
    html = html.replace(
      '<script src="../js/backtop.js"></script>',
      '<script src="../js/secure-lock.js"></script>\n<script src="../js/backtop.js"></script>'
    );
  }
  fs.writeFileSync(path, html);
}

patchLecture('pages/lecture-week02.html', [
  [
    'data-lock-password="2468" data-lock-src="week02-summary.html"',
    'data-lock-encrypted="week02-summary.enc.json"'
  ]
]);

patchLecture('pages/lecture-week03.html', [
  [
    'data-lock-password="2468" data-lock-src="week03-summary.html"',
    'data-lock-encrypted="week03-summary.enc.json"'
  ],
  [
    'data-lock-password="8989" data-lock-src="week03-lab.html"',
    'data-lock-encrypted="week03-lab.enc.json"'
  ]
]);

const secureLockJs = String.raw`(() => {
  'use strict';
  const enc = new TextEncoder();
  const dec = new TextDecoder();

  const b64 = (s) => {
    const bin = atob(s);
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  };

  async function keyFromPassword(password, salt, iterations) {
    const material = await crypto.subtle.importKey(
      'raw', enc.encode(password), 'PBKDF2', false, ['deriveKey']
    );
    return crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt, iterations, hash: 'SHA-256' },
      material,
      { name: 'AES-GCM', length: 256 },
      false,
      ['decrypt']
    );
  }

  async function decrypt(password, payload) {
    const key = await keyFromPassword(
      password, b64(payload.salt), payload.iterations
    );
    const raw = b64(payload.data);
    return dec.decode(await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: b64(payload.iv) },
      key,
      raw
    ));
  }

  document.querySelectorAll('.lc-lock[data-lock-encrypted]').forEach((lock) => {
    const src = lock.getAttribute('data-lock-encrypted');
    const form = lock.querySelector('.lc-lock-form');
    const input = lock.querySelector('.lc-lock-input');
    const errorEl = lock.querySelector('.lc-lock-error');
    const gate = lock.querySelector('.lc-lock-gate');
    const frame = lock.querySelector('.lc-lock-frame');
    if (!src || !form || !input || !frame) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (errorEl) errorEl.hidden = true;
      const btn = form.querySelector('button[type="submit"]');
      if (btn) btn.disabled = true;
      try {
        const r = await fetch(src, { cache: 'no-store' });
        if (!r.ok) throw new Error('load');
        const payload = await r.json();
        const html = await decrypt(input.value, payload);
        frame.srcdoc = html;
        frame.hidden = false;
        if (gate) gate.hidden = true;
        input.value = '';
      } catch (_) {
        if (errorEl) errorEl.hidden = false;
        input.value = '';
        input.focus();
      } finally {
        if (btn) btn.disabled = false;
      }
    });
  });
})();`;
fs.writeFileSync('js/secure-lock.js', secureLockJs);

let week04 = fs.readFileSync('pages/lecture-week04.html', 'utf8');
week04 = week04.replace("input.value==='4520'", "input.value==='__deprecated__'");
week04 = week04.replace('</head>', '<style>.week04-gate{display:none!important}</style></head>');
fs.writeFileSync(
  'pages/week04-full.enc.json',
  JSON.stringify(encryptText(week04, pw['4주차 전체 교안']))
);

const loader = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>WEEK 04 · 보호된 강의교안</title>
<style>
body{margin:0;font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;background:#0d1020;color:#111}
.gate{min-height:100vh;display:grid;place-items:center;padding:24px;box-sizing:border-box}
.card{width:min(440px,100%);background:#fff;border-radius:22px;padding:32px;box-shadow:0 30px 90px rgba(0,0,0,.35)}
h1{font-size:22px;margin:0 0 8px}.desc{color:#667085;line-height:1.65}.form{display:flex;gap:8px;margin-top:18px}
input{flex:1;min-width:0;border:1px solid #d0d5dd;border-radius:10px;padding:12px 14px;font:inherit}
button{border:0;border-radius:10px;background:#5b4de3;color:#fff;padding:12px 16px;font:inherit;font-weight:700;cursor:pointer}
.err{color:#c4320a;font-size:13px;margin:10px 0 0}
</style>
</head>
<body>
<main class="gate"><section class="card"><div style="font-size:32px">🔒</div><h1>4주차 강의교안</h1>
<p class="desc">비밀번호 확인 후 교안 페이지에 접속할 수 있습니다.</p>
<form class="form" id="f"><input id="p" type="password" autocomplete="off" placeholder="비밀번호"><button type="submit">접속하기</button></form>
<p class="err" id="e" hidden>비밀번호가 올바르지 않습니다.</p></section></main>
<script>
(()=>{'use strict';
  const enc=new TextEncoder(),dec=new TextDecoder();
  const b64=s=>{const b=atob(s),o=new Uint8Array(b.length);for(let i=0;i<b.length;i++)o[i]=b.charCodeAt(i);return o};
  async function decrypt(password,payload){
    const m=await crypto.subtle.importKey('raw',enc.encode(password),'PBKDF2',false,['deriveKey']);
    const k=await crypto.subtle.deriveKey({name:'PBKDF2',salt:b64(payload.salt),iterations:payload.iterations,hash:'SHA-256'},m,{name:'AES-GCM',length:256},false,['decrypt']);
    return dec.decode(await crypto.subtle.decrypt({name:'AES-GCM',iv:b64(payload.iv)},k,b64(payload.data)));
  }
  document.getElementById('f').addEventListener('submit',async e=>{
    e.preventDefault();const p=document.getElementById('p'),err=document.getElementById('e');err.hidden=true;
    try{const r=await fetch('week04-full.enc.json',{cache:'no-store'});const payload=await r.json();const html=await decrypt(p.value,payload);document.open();document.write(html);document.close();}
    catch(_){err.hidden=false;p.value='';p.focus();}
  });
})();
</script>
</body></html>`;
fs.writeFileSync('pages/lecture-week04.html', loader);

const publicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAoAIuF31l9kBtRcd8OeC5
ncvOVHqt7YMEjloFzW+Eb/O2ZuI03K2VjYW6LoXlXFfg1CWR73a2P0Ur1oCGlyKO
QYa2is0bY/73UTznjxeWt4AVRyn75OcnaPDZJMskJNQ6Gm7GWX1l6dHzl++WrNIg
zcojNAsBjvL+yMUee7uIobTnhfn+GXziPzPdFzT5BUpgzymFFfkSbd2DAGKdn7nW
KR803KOetyfsJi97IoCtitwcdmhuDOhUSogE0OjjFOOPu31n983cwlj0P3JIriAu
k0FpCcE9xEHVV9q5F47EG23+mZawa2KOEvYuP1Xl/gWZX3YLz4GfRufPm4kBXj+U
vQIDAQAB
-----END PUBLIC KEY-----`;
const vaultPlain = Buffer.from(JSON.stringify({
  generatedAt: new Date().toISOString(),
  passwords: pw
}, null, 2), 'utf8');

const encryptedVault = crypto.publicEncrypt(
  { key: publicKey, padding: crypto.constants.RSA_PKCS1_OAEP_PADDING, oaepHash: 'sha256' },
  vaultPlain
);
fs.mkdirSync('.security', { recursive: true });
fs.writeFileSync('.security/password-vault.enc', encryptedVault.toString('base64'));

if (fs.existsSync('.github/workflows/secure-content-migration.yml')) fs.unlinkSync('.github/workflows/secure-content-migration.yml');
if (fs.existsSync('tools/secure-content-migration.js')) fs.unlinkSync('tools/secure-content-migration.js');
