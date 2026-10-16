import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';
import createDOMPurify from 'dompurify';
import { getSections, renderResume, validateResume, dateRange, safeURL } from '../src/resume.js';

const data = JSON.parse(readFileSync(new URL('../examples/resume.sample.json', import.meta.url), 'utf8'));
const window = new JSDOM('').window;
const purifier = createDOMPurify(window);
const render = (resume = data, options = {}) => renderResume(resume, options, purifier.sanitize);

test('sample renders all populated sections and every project without empty skills', () => {
  const sections = getSections(data);
  assert.equal(sections.length, 6);
  assert.ok(!sections.some((section) => section.id === 'skills'));
  const document = new JSDOM(render()).window.document;
  assert.equal(document.querySelectorAll('[data-section="custom:sample-projects"] article').length, 6);
  assert.equal(document.querySelectorAll('[data-section="custom:sample-skills"] article').length, 4);
  assert.match(document.body.textContent, /Example Product Studio/);
  assert.match(document.body.textContent, /Research Repository Pilot/);
  assert.match(document.body.textContent, /Upper intermediate/i);
});

test('public sample uses fictional contact details and excludes private metadata', () => {
  assert.equal(data.email, 'alex.morgan@example.com');
  assert.equal(data.avatar.blank, true);
  assert.equal(data.avatar.originalUrl, null);
  const privateKeys = new Set(['userId', 'resumeId', 'renderingToken', 'secureId', 'originalResumeId', 'createdAt', 'updatedAt', 'version', 'jobCardId', 'trOrderId']);
  const inspect = (value) => {
    if (!value || typeof value !== 'object') return;
    for (const [key, nested] of Object.entries(value)) {
      assert.ok(!privateKeys.has(key), `Sample must not contain ${key}`);
      inspect(nested);
    }
  };
  inspect(data);
});

test('imported HTML, names and URLs cannot execute scripts', () => {
  const malicious = { firstName: '<img src=x onerror=alert(1)>', profile: '<script>alert(1)</script><img src=x onerror=alert(1)><a href="javascript:alert(1)">Link</a><strong>Safe</strong>', avatar: { mediumUrl: 'javascript:alert(1)' } };
  const document = new JSDOM(render(malicious)).window.document;
  assert.equal(document.querySelectorAll('script, img, [onerror], [href^="javascript:"]').length, 0);
  assert.equal(document.querySelector('strong').textContent, 'Safe');
  assert.match(document.querySelector('h1').textContent, /<img/);
  assert.equal(safeURL('data:text/html,bad'), '');
});

test('visibility and photo controls affect output', () => {
  const document = new JSDOM(render(data, { hidden: ['profile'], photo: false })).window.document;
  assert.equal(document.querySelector('[data-section="profile"]'), null);
  assert.equal(document.querySelector('.resume-avatar'), null);
});

test('dates, invalid input and missing optional fields are handled', () => {
  assert.equal(dateRange({ dateFrom: '2015-11-01', isDateUntilPresent: true }), 'Nov 2015 - Present');
  assert.equal(dateRange({ dateFrom: 'bad' }), '');
  assert.throws(() => validateResume([]));
  assert.throws(() => validateResume({ name: 'Test', workExperiences: 'invalid' }));
  assert.doesNotThrow(() => render({ name: 'Test' }));
});