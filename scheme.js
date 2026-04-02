const schemes = {
  blue: {
    bg: '#0400ff',
    text: '#ffffff',
    dark: '#0000b8',
    accent: '#0a0a0a',
    footerBg: '#0a0a0a',
    footerText: '#ffffff',
    lineColor: 'rgba(255, 255, 255, 0.3)',
    labelBorder: '#ffffff'
  },
  lavender: {
    bg: '#E8E0F0',
    text: '#2D2050',
    dark: '#8B7BB5',
    accent: '#2D2050',
    footerBg: '#2D2050',
    footerText: '#E8E0F0',
    lineColor: 'rgba(139, 123, 181, 0.35)',
    labelBorder: '#2D2050'
  },
  coral: {
    bg: '#E8918A',
    text: '#2D2050',
    dark: '#4A3F6B',
    accent: '#4A3F6B',
    footerBg: '#4A3F6B',
    footerText: '#E8918A',
    lineColor: 'rgba(74, 63, 107, 0.35)',
    labelBorder: '#2D2050'
  },
  bw: {
    bg: '#ffffff',
    text: '#0a0a0a',
    dark: '#000000',
    accent: '#000000',
    footerBg: '#0a0a0a',
    footerText: '#ffffff',
    lineColor: 'rgba(0, 0, 0, 0.2)',
    labelBorder: '#0a0a0a'
  }
};

function luminance(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const toLinear = (c) => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

function contrastRatio(hex1, hex2) {
  const l1 = luminance(hex1);
  const l2 = luminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function applyScheme(name) {
  const s = schemes[name];
  if (!s) return;

  const root = document.documentElement;
  root.setAttribute('data-scheme', name);
  root.style.setProperty('--bg', s.bg);
  root.style.setProperty('--text', s.text);
  root.style.setProperty('--dark', s.dark);
  root.style.setProperty('--accent', s.accent);
  root.style.setProperty('--footer-bg', s.footerBg);
  root.style.setProperty('--footer-text', s.footerText);
  root.style.setProperty('--line-color', s.lineColor);
  root.style.setProperty('--label-border', s.labelBorder);

  const ratio = contrastRatio(s.bg, s.text);
  const formatted = ratio.toFixed(1).replace('.', ',');
  document.getElementById('contrast-value').textContent = formatted;

  document.querySelectorAll('.scheme-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.scheme === name);
  });
}

document.querySelectorAll('.scheme-btn').forEach((btn) => {
  btn.addEventListener('click', () => applyScheme(btn.dataset.scheme));
});

applyScheme('blue');
