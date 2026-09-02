/* backtop.js wrapper: preserve original shared behavior and open Week 04/05 navigation */
(function () {
  'use strict';

  /* Load the previous shared script synchronously at the same parser position. */
  document.write('<script src="../js/backtop-core.js"><\/script>');

  function setOpenOption(select, labelText, value) {
    if (!select) return;
    var openGroup = select.querySelector('optgroup[label="개설 강의"]');
    Array.prototype.forEach.call(select.options, function (option) {
      if (option.textContent.indexOf(labelText) !== -1) {
        option.disabled = false;
        option.value = value;
        if (openGroup && option.parentElement !== openGroup) openGroup.appendChild(option);
      }
    });
  }

  function activateNavItem(item, href) {
    if (!item) return;
    item.classList.remove('is-disabled');
    item.removeAttribute('aria-disabled');
    item.setAttribute('data-href', href);
    if (item.tagName === 'A') item.setAttribute('href', href);
    if (!item.dataset.openWeekBound) {
      item.dataset.openWeekBound = '1';
      item.addEventListener('click', function (e) {
        if (item.tagName !== 'A') {
          e.preventDefault();
          window.location.href = href;
        }
      });
    }
  }

  function enableWeekNavigation() {
    var select = document.getElementById('weekSelect');
    setOpenOption(select, '04주차 · 프로젝트 유형 탐색과 AI 아이데이션', 'lecture-week04.html');
    setOpenOption(select, '05주차 · 나만의 AI 비서 설계', 'lecture-week05.html');

    Array.prototype.forEach.call(document.querySelectorAll('.lecture-nav-item'), function (item) {
      var name = item.querySelector('.nav-name');
      var text = name ? name.textContent : item.textContent;
      if (text.indexOf('WEEK 04') !== -1 || text.indexOf('04주차') !== -1) activateNavItem(item, 'lecture-week04.html');
      if (text.indexOf('WEEK 05') !== -1 || text.indexOf('05주차') !== -1) activateNavItem(item, 'lecture-week05.html');
    });
  }

  function isWeek04() {
    var eyebrow = document.querySelector('.lecture-eyebrow strong');
    return !!eyebrow && eyebrow.textContent.indexOf('WEEK 04') !== -1;
  }

  function ensureWeek04PromptUI(root) {
    if (!isWeek04()) return;
    root = root || document;

    if (!document.getElementById('week04-prompt-ui-style')) {
      var style = document.createElement('style');
      style.id = 'week04-prompt-ui-style';
      style.textContent = [
        '.week04-page .lc-prompt-wrap{position:relative;margin:8px 0 24px}',
        '.week04-page .lc-prompt{display:block;box-sizing:border-box;width:100%;margin:0!important;padding:20px 86px 20px 20px!important;border:1px solid #20242e!important;border-radius:14px!important;background:#000!important;color:#fff!important;white-space:pre-wrap;word-break:break-word;overflow-wrap:anywhere;line-height:1.75;font-family:\'IBM Plex Mono\',monospace;font-size:14px;box-shadow:0 10px 28px rgba(20,16,42,.12)}',
        '.week04-page .lc-prompt *{color:#fff!important;background:transparent!important}',
        '.week04-page .lc-prompt-copy{position:absolute;top:12px;right:12px;z-index:3;border:1px solid rgba(255,255,255,.38);border-radius:8px;background:#1d212b;color:#fff;padding:8px 11px;font:600 12px/1 \'IBM Plex Sans KR\',sans-serif;cursor:pointer;transition:background .2s ease,border-color .2s ease,transform .15s ease}',
        '.week04-page .lc-prompt-copy:hover{background:#2a3040;border-color:rgba(255,255,255,.68)}',
        '.week04-page .lc-prompt-copy:active{transform:translateY(1px)}',
        '.week04-page .lc-prompt-copy:focus-visible{outline:2px solid #fff;outline-offset:2px}',
        '.week04-page .lc-prompt-copy.is-copied{border-color:#48d8b5;color:#7defd3}'
      ].join('');
      document.head.appendChild(style);
    }

    Array.prototype.forEach.call(root.querySelectorAll ? root.querySelectorAll('.lc-prompt') : [], function (pre) {
      var wrap = pre.parentElement && pre.parentElement.classList.contains('lc-prompt-wrap') ? pre.parentElement : null;
      if (!wrap) {
        wrap = document.createElement('div');
        wrap.className = 'lc-prompt-wrap';
        pre.parentNode.insertBefore(wrap, pre);
        wrap.appendChild(pre);
      }
      if (wrap.querySelector('.lc-prompt-copy')) return;

      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'lc-prompt-copy';
      btn.textContent = '복사';
      btn.setAttribute('aria-label', '프롬프트 복사');
      btn.addEventListener('click', function () {
        var text = pre.textContent;
        function done() {
          btn.textContent = '복사됨';
          btn.classList.add('is-copied');
          window.setTimeout(function () {
            btn.textContent = '복사';
            btn.classList.remove('is-copied');
          }, 1400);
        }
        function fallback() {
          var ta = document.createElement('textarea');
          ta.value = text;
          ta.style.position = 'fixed';
          ta.style.opacity = '0';
          document.body.appendChild(ta);
          ta.select();
          try { document.execCommand('copy'); done(); } catch (e) {}
          document.body.removeChild(ta);
        }
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(done).catch(fallback);
        } else {
          fallback();
        }
      });
      wrap.appendChild(btn);
    });
  }

  function installWeek04Locks() {
    var eyebrow = document.querySelector('.lecture-eyebrow strong');
    if (!eyebrow || eyebrow.textContent.indexOf('WEEK 04') === -1) return;
    if (document.body.dataset.week04LocksReady === '1') return;
    document.body.dataset.week04LocksReady = '1';

    /* Main lecture itself is public. */
    var oldGate = document.getElementById('week04Gate');
    if (oldGate) {
      oldGate.hidden = true;
      oldGate.style.display = 'none';
    }

    var style = document.createElement('style');
    style.id = 'week04-public-lock-style';
    style.textContent = '.week04-gate{display:none!important}.w4-locked-content{display:none}.w4-practice-gate{padding:28px 22px;text-align:center;border:1px solid #d9dcec;border-radius:12px;background:#f7f8ff;margin:18px 0}.w4-practice-gate .w4-lock-icon{font-size:28px;margin:0 0 8px}.w4-practice-gate .w4-lock-title{font-weight:700;color:#303b69;margin:0 0 6px}.w4-practice-gate .w4-lock-desc{color:#667085;margin:0 0 14px}.w4-practice-gate form{display:flex;gap:8px;justify-content:center;flex-wrap:wrap}.w4-practice-gate input{width:220px;max-width:70vw;border:1px solid #cfd4e6;border-radius:999px;padding:10px 14px;font:inherit}.w4-practice-gate button{border:0;border-radius:999px;background:#5266e8;color:#fff;padding:10px 18px;font:inherit;font-weight:700;cursor:pointer}.w4-practice-gate .w4-lock-error{margin:10px 0 0;color:#c4320a;font-size:13px}';
    document.head.appendChild(style);

    var targetHash = '9a474d9446107e9c48c74170d56e739dbaa3a188d458ea0777f675edfcd6f6bf';
    var encoder = new TextEncoder();
    var toHex = function (buffer) { return Array.from(new Uint8Array(buffer)).map(function (x) { return x.toString(16).padStart(2, '0'); }).join(''); };
    var blocks = Array.prototype.slice.call(document.querySelectorAll('.lc-practice'));
    var originals = blocks.map(function (b) { return b.innerHTML; });
    var outputHolder = null;
    var outputGate = null;
    var unlocked = false;

    function gateMarkup(label) {
      return '<div class="w4-practice-gate"><p class="w4-lock-icon">🔒</p><p class="w4-lock-title">비밀번호가 필요한 ' + label + '입니다</p><p class="w4-lock-desc">내용은 비밀번호 확인 후 열람할 수 있습니다.</p><form><input type="password" autocomplete="off" placeholder="비밀번호"><button type="submit">열람하기</button></form><p class="w4-lock-error" hidden>비밀번호가 올바르지 않습니다.</p></div>';
    }
    async function valid(value) {
      return toHex(await crypto.subtle.digest('SHA-256', encoder.encode(value))) === targetHash;
    }
    function openAll() {
      unlocked = true;
      blocks.forEach(function (b, i) { b.innerHTML = originals[i]; });
      if (outputHolder) outputHolder.classList.remove('w4-locked-content');
      if (outputGate) { outputGate.remove(); outputGate = null; }
      ensureWeek04PromptUI(document);
    }
    function bindGate(root) {
      var form = root.querySelector('form');
      var input = root.querySelector('input');
      var error = root.querySelector('.w4-lock-error');
      if (!form || !input) return;
      form.addEventListener('submit', async function (e) {
        e.preventDefault();
        if (error) error.hidden = true;
        if (unlocked || await valid(input.value)) openAll();
        else { if (error) error.hidden = false; input.value = ''; input.focus(); }
      });
    }

    blocks.forEach(function (b) { b.innerHTML = gateMarkup('실습'); bindGate(b); });

    var outputs = document.getElementById('outputs');
    if (outputs && outputs.parentNode) {
      outputHolder = document.createElement('div');
      outputHolder.className = 'w4-locked-content';
      var node = outputs.nextSibling;
      while (node) {
        var next = node.nextSibling;
        outputHolder.appendChild(node);
        node = next;
      }
      outputs.parentNode.appendChild(outputHolder);
      var shell = document.createElement('div');
      shell.innerHTML = gateMarkup('산출물');
      outputGate = shell.firstElementChild;
      outputs.parentNode.insertBefore(outputGate, outputHolder);
      bindGate(outputGate);
    }
  }

  function enhance() {
    enableWeekNavigation();
    ensureWeek04PromptUI(document);
    installWeek04Locks();
    ensureWeek04PromptUI(document);
  }

  if (document.readyState === 'loading') {
    window.setTimeout(enhance, 0);
    document.addEventListener('DOMContentLoaded', enhance, { once: true });
  } else {
    enhance();
  }
})();