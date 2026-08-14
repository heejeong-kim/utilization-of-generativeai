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
│   ├── img/                # 주차별 썸네일 1.png ~ 12.png
│   └── icon/               # 파비콘, 아이콘 등
├── css/
│   ├── base.css            # 디자인 토큰, 리셋, 타이포그래피
│   ├── layout.css          # 헤더, 히어로, 섹션, 그리드, 푸터, 반응형
│   └── components.css      # 버튼, 카드, 칩, 검색, 팀 카드
├── js/
│   ├── data.js             # 주차 데이터 + 팀 데이터 (내용 수정은 여기서만)
│   └── main.js             # 렌더링, 검색, 필터, 등장 모션
└── pages/                  # 주차별 강의교안 페이지 (ot.html, week01.html …)
```

---

## 2. 썸네일 넣는 방법

`assets/img/` 폴더에 아래 이름으로 넣으면 카드에 자동 반영됨.

| 카드 | 파일명 | 카드 | 파일명 |
|---|---|---|---|
| OT | `1.png` | WEEK 06 | `7.png` |
| WEEK 01 | `2.png` | WEEK 07 | `8.png` |
| WEEK 02 | `3.png` | WEEK 08 | `9.png` |
| WEEK 03 | `4.png` | WEEK 09 | `10.png` |
| WEEK 04 | `5.png` | WEEK 10 | `11.png` |
| WEEK 05 | `6.png` | WEEK 11 | `12.png` |

- 권장 비율은 16:10, 권장 크기는 800×500px 이상임
- 이미지가 없으면 카드에 주차 라벨이 들어간 그라디언트 자리표시가 대신 노출되므로 작업 중에도 레이아웃이 깨지지 않음
- 파일명을 바꾸고 싶으면 `js/data.js` 의 `thumb` 값만 수정함

---

## 3. 주차 내용 수정 방법

`js/data.js` 의 `WEEKS` 배열만 수정하면 됨. 항목을 추가하면 4열 그리드에 자동으로 이어짐.

```js
{
  id: 'w12',
  week: 'WEEK 12',
  type: 'class',            // 'class'(수업) | 'eval'(평가)
  badge: '수업',
  title: '프로토타입 테스트',
  desc: '사용자 테스트로 비서의 응답 품질을 검증한다',
  tags: ['User Test', '개선안'],
  thumb: '13.png',
  link: 'pages/week12.html' // 빈 문자열이면 '준비 중'으로 표시됨
}
```

팀 현황은 같은 파일의 `TEAMS` 배열에서 수정함. `done / total` 값으로 진행률 바가 계산됨.

---

## 4. 디자인 규칙

| 항목 | 값 |
|---|---|
| 기준 해상도 | 1520px (`--shell-max`) |
| 폰트 | IBM Plex Sans KR (본문) / IBM Plex Mono (라벨·숫자) |
| 기본 폰트 사이즈 | 18px (`--fs-base`) |
| 소형 사이즈 | 13.5px (`--fs-xs`) — 배지, 태그, 캡션, 버튼에만 사용함 |
| 주조색 | 보라 `#6C4CF1` / 심층 배경 `#1C1540` |
| 강조색 | 민트 `#23D6AE` |

폰트 사이즈를 조정할 때는 개별 요소를 고치지 않고 `css/base.css` 상단의 토큰 값을 바꿈.

---

## 5. 로컬에서 확인하는 방법

`index.html` 을 브라우저로 바로 열어도 동작함. 경로 문제 없이 확인하려면 간단한 서버를 띄움.

```bash
python3 -m http.server 5500
# http://localhost:5500 접속
```

---

## 6. GitHub Pages 배포

1. 저장소 루트에 전체 폴더 내용을 그대로 업로드함
2. Settings → Pages → Source 를 `Deploy from a branch` 로 설정함
3. Branch 는 `main`, 폴더는 `/ (root)` 로 지정하고 저장함
4. 1~2분 후 `https://heejeong-kim.github.io/utilization-of-generativeai/` 에서 확인함

---

## 7. 다음 작업

- [ ] `pages/ot.html` — 성적 평가기준·수업 운영 안내 (좌측 주차 선택 + 목차 사이드바 구조)
- [ ] `pages/week01.html` — 주차별 교안 템플릿 확정 후 나머지 주차 복제
- [ ] `assets/img/` 썸네일 12종 업로드
- [ ] `assets/icon/favicon.png` 추가 및 `index.html` 에 링크 연결
