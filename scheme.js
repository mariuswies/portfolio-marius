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
  },
  rgb: {
    bg: '#F0E4D8',
    text: '#1a1a1a',
    dark: '#333333',
    accent: '#1a1a1a',
    footerBg: '#1a1a1a',
    footerText: '#F0E4D8',
    lineColor: 'rgba(0, 0, 0, 0.15)',
    labelBorder: '#1a1a1a'
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

function createRgbDots() {
  const canvas = document.createElement('canvas');
  canvas.id = 'rgb-dots';
  canvas.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:0;display:none;';
  document.body.prepend(canvas);

  function draw() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    const colors = ['#d94040', '#2d8a2d', '#3060cc'];
    const cols = Math.ceil(window.innerWidth / 120);
    const rows = Math.ceil(window.innerHeight / 80);

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        for (let i = 0; i < 3; i++) {
          const x = col * 120 + 20 + Math.random() * 80;
          const y = row * 80 + 10 + Math.random() * 60;
          ctx.beginPath();
          ctx.arc(x, y, 2, 0, Math.PI * 2);
          ctx.fillStyle = colors[i];
          ctx.fill();
        }
      }
    }
  }

  draw();
  window.addEventListener('resize', draw);
  return canvas;
}

let rgbCanvas = null;

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

  if (!rgbCanvas) rgbCanvas = createRgbDots();
  rgbCanvas.style.display = name === 'rgb' ? 'block' : 'none';
}

document.querySelectorAll('.scheme-btn').forEach((btn) => {
  btn.addEventListener('click', () => applyScheme(btn.dataset.scheme));
});

applyScheme('blue');
