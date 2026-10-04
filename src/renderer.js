// D3 renderer: draws a layout model into an <svg>. Uses the global `d3` from vendor/d3.min.js.

import { buildModel } from './layout.js';
import { FONT, getTheme, noteStyle, toneColor } from './themes.js';

const SVG_NS = 'http://www.w3.org/2000/svg';

// opts: { focus: Set<string>, animate: bool, onCellClick(key), onCellHover(key|null, event), onTypeHover(bool, event) }
export function render(svgNode, model, theme, opts = {}) {
  const { focus = new Set(), animate = true, onCellClick, onCellHover, onTypeHover } = opts;
  const svg = d3.select(svgNode);
  svg.attr('xmlns', SVG_NS)
    .attr('viewBox', `0 0 ${model.width} ${model.height}`)
    .attr('font-family', FONT);

  svg.selectAll('rect.bg').data([0]).join('rect').attr('class', 'bg')
    .attr('width', model.width).attr('height', model.height).attr('fill', theme.bg);

  // Header
  const h = model.header;
  svg.selectAll('text.title').data([h.title]).join('text').attr('class', 'title')
    .attr('x', 20).attr('y', 36).attr('font-size', 26).attr('font-weight', 700).attr('fill', theme.title).text((d) => d);
  svg.selectAll('text.subtitle').data([h.subtitle]).join('text').attr('class', 'subtitle')
    .attr('x', 20).attr('y', 58).attr('font-size', 14).attr('fill', theme.sub).text((d) => d);
  // The canvas type label under the title explains itself on hover (only when it is the default subtitle).
  const typeHover = !!onTypeHover && h.typeLabel;
  svg.select('text.subtitle')
    .style('cursor', typeHover ? 'help' : null)
    .style('text-decoration', typeHover ? 'underline dotted' : null)
    .on('mouseenter mousemove', typeHover ? (e) => onTypeHover(true, e) : null)
    .on('mouseleave', typeHover ? () => onTypeHover(false) : null);
  svg.selectAll('text.meta').data([h.meta]).join('text').attr('class', 'meta')
    .attr('x', model.width - 20).attr('y', 36).attr('text-anchor', 'end').attr('font-size', 14).attr('fill', theme.sub).text((d) => d);

  // Group bands (Value Map / Customer Profile)
  svg.selectAll('g.group').data(model.groups, (d) => d.title).join(
    (enter) => {
      const g = enter.append('g').attr('class', 'group');
      g.append('rect'); g.append('text');
      return g;
    },
  ).each(function (d) {
    const g = d3.select(this);
    g.select('rect').attr('x', d.x).attr('y', d.y).attr('width', d.w).attr('height', d.h).attr('rx', 6)
      .attr('fill', theme.stroke).attr('opacity', theme.mode === 'light' || theme.mode === 'mono' ? 0.9 : 0.35);
    g.select('text').attr('x', d.x + d.w / 2).attr('y', d.y + d.h / 2 + 5).attr('text-anchor', 'middle')
      .attr('font-size', 13).attr('font-weight', 700).attr('letter-spacing', 2)
      .attr('fill', theme.mode === 'light' || theme.mode === 'mono' ? theme.bg : theme.title).text(d.title);
  });

  // Cells
  const cells = svg.selectAll('g.cell').data(model.cells, (d) => d.key).join(
    (enter) => {
      const g = enter.append('g').attr('class', 'cell').style('cursor', 'pointer');
      g.append('title');
      g.append('rect').attr('class', 'frame');
      g.append('rect').attr('class', 'stripe');
      g.append('circle').attr('class', 'badge');
      g.append('text').attr('class', 'num');
      g.append('text').attr('class', 'ctitle');
      g.append('text').attr('class', 'hint');
      g.append('g').attr('class', 'notes');
      g.append('text').attr('class', 'more');
      return g;
    },
  );

  cells
    .on('click', (_, d) => onCellClick && onCellClick(d.key))
    .on('mouseenter', (e, d) => onCellHover && onCellHover(d.key, e))
    .on('mousemove', (e, d) => onCellHover && onCellHover(d.key, e))
    .on('mouseleave', () => onCellHover && onCellHover(null));

  cells.each(function (d) {
    const g = d3.select(this);
    const focused = focus.has(d.key);
    const tone = toneColor(d.tone, theme);
    // In the app a rich popover replaces the native tooltip; exports keep the plain one.
    g.select('title').text(onCellHover ? '' : `${d.title}: ${d.hint}`);
    g.select('rect.frame').attr('x', d.x).attr('y', d.y).attr('width', d.w).attr('height', d.h).attr('rx', 8)
      .attr('fill', theme.cell)
      .attr('stroke', focused ? theme.accent : theme.stroke)
      .attr('stroke-width', focused ? 3.5 : 1.5)
      .attr('stroke-dasharray', d.sub && !focused ? '6 4' : null);
    g.select('rect.stripe').attr('x', d.x + 1).attr('y', d.y + 10).attr('width', 4).attr('height', 24).attr('rx', 2)
      .attr('fill', tone).attr('display', d.tone ? null : 'none');
    const hasNum = d.num !== null;
    g.select('circle.badge').attr('cx', d.x + 22).attr('cy', d.y + 22).attr('r', 11)
      .attr('fill', theme.title).attr('display', hasNum ? null : 'none');
    g.select('text.num').attr('x', d.x + 22).attr('y', d.y + 27).attr('text-anchor', 'middle')
      .attr('font-size', 13).attr('font-weight', 700).attr('fill', theme.bg).attr('display', hasNum ? null : 'none').text(d.num);
    const tx = d.x + (hasNum ? 40 : 14);
    g.select('text.ctitle').attr('font-size', d.titleSize).attr('font-weight', d.sub ? 600 : 700)
      .attr('fill', d.tone ? tone : theme.title)
      .selectAll('tspan').data(d.titleLines).join('tspan')
      .attr('x', tx).attr('y', (_, i) => d.y + 27 + i * (d.titleSize + 2)).text((l) => l.toUpperCase());

    // Placeholder hint, only while the section is empty
    const hintLines = d.itemCount === 0 ? hintWrap(d.hint, d.w - 28) : [];
    g.select('text.hint').attr('x', d.x + 14).attr('y', d.area.y + 10).attr('font-size', 12).attr('font-style', 'italic')
      .attr('fill', theme.hint)
      .selectAll('tspan').data(hintLines).join('tspan')
      .attr('x', d.x + 14).attr('dy', (_, i) => (i === 0 ? 0 : 16)).text((l) => l);

    const noteSel = g.select('g.notes').selectAll('g.note').data(d.notes, (n, i) => `${i}:${n.text}:${n.color}`).join(
      (enter) => {
        const e = enter.append('g').attr('class', 'note');
        if (animate) e.attr('opacity', 0).transition().duration(220).attr('opacity', 1);
        e.append('rect'); e.append('text');
        return e;
      },
    );
    noteSel.each(function (n) {
      const ns = noteStyle(theme, n.color);
      const ng = d3.select(this);
      ng.select('rect').attr('x', n.x).attr('y', n.y).attr('width', n.w).attr('height', n.h).attr('rx', 4)
        .attr('fill', ns.fill).attr('stroke', ns.stroke).attr('stroke-width', ns.stroke === 'none' ? 0 : 1);
      ng.select('text').attr('font-size', d.fontSize).attr('fill', ns.text)
        .selectAll('tspan').data(n.lines).join('tspan')
        .attr('x', n.x + n.padding).attr('y', (_, i) => n.y + n.padding + d.fontSize + i * n.lineH - 2).text((l) => l);
    });

    g.select('text.more').attr('x', d.x + d.w - 14).attr('y', d.y + d.h - 8).attr('text-anchor', 'end')
      .attr('font-size', 12).attr('font-weight', 600).attr('fill', theme.sub)
      .text(d.overflow ? `+${d.overflow} more` : '');
  });
}

function hintWrap(text, maxWidth) {
  const maxChars = Math.max(8, Math.floor(maxWidth / (12 * 0.5)));
  const lines = [];
  let line = '';
  for (const w of text.split(' ')) {
    if (line && (line + ' ' + w).length > maxChars) { lines.push(line); line = w; } else line = line ? line + ' ' + w : w;
  }
  if (line) lines.push(line);
  return lines.slice(0, 4);
}

// Build a fresh, detached, static SVG for export (no transitions in flight).
export function renderStandalone(doc, width = 1200) {
  const svg = document.createElementNS(SVG_NS, 'svg');
  const model = buildModel(doc, width);
  svg.setAttribute('width', model.width);
  svg.setAttribute('height', model.height);
  render(svg, model, getTheme(doc.theme), { animate: false });
  return { svg, model };
}

export function svgString(doc, width = 1200) {
  const { svg } = renderStandalone(doc, width);
  return '<?xml version="1.0" encoding="UTF-8"?>\n' + new XMLSerializer().serializeToString(svg);
}

export function svgToPngBlob(doc, scale = 2) {
  const { svg, model } = renderStandalone(doc);
  const xml = new XMLSerializer().serializeToString(svg);
  const url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(xml);
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = model.width * scale;
      canvas.height = model.height * scale;
      const ctx = canvas.getContext('2d');
      ctx.scale(scale, scale);
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('PNG export failed'))), 'image/png');
    };
    img.onerror = () => reject(new Error('Could not rasterize SVG'));
    img.src = url;
  });
}
