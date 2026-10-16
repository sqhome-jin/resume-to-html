import DOMPurify from 'dompurify';
import { createIcons, Download, Printer, FileJson2, Upload, PanelsTopLeft, Rows3, CircleCheck, RotateCcw, ShieldCheck, Minus, Plus, Scan, Check, Pencil, X, ListPlus, Save, Trash2, ChevronDown } from 'lucide';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import sample from '../examples/resume.sample.json';
import { escapeHTML, getSections, renderResume, validateResume } from './resume.js';
import { createResumeEditor } from './editor.js';
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

function notify(message) {
  clearTimeout(toastTimer);
  element('toast').textContent = message;
  element('toast').hidden = false;
  toastTimer = setTimeout(() => { element('toast').hidden = true; }, 4500);
}

function render(resume = data) {
  const paper = element('resume');
  paper.innerHTML = renderResume(resume, options, DOMPurify.sanitize);
  paper.dataset.layout = options.layout;
  paper.style.setProperty('--accent', options.color);
  const name = [resume.firstName, resume.lastName].filter(Boolean).join(' ') || resume.name;
  element('document-title').innerHTML = `${escapeHTML(name)} <span>/ Resume</span>`;
  element('preview-meta').textContent = `${options.layout === 'executive' ? '商务双栏' : '经典单栏'} · 连续页面`;
  const sections = getSections(resume);
  element('section-count').textContent = `${sections.filter((section) => !options.hidden.includes(section.id)).length} / ${sections.length}`;
  paper.querySelector('.resume-avatar')?.addEventListener('error', (event) => { event.target.hidden = true; });
}

function renderControls() {
  element('section-controls').innerHTML = getSections(data).map((section) => `<label class="section-option"><span>${escapeHTML(section.title)}</span><input type="checkbox" value="${escapeHTML(section.id)}" ${options.hidden.includes(section.id) ? '' : 'checked'}><span class="section-check"><i data-lucide="check"></i></span></label>`).join('');
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
    if (file.size > 5 * 1024 * 1024) throw new Error('请选择小于 5 MB 的 JSON 文件。');
    const imported = validateResume(JSON.parse(await file.text()));
    renderResume(imported, options, DOMPurify.sanitize);
    if (modified && !window.confirm('当前修改尚未下载为 JSON。仍要导入其他简历吗？')) return;
    data = imported;
    modified = false;
    element('file-status').textContent = 'JSON 文档';
    options.hidden = [];
    element('filename').textContent = file.name;
    renderControls();
    render();
    notify('简历已导入');
  } catch (error) {
    notify(error instanceof SyntaxError ? 'JSON 格式错误，请检查文件。' : error.message);
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
element('reset').addEventListener('click', () => { options = defaults(); setZoom(100); renderControls(); render(); notify('已恢复默认排版'); });

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
element('print').addEventListener('click', () => window.print());

function download(content, filename, type) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const editor = createResumeEditor({
  dialog: element('resume-editor'), Quill, sanitize: DOMPurify.sanitize,
  refreshIcons: () => createIcons({ icons }),
  onPreview: (draft) => { editorDirty = true; render(draft); },
  onSave: (draft) => {
    data = draft;
    modified = true;
    editorDirty = false;
    options.hidden = options.hidden.filter((id) => getSections(data).some((section) => section.id === id));
    element('file-status').textContent = '已修改 · 未下载';
    renderControls();
    render();
    notify('修改已应用');
  },
  onCancel: () => { editorDirty = false; render(); }
});
element('edit').addEventListener('click', () => editor.open(data));
element('download-json').addEventListener('click', () => {
  const filename = element('filename').textContent.replace(/\.json$/i, '') + '.edited.json';
  download(JSON.stringify(data, null, 2) + '\n', filename, 'application/json;charset=utf-8');
  modified = false;
  element('file-status').textContent = 'JSON 已下载';
  notify('修改后的 JSON 已导出');
});
window.addEventListener('beforeunload', (event) => {
  if (!modified && !editorDirty) return;
  event.preventDefault();
  event.returnValue = '';
});

element('export').addEventListener('click', () => {
  const name = [data.firstName, data.lastName].filter(Boolean).join(' ') || data.name;
  const html = `<!doctype html>\n<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escapeHTML(name)} - Resume</title><style>${resumeCSS}\nbody{margin:0;background:#eceeed;padding:32px 16px}.resume-paper{margin:auto}@media print{body{padding:0;background:white}}</style></head><body><article class="resume-paper" data-layout="${options.layout}" style="--accent:${options.color}">${renderResume(data, options, DOMPurify.sanitize)}</article></body></html>`;
  download(html, `${String(name).replace(/[^\p{L}\p{N}_-]/gu, '-')}-resume.html`, 'text/html;charset=utf-8');
  notify('HTML 已导出');
});

renderControls();
render();