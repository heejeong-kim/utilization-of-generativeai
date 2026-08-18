/* ============================================================================
   backtop.js — 스크롤을 따라다니는 '맨 위로' 플로팅 버튼 (전 페이지 공통)
   일정 높이 이상 내려가면 나타나고, 클릭하면 최상단으로 이동한다.
   ========================================================================== */

(function () {
  'use strict';

  function isWeek02() {
    var week = document.querySelector('.lecture-eyebrow strong');
    return !!week && week.textContent.indexOf('WEEK 02') !== -1;
  }

  /* 2주차 공개 상태를 기존 OT·1주차 페이지의 정적 목록과 다음 버튼에 반영한다. */
  function enableWeek02Navigation() {
    var weekSelect = document.getElementById('weekSelect');
    if (weekSelect) {
      var openGroup = weekSelect.querySelector('optgroup[label="개설 강의"]');
      Array.prototype.forEach.call(weekSelect.options, function (option) {
        if (option.textContent.indexOf('02주차 · LLM의 원리와 기본 질문법') !== -1) {
          option.disabled = false;
          option.value = 'lecture-week02.html';
          if (openGroup && option.parentElement !== openGroup) openGroup.appendChild(option);
        }
      });
    }

    Array.prototype.forEach.call(document.querySelectorAll('.lecture-nav-item--next'), function (item) {
      var name = item.querySelector('.nav-name');
      if (name && name.textContent.indexOf('WEEK 02') !== -1 && !item.getAttribute('data-href')) {
        item.setAttribute('data-href', 'lecture-week02.html');
        item.classList.remove('is-disabled');
      }
    });
  }

  /* 2주차 상세 페이지에는 1주차의 인라인 토글 스크립트가 없으므로 공통 스크립트에서 보완한다. */
  function enableLectureSideToggle() {
    var layout = document.getElementById('lectureLayout');
    var sideToggle = document.getElementById('lectureSideToggle');

    if (!layout || !sideToggle || document.getElementById('lectureToast')) return;

    var storageKey = 'lecture-side-closed';

    function setClosed(closed) {
      layout.classList.toggle('is-side-closed', closed);
      sideToggle.setAttribute('aria-expanded', String(!closed));
      sideToggle.innerHTML = closed
        ? '<span aria-hidden="true">▶</span> 왼쪽 영역 열기'
        : '<span aria-hidden="true">◀</span> 왼쪽 영역 닫기';
    }

    var savedClosed = false;
    try { savedClosed = localStorage.getItem(storageKey) === 'true'; } catch (e) {}
    setClosed(savedClosed);

    sideToggle.addEventListener('click', function () {
      var nextClosed = !layout.classList.contains('is-side-closed');
      setClosed(nextClosed);
      try { localStorage.setItem(storageKey, String(nextClosed)); } catch (e) {}
    });
  }

  /* 2주차 5·6장 H1 배너 이미지도 1~4장과 동일한 패턴으로 맞춘다. */
  function ensureWeek02SectionBanners() {
    if (!isWeek02()) return;

    [
      { id: 's5', src: '../assets/img/2_5.png', alt: '환각·편향·최신성 한계와 사실 검증' },
      { id: 's6', src: '../assets/img/2_6.png', alt: '이론을 적용한 프롬프트 작성·비교·검증' }
    ].forEach(function (item) {
      var heading = document.getElementById(item.id);
      if (!heading) return;
      var next = heading.nextElementSibling;
      if (next && next.classList.contains('lc-banner')) return;

      var figure = document.createElement('figure');
      figure.className = 'lc-banner';
      var img = document.createElement('img');
      img.src = item.src;
      img.alt = item.alt;
      img.loading = 'lazy';
      img.addEventListener('error', function () { figure.style.display = 'none'; });
      figure.appendChild(img);
      heading.insertAdjacentElement('afterend', figure);
    });
  }

  /* 2주차 전용 화면 보정: 테이블 비율, 블릿, 서술문, 산출물 색상 */
  function polishWeek02Content() {
    if (!isWeek02()) return;
    document.body.classList.add('week02-page');

    Array.prototype.forEach.call(document.querySelectorAll('.lecture-content .lc-table'), function (table) {
      var headRow = table.querySelector('thead tr');
      if (!headRow) return;
      var count = headRow.children.length;
      table.classList.add('lc-table--cols-' + count);

      var labels = Array.prototype.map.call(headRow.children, function (cell) {
        return cell.textContent.trim();
      }).join('|');

      if (labels.indexOf('ChatGPT|Claude|Gemini') !== -1) table.classList.add('lc-table--compare');
      if (labels.indexOf('요소|답해야 할 질문|작성 예시|빠뜨렸을 때의 증상') !== -1) table.classList.add('lc-table--prompt-elements');
      if (labels.indexOf('서비스|최신 모델 예시|컨텍스트 규모|학생 관점에서의 의미') !== -1) table.classList.add('lc-table--model-context');
      if (labels.indexOf('구간|작성 내용') !== -1) table.classList.add('lc-table--label-content');
      if (labels.indexOf('고민해볼 문제') !== -1) table.classList.add('lc-table--question');
    });

    /* 5.3의 서술형 한 문장을 항목형 정보로 표시 */
    Array.prototype.forEach.call(document.querySelectorAll('.lecture-content .lc-h2'), function (heading) {
      if (heading.textContent.trim().indexOf('5.3 최신성 한계') === 0) {
        var p = heading.nextElementSibling;
        if (p && p.classList.contains('lc-p') && !p.classList.contains('lc-bullet-lead')) {
          p.classList.add('lc-bullet-lead');
        }
      }
      if (heading.textContent.trim().indexOf('4.2 요소별 작성 요령') === 0) {
        var list = heading.nextElementSibling;
        if (list && list.classList.contains('lc-list')) list.classList.add('lc-list--bullet');
      }
    });

    var outputs = document.getElementById('outputs');
    if (outputs) {
      outputs.classList.add('lc-output-title');
      var intro = outputs.nextElementSibling;
      if (intro && intro.classList.contains('lc-p')) intro.classList.add('lc-output-intro');
      var callout = intro && intro.nextElementSibling;
      if (callout && callout.classList.contains('lc-callout')) callout.classList.add('lc-output-callout');
    }
  }

  /* 학생용 프롬프트는 검정 배경 + 복사 버튼으로 제공 */
  function enablePromptCopyBlocks() {
    if (!isWeek02()) return;

    Array.prototype.forEach.call(document.querySelectorAll('.lecture-content pre'), function (pre, index) {
      if (pre.closest('.lc-code-shell')) return;

      var shell = document.createElement('div');
      shell.className = 'lc-code-shell';
      pre.parentNode.insertBefore(shell, pre);
      shell.appendChild(pre);

      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'lc-copy-btn';
      button.setAttribute('aria-label', '프롬프트 복사');
      button.textContent = '복사';
      shell.insertBefore(button, pre);

      button.addEventListener('click', function () {
        var code = pre.querySelector('code');
        var text = code ? code.innerText : pre.innerText;
        var done = function () {
          button.textContent = '복사됨';
          button.classList.add('is-copied');
          window.setTimeout(function () {
            button.textContent = '복사';
            button.classList.remove('is-copied');
          }, 1400);
        };

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(done).catch(function () { fallbackCopy(text, done); });
        } else {
          fallbackCopy(text, done);
        }
      });
    });
  }

  function fallbackCopy(text, done) {
    var area = document.createElement('textarea');
    area.value = text;
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    try { document.execCommand('copy'); done(); } catch (e) {}
    document.body.removeChild(area);
  }

  enableWeek02Navigation();
  enableLectureSideToggle();
  ensureWeek02SectionBanners();
  polishWeek02Content();
  enablePromptCopyBlocks();

  const btn = document.getElementById('backTop');
  if (!btn) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function toggle() {
    btn.classList.toggle('is-visible', window.scrollY > 320);
  }

  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });

  window.addEventListener('scroll', toggle, { passive: true });
  window.addEventListener('resize', toggle);
  toggle();
})();
