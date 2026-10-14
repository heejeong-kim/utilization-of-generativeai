/* ========================================================================== 
   data.js — 주차별 강의교안 데이터 / 팀 현황 데이터
   커리큘럼명과 요약은 Notion '주차별 커리큘럼' DB의 커리큘럼 · 목표 및 내용 기준임

   [주차 카드 속성]
   no      : 주차 번호 (썸네일 파일명과 동일하게 사용됨)
   week    : 카드 상단 라벨
   type    : 'class'(수업) | 'demo'(발표) | 'eval'(평가) — 필터·색상 인디케이터
   badge   : 우측 상단 배지 문구
   title   : 커리큘럼명 (Notion 원문 그대로)
   summary : 두 줄 요약 배열 (반드시 2개 항목)
   tags    : 키워드 배열 (검색 대상에 포함됨)
   thumb   : assets/img 안의 파일명
   link    : 강의교안 페이지 경로. 빈 문자열이면 '준비 중'으로 표시됨
   ========================================================================== */

const WEEKS = [
  {
    no: 0, week: 'OT', type: 'class', badge: '오리엔테이션',
    title: '오리엔테이션 · 강의 소개',
    summary: [
      '수업 운영·평가 기준을 확인한다',
      '팀프로젝트 전체 흐름을 살펴본다'
    ],
    tags: ['오리엔테이션', '성적 평가', '팀프로젝트'],
    thumb: 'ot.png', link: 'pages/lecture-ot.html'
  },
  {
    no: 1, week: 'WEEK 01', type: 'class', badge: '수업',
    title: '생성형 AI 개요',
    summary: [
      '생성형 AI와 LLM 개념을 이해한다',
      '기본 용어와 주요 활용 사례를 익힌다'
    ],
    tags: ['생성형 AI 개요', 'LLM', '수업 운영'],
    thumb: '1.png', link: 'pages/lecture-week01.html'
  },
  {
    no: 2, week: 'WEEK 02', type: 'class', badge: '수업',
    title: 'LLM의 원리와 기본 질문법',
    summary: [
      'LLM 생성 원리와 프롬프트 구조를 익힌다',
      '좋은 질문법과 사실 검증 방법을 연습한다'
    ],
    tags: ['토큰', '프롬프트 구조', '사실 검증'],
    thumb: '2.png', link: ''
  },
  {
    no: 3, week: 'WEEK 03', type: 'class', badge: '수업',
    title: '주요 AI 플랫폼과 확장 기능 탐색',
    summary: [
      '주요 AI 플랫폼의 강점과 차이를 비교한다',
      '검색·파일·확장 기능 활용법을 익힌다'
    ],
    tags: ['플랫폼 비교', 'GPTs', 'Gems'],
    thumb: '3.png', link: 'pages/lecture-week03.html'
  },
  {
    no: 4, week: 'WEEK 04', type: 'class', badge: '수업',
    title: '프로젝트 유형 탐색과 AI 아이데이션',
    summary: [
      '프로젝트 유형별 사용자 가치를 비교한다',
      'AI로 아이디어를 발산하고 후보를 선정한다'
    ],
    tags: ['아이데이션', 'SCAMPER', '평가 매트릭스'],
    thumb: '4.png', link: 'pages/lecture-week04.html'
  },
  {
    no: 5, week: 'WEEK 05', type: 'class', badge: '수업',
    title: '나만의 AI 비서 설계',
    summary: [
      'AI 비서의 역할과 사용 시나리오를 설계한다',
      '지침과 테스트로 응답 품질을 개선한다'
    ],
    tags: ['맞춤형 GPT', '지침 설계', '프로토타입'],
    thumb: '5.png', link: 'pages/lecture-week05.html'
  },
  {
    no: 6, week: 'WEEK 06', type: 'class', badge: '수업',
    title: '멀티모달 AI와 프로젝트 활용',
    summary: [
      '멀티모달 AI 도구의 특징을 이해한다',
      '프로젝트 활용과 저작권 이슈를 점검한다'
    ],
    tags: ['멀티모달', '콘텐츠 생성', '저작권'],
    thumb: '6.png', link: 'pages/lecture-week06.html'
  },
  {
    no: 7, week: 'WEEK 07', type: 'class', badge: '수업',
    title: '프로젝트 방향성 검증과 AI 활용 사례',
    summary: [
      '팀 주제와 문제 정의의 타당성을 점검한다',
      '실현 가능성과 주요 위험을 검토한다'
    ],
    tags: ['기획 검증', '실현 가능성', '위험 검토'],
    thumb: '7.png', link: 'pages/lecture-week07.html'
  },
  {
    no: 8, week: 'WEEK 08', type: 'eval', badge: '평가',
    title: '직무수행능력평가 1차(중간고사)',
    summary: [
      '1~7주차 강의 내용을 평가한다',
      '객관식·주관식 필기시험을 진행한다'
    ],
    tags: ['중간고사', '필기시험'],
    thumb: '8.png', link: 'pages/lecture-week08.html'
  },
  {
    no: 9, week: 'WEEK 09', type: 'class', badge: '수업',
    title: 'MVP 정의와 PRD 작성',
    summary: [
      '핵심 가치와 MVP 범위를 확정한다',
      'PRD와 구현 계획을 작성한다'
    ],
    tags: ['MVP', 'PRD', '기능 우선순위'],
    thumb: '9.png', link: 'pages/lecture-week09.html'
  },
  {
    no: 10, week: 'WEEK 10', type: 'demo', badge: '발표',
    title: '프로젝트 중간 발표와 피드백',
    summary: [
      'MVP와 프로토타입 진행 결과를 발표한다',
      '피드백으로 개선 과제와 계획을 조정한다'
    ],
    tags: ['중간 발표', '피드백', '실행계획'],
    thumb: '10.png', link: 'pages/lecture-week10.html'
  },
  {
    no: 11, week: 'WEEK 11', type: 'class', badge: '수업',
    title: 'AI 기반 슬라이드 제작과 발표 자동화',
    summary: [
      '10주차 MVP의 부족한 기능을 채우고 고도화한다',
      'AI로 최종 프로젝트 보고 슬라이드를 만든다'
    ],
    tags: ['기능 보완', 'PRD 업데이트', '슬라이드 제작'],
    thumb: '11.png', link: 'pages/lecture-week11.html'
  },
  {
    no: 12, week: 'WEEK 12', type: 'class', badge: '수업',
    title: '사용자 테스트와 프로젝트 개선',
    summary: [
      '사용자 테스트로 기능과 품질을 검증한다',
      '개선 내용을 재확인하고 PRD 버전을 올린다'
    ],
    tags: ['사용자 테스트', '품질 평가', 'PRD 버전업'],
    thumb: '12.png', link: 'pages/lecture-week12.html'
  },
  {
    no: 13, week: 'WEEK 13', type: 'class', badge: '수업',
    title: '최종 구현 점검과 발표 준비',
    summary: [
      '최종 QA로 시연 범위를 확정하고 결함을 정리한다',
      '11주차 보고 슬라이드 초안을 최종본으로 마무리한다'
    ],
    tags: ['QA 체크리스트', 'AI 윤리', '리허설'],
    thumb: '13.png', link: 'pages/lecture-week13.html'
  },
  {
    no: 14, week: 'WEEK 14', type: 'demo', badge: '발표',
    title: '최종 프로젝트 발표',
    summary: [
      '최종 결과물과 핵심 기능을 시연한다',
      '4주차부터의 과정 전체를 팀별로 발표하고 평가한다'
    ],
    tags: ['팀별 최종 발표', '시연', '동료평가'],
    thumb: '14.png', link: 'pages/lecture-week14.html'
  },
  {
    no: 15, week: 'WEEK 15', type: 'eval', badge: '평가',
    title: '기말고사: 최종 평가와 프로젝트 회고',
    summary: [
      '7~14주차 핵심 내용을 기말고사로 평가한다',
      '주차별 학습 가이드로 시험을 준비한다'
    ],
    tags: ['기말고사', '학습 가이드', '7~14주차'],
    thumb: '15.png', link: 'pages/lecture-week15.html'
  }
];

/* --------------------------------------------------------------------------
   팀 현황 데이터
   index.html 하단 '팀 현황'은 더미 배열이 아니라 구글 시트에 실제 등록된 팀을
   불러와 표시한다. (main.js 가 config.js 의 SHEET_API_URL 로 조회함)
   -------------------------------------------------------------------------- */

/* 팀 현황 전체 보기 CTA가 연결될 주소 (팀 현황 페이지) */
const TEAM_STATUS_URL = 'https://heejeong-kim.github.io/utilization-of-generativeai/pages/team-project.html';
