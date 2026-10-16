import { escapeHTML, getSections, validateResume } from './resume.js';

const standardSections = { profile: '个人简介', workExperiences: '工作经历', educations: '教育经历', skills: '技能', languages: '语言', socialProfiles: '社交链接' };

export function getEditorSections(data) {
  const sections = getSections(data);
  for (const custom of data.customSections || []) {
    const id = `custom:${custom.externalId ?? custom.id}`;
    if (!sections.some((section) => section.id === id)) sections.push({ id, title: custom.title || 'Additional information' });
  }
  for (const [id, title] of Object.entries(standardSections)) {
    if (!sections.some((section) => section.id === id)) sections.push({ id, title });
  }
  return [{ id: 'personal', title: '个人资料' }, ...sections];
}

export function getEditorTarget(data, sectionId) {
  if (sectionId.startsWith('custom:')) {
    const section = data.customSections?.find((item) => `custom:${item.externalId ?? item.id}` === sectionId);
    if (!section) throw new Error('找不到该章节。');
    section.items ??= [];
    return { owner: section, key: 'items' };
  }
  if (!Object.hasOwn(standardSections, sectionId) && !getSections(data).some((section) => section.id === sectionId)) throw new Error('找不到该章节。');
  return { owner: data, key: sectionId };
}

export function addEditorEntry(data, sectionId) {
  const { owner, key } = getEditorTarget(data, sectionId);
  owner[key] ??= [];
  if (!Array.isArray(owner[key])) throw new Error('该章节不支持添加条目。');
  const titleKey = { educations: 'school', skills: 'skill', languages: 'language', socialProfiles: 'label' }[sectionId] || 'title';
  const item = { [titleKey]: '', position: Math.max(0, ...owner[key].map((entry) => Number(entry?.position) || 0)) + 1 };
  owner[key].push(item);
  return item;
}

export function addEditorSection(data, externalId) {
  data.customSections ??= [];
  const section = { externalId, title: 'New section', type: 'advanced', items: [] };
  data.customSections.push(section);
  const id = `custom:${externalId}`;
  data.sectionsOrder ??= getSections(data).map((item) => item.id);
  data.sectionsOrder.push(id);
  return id;
}

const personalFields = [['firstName', '名'], ['lastName', '姓'], ['position', '职位'], ['email', '邮箱', 'email'], ['phoneNumber', '电话', 'tel'], ['city', '城市'], ['countryName', '国家 / 地区'], ['address', '地址'], ['postalCode', '邮编']];
const dates = [['dateFrom', '开始时间', 'month'], ['dateUntil', '结束时间', 'month']];
const entryFields = {
  workExperiences: [['title', '职位'], ['employer', '公司'], ['city', '城市'], ...dates],
  educations: [['school', '学校'], ['degree', '学位 / 专业'], ['city', '城市'], ...dates],
  skills: [['skill', '技能'], ['level', '熟练程度']],
  languages: [['language', '语言'], ['level', '熟练程度']],
  socialProfiles: [['label', '名称'], ['url', '链接', 'url']]
};

export function createResumeEditor({ dialog, Quill, sanitize, refreshIcons, onPreview, onSave, onCancel }) {
  const document = dialog.ownerDocument;
  let draft;
  let current = 'personal';
  let opener;
  dialog.innerHTML = `<div class="editor-header"><div><span class="eyebrow">RESUME EDITOR</span><h2>编辑简历</h2></div><button type="button" class="icon-button" data-action="cancel" title="取消修改" aria-label="取消修改"><i data-lucide="x"></i></button></div><div class="editor-navigation"><label for="editor-section">当前章节</label><div class="editor-section-row"><select id="editor-section"></select><button type="button" class="icon-button" data-action="add-section" title="添加自定义章节" aria-label="添加自定义章节"><i data-lucide="list-plus"></i></button></div></div><div id="editor-fields" class="editor-fields"></div><p id="editor-error" class="editor-error" role="alert" hidden></p><footer class="editor-footer"><button type="button" class="button secondary" data-action="cancel">取消修改</button><button type="button" class="button primary" data-action="save"><i data-lucide="save"></i>保存修改</button></footer>`;
  const content = dialog.querySelector('#editor-fields');
  const navigation = dialog.querySelector('#editor-section');
  const error = dialog.querySelector('#editor-error');
  const field = ([key, label, type = 'text'], item) => `<label class="editor-field"><span>${label}</span><input data-field="${key}" type="${type}" value="${escapeHTML(type === 'month' ? item[key]?.slice(0, 7) : item[key])}" ${key === 'dateUntil' && item.isDateUntilPresent ? 'disabled' : ''}></label>`;
  const richField = (key, label) => `<div class="editor-field editor-field-wide"><span>${label}</span><div class="rich-input" data-rich="${key}" data-label="${label}"></div></div>`;
  const preview = () => {
    error.hidden = true;
    try { onPreview(draft); }
    catch (issue) { error.textContent = issue.message; error.hidden = false; }
  };

  function mountRich(container) {
    container.querySelectorAll('[data-rich]').forEach((node) => {
      if (node.dataset.mounted || (node.closest('details') && !node.closest('details').open)) return;
      node.dataset.mounted = 'true';
      const index = node.closest('[data-index]')?.dataset.index;
      const target = current === 'personal' ? draft.avatar : index == null ? getEditorTarget(draft, current).owner : getEditorTarget(draft, current).owner[getEditorTarget(draft, current).key][index];
      const key = node.dataset.rich;
      const source = index == null && current !== 'personal' ? target[getEditorTarget(draft, current).key] : target[key];
      const quill = new Quill(node, { theme: 'snow', formats: ['bold', 'italic', 'underline', 'list', 'link'], modules: { toolbar: [['bold', 'italic', 'underline'], [{ list: 'ordered' }, { list: 'bullet' }], ['link', 'clean']] } });
      quill.clipboard.dangerouslyPasteHTML(sanitize(String(source || '')));
      quill.root.setAttribute('role', 'textbox');
      quill.root.setAttribute('aria-label', node.dataset.label);
      quill.root.setAttribute('aria-multiline', 'true');
      const labels = { bold: '加粗', italic: '斜体', underline: '下划线', link: '链接', clean: '清除格式' };
      node.previousElementSibling.querySelectorAll('button').forEach((button) => {
        const format = [...button.classList].find((name) => name.startsWith('ql-'))?.slice(3);
        const label = format === 'list' ? button.value === 'ordered' ? '编号列表' : '项目列表' : labels[format];
        button.title = label;
        button.setAttribute('aria-label', label);
        button.type = 'button';
      });
      quill.on('text-change', (_delta, _old, sourceType) => {
        if (sourceType !== 'user') return;
        const value = quill.getText().trim() ? sanitize(quill.getSemanticHTML()) : '';
        if (index == null) target[getEditorTarget(draft, current).key] = value;
        else target[key] = value;
        preview();
      });
    });
  }

  function renderFields() {
    if (current === 'personal') {
      const fields = draft.firstName || draft.lastName ? personalFields : [['name', '姓名'], ...personalFields.slice(2)];
      content.innerHTML = `<div class="editor-field-grid">${fields.map((descriptor) => field(descriptor, draft)).join('')}${field(['photoURL', '头像地址', 'url'], { photoURL: draft.avatar?.mediumUrl || draft.avatar?.largeUrl || draft.avatar?.originalUrl })}</div>`;
    } else {
      const { owner, key } = getEditorTarget(draft, current);
      const custom = current.startsWith('custom:');
      const heading = custom ? `<div class="custom-heading">${field(['sectionTitle', '章节名称'], { sectionTitle: owner.title })}<button type="button" class="icon-button danger-button" data-action="delete-section" title="删除章节" aria-label="删除章节"><i data-lucide="trash-2"></i></button></div>` : '';
      if (['profile', 'accomplishments', 'publications'].includes(current) || typeof owner[key] === 'string') {
        content.innerHTML = `${heading}${richField(key, '正文')}`;
      } else {
        const items = (owner[key] || []).map((item, index) => ({ item, index })).filter(({ item }) => item && typeof item === 'object').sort((first, second) => (first.item.position ?? 0) - (second.item.position ?? 0));
        content.innerHTML = `${heading}<div class="editor-entries">${items.map(({ item, index }, position) => {
          const descriptors = entryFields[current] || [['title', '标题'], ['employer', '机构'], ['city', '城市'], ...dates];
          const title = item.title || item.school || item.skill || item.language || item.label || item.name || '新条目';
          const hasDates = descriptors.some(([name]) => name === 'dateUntil');
          return `<details class="editor-entry" data-index="${index}" ${position === 0 ? 'open' : ''}><summary><span class="entry-number">${String(position + 1).padStart(2, '0')}</span><span class="editor-entry-title">${escapeHTML(title)}</span><i data-lucide="chevron-down"></i></summary><div class="editor-entry-body"><div class="editor-field-grid">${descriptors.map((descriptor) => field(descriptor, item)).join('')}${hasDates ? `<label class="editor-present editor-field-wide"><input type="checkbox" data-field="isDateUntilPresent" ${item.isDateUntilPresent ? 'checked' : ''}>至今</label>` : ''}</div>${current !== 'languages' && current !== 'socialProfiles' ? richField(current === 'skills' ? 'details' : 'description', '描述') : ''}<button type="button" class="editor-delete" data-action="delete-entry"><i data-lucide="trash-2"></i>删除条目</button></div></details>`;
        }).join('')}</div><button type="button" class="button editor-add" data-action="add-entry"><i data-lucide="plus"></i>添加条目</button>`;
      }
    }
    mountRich(content);
    refreshIcons();
  }

  function renderNavigation() {
    navigation.innerHTML = getEditorSections(draft).map((section) => `<option value="${escapeHTML(section.id)}">${escapeHTML(standardSections[section.id] || section.title)}</option>`).join('');
    navigation.value = current;
    renderFields();
  }

  function cancel() {
    onCancel();
    dialog.close();
  }

  navigation.addEventListener('change', () => { current = navigation.value; error.hidden = true; renderFields(); content.scrollTop = 0; });
  content.addEventListener('toggle', (event) => { if (event.target.open) mountRich(event.target); }, true);
  content.addEventListener('input', (event) => {
    const input = event.target;
    if (!input.dataset.field) return;
    const key = input.dataset.field;
    const value = input.type === 'checkbox' ? input.checked : input.type === 'month' ? input.value ? `${input.value}-01` : null : input.value;
    if (current === 'personal') {
      if (key === 'photoURL') draft.avatar = { ...draft.avatar, blank: !value, mediumUrl: value || null, largeUrl: null, originalUrl: null, thumbUrl: null };
      else {
        draft[key] = value;
        if (['firstName', 'lastName'].includes(key)) draft.name = [draft.firstName, draft.lastName].filter(Boolean).join(' ');
      }
    } else {
      const { owner, key: sectionKey } = getEditorTarget(draft, current);
      if (key === 'sectionTitle') {
        owner.title = value;
        navigation.selectedOptions[0].textContent = value || 'Additional information';
      }
      else {
        const entry = input.closest('[data-index]');
        const item = owner[sectionKey][entry.dataset.index];
        item[key] = value;
        if (['title', 'school', 'skill', 'language', 'label'].includes(key)) entry.querySelector('.editor-entry-title').textContent = value || '新条目';
        if (key === 'isDateUntilPresent') entry.querySelector('[data-field="dateUntil"]').disabled = value;
      }
    }
    preview();
  });
  dialog.addEventListener('click', (event) => {
    const button = event.target.closest('[data-action]');
    if (!button) return;
    const action = button.dataset.action;
    if (action === 'cancel') cancel();
    if (action === 'save') {
      try {
        for (const input of content.querySelectorAll('input')) {
          if (!input.checkValidity()) {
            const details = input.closest('details');
            if (details) details.open = true;
            input.reportValidity();
            return;
          }
        }
        validateResume(draft);
        onSave(draft);
        dialog.close();
      } catch (issue) { error.textContent = issue.message; error.hidden = false; }
    }
    if (action === 'add-section') { current = addEditorSection(draft, crypto.randomUUID()); renderNavigation(); preview(); content.querySelector('input')?.focus(); }
    if (action === 'delete-section') {
      const removed = current;
      draft.customSections = draft.customSections.filter((section) => `custom:${section.externalId ?? section.id}` !== removed);
      draft.sectionsOrder = (draft.sectionsOrder || []).filter((id) => id !== removed);
      current = 'personal';
      renderNavigation();
      preview();
    }
    if (action === 'add-entry') {
      addEditorEntry(draft, current);
      renderFields();
      const entries = content.querySelectorAll('details');
      const added = entries[entries.length - 1];
      added.open = true;
      mountRich(added);
      added.querySelector('input').focus();
      preview();
    }
    if (action === 'delete-entry') {
      const { owner, key } = getEditorTarget(draft, current);
      owner[key].splice(Number(button.closest('[data-index]').dataset.index), 1);
      renderFields();
      preview();
    }
  });
  dialog.addEventListener('cancel', (event) => { event.preventDefault(); cancel(); });
  dialog.addEventListener('close', () => { document.body.classList.remove('editing'); opener?.focus(); });
  return {
    open(data) {
      draft = structuredClone(data);
      current = 'personal';
      opener = document.activeElement;
      error.hidden = true;
      renderNavigation();
      document.body.classList.add('editing');
      dialog.showModal();
    }
  };
}