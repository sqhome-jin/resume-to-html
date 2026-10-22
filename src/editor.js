import { escapeHTML, getSections, validateResume } from './resume.js';
import { translate } from './i18n.js';

const standardSectionIds = ['profile', 'workExperiences', 'educations', 'skills', 'languages', 'socialProfiles'];

export function getEditorSections(data, locale = 'zh-CN') {
  const sections = getSections(data, locale);
  for (const custom of data.customSections || []) {
    const id = `custom:${custom.externalId ?? custom.id}`;
    if (!sections.some((section) => section.id === id)) sections.push({ id, title: custom.title || translate(locale, 'additional_information') });
  }
  for (const id of standardSectionIds) {
    if (!sections.some((section) => section.id === id)) sections.push({ id, title: translate(locale, `section_${id}`) });
  }
  return [{ id: 'personal', title: translate(locale, 'personal_details') }, ...sections];
}

export function getEditorTarget(data, sectionId, locale = 'zh-CN') {
  if (sectionId.startsWith('custom:')) {
    const section = data.customSections?.find((item) => `custom:${item.externalId ?? item.id}` === sectionId);
    if (!section) throw new Error(translate(locale, 'error_section_not_found'));
    section.items ??= [];
    return { owner: section, key: 'items' };
  }
  if (!standardSectionIds.includes(sectionId) && !getSections(data, locale).some((section) => section.id === sectionId)) throw new Error(translate(locale, 'error_section_not_found'));
  return { owner: data, key: sectionId };
}

export function addEditorEntry(data, sectionId, locale = 'zh-CN') {
  const { owner, key } = getEditorTarget(data, sectionId, locale);
  owner[key] ??= [];
  if (!Array.isArray(owner[key])) throw new Error(translate(locale, 'error_entries_unsupported'));
  const titleKey = { educations: 'school', skills: 'skill', languages: 'language', socialProfiles: 'label' }[sectionId] || 'title';
  const item = { [titleKey]: '', position: Math.max(0, ...owner[key].map((entry) => Number(entry?.position) || 0)) + 1 };
  owner[key].push(item);
  return item;
}

export function addEditorSection(data, externalId, locale = 'zh-CN') {
  data.customSections ??= [];
  const section = { externalId, title: translate(locale, 'new_section'), type: 'advanced', items: [] };
  data.customSections.push(section);
  const id = `custom:${externalId}`;
  data.sectionsOrder ??= getSections(data).map((item) => item.id);
  data.sectionsOrder.push(id);
  return id;
}

const personalFields = [['firstName', 'first_name'], ['lastName', 'last_name'], ['position', 'position'], ['email', 'email', 'email'], ['phoneNumber', 'phone', 'tel'], ['city', 'city'], ['countryName', 'country'], ['address', 'address'], ['postalCode', 'postal_code']];
const dates = [['dateFrom', 'start_date', 'month'], ['dateUntil', 'end_date', 'month']];
const entryFields = {
  workExperiences: [['title', 'position'], ['employer', 'organization'], ['city', 'city'], ...dates],
  educations: [['school', 'school'], ['degree', 'degree'], ['city', 'city'], ...dates],
  skills: [['skill', 'skill'], ['level', 'level']],
  languages: [['language', 'language_name'], ['level', 'level']],
  socialProfiles: [['label', 'label'], ['url', 'url', 'url']]
};

export function createResumeEditor({ dialog, Quill, sanitize, refreshIcons, onPreview, onSave, onCancel, getLocale = () => 'zh-CN' }) {
  const document = dialog.ownerDocument;
  const t = (key) => translate(getLocale(), key);
  let draft;
  let current = 'personal';
  let opener;
  dialog.innerHTML = `<div class="editor-header"><div><span class="eyebrow">${t('editor_eyebrow')}</span><h2>${t('editor_title')}</h2></div><button type="button" class="icon-button" data-action="cancel" title="${t('cancel_changes')}" aria-label="${t('cancel_changes')}"><i data-lucide="x"></i></button></div><div class="editor-navigation"><label for="editor-section">${t('current_section')}</label><div class="editor-section-row"><select id="editor-section"></select><button type="button" class="icon-button" data-action="add-section" title="${t('add_custom_section')}" aria-label="${t('add_custom_section')}"><i data-lucide="list-plus"></i></button></div></div><div id="editor-fields" class="editor-fields"></div><p id="editor-error" class="editor-error" role="alert" hidden></p><footer class="editor-footer"><button type="button" class="button secondary" data-action="cancel">${t('cancel_changes')}</button><button type="button" class="button primary" data-action="save"><i data-lucide="save"></i>${t('save_changes')}</button></footer>`;
  dialog.setAttribute('aria-label', t('editor_title'));
  const content = dialog.querySelector('#editor-fields');
  const navigation = dialog.querySelector('#editor-section');
  const error = dialog.querySelector('#editor-error');
  const field = ([key, label, type = 'text'], item) => `<label class="editor-field"><span>${t(label)}</span><input data-field="${key}" type="${type}" value="${escapeHTML(type === 'month' ? item[key]?.slice(0, 7) : item[key])}" ${key === 'dateUntil' && item.isDateUntilPresent ? 'disabled' : ''}></label>`;
  const richField = (key, label) => `<div class="editor-field editor-field-wide"><span>${t(label)}</span><div class="rich-input" data-rich="${key}" data-label="${escapeHTML(t(label))}"></div></div>`;
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
      const target = current === 'personal' ? draft.avatar : index == null ? getEditorTarget(draft, current, getLocale()).owner : getEditorTarget(draft, current, getLocale()).owner[getEditorTarget(draft, current, getLocale()).key][index];
      const key = node.dataset.rich;
      const source = index == null && current !== 'personal' ? target[getEditorTarget(draft, current, getLocale()).key] : target[key];
      const quill = new Quill(node, { theme: 'snow', formats: ['bold', 'italic', 'underline', 'list', 'link'], modules: { toolbar: [['bold', 'italic', 'underline'], [{ list: 'ordered' }, { list: 'bullet' }], ['link', 'clean']] } });
      quill.clipboard.dangerouslyPasteHTML(sanitize(String(source || '')));
      quill.root.setAttribute('role', 'textbox');
      quill.root.setAttribute('aria-label', node.dataset.label);
      quill.root.setAttribute('aria-multiline', 'true');
      const labels = { bold: t('quill_bold'), italic: t('quill_italic'), underline: t('quill_underline'), link: t('quill_link'), clean: t('quill_clean') };
      node.previousElementSibling.querySelectorAll('button').forEach((button) => {
        const format = [...button.classList].find((name) => name.startsWith('ql-'))?.slice(3);
        const label = format === 'list' ? t(button.value === 'ordered' ? 'ordered_list' : 'bullet_list') : labels[format];
        button.title = label;
        button.setAttribute('aria-label', label);
        button.type = 'button';
      });
      quill.on('text-change', (_delta, _old, sourceType) => {
        if (sourceType !== 'user') return;
        const value = quill.getText().trim() ? sanitize(quill.getSemanticHTML()) : '';
        if (index == null) target[getEditorTarget(draft, current, getLocale()).key] = value;
        else target[key] = value;
        preview();
      });
    });
  }

  function renderFields() {
    if (current === 'personal') {
      const fields = draft.firstName || draft.lastName ? personalFields : [['name', 'full_name'], ...personalFields.slice(2)];
      content.innerHTML = `<div class="editor-field-grid">${fields.map((descriptor) => field(descriptor, draft)).join('')}${field(['photoURL', 'photo_url', 'url'], { photoURL: draft.avatar?.mediumUrl || draft.avatar?.largeUrl || draft.avatar?.originalUrl })}</div>`;
    } else {
      const { owner, key } = getEditorTarget(draft, current, getLocale());
      const custom = current.startsWith('custom:');
      const heading = custom ? `<div class="custom-heading">${field(['sectionTitle', 'section_title'], { sectionTitle: owner.title })}<button type="button" class="icon-button danger-button" data-action="delete-section" title="${t('delete_section')}" aria-label="${t('delete_section')}"><i data-lucide="trash-2"></i></button></div>` : '';
      if (['profile', 'accomplishments', 'publications'].includes(current) || typeof owner[key] === 'string') {
        content.innerHTML = `${heading}${richField(key, 'body')}`;
      } else {
        const items = (owner[key] || []).map((item, index) => ({ item, index })).filter(({ item }) => item && typeof item === 'object').sort((first, second) => (first.item.position ?? 0) - (second.item.position ?? 0));
        content.innerHTML = `${heading}<div class="editor-entries">${items.map(({ item, index }, position) => {
          const descriptors = entryFields[current] || [['title', 'title'], ['employer', 'organization'], ['city', 'city'], ...dates];
          const title = item.title || item.school || item.skill || item.language || item.label || item.name || t('new_item');
          const hasDates = descriptors.some(([name]) => name === 'dateUntil');
          return `<details class="editor-entry" data-index="${index}" ${position === 0 ? 'open' : ''}><summary><span class="entry-number">${String(position + 1).padStart(2, '0')}</span><span class="editor-entry-title">${escapeHTML(title)}</span><i data-lucide="chevron-down"></i></summary><div class="editor-entry-body"><div class="editor-field-grid">${descriptors.map((descriptor) => field(descriptor, item)).join('')}${hasDates ? `<label class="editor-present editor-field-wide"><input type="checkbox" data-field="isDateUntilPresent" ${item.isDateUntilPresent ? 'checked' : ''}>${t('until_present')}</label>` : ''}</div>${current !== 'languages' && current !== 'socialProfiles' ? richField(current === 'skills' ? 'details' : 'description', 'description') : ''}<button type="button" class="editor-delete" data-action="delete-entry"><i data-lucide="trash-2"></i>${t('delete_entry')}</button></div></details>`;
        }).join('')}</div><button type="button" class="button editor-add" data-action="add-entry"><i data-lucide="plus"></i>${t('add_entry')}</button>`;
      }
    }
    mountRich(content);
    refreshIcons();
  }

  function renderNavigation() {
    navigation.innerHTML = getEditorSections(draft, getLocale()).map((section) => `<option value="${escapeHTML(section.id)}">${escapeHTML(section.title)}</option>`).join('');
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
      const { owner, key: sectionKey } = getEditorTarget(draft, current, getLocale());
      if (key === 'sectionTitle') {
        owner.title = value;
        navigation.selectedOptions[0].textContent = value || t('additional_information');
      }
      else {
        const entry = input.closest('[data-index]');
        const item = owner[sectionKey][entry.dataset.index];
        item[key] = value;
        if (['title', 'school', 'skill', 'language', 'label'].includes(key)) entry.querySelector('.editor-entry-title').textContent = value || t('new_item');
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
        validateResume(draft, getLocale());
        onSave(draft);
        dialog.close();
      } catch (issue) { error.textContent = issue.message; error.hidden = false; }
    }
    if (action === 'add-section') { current = addEditorSection(draft, crypto.randomUUID(), getLocale()); renderNavigation(); preview(); content.querySelector('input')?.focus(); }
    if (action === 'delete-section') {
      const removed = current;
      draft.customSections = draft.customSections.filter((section) => `custom:${section.externalId ?? section.id}` !== removed);
      draft.sectionsOrder = (draft.sectionsOrder || []).filter((id) => id !== removed);
      current = 'personal';
      renderNavigation();
      preview();
    }
    if (action === 'add-entry') {
      addEditorEntry(draft, current, getLocale());
      renderFields();
      const entries = content.querySelectorAll('details');
      const added = entries[entries.length - 1];
      added.open = true;
      mountRich(added);
      added.querySelector('input').focus();
      preview();
    }
    if (action === 'delete-entry') {
      const { owner, key } = getEditorTarget(draft, current, getLocale());
      owner[key].splice(Number(button.closest('[data-index]').dataset.index), 1);
      renderFields();
      preview();
    }
  });
  dialog.addEventListener('cancel', (event) => { event.preventDefault(); cancel(); });
  dialog.addEventListener('close', () => { document.body.classList.remove('editing'); opener?.focus(); });
  return {
    setLocale(_locale, replacementDraft) {
      if (replacementDraft) {
        draft = structuredClone(replacementDraft);
        current = 'personal';
        error.hidden = true;
      }
      dialog.setAttribute('aria-label', t('editor_title'));
      dialog.querySelector('.editor-header .eyebrow').textContent = t('editor_eyebrow');
      dialog.querySelector('.editor-header h2').textContent = t('editor_title');
      dialog.querySelector('.editor-header [data-action="cancel"]').title = t('cancel_changes');
      dialog.querySelector('.editor-header [data-action="cancel"]').setAttribute('aria-label', t('cancel_changes'));
      dialog.querySelector('.editor-navigation label').textContent = t('current_section');
      dialog.querySelector('.editor-navigation [data-action="add-section"]').title = t('add_custom_section');
      dialog.querySelector('.editor-navigation [data-action="add-section"]').setAttribute('aria-label', t('add_custom_section'));
      dialog.querySelector('.editor-footer [data-action="cancel"]').textContent = t('cancel_changes');
      dialog.querySelector('.editor-footer [data-action="save"]').lastChild.textContent = t('save_changes');
      if (draft) renderNavigation();
    },
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