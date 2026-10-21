import DOMPurify from 'dompurify';
import { createIcons, Download, Printer, FileJson2, Upload, PanelsTopLeft, Rows3, CircleCheck, RotateCcw, ShieldCheck, Minus, Plus, Scan, Check, Pencil, X, ListPlus, Save, Trash2, ChevronDown } from 'lucide';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import sample from '../examples/resume.sample.json';
import { escapeHTML, getSections, renderResume, validateResume } from './resume.js';
import { createResumeEditor } from './editor.js';
import { supportedLocales, translate } from './i18n.js';
import './style.css';
import './resume.css';
import './editor.css';
import resumeCSS from './resume.css?raw';

const icons = { Download, Printer, FileJson2, Upload, PanelsTopLeft, Rows3, CircleCheck, RotateCcw, ShieldCheck, Minus, Plus, Scan, Check, Pencil, X, ListPlus, Save, Trash2, ChevronDown };
const element = (id) => document.getElementById(id);
const defaults = () => ({ layout: 'executive', color: '#3d625b', photo: true, hidden: [] });
let data = sample;
let options = defaults();
let zoom = 100;
let toastTimer;
let modified = false;
let editorDirty = false;
const savedLocale = (() => {
  try { return localStorage.getItem('resume-to-html-locale'); }
  catch { return null; }
})();
let locale = supportedLocales.some(({ code }) => code === savedLocale) ? savedLocale : 'zh-CN';

function saveLocale(value) {
  try { localStorage.setItem('resume-to-html-locale', value); }
  catch { /* Language selection still works when storage is unavailable. */ }
}

function applyLocale() {
  document.documentElement.lang = locale;
  document.title = translate(locale, 'app_title');
  element('language-select').value = locale;
  document.querySelectorAll('[data-i18n]').forEach((node) => {
    node.textContent = translate(locale, node.dataset.i18n);
  });
  document.querySelectorAll('[data-i18n-title]').forEach((node) => {
    node.title = translate(locale, node.dataset.i18nTitle);
  });
  document.querySelectorAll('[data-i18n-aria-label]').forEach((node) => {
    node.setAttribute('aria-label', translate(locale, node.dataset.i18nAriaLabel));
  });
}

function setFileStatus(key) {
  const status = element('file-status');
  status.dataset.i18n = key;
  status.textContent = translate(locale, key);
}

function notify(message) {
  clearTimeout(toastTimer);
  element('toast').textContent = message;
  element('toast').hidden = false;
  toastTimer = setTimeout(() => { element('toast').hidden = true; }, 4500);
}

function render(resume = data) {
  const paper = element('resume');
  paper.innerHTML = renderResume(resume, { ...options, locale }, DOMPurify.sanitize);
  paper.dataset.layout = options.layout;
  paper.dataset.theme = options.color.slice(1);
  paper.lang = locale;
  paper.style.setProperty('--accent', options.color);
  document.querySelector('.preview-area').style.setProperty('--canvas-accent', options.color);
  const name = [resume.firstName, resume.lastName].filter(Boolean).join(' ') || resume.name;
  element('document-title').innerHTML = `${escapeHTML(name)} <span>/ ${translate(locale, 'resume')}</span>`;
  element('preview-meta').textContent = `${translate(locale, options.layout === 'executive' ? 'layout_executive' : 'layout_classic')} · ${translate(locale, 'continuous_pages')}`;
  const sections = getSections(resume, locale);
  element('section-count').textContent = `${sections.filter((section) => !options.hidden.includes(section.id)).length} / ${sections.length}`;
  paper.querySelector('.resume-avatar')?.addEventListener('error', (event) => { event.target.hidden = true; });
}

function renderControls() {
  element('section-controls').innerHTML = getSections(data, locale).map((section) => `<label class="section-option"><span>${escapeHTML(section.title)}</span><input type="checkbox" value="${escapeHTML(section.id)}" ${options.hidden.includes(section.id) ? '' : 'checked'}><span class="section-check"><i data-lucide="check"></i></span></label>`).join('');
  document.querySelector(`input[name="layout"][value="${options.layout}"]`).checked = true;
  document.querySelector(`input[name="color"][value="${options.color}"]`).checked = true;
  element('photo').checked = options.photo;
  createIcons({ icons });
}

element('import').addEventListener('click', () => element('file-input').click());
element('file-input').addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  try {
    if (file.size > 5 * 1024 * 1024) throw new Error(translate(locale, 'error_file_too_large'));
    const imported = validateResume(JSON.parse(await file.text()), locale);
    renderResume(imported, { ...options, locale }, DOMPurify.sanitize);
    if (modified && !window.confirm(translate(locale, 'confirm_import_unsaved'))) return;
    data = imported;
    modified = false;
    setFileStatus('json_document');
    options.hidden = [];
    element('filename').textContent = file.name;
    renderControls();
    render();
    notify(translate(locale, 'status_imported'));
  } catch (error) {
    notify(error instanceof SyntaxError ? translate(locale, 'error_invalid_json') : error.message);
  } finally { event.target.value = ''; }
});

document.querySelectorAll('input[name="layout"], input[name="color"]').forEach((input) => input.addEventListener('change', () => {
  options[input.name] = input.value;
  render();
}));
element('photo').addEventListener('change', (event) => { options.photo = event.target.checked; render(); });
element('section-controls').addEventListener('change', (event) => {
  const input = event.target;
  options.hidden = input.checked ? options.hidden.filter((id) => id !== input.value) : [...options.hidden, input.value];
  render();
});
element('reset').addEventListener('click', () => { options = defaults(); setZoom(100); renderControls(); render(); notify(translate(locale, 'status_reset')); });

function setZoom(value) {
  zoom = Math.max(60, Math.min(140, value));
  element('resume').style.zoom = zoom / 100;
  element('zoom-label').textContent = `${zoom}%`;
  element('zoom-out').disabled = zoom === 60;
  element('zoom-in').disabled = zoom === 140;
}
element('zoom-out').addEventListener('click', () => setZoom(zoom - 10));
element('zoom-in').addEventListener('click', () => setZoom(zoom + 10));
element('zoom-fit').addEventListener('click', () => setZoom(100));
element('print').addEventListener('click', () => {
  const name = [data.firstName, data.lastName].filter(Boolean).join(' ') || data.name;
  const date = new Date();
  const dateLabel = [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-');
  const filename = [name, data.position, 'Resume', dateLabel].filter((part) => typeof part === 'string' && part.trim()).join(' - ').replace(/[\\/:*?"<>|\u0000-\u001f]/g, '-');
  const printWindow = window.open('about:blank', '_blank');
  if (!printWindow) {
    notify(translate(locale, 'popup_blocked'));
    return;
  }
  printWindow.opener = null;
  printWindow.document.open();
  printWindow.document.write(`<!doctype html><html lang="${locale}"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escapeHTML(filename)}</title><style>${resumeCSS}\nbody{margin:0;background:#fff;padding:24px}.resume-paper{margin:auto}@media print{body{padding:0}}</style></head><body>${element('resume').outerHTML}</body></html>`);
  printWindow.document.close();
  printWindow.addEventListener('afterprint', () => printWindow.close(), { once: true });
  printWindow.focus();
  printWindow.print();
});

function download(content, filename, type) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const editor = createResumeEditor({
  dialog: element('resume-editor'), Quill, sanitize: DOMPurify.sanitize, getLocale: () => locale,
  refreshIcons: () => createIcons({ icons }),
  onPreview: (draft) => { editorDirty = true; render(draft); },
  onSave: (draft) => {
    data = draft;
    modified = true;
    editorDirty = false;
    options.hidden = options.hidden.filter((id) => getSections(data, locale).some((section) => section.id === id));
    setFileStatus('status_modified');
    renderControls();
    render();
    notify(translate(locale, 'status_applied'));
  },
  onCancel: () => { editorDirty = false; render(); }
});
element('edit').addEventListener('click', () => editor.open(data));
element('download-json').addEventListener('click', () => {
  const filename = element('filename').textContent.replace(/\.json$/i, '') + '.edited.json';
  download(JSON.stringify(data, null, 2) + '\n', filename, 'application/json;charset=utf-8');
  modified = false;
  setFileStatus('status_json_downloaded');
  notify(translate(locale, 'status_json_exported'));
});
element('language-select').addEventListener('change', (event) => {
  locale = event.target.value;
  saveLocale(locale);
  applyLocale();
  renderControls();
  render();
  editor.setLocale(locale);
});
window.addEventListener('beforeunload', (event) => {
  if (!modified && !editorDirty) return;
  event.preventDefault();
  event.returnValue = '';
});

element('export').addEventListener('click', () => {
  const name = [data.firstName, data.lastName].filter(Boolean).join(' ') || data.name;
  const html = `<!doctype html>\n<html lang="${locale}"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escapeHTML(name)} - ${translate(locale, 'resume')}</title><style>${resumeCSS}\nbody{margin:0;background:#eceeed;padding:32px 16px}.resume-paper{margin:auto}@media print{body{padding:0;background:white}}</style></head><body><article class="resume-paper" data-layout="${options.layout}" data-theme="${options.color.slice(1)}" lang="${locale}" style="--accent:${options.color}">${renderResume(data, { ...options, locale }, DOMPurify.sanitize)}</article></body></html>`;
  download(html, `${String(name).replace(/[^\p{L}\p{N}_-]/gu, '-')}-resume.html`, 'text/html;charset=utf-8');
  notify(translate(locale, 'status_html_exported'));
});

applyLocale();
renderControls();
render();