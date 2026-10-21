import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';
import createDOMPurify from 'dompurify';
import { getSections, renderResume, validateResume, dateRange, safeURL } from '../src/resume.js';
import { getEditorSections, getEditorTarget, addEditorEntry, addEditorSection, createResumeEditor } from '../src/editor.js';
import { supportedLocales, translate } from '../src/i18n.js';

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

test('resume embeds accessible icons and semantic accents without requiring runtime scripts', () => {
  const document = new JSDOM(render()).window.document;
  assert.equal(document.querySelectorAll('.section-symbol svg').length, 6);
  assert.equal(document.querySelectorAll('[data-kind="projects"] .project-number').length, 6);
  assert.equal(document.querySelectorAll('[data-kind="projects"] h3 > .project-number').length, 6);
  assert.equal(document.querySelector('[data-section="workExperiences"]').dataset.tone, 'blue');
  assert.equal(document.querySelector('.resume-monogram').textContent, 'AM');
  assert.equal(document.querySelectorAll('.resume-contact svg').length, 2);
  for (const icon of document.querySelectorAll('svg')) {
    assert.equal(icon.getAttribute('aria-hidden'), 'true');
    assert.ok(icon.querySelector('path, circle, rect, polyline, line'));
    assert.equal(icon.getAttribute('viewBox'), '0 0 24 24');
  }
  assert.equal(document.querySelectorAll('script, [data-lucide]').length, 0);
});

test('employment, education, languages and projects use distinct section tones', () => {
  const resume = {
    name: 'Taylor Morgan',
    workExperiences: [{ title: 'Product Manager' }],
    educations: [{ school: 'Example University' }],
    languages: [{ language: 'English' }],
    customSections: [{ id: 'projects', title: 'Projects', items: [{ title: 'Sample project' }] }]
  };
  const document = new JSDOM(render(resume)).window.document;
  const tones = [
    document.querySelector('[data-section="workExperiences"]').dataset.tone,
    document.querySelector('[data-section="educations"]').dataset.tone,
    document.querySelector('[data-section="languages"]').dataset.tone,
    document.querySelector('[data-kind="projects"]').dataset.tone
  ];
  assert.deepEqual(tones, ['blue', 'coral', 'violet', 'amber']);
  assert.equal(new Set(tones).size, tones.length);
});

test('supported locales translate built-in section names and date ranges', () => {
  assert.deepEqual(supportedLocales.map(({ code }) => code), ['zh-CN', 'en', 'ja', 'ko', 'es', 'fr']);
  assert.equal(translate('ko', 'language'), '언어');
  assert.equal(getSections(data, 'ja').find((section) => section.id === 'workExperiences').title, '職務経歴');
  assert.equal(getSections(data, 'fr').find((section) => section.id === 'languages').title, 'Langues');
  assert.match(dateRange({ dateFrom: '2022-03', isDateUntilPresent: true }, 'ja'), /現在/);
  const document = new JSDOM(render(data, { locale: 'es' })).window.document;
  assert.equal(document.querySelector('[data-section="workExperiences"] h2').textContent.includes('Experiencia laboral'), true);
});

test('recognized custom Skills and Selected Projects titles are localized', () => {
  const resume = {
    name: 'Taylor Morgan',
    customSections: [
      { id: 'skills', title: 'Skills', items: [{ skill: 'Research' }] },
      { id: 'projects', title: 'Selected Projects', items: [{ title: 'Sample project' }] },
      { id: 'notes', title: 'My notes', items: [{ title: 'Keep original' }] }
    ]
  };
  const titles = getSections(resume, 'ja').map((section) => section.title);
  assert.deepEqual(titles, ['スキル', '選択したプロジェクト', 'My notes']);
  const document = new JSDOM(render(resume, { locale: 'fr' })).window.document;
  assert.equal(document.querySelector('[data-section="custom:projects"]').dataset.kind, 'projects');
  assert.ok(document.querySelector('.resume-aside [data-section="custom:skills"]'));
});

test('an open editor refreshes its labels when the locale changes', () => {
  const browser = new JSDOM('<dialog></dialog>').window;
  const dialog = browser.document.querySelector('dialog');
  dialog.showModal = () => dialog.setAttribute('open', '');
  let locale = 'en';
  const editor = createResumeEditor({ dialog, Quill: class {}, sanitize: purifier.sanitize, refreshIcons: () => {}, getLocale: () => locale, onPreview: () => {}, onSave: () => {}, onCancel: () => {} });
  editor.open(data);
  assert.equal(dialog.querySelector('.editor-header h2').textContent, 'Edit resume');
  locale = 'ja';
  editor.setLocale();
  assert.equal(dialog.querySelector('.editor-header h2').textContent, '履歴書を編集');
  assert.equal(dialog.querySelector('#editor-section option').textContent, '個人情報');
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

test('editing a cloned draft preserves source fields and updates rendered entries', () => {
  const draft = structuredClone(data);
  draft.firstName = 'Taylor';
  draft.workExperiences[0].title = 'Edited role';
  const entry = addEditorEntry(draft, 'workExperiences');
  entry.title = 'New role';
  const sectionId = addEditorSection(draft, 'test-section');
  assert.ok(getEditorSections(draft).some((section) => section.id === sectionId));
  const custom = addEditorEntry(draft, sectionId);
  custom.title = 'New project';
  assert.equal(getEditorTarget(draft, sectionId).owner.items[0], custom);
  const html = render(draft);
  assert.match(html, /Taylor/);
  assert.match(html, /Edited role/);
  assert.match(html, /New project/);
  assert.equal(data.firstName, 'Alex');
  assert.equal(data.workExperiences.length, 2);
  assert.equal(draft.workExperiences[0].employer, data.workExperiences[0].employer);
  assert.ok(getEditorSections({ name: 'Test' }).some((section) => section.id === 'educations'));
  assert.throws(() => getEditorTarget(draft, '__proto__'));
});

test('editor form previews drafts, cancels changes and saves without losing unknown fields', () => {
  const browser = new JSDOM('<button>Open</button><dialog></dialog>').window;
  const dialog = browser.document.querySelector('dialog');
  dialog.showModal = () => dialog.setAttribute('open', '');
  dialog.close = () => { dialog.removeAttribute('open'); dialog.dispatchEvent(new browser.Event('close')); };
  const original = { ...structuredClone(data), extraMetadata: { reference: 'preserve-me' } };
  let preview;
  let saved;
  let canceled = false;
  const editor = createResumeEditor({ dialog, sanitize: purifier.sanitize, refreshIcons: () => {}, onPreview: (draft) => { preview = render(draft); }, onSave: (draft) => { saved = draft; }, onCancel: () => { canceled = true; } });
  const change = (key, value) => {
    const input = dialog.querySelector(`[data-field="${key}"]`);
    input.value = value;
    input.dispatchEvent(new browser.Event('input', { bubbles: true }));
  };
  editor.open(original);
  change('firstName', 'Taylor');
  assert.match(preview, /Taylor Morgan/);
  assert.equal(original.firstName, 'Alex');
  dialog.querySelector('[data-action="cancel"]').click();
  assert.equal(canceled, true);
  assert.equal(saved, undefined);
  assert.equal(dialog.open, false);
  editor.open(original);
  assert.equal(dialog.querySelector('[data-field="firstName"]').value, 'Alex');
  change('firstName', 'Jordan');
  dialog.querySelector('[data-action="save"]').click();
  assert.equal(saved.firstName, 'Jordan');
  assert.equal(saved.name, 'Jordan Morgan');
  assert.deepEqual(saved.extraMetadata, original.extraMetadata);
  assert.equal(saved.workExperiences[0].description, original.workExperiences[0].description);
});

test('editor refuses to save a blank name without crashing live preview', () => {
  const browser = new JSDOM('<dialog></dialog>').window;
  const dialog = browser.document.querySelector('dialog');
  dialog.showModal = () => dialog.setAttribute('open', '');
  let saved = false;
  const editor = createResumeEditor({ dialog, sanitize: purifier.sanitize, refreshIcons: () => {}, onPreview: (draft) => render(draft), onSave: () => { saved = true; }, onCancel: () => {} });
  editor.open(data);
  for (const key of ['firstName', 'lastName']) {
    const input = dialog.querySelector(`[data-field="${key}"]`);
    input.value = '';
    input.dispatchEvent(new browser.Event('input', { bubbles: true }));
  }
  dialog.querySelector('[data-action="save"]').click();
  assert.equal(saved, false);
  assert.equal(dialog.open, true);
  assert.equal(dialog.querySelector('#editor-error').hidden, false);
});