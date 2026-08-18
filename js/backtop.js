/* ==========================================================================
   backtop.js — 스크롤을 따라다니는 '맨 위로' 플로팅 버튼 (전 페이지 공통)
   일정 높이 이상 내려가면 나타나고, 클릭하면 최상단으로 이동한다.
   ========================================================================== */

(function () {
  'use strict';

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

    /* 기존 OT·1주차는 자체 스크립트를 사용하므로 중복 이벤트를 등록하지 않는다. */
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
    if (!document.querySelector('.lecture-eyebrow strong') || document.querySelector('.lecture-eyebrow strong').textContent.indexOf('WEEK 02') === -1) return;

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

  enableWeek02Navigation();
  enableLectureSideToggle();
  ensureWeek02SectionBanners();

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
