/* ==========================================================================
   main.js — 카드 렌더링, 검색, 필터, 스크롤 등장 모션
   ========================================================================== */

(function () {
  'use strict';

  const grid = document.getElementById('cardGrid');
  const teamGrid = document.getElementById('teamGrid');
  const searchInput = document.getElementById('searchInput');
  const emptyState = document.getElementById('emptyState');
  const chips = Array.from(document.querySelectorAll('.chip'));

  let currentFilter = 'all';
  let currentKeyword = '';

  /* ---------- HTML 이스케이프 (데이터에 특수문자가 들어와도 안전하게 출력) ---------- */
  function escapeHTML(str) {
    return String(str).replace(/[&<>"']/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
    });
  }

  /* ---------- 주차 카드 마크업 생성 ---------- */
  function cardTemplate(item) {
    const isEval = item.type === 'eval';
    const tags = item.tags.map(function (t) {
      return '<li class="tag">' + escapeHTML(t) + '</li>';
    }).join('');

    // 링크가 비어 있으면 준비 중 상태로 표기한다
    const cta = item.link
      ? '<a class="card-cta" href="' + escapeHTML(item.link) + '">강의교안 열기</a>'
      : '<span class="card-cta card-cta--soon">준비 중</span>';

    return '' +
      '<article class="card' + (isEval ? ' card--eval' : '') + '" data-type="' + item.type + '">' +
        '<div class="card-thumb">' +
          '<span class="thumb-fallback" aria-hidden="true">' + escapeHTML(item.week) + '</span>' +
          '<img src="assets/img/' + escapeHTML(item.thumb) + '" alt="" loading="lazy" ' +
               'onerror="this.style.display=\'none\'">' +
        '</div>' +
        '<div class="card-body">' +
          '<div class="card-meta">' +
            '<p class="card-week">' + escapeHTML(item.week) + '</p>' +
            '<span class="badge' + (isEval ? ' badge--eval' : '') + '">' + escapeHTML(item.badge) + '</span>' +
          '</div>' +
          '<h3 class="card-title">' + escapeHTML(item.title) + '</h3>' +
          '<p class="card-desc">' + escapeHTML(item.desc) + '</p>' +
          '<ul class="tags">' + tags + '</ul>' +
          cta +
        '</div>' +
      '</article>';
  }

  /* ---------- 팀 카드 마크업 생성 ---------- */
  function teamTemplate(team) {
    const percent = Math.round((team.done / team.total) * 100);
    const link = team.url
      ? '<a class="team-link" href="' + escapeHTML(team.url) + '" target="_blank" rel="noopener">배포 URL 열기 →</a>'
      : '<span class="team-link" aria-disabled="true">배포 전</span>';

    return '' +
      '<article class="team-card">' +
        '<h3 class="team-name">' + escapeHTML(team.name) + '</h3>' +
        '<p class="team-topic">' + escapeHTML(team.topic) + '</p>' +
        '<div class="team-progress" role="img" aria-label="산출물 ' + team.done + '개 중 ' + team.total + '개 제출">' +
          '<span style="width:' + percent + '%"></span>' +
        '</div>' +
        '<div class="team-foot">' +
          '<p class="team-count">산출물 ' + team.done + '/' + team.total + ' · 팀원 ' + team.members + '명</p>' +
          link +
        '</div>' +
      '</article>';
  }

  /* ---------- 등장 모션 ---------- */
  const observer = ('IntersectionObserver' in window)
    ? new IntersectionObserver(function (entries) {
        entries.forEach(function (entry, i) {
          if (!entry.isIntersecting) return;
          const delay = Math.min(i, 7) * 45;
          setTimeout(function () { entry.target.classList.add('is-in'); }, delay);
          observer.unobserve(entry.target);
        });
      }, { threshold: .12, rootMargin: '0px 0px -40px 0px' })
    : null;

  /* ---------- 목록 렌더링 ---------- */
  function render() {
    const keyword = currentKeyword.trim().toLowerCase();

    const list = WEEKS.filter(function (item) {
      const typeOK = currentFilter === 'all' || item.type === currentFilter;
      if (!typeOK) return false;
      if (!keyword) return true;

      const haystack = [item.week, item.title, item.desc, item.badge]
        .concat(item.tags).join(' ').toLowerCase();
      return haystack.indexOf(keyword) !== -1;
    });

    grid.innerHTML = list.map(cardTemplate).join('');
    emptyState.hidden = list.length !== 0;

    Array.from(grid.children).forEach(function (card) {
      if (observer) observer.observe(card);
      else card.classList.add('is-in');
    });
  }

  /* ---------- 이벤트 연결 ---------- */
  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      chips.forEach(function (c) { c.classList.remove('is-active'); });
      chip.classList.add('is-active');
      currentFilter = chip.dataset.filter;
      render();
    });
  });

  let timer = null;
  searchInput.addEventListener('input', function (e) {
    clearTimeout(timer);
    const value = e.target.value;
    timer = setTimeout(function () {
      currentKeyword = value;
      render();
    }, 140);
  });

  /* ---------- 초기 실행 ---------- */
  render();
  teamGrid.innerHTML = TEAMS.map(teamTemplate).join('');
})();
