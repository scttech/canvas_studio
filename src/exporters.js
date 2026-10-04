// Non-SVG exports, share links and local persistence.

export function toMarkdown(doc) {
  const out = [`# ${doc.title || 'Untitled ' + doc.def.name}`, ''];
  const meta = [doc.subtitle, doc.author, doc.date, doc.version && `v${doc.version}`].filter(Boolean);
  if (meta.length) out.push(`_${meta.join(' · ')}_`, '');
  out.push(`*${doc.def.name}*`, '');
  for (const sec of doc.def.sections) {
    const s = doc.sections[sec.key];
    out.push(`## ${sec.title}`);
    if (s && s.items.length) s.items.forEach((i) => out.push(`- ${i.text}`));
    else out.push('_(empty)_');
    out.push('');
  }
  return out.join('\n');
}

// base64url of UTF-8 text, for #c=... share links
export function encodeShare(text) {
  const bytes = new TextEncoder().encode(text);
  let bin = '';
  bytes.forEach((b) => { bin += String.fromCharCode(b); });
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function decodeShare(s) {
  try {
    const b64 = s.replace(/-/g, '+').replace(/_/g, '/');
    const bin = atob(b64 + '='.repeat((4 - (b64.length % 4)) % 4));
    return new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)));
  } catch {
    return null;
  }
}

const KEY = 'canvas-studio.draft.v1';

export function saveDraft(text) {
  try { localStorage.setItem(KEY, text); } catch { /* storage unavailable */ }
}

export function loadDraft() {
  try { return localStorage.getItem(KEY); } catch { return null; }
}

export function download(filename, blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function slug(s) {
  return String(s || 'canvas').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'canvas';
}
