import { UserRound, BriefcaseBusiness, FolderKanban, GraduationCap, Languages, Compass, Mail, Phone, MapPin, CalendarDays, Building2, Award, BookOpen, Link, FileText, HeartHandshake } from 'lucide';

export const escapeHTML = (value = '') => String(value ?? '').replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);

const iconHTML = ([, , nodes]) => `<svg class="resume-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${nodes.map(([tag, attributes]) => `<${tag} ${Object.entries(attributes).map(([key, value]) => `${key}="${escapeHTML(value)}"`).join(' ')}></${tag}>`).join('')}</svg>`;

function sectionAppearance(section) {
  const appearances = {
    profile: [UserRound, 'teal', 'profile'], workExperiences: [BriefcaseBusiness, 'blue', 'experience'],
    educations: [GraduationCap, 'blue', 'education'], languages: [Languages, 'amber', 'languages'],
    skills: [Compass, 'rose', 'skills'], socialProfiles: [Link, 'teal', 'links'],
    licensesAndCertifications: [Award, 'amber', 'certifications'], awards: [Award, 'amber', 'awards'],
    publications: [BookOpen, 'blue', 'publications'], volunteerings: [HeartHandshake, 'rose', 'volunteering']
  };
  if (appearances[section.id]) return appearances[section.id];
  if (section.id.startsWith('custom:')) {
    if (section.sidebar || /skill|expertise|技能|专长/i.test(section.title)) return [Compass, 'rose', 'skills'];
    if (/project|项目/i.test(section.title)) return [FolderKanban, 'amber', 'projects'];
    if (/certif|award|证书|认证|奖/i.test(section.title)) return [Award, 'teal', 'certifications'];
  }
  return [FileText, 'teal', 'additional'];
}

export function validateResume(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('请选择有效的简历 JSON 对象。');
  if (![data.firstName, data.lastName, data.name].some((value) => typeof value === 'string' && value.trim())) throw new Error('简历需要包含 firstName、lastName 或 name。');
  for (const key of ['sectionsOrder', 'customSections', 'workExperiences', 'educations', 'skills', 'languages', 'socialProfiles', 'courses', 'internships', 'activities', 'references', 'awards', 'licensesAndCertifications', 'hobbies', 'volunteerings', 'conferences', 'affiliations', 'technicalProficiencyCategories']) {
    if (data[key] != null && !Array.isArray(data[key])) throw new Error(`${key} 必须是数组。`);
  }
  for (const section of data.customSections || []) {
    if (!section || typeof section !== 'object' || (section.items != null && !Array.isArray(section.items))) throw new Error('自定义章节格式无效。');
  }
  return data;
}

const titles = { profile: 'Profile', workExperiences: 'Employment history', educations: 'Education', skills: 'Skills', languages: 'Languages', socialProfiles: 'Links', accomplishments: 'Accomplishments', publications: 'Publications', courses: 'Courses', internships: 'Internships', activities: 'Activities', references: 'References', awards: 'Awards', licensesAndCertifications: 'Certifications', hobbies: 'Interests', volunteerings: 'Volunteering', conferences: 'Conferences', affiliations: 'Affiliations', technicalProficiencyCategories: 'Technical proficiency' };
const ordered = (items) => [...items].filter((item) => item && typeof item === 'object').sort((first, second) => (first.position ?? 0) - (second.position ?? 0));

export function getSections(data) {
  const sections = Object.entries(titles).map(([id, title]) => ({ id, title: data.sectionTitles?.[id] || title, items: data[id], sidebar: ['educations', 'skills', 'languages', 'socialProfiles'].includes(id) }));
  for (const custom of data.customSections || []) sections.push({ id: `custom:${custom.externalId ?? custom.id}`, title: custom.title || 'Additional information', items: custom.items, sidebar: /^(skills?|expertise|competenc)/i.test(custom.title || '') });
  const order = [...new Set([...(data.sectionsOrder || []), ...sections.map((section) => section.id)])];
  return order.map((id) => sections.find((section) => section.id === id)).filter(Boolean).filter((section) => Array.isArray(section.items) ? section.items.some((item) => item && (item.title || item.skill || item.language || item.school || item.label || item.name || item.description || item.url)) : typeof section.items === 'string' && section.items.replace(/<[^>]*>/g, '').trim());
}

export function safeURL(value, protocols = ['https:', 'http:']) {
  try {
    const url = new URL(value);
    return protocols.includes(url.protocol) ? url.href : '';
  } catch { return ''; }
}

export function dateRange(item) {
  const format = (value, hideMonth) => {
    if (!value || !/^\d{4}-\d{2}(?:-\d{2})?$/.test(value)) return '';
    const date = new Date(`${value.slice(0, 7)}-01T00:00:00Z`);
    return Number.isNaN(date.getTime()) ? '' : new Intl.DateTimeFormat('en', { year: 'numeric', ...(hideMonth ? {} : { month: 'short' }), timeZone: 'UTC' }).format(date);
  };
  return [format(item.dateFrom, item.isMonthFromHidden), item.isDateUntilPresent ? 'Present' : format(item.dateUntil, item.isMonthUntilHidden)].filter(Boolean).join(' - ');
}

export function renderResume(data, options, sanitize) {
  validateResume(data);
  const rich = (html) => sanitize(String(html || ''), { ALLOWED_TAGS: ['p', 'br', 'strong', 'b', 'em', 'i', 'u', 'ul', 'ol', 'li', 'a', 'h1', 'h2', 'h3', 'h4', 'blockquote'], ALLOWED_ATTR: ['href', 'title'], ALLOW_DATA_ATTR: false });
  const sectionHTML = (section) => {
    const [symbol, tone, kind] = sectionAppearance(section);
    const body = typeof section.items === 'string' ? `<div class="rich-text">${rich(section.items)}</div>` : ordered(section.items).map((item, index) => {
      const title = item.title || item.skill || item.language || item.school || item.label || item.name || item.url;
      if (!title && !item.description) return '';
      const subtitle = [item.employer, item.degree, item.city].filter(Boolean).map(escapeHTML).join(' · ');
      const subtitleIcon = item.employer ? Building2 : item.degree || item.school ? GraduationCap : MapPin;
      const level = item.level ? String(item.level).replaceAll('_', ' ') : '';
      const url = safeURL(item.url);
      return `<article class="resume-entry">${kind === 'projects' ? `<span class="project-number" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span>` : ''}<div class="entry-heading"><h3>${url ? `<a href="${escapeHTML(url)}" rel="noreferrer">${escapeHTML(title)}</a>` : escapeHTML(title)}</h3>${dateRange(item) ? `<span class="entry-date">${iconHTML(CalendarDays)}<span>${escapeHTML(dateRange(item))}</span></span>` : ''}</div>${subtitle ? `<div class="entry-subtitle">${iconHTML(subtitleIcon)}<span>${subtitle}</span></div>` : ''}${level && !(section.id === 'skills' && data.hideSkillLevel) ? `<div class="entry-level">${escapeHTML(level)}</div>` : ''}${item.description || item.details ? `<div class="rich-text">${rich(item.description || item.details)}</div>` : ''}</article>`;
    }).join('');
    return `<section class="resume-section" data-section="${escapeHTML(section.id)}" data-tone="${tone}" data-kind="${kind}"><h2><span class="section-symbol">${iconHTML(symbol)}</span><span>${escapeHTML(section.title)}</span></h2>${body}</section>`;
  };
  const sections = getSections(data).filter((section) => !options.hidden?.includes(section.id));
  const name = [data.firstName, data.lastName].filter(Boolean).join(' ') || data.name;
  const photo = options.photo !== false && !data.avatar?.blank && safeURL(data.avatar?.mediumUrl || data.avatar?.largeUrl || data.avatar?.originalUrl);
  const email = typeof data.email === 'string' && /^[^\s@]+@[^\s@]+$/.test(data.email) ? `<a href="mailto:${escapeHTML(encodeURIComponent(data.email))}">${escapeHTML(data.email)}</a>` : '';
  const contacts = [[Mail, email], [Phone, data.phoneNumber && escapeHTML(data.phoneNumber)], [MapPin, [data.city, data.countryName].filter(Boolean).map(escapeHTML).join(', ')]].filter(([, value]) => value);
  const initials = String(name).trim().split(/\s+/).slice(0, 2).map((part) => Array.from(part)[0]).join('').toLocaleUpperCase();
  const profile = sections.filter((section) => section.id === 'profile');
  const remaining = sections.filter((section) => section.id !== 'profile');
  return `<header class="resume-header"><div class="identity"><h1>${escapeHTML(name)}</h1>${data.position ? `<p class="resume-position">${escapeHTML(data.position)}</p>` : ''}<div class="resume-contact">${contacts.map(([symbol, contact]) => `<span class="contact-item">${iconHTML(symbol)}<span>${contact}</span></span>`).join('')}</div></div>${photo ? `<img class="resume-avatar" src="${escapeHTML(photo)}" alt="${escapeHTML(name)}" referrerpolicy="no-referrer">` : `<div class="resume-monogram" aria-hidden="true">${escapeHTML(initials)}</div>`}</header><div class="resume-body">${profile.map(sectionHTML).join('')}<div class="resume-columns"><main class="resume-main">${remaining.filter((section) => !section.sidebar).map(sectionHTML).join('')}</main><aside class="resume-aside">${remaining.filter((section) => section.sidebar).map(sectionHTML).join('')}</aside></div></div>`;
}