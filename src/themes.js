// Canvas themes. All colors are applied as SVG attributes (not CSS) so exported SVG/PNG is self-contained.

export const FONT = "'Segoe UI', system-ui, -apple-system, Roboto, Helvetica, Arial, sans-serif";

const TONES = {
  green: '#2e9d57', blue: '#2f6fed', red: '#d64545', orange: '#e2812b', purple: '#7b52c9',
};

const LIGHT_NOTES = {
  yellow: '#fff3a8', green: '#c9efc4', blue: '#bfe0ff', pink: '#ffd0e0',
  orange: '#ffd9a8', purple: '#e0d0ff', gray: '#e3e6ea', red: '#ffc4c0',
};
const DARK_NOTES = {
  yellow: '#6b5d12', green: '#24542b', blue: '#1f4a78', pink: '#7a2f4a',
  orange: '#7a4a14', purple: '#4d3a85', gray: '#444b55', red: '#7a2a26',
};
const BLUEPRINT_STROKES = {
  yellow: '#ffe66d', green: '#8ff0a4', blue: '#99c1f1', pink: '#f5a9c9',
  orange: '#ffbe6f', purple: '#dc8add', gray: '#d0d7de', red: '#ff938c',
};

export const THEMES = {
  light: { bg: '#ffffff', cell: '#ffffff', stroke: '#33475b', title: '#16222e', text: '#1d2b3a', hint: '#8a97a6', accent: '#2f6fed', sub: '#5b6b7c', mode: 'light' },
  dark: { bg: '#161b22', cell: '#1e252e', stroke: '#6e7d8d', title: '#f0f3f6', text: '#f0f3f6', hint: '#7d8a99', accent: '#58a6ff', sub: '#9aa7b5', mode: 'dark' },
  blueprint: { bg: '#12467a', cell: '#12467a', stroke: '#c9defa', title: '#ffffff', text: '#ffffff', hint: '#8fb4e3', accent: '#ffe66d', sub: '#c9defa', mode: 'blueprint' },
  mono: { bg: '#ffffff', cell: '#ffffff', stroke: '#000000', title: '#000000', text: '#000000', hint: '#888888', accent: '#000000', sub: '#444444', mode: 'mono' },
};

export function getTheme(name) {
  return THEMES[name] || THEMES.light;
}

export function toneColor(tone, theme) {
  return (tone && TONES[tone]) || theme.title;
}

function luminance(hex) {
  const h = hex.replace('#', '');
  const f = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(f.slice(i, i + 2), 16) / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// Returns { fill, stroke, text } for a sticky note of the given color name or #hex.
export function noteStyle(theme, color) {
  const isHex = typeof color === 'string' && color.startsWith('#');
  if (isHex) {
    const dark = luminance(color) < 0.5;
    return { fill: color, stroke: 'none', text: dark ? '#ffffff' : '#1d2b3a' };
  }
  const c = color || 'yellow';
  switch (theme.mode) {
    case 'dark': return { fill: DARK_NOTES[c], stroke: 'none', text: '#f2f2f2' };
    case 'blueprint': return { fill: 'rgba(255,255,255,0.08)', stroke: BLUEPRINT_STROKES[c], text: '#ffffff' };
    case 'mono': return { fill: c === 'gray' ? '#dddddd' : '#f6f6f6', stroke: '#000000', text: '#000000' };
    default: return { fill: LIGHT_NOTES[c], stroke: 'none', text: '#222222' };
  }
}
