/* ==========================================================================
   team-api.gs — 팀프로젝트 Google Sheet 백엔드 (Google Apps Script 웹 앱)

   [보안 구조]
   - 팀 목록 조회(list)는 비밀번호가 맞을 때만 데이터를 돌려준다
     → 웹 앱 URL(…/exec?action=list)을 브라우저로 직접 열어도 데이터가 보이지 않음
   - 비밀번호는 코드가 아니라 "스크립트 속성(Script Properties)"에 저장한다
     → GitHub 저장소·브라우저 소스에 비밀번호가 노출되지 않음
   - 기존 팀 정보 수정(update)도 비밀번호가 있어야 가능하다
   - 신규 팀 등록은 비밀번호 없이 가능하다 (수업 중 등록 흐름 유지)
   - 비밀번호를 10분 동안 20회 이상 틀리면 10분간 조회를 잠근다 (무차별 대입 방지)

   [최초 1회 설정]
   1. 이 코드를 Apps Script 편집기에 통째로 붙여 넣고 저장한다
   2. 상단 함수 선택에서 setupPassword 를 고르고 ▶ 실행한다 (비밀번호 저장)
      - 실행 후 setupPassword 안의 비밀번호 문자열은 지워도 된다
   3. 배포 → 배포 관리 → 기존 배포 ✏️ 편집 → 버전: "새 버전" → 배포
      - 기존 URL이 유지되므로 js/config.js 는 수정하지 않아도 된다
   ========================================================================== */

// 시트 탭 이름
const SHEET_NAME = 'teams';

// 시트 열 순서 (A열부터). 헤더 글자와 무관하게 "열 위치" 기준으로 읽고 쓴다
const HEADERS = [
  'id', 'cls', 'teamName', 'idea',
  'm1id', 'm1name', 'm2id', 'm2name', 'm3id', 'm3name',
  'projectUrl', 'outputUrl', 'updatedAt'
];

// 클라이언트가 수정할 수 있는 필드
const EDITABLE = [
  'cls', 'teamName', 'idea', 'projectUrl', 'outputUrl',
  'm1id', 'm1name', 'm2id', 'm2name', 'm3id', 'm3name'
];

// 무차별 대입 방지 기준
const MAX_FAILS = 20;          // 허용 실패 횟수
const LOCK_SECONDS = 600;      // 잠금 시간(초)

/* ---------- 최초 1회 실행: 비밀번호 저장 ---------- */
function setupPassword() {
  const PASSWORD = 'dongyang';   // ← 원하는 비밀번호로 바꾼 뒤 실행
  PropertiesService.getScriptProperties().setProperty('TEAM_PASSWORD', PASSWORD);
  Logger.log('비밀번호 저장 완료');
}

/* ---------- 공용 유틸 ---------- */
function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  return ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];
}

// 비밀번호 검증 (실패 횟수 누적 → 일정 횟수 초과 시 잠금)
function checkPassword_(password) {
  const saved = PropertiesService.getScriptProperties().getProperty('TEAM_PASSWORD');
  if (!saved) return { ok: false, error: 'not_configured' };

  const cache = CacheService.getScriptCache();
  const fails = Number(cache.get('pw_fails') || 0);
  if (fails >= MAX_FAILS) return { ok: false, error: 'locked' };

  if (String(password || '') === saved) return { ok: true };

  cache.put('pw_fails', String(fails + 1), LOCK_SECONDS);
  return { ok: false, error: 'unauthorized' };
}

// 헤더 행 위치 찾기 (A열 값이 'id'인 행). 없으면 1행을 헤더로 본다
function headerRow_(values) {
  for (let i = 0; i < values.length; i++) {
    if (String(values[i][0]).trim() === 'id') return i;
  }
  return 0;
}

function readTeams_() {
  const values = getSheet_().getDataRange().getValues();
  const start = headerRow_(values) + 1;
  const tz = Session.getScriptTimeZone();
  const teams = [];

  for (let r = start; r < values.length; r++) {
    const row = values[r];
    if (!row[0]) continue;
    const team = {};
    HEADERS.forEach(function (key, c) {
      const v = row[c];
      team[key] = v instanceof Date ? Utilities.formatDate(v, tz, 'yyyy-MM-dd HH:mm:ss') : String(v == null ? '' : v);
    });
    teams.push(team);
  }
  return teams;
}

function clean_(v) {
  // 수식 주입 방지: =, +, -, @ 로 시작하면 앞에 ' 를 붙인다
  let s = String(v == null ? '' : v).trim().slice(0, 500);
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return s;
}

function saveTeam_(input, authorized) {
  const sheet = getSheet_();
  const values = sheet.getDataRange().getValues();
  const hRow = headerRow_(values);
  const tz = Session.getScriptTimeZone();
  const now = Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd HH:mm:ss');

  const id = String(input.id || '');
  const isNew = !id || id.indexOf('local-') === 0;

  // 기존 팀 수정은 비밀번호 필요
  if (!isNew && !authorized) return { ok: false, error: 'unauthorized' };

  if (!clean_(input.teamName)) return { ok: false, error: 'teamName_required' };
  if (['A', 'C'].indexOf(String(input.cls)) === -1) return { ok: false, error: 'invalid_class' };

  const row = HEADERS.map(function (key) {
    if (key === 'updatedAt') return now;
    if (key === 'id') return isNew ? Utilities.getUuid() : id;
    return EDITABLE.indexOf(key) !== -1 ? clean_(input[key]) : '';
  });

  if (isNew) {
    sheet.appendRow(row);
    return { ok: true, id: row[0] };
  }

  for (let r = hRow + 1; r < values.length; r++) {
    if (String(values[r][0]) === id) {
      sheet.getRange(r + 1, 1, 1, HEADERS.length).setValues([row]);
      return { ok: true, id: id };
    }
  }
  return { ok: false, error: 'not_found' };
}

/* ---------- GET: 데이터는 절대 반환하지 않음 ---------- */
function doGet(e) {
  return json_({
    ok: false,
    error: 'forbidden',
    message: '팀 목록은 비밀번호 확인 후 페이지에서만 조회할 수 있다.'
  });
}

/* ---------- POST: list / save ---------- */
function doPost(e) {
  let body = {};
  try {
    body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
  } catch (err) {
    return json_({ ok: false, error: 'bad_request' });
  }

  if (body.action === 'list') {
    const auth = checkPassword_(body.password);
    if (!auth.ok) return json_({ ok: false, error: auth.error });
    return json_({ ok: true, teams: readTeams_() });
  }

  if (body.action === 'save') {
    // 신규 등록은 비밀번호 없이 가능 → 비밀번호를 보낸 경우에만 검증
    const auth = body.password ? checkPassword_(body.password) : { ok: false };
    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      return json_(saveTeam_(body.team || {}, auth.ok));
    } finally {
      lock.releaseLock();
    }
  }

  return json_({ ok: false, error: 'unknown_action' });
}
