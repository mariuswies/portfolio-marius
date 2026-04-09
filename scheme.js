const schemes = {
  mint: {
    bg: '#BFFFBD',
    text: '#000000',
    dark: '#000000',
    accent: '#000000',
    footerBg: '#000000',
    footerText: '#BFFFBD',
    lineColor: 'rgba(0, 0, 0, 0.2)',
    labelBorder: '#000000'
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
  dark: {
    bg: '#000000',
    text: '#F2F0E6',
    dark: '#000000',
    accent: '#BFFFBD',
    footerBg: '#F2F0E6',
    footerText: '#000000',
    lineColor: 'rgba(242, 240, 230, 0.2)',
    labelBorder: '#F2F0E6'
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
    bg: '#EFDED2',
    text: '#1a1a1a',
    dark: '#333333',
    accent: '#1a1a1a',
    footerBg: '#1a1a1a',
    footerText: '#EFDED2',
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

  function seededRandom(seed) {
    let s = seed;
    return function () {
      s = (s * 16807 + 0) % 2147483647;
      return (s - 1) / 2147483646;
    };
  }

  function draw() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    const rand = seededRandom(42);
    const colors = ['#d47070', '#5aaa5a', '#6b8ec8'];
    const cellW = 160;
    const cellH = 100;
    const cols = Math.ceil(window.innerWidth / cellW) + 1;
    const rows = Math.ceil(window.innerHeight / cellH) + 1;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const baseX = col * cellW;
        const baseY = row * cellH;
        for (let i = 0; i < 3; i++) {
          const x = baseX + 30 + rand() * 100;
          const y = baseY + 20 + rand() * 60;
          ctx.fillStyle = colors[i];
          ctx.fillRect(Math.round(x), Math.round(y), 2, 2);
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
  const passAA = ratio >= 4.5;
  const passAALarge = ratio >= 3;
  document.getElementById('contrast-value').textContent = formatted;
  const ratingEl = document.getElementById('wcag-rating');
  if (passAA) {
    ratingEl.textContent = 'WCAG AA';
    ratingEl.className = 'wcag-pass';
  } else if (passAALarge) {
    ratingEl.textContent = 'WCAG AA Large';
    ratingEl.className = 'wcag-partial';
  } else {
    ratingEl.textContent = 'Fail AA';
    ratingEl.className = 'wcag-fail';
  }

  document.querySelectorAll('.scheme-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.scheme === name);
  });

  if (!rgbCanvas) rgbCanvas = createRgbDots();
  rgbCanvas.style.display = name === 'rgb' ? 'block' : 'none';
}

document.querySelectorAll('.scheme-btn').forEach((btn) => {
  btn.addEventListener('click', () => applyScheme(btn.dataset.scheme));
});

applyScheme('rgb');
