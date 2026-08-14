/**
 * 생성형 AI 활용 · 팀 현황 백엔드 (Google Apps Script)
 * js/team.js 의 fetch 규격에 맞춘 Web App API
 *
 * [배포 방법]
 *  1) 구글 시트 > 확장 프로그램 > Apps Script 에 이 코드를 전부 붙여넣는다
 *  2) (선택) 상단 함수 목록에서 setupSheet 를 한 번 실행해 헤더를 만든다
 *  3) 배포 > 새 배포 > 유형: 웹 앱
 *       - 실행 사용자: 나(Me)
 *       - 액세스 권한: 모든 사용자(Anyone)   ← "모든 Google 계정 사용자" 아님
 *  4) 배포 후 나오는 .../exec URL 을 js/config.js 의 SHEET_API_URL 에 넣는다
 *
 *  코드를 수정하면 반드시 "배포 관리 > 편집 > 새 버전"으로 재배포해야 반영된다.
 *
 * [API]
 *  GET  ?action=list                         → { ok:true, teams:[...] }
 *  POST { action:'save', team:{...} }         → { ok:true, id }   (text/plain 본문)
 */

// 데이터가 들어갈 시트 탭 이름 (없으면 자동 생성).
// 기존 시트(예: '시트1')에 저장하고 싶으면 그 탭 이름으로 바꾼다.
const SHEET_NAME = 'teams';

const HEADERS = [
  'id', 'cls', 'teamName', 'idea',
  'm1id', 'm1name', 'm2id', 'm2name', 'm3id', 'm3name',
  'projectUrl', 'outputUrl',
  'updatedAt'
];

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) sh = ss.insertSheet(SHEET_NAME);
  // 헤더가 비어 있으면 자동으로 채운다
  if (sh.getLastRow() === 0) {
    sh.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sh.setFrozenRows(1);
  }
  return sh;
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/** 시트를 팀 객체 배열로 읽는다 (display 값 사용 → 학번 앞자리 0 보존) */
function readTeams_() {
  const sh = getSheet_();
  const lastRow = sh.getLastRow();
  if (lastRow < 2) return [];
  const values = sh.getRange(2, 1, lastRow - 1, HEADERS.length).getDisplayValues();
  return values
    .filter(function (row) { return String(row[0]).trim() !== ''; }) // id 없는 빈 행 제외
    .map(function (row) {
      const team = {};
      HEADERS.forEach(function (key, i) { team[key] = row[i]; });
      return team;
    });
}

/** GET: ?action=list → { ok:true, teams:[...] } */
function doGet(e) {
  try {
    const action = (e && e.parameter && e.parameter.action) || 'list';
    if (action === 'list') return json_({ ok: true, teams: readTeams_() });
    return json_({ ok: false, error: 'unknown action: ' + action });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

/** POST: {action:'save', team:{...}} → { ok:true, id } */
function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000); // 여러 명이 동시에 저장할 때 충돌 방지
    const body = (e && e.postData && e.postData.contents) ? JSON.parse(e.postData.contents) : {};
    if ((body.action || 'save') !== 'save') return json_({ ok: false, error: 'unknown action' });
    const id = saveTeam_(body.team || {});
    return json_({ ok: true, id: id });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

/** 신규는 추가, 기존 id는 해당 행 갱신 */
function saveTeam_(team) {
  const sh = getSheet_();

  // 로컬 임시 id('local-...')나 빈 값이면 서버가 새 id 발급
  let id = String(team.id || '').trim();
  const isNew = (id === '' || id.indexOf('local-') === 0);
  if (isNew) id = Utilities.getUuid();

  const now = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');

  // HEADERS 순서대로 한 행 구성
  const rowObj = Object.assign({}, team, { id: id, updatedAt: now });
  const row = HEADERS.map(function (key) { return rowObj[key] != null ? rowObj[key] : ''; });

  // 기존 행 탐색 (id 열 = 1열)
  const lastRow = sh.getLastRow();
  if (!isNew && lastRow >= 2) {
    const ids = sh.getRange(2, 1, lastRow - 1, 1).getDisplayValues();
    for (let i = 0; i < ids.length; i++) {
      if (String(ids[i][0]) === id) {
        sh.getRange(i + 2, 1, 1, HEADERS.length).setValues([row]);
        return id;
      }
    }
  }

  // 없으면 새 행 추가
  sh.appendRow(row);
  return id;
}

/** 시트를 처음 세팅할 때 한 번 실행 — 헤더 생성/권한 승인 */
function setupSheet() {
  getSheet_();
}
