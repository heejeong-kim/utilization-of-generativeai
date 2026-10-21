# 생성형 AI 활용 · 강의교안 웹뷰

2026학년도 2학기 「생성형 AI 활용」 과목의 강의교안 인덱스 페이지임.
빌드 도구 없이 정적 파일만으로 동작하므로 GitHub Pages에 그대로 올려 사용함.

---

## 1. 디렉토리 구조

```
utilization-of-generativeai/
├── index.html              # 강의 목록 인덱스 (루트에는 이 파일과 README.md만 둠)
├── README.md
├── assets/
│   ├── img/                # 주차별 썸네일 1.png ~ 15.png, 본문 이미지 N_n.png (예: 9_1.png)
│   └── icon/               # 파비콘, 아이콘 등
├── css/
│   ├── base.css            # 디자인 토큰, 리셋, 타이포그래피
│   ├── layout.css          # 헤더, 히어로, 섹션, 그리드, 푸터, 반응형
│   ├── components.css      # 버튼, 카드, 칩, 검색, 팀 카드
│   └── motion.css          # 앰비언트 모션, 스크롤 등장, 호버 모션
├── js/
│   ├── data.js             # 주차 데이터 + 팀 데이터 (내용 수정은 여기서만)
│   ├── main.js             # 렌더링, 검색, 필터, 모션 제어
│   ├── backtop.js          # 맨 위로 버튼 (전 페이지 공통)
│   └── team.js             # 팀 현황 페이지 (Apps Script 연동)
└── pages/
    ├── lecture-ot.html, lecture-week01~15.html   # 주차별 강의교안
    ├── weekNN-full.enc.js  # 잠금 교안의 암호화 데이터 (9~15주차, 직접 수정 금지)
    ├── 10week_wireframe.html · 10week_prototype.html · 10week_mvp.html
    ├── 11week_prototype.html · 12week_prototype.html · 13week_prototype.html
    │                       # 샘플 프로젝트 '캠퍼스 공강 플래너' 주차별 작업본 (ver0.3 → ver0.8)
    ├── 10week_data/        # 샘플 앱용 학교 공간·공유 플래닝 데이터 (JSON)
    └── team-project.html   # 팀 현황 페이지
```

---

## 2. 적용된 모션

| 구간 | 모션 | 비고 |
|---|---|---|
| 히어로 배경 | 보라·민트 오브 3개가 21~32초 주기로 표류함 | 스크롤 없이 상시 구동됨 |
| 히어로 배경 | 그리드가 24초 주기로 흐르고 민트 스캔 라인이 9초마다 훑고 지나감 | 상시 구동됨 |
| 히어로 제목 | `팀 프로젝트` 그라디언트가 9초 주기로 흐름 | 상시 구동됨 |
| 학기 흐름 패널 | 01~04 단계가 2.6초마다 순환 점등됨 | 상시 구동됨 |
| 히어로 전체 | 마우스 위치에 따라 텍스트와 패널이 반대 방향으로 미세 이동함 | 마우스 반응 |
| 헤더 | 스크롤 진행률 표시줄이 하단에 채워짐 | 스크롤 반응 |
| 전 섹션 | 뷰포트 진입 시 순차 페이드업 (카드는 55ms 간격 스태거) | 스크롤 반응 |
| 호버 | 로고 회전, 네비 밑줄 좌→우 드로잉, 버튼 광택 스윕과 화살표 이동 | 마우스 오버 |
| 호버 | 카드 리프트·썸네일 확대·상단 인디케이터 확장·제목 색 전환·태그 반전 | 마우스 오버 |
| 호버 | 팀 카드 리프트, 진행률 바 광택 통과 | 마우스 오버 |

`prefers-reduced-motion: reduce` 설정 시 모든 애니메이션이 자동으로 꺼짐.

---

## 3. 썸네일 넣는 방법

`assets/img/` 폴더에 `1.png` ~ `15.png` 로 넣으면 주차 번호와 1:1로 매칭됨.
(1주차 → `1.png`, 15주차 → `15.png`)

- 권장 비율 16:10, 권장 크기 800×500px 이상
- 이미지가 없으면 카드에 주차 라벨이 들어간 그라디언트 자리표시가 대신 노출되므로 레이아웃이 깨지지 않음
- 파일명을 바꾸려면 `js/data.js` 의 `thumb` 값만 수정함

---

## 4. 주차 내용 수정 방법

커리큘럼명과 두 줄 요약은 Notion 「주차별 커리큘럼」 DB의 `커리큘럼`, `목표 및 내용` 기준으로 작성되어 있음.
수정은 `js/data.js` 의 `WEEKS` 배열에서만 함.

```js
{
  no: 16, week: 'WEEK 16', type: 'class', // 'class'(수업) | 'demo'(발표) | 'eval'(평가)
  badge: '수업',
  title: '커리큘럼명',
  summary: ['첫 번째 줄 요약', '두 번째 줄 요약'],  // 반드시 2개
  tags: ['키워드1', '키워드2'],
  thumb: '16.png',
  link: 'pages/week16.html'   // 빈 문자열이면 '준비 중'으로 표시됨
}
```

---

## 5. 팀 현황 수정 방법

`js/data.js` 의 `TEAMS` 배열에 행을 추가하면 됨. 팀 수 제한 없이 그리드에 자동으로 이어짐.

```js
{ cls: 'B', name: 'B-3팀', topic: '주제', members: 5, done: 3, total: 12, url: '' }
```

- `cls` 값은 `'A' | 'B' | 'C'` 이며 분반 필터 버튼과 연결됨
- `done / total` 로 진행률 바가 계산됨
- `url` 이 비면 '배포 전'으로 표시됨
- 섹션 하단 **팀 현황 전체 보기** CTA 주소는 같은 파일 맨 아래 `TEAM_STATUS_URL` 에서 바꿈

---

## 6. 디자인 규칙

| 항목 | 값 |
|---|---|
| 기준 해상도 | 1520px (`--shell-max`) |
| 폰트 | IBM Plex Sans KR (본문) / IBM Plex Mono (라벨·숫자) |
| 기본 폰트 사이즈 | 18px (`--fs-base`) |
| 소형 사이즈 | 13.5px (`--fs-xs`) — 배지, 태그, 요약, 캡션, 버튼에만 사용함 |
| 주조색 | 보라 `#6C4CF1` / 심층 배경 `#1C1540` |
| 강조색 | 민트 `#23D6AE` |

사이즈를 조정할 때는 개별 요소가 아니라 `css/base.css` 상단 토큰 값을 바꿈.

---

## 7. 강의교안 비밀번호 잠금

9~15주차 강의교안은 비밀번호를 입력해야 열람할 수 있음.

- `lecture-weekNN.html` 은 비밀번호 입력 화면만 담고 있고, 교안 본문(샘플 포함)은 `weekNN-full.enc.js` 에 암호화되어 있음
- 암호화 방식: AES-256-GCM + PBKDF2-SHA256(600,000회) + gzip, 브라우저에서 입력한 비밀번호로 복호화함
- **비밀번호는 어떤 파일에도 저장하지 않음** — 저장소·README·주석에 비밀번호를 적지 않음
- 교안을 수정할 때는 Notion을 먼저 수정하고, 로컬에서 복호화 → 수정 → 다시 암호화한 뒤 `lecture-weekNN.html` 과 `weekNN-full.enc.js` 를 함께 올림
- 샘플 앱 파일(`10week_*`, `11~13week_prototype.html`)은 별도 페이지라 잠금 대상이 아님

---

## 8. 샘플 프로젝트 버전 흐름

| 주차 | 파일 | 버전 | 내용 |
|---|---|---|---|
| 10 | `10week_wireframe.html` | ver0.3 | HTML 와이어프레임 (점검 후 수정본) |
| 10 | `10week_prototype.html` | ver0.4 | 프로토타입 (고정 예시 데이터) |
| 10 | `10week_mvp.html` | ver0.5 | 최소 기능 구현 (가상 장소 자료로 실제 계산, AI 연결 전) |
| 11 | `11week_prototype.html` | ver0.6 | 고도화 (실제 학교 공간 14곳, 하단 탭, 내 플래닝 저장·공유) |
| 12 | `12week_prototype.html` | ver0.7 | 사용자 테스트 후 개선 (저장 위치 안내, 공유 데이터 범위 표시) |
| 13 | `13week_prototype.html` | ver0.8 | 최종 QA 결함 수정 (운영정보 '확인 필요' 표시, 카드 글자 확대) |

---

## 9. 2026-10-21 업데이트 — GitHub에 올릴 파일

**반드시 올림**

- `pages/lecture-week09.html` ~ `lecture-week15.html` (7개)
- `pages/week09-full.enc.js` ~ `week15-full.enc.js` (7개)
- `pages/10week_wireframe.html`, `10week_prototype.html`, `10week_mvp.html`, `11week_prototype.html`, `12week_prototype.html`, `13week_prototype.html` (6개)
- `pages/10week_data/school.json`, `pages/10week_data/shared-plans.json`
- `assets/img/9_1.png` ~ `9_7.png`, `10_1.png` ~ `10_6.png` (13개)
- `js/data.js` (9~15주차 카드 링크 연결)
- `README.md`

**함께 올림 (수정본)**

- `index.html`, `js/main.js`, `js/backtop.js`, `js/team.js`
- `pages/lecture-ot.html`, `pages/lecture-week01.html` ~ `lecture-week08.html`, `pages/team-project.html`

**올리지 않음**

- `.DS_Store`, `assets/.DS_Store`, `.claude/`, `outputs/`, `scripts/` 신규 파일, `assets/pdf/`(공개 여부 확인 후)

---

## 10. 로컬 확인 및 배포

```bash
python3 -m http.server 5500
# http://localhost:5500 접속
```

GitHub Pages: Settings → Pages → Source `Deploy from a branch` → Branch `main` / `/ (root)`

---

## 11. 다음 작업

- [x] 주차별 교안 페이지 `lecture-week01~15.html` 작성
- [x] `js/data.js` 의 `link` 값 채우기
- [ ] `assets/img/11_1.png`, `11_2.png` 추가 (11주차 본문 이미지 누락)
- [ ] 샘플 앱 파일 잠금 여부 결정
- [ ] `TEAM_STATUS_URL` 을 실제 팀 현황 보드 주소로 교체
