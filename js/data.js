/* ==========================================================================
   data.js — 주차별 강의교안 데이터 / 팀 현황 데이터
   이 파일만 수정하면 index.html 의 카드 목록이 자동으로 갱신된다.

   [주차 카드 속성]
   id     : 정렬 및 식별용 문자열
   week   : 카드 상단에 표기되는 라벨 (예: 'WEEK 01')
   type   : 'class' (수업) | 'eval' (평가) — 필터와 색상 인디케이터에 사용
   badge  : 우측 상단 배지 문구
   title  : 카드 제목
   desc   : 한 줄 설명 (~한다 체로 통일)
   tags   : 키워드 배열 (검색 대상에 포함됨)
   thumb  : assets/img 안의 파일명
   link   : 강의교안 페이지 경로. 빈 문자열이면 '준비 중' 상태로 표시된다.
   ========================================================================== */

const WEEKS = [
  {
    id: 'ot',
    week: 'OT',
    type: 'class',
    badge: '안내',
    title: '오리엔테이션',
    desc: '성적 평가기준과 수업 운영 방식, 팀 편성 절차를 확인한다',
    tags: ['성적 평가기준', '수업 운영', '팀 편성'],
    thumb: '1.png',
    link: 'pages/ot.html'
  },
  {
    id: 'w01',
    week: 'WEEK 01',
    type: 'class',
    badge: '수업',
    title: '생성형 AI 이해와 활용 지도',
    desc: '생성형 AI의 동작 원리와 대표 도구의 차이를 비교해 활용 범위를 잡는다',
    tags: ['LLM', '멀티모달', '도구 비교'],
    thumb: '2.png',
    link: 'pages/week01.html'
  },
  {
    id: 'w02',
    week: 'WEEK 02',
    type: 'class',
    badge: '수업',
    title: '프롬프트 엔지니어링 기초',
    desc: '역할·맥락·제약·출력형식 네 요소로 프롬프트를 구조화한다',
    tags: ['Role', 'Context', 'Output Format'],
    thumb: '3.png',
    link: ''
  },
  {
    id: 'w03',
    week: 'WEEK 03',
    type: 'class',
    badge: '수업',
    title: '팀 AI 비서 문제 정의',
    desc: '핵심 사용자와 반복 업무를 분석해 팀 프로젝트 주제를 확정한다',
    tags: ['Persona', 'Pain Point', '문제 정의서'],
    thumb: '4.png',
    link: ''
  },
  {
    id: 'w04',
    week: 'WEEK 04',
    type: 'class',
    badge: '수업',
    title: '사용자 리서치와 시나리오 설계',
    desc: '인터뷰와 데스크 리서치로 비서가 처리할 과업 시나리오를 설계한다',
    tags: ['User Research', 'Task Flow', '시나리오'],
    thumb: '5.png',
    link: ''
  },
  {
    id: 'w05',
    week: 'WEEK 05',
    type: 'class',
    badge: '수업',
    title: '프롬프트 설계 심화',
    desc: 'Few-shot과 Chain-of-Thought로 출력 품질과 일관성을 끌어올린다',
    tags: ['Few-shot', 'CoT', 'Self-Consistency'],
    thumb: '6.png',
    link: ''
  },
  {
    id: 'w06',
    week: 'WEEK 06',
    type: 'class',
    badge: '수업',
    title: '데이터 수집과 문서 정제',
    desc: '비서가 참조할 원본 문서를 수집하고 청크 단위로 정제한다',
    tags: ['Data Cleaning', 'Chunking', '메타데이터'],
    thumb: '7.png',
    link: ''
  },
  {
    id: 'w07',
    week: 'WEEK 07',
    type: 'class',
    badge: '수업',
    title: 'RAG 구조와 지식베이스 구축',
    desc: '검색 증강 생성 구조를 이해하고 팀 지식베이스를 연결한다',
    tags: ['RAG', 'Embedding', 'Knowledge Base'],
    thumb: '8.png',
    link: ''
  },
  {
    id: 'w08',
    week: 'WEEK 08',
    type: 'eval',
    badge: '평가',
    title: '중간고사 및 중간 점검',
    desc: '1~7주차 개념을 필기로 평가하고 팀 산출물 진행 상태를 점검한다',
    tags: ['중간고사', '산출물 점검'],
    thumb: '9.png',
    link: ''
  },
  {
    id: 'w09',
    week: 'WEEK 09',
    type: 'class',
    badge: '수업',
    title: '노코드 챗봇 구현',
    desc: '노코드 도구로 팀 AI 비서의 첫 동작 버전을 만든다',
    tags: ['No-code', 'Chatbot', 'MVP'],
    thumb: '10.png',
    link: ''
  },
  {
    id: 'w10',
    week: 'WEEK 10',
    type: 'class',
    badge: '수업',
    title: '이미지·영상 생성 활용',
    desc: '비서의 결과물을 시각 자산으로 확장하는 멀티모달 실습을 진행한다',
    tags: ['Image Gen', 'Video Gen', '브랜딩'],
    thumb: '11.png',
    link: ''
  },
  {
    id: 'w11',
    week: 'WEEK 11',
    type: 'class',
    badge: '수업',
    title: '자동화 워크플로 연결',
    desc: '외부 도구와 비서를 연결해 반복 업무를 자동으로 처리한다',
    tags: ['Workflow', 'API', '자동화'],
    thumb: '12.png',
    link: ''
  }
];

/* --------------------------------------------------------------------------
   팀 현황 데이터
   done  : 제출 완료한 산출물 수
   total : 전체 산출물 단계 수
   url   : 배포 URL. 빈 문자열이면 '배포 전' 으로 표시된다.
   -------------------------------------------------------------------------- */

const TEAMS = [
  { name: '1팀', topic: '학과 공지 요약 비서', members: 5, done: 4, total: 12, url: '' },
  { name: '2팀', topic: '취업 자소서 첨삭 비서', members: 5, done: 3, total: 12, url: '' },
  { name: '3팀', topic: '스터디 일정 조율 비서', members: 4, done: 5, total: 12, url: '' },
  { name: '4팀', topic: '강의 노트 정리 비서', members: 5, done: 2, total: 12, url: '' }
];
