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

  enableWeek02Navigation();

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
