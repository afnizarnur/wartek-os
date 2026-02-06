function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

function rgbToString(rgb) {
  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
}

function hslToString(hsl) {
  return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
}

function updateConversion() {
  const hexInput = document.getElementById('hexInput');
  const preview = document.getElementById('preview');
  const rgbValue = document.getElementById('rgbValue');
  const hslValue = document.getElementById('hslValue');

  let hex = hexInput.value.replace(/[^a-fA-F0-9]/g, '');

  if (hex.length === 6) {
    const rgb = hexToRgb(hex);
    if (rgb) {
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

      preview.style.background = `#${hex}`;
      rgbValue.textContent = rgbToString(rgb);
      hslValue.textContent = hslToString(hsl);
    }
  } else if (hex.length === 0) {
    preview.style.background = '#000';
    rgbValue.textContent = 'rgb(0, 0, 0)';
    hslValue.textContent = 'hsl(0, 0%, 0%)';
  }
}

function copyToClipboard(targetId) {
  const text = document.getElementById(targetId).textContent;
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.querySelector(`[data-target="${targetId}"]`);
    const original = btn.textContent;
    btn.textContent = 'Copied!';
    setTimeout(() => btn.textContent = original, 1000);
  });
}

function init() {
  const hexInput = document.getElementById('hexInput');
  hexInput.addEventListener('input', updateConversion);

  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      copyToClipboard(btn.dataset.target);
    });
  });
}

init();
