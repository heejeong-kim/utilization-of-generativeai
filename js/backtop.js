/* ==========================================================================
   backtop.js — 스크롤을 따라다니는 '맨 위로' 플로팅 버튼 (전 페이지 공통)
   일정 높이 이상 내려가면 나타나고, 클릭하면 최상단으로 이동한다.
   ========================================================================== */

(function () {
  'use strict';

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
