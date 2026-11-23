import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import { runInNewContext } from 'node:vm';

const readPage = (path) => readFile(new URL(`../public/${path}`, import.meta.url), 'utf8');
const searchModule = () => import('../public/support-map/assets/wmm-support-search.mjs');
const today = '2026-11-23';

const notices = [
  { id: 'seoul', title: '서울 스마트 제조 지원', audience: ['business'], category: 'technology', region: '서울', start: '2026-11-01', end: '2026-11-23' },
  { id: 'nationwide', title: '전국 제조 기업 지원', audience: ['business', 'solo'], category: 'technology', region: '전국', start: '2026-11-21', end: '2026-11-28', summary: 'Smart Factory 설비 지원' },
  { id: 'busan', title: '부산 공정 개선 지원', audience: ['business'], category: 'technology', region: '부산', start: '2026-11-11', end: '2026-11-29' },
  { id: 'local-business', title: '서울 온라인 판매 지원', audience: ['solo'], category: 'technology', region: '서울', start: '2026-11-13', end: '2026-11-30' },
  { id: 'export', title: '서울 수출 준비 지원', audience: ['business'], category: 'export', region: '서울', start: '2026-11-01', end: '2026-11-30' },
  { id: 'expired', title: '서울 제조 지원', audience: ['business'], category: 'technology', region: '서울', start: '2026-11-01', end: '2026-11-22' },
  { id: 'future', title: '서울 제조 지원 추가 모집', audience: ['business'], category: 'technology', region: '서울', start: '2026-11-24', end: '2026-12-01' },
  { id: 'undated', title: '서울 제조 지원 일정 확인', audience: ['business'], category: 'technology', region: '서울', start: '', end: '' },
];

const ids = (results) => results.map(({ id }) => id);

test('homepage provides search, preparation, resources, consultation and existing service destinations', async () => {
  const home = await readPage('home.html');
  const sectionIds = new Set(Array.from(home.matchAll(/\sid=["']([^"']+)["']/g), ([, id]) => id));
  const linkPaths = new Set(Array.from(home.matchAll(/\shref=["']([^"']+)["']/g), ([, href]) => href.split(/[?#]/, 1)[0]));
  for (const id of ['support-search', 'preparation', 'resources', 'request']) {
    assert.ok(sectionIds.has(id), `missing #${id} section`);
  }
  for (const path of ['/membership/', '/radar-entry/', '/home-details']) {
    assert.ok(linkPaths.has(path), `missing link to ${path}`);
  }
});

test('legacy gateway consultation links preserve the language and fragment', async () => {
  const gateway = await readPage('index.html');
  const script = Array.from(gateway.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi), ([, code]) => code)
    .find((code) => code.includes('location.replace') && code.includes('location.hash'));
  assert.ok(script, 'legacy fragment should be handled in the gateway');

  const redirects = [];
  const location = { hash: '#request', search: '?lang=en', replace: (href) => redirects.push(href) };
  runInNewContext(script, { location });
  assert.equal(redirects.length, 1);

  const destination = new URL(redirects[0], 'https://www.wmm-hoa.com');
  assert.match(destination.pathname, /^\/home(?:\.html)?$/);
  assert.equal(destination.search, '?lang=en');
  assert.equal(destination.hash, '#request');
});

test('notice status uses an inclusive application period and rejects unusable dates', async () => {
  const { noticeStatus } = await searchModule();
  assert.equal(noticeStatus({ start: today, end: today }, today), 'open');
  assert.equal(noticeStatus({ start: '2026-11-01', end: '2026-11-22' }, today), 'closed');
  assert.equal(noticeStatus({ start: '2026-11-24', end: '2026-12-01' }, today), 'upcoming');
  assert.equal(noticeStatus({ start: '', end: '' }, today), 'unknown');
  assert.equal(noticeStatus({ start: '2026-11-01', end: '2026-11-31' }, today), 'unknown');
  assert.equal(noticeStatus({ start: '2026-11-30', end: '2026-11-01' }, today), 'unknown');
});

test('notice search omits expired, future and undated results by default', async () => {
  const { findNotices } = await searchModule();
  assert.deepEqual(ids(findNotices(notices, {}, today)).sort(), ['busan', 'export', 'local-business', 'nationwide', 'seoul']);
  assert.deepEqual(ids(findNotices(notices, { status: 'closed' }, today)), ['expired']);
  assert.equal(findNotices(notices, { status: 'all' }, today).length, notices.length);
  assert.deepEqual(findNotices([], {}, today), []);
});

test('notice search handles Korean keywords, case and whitespace, and missing matches', async () => {
  const { findNotices } = await searchModule();
  assert.deepEqual(ids(findNotices(notices, { query: '수출 준비' }, today)), ['export']);
  assert.deepEqual(ids(findNotices(notices, { query: '  smart factory  ' }, today)), ['nationwide']);
  assert.deepEqual(findNotices(notices, { query: '일치하지 않는 사업' }, today), []);
});

test('notice filters combine audience, category and region while retaining nationwide programmes', async () => {
  const { findNotices } = await searchModule();
  const filters = { audience: 'business', category: 'technology', region: '서울' };
  assert.deepEqual(ids(findNotices(notices, filters, today)).sort(), ['nationwide', 'seoul']);
});
