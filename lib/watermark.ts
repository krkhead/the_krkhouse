// Client-side watermark overlay generator
// Returns a data URL for a transparent PNG with © Krkhouse text

export function createWatermarkDataUrl(width: number, height: number): string {
  if (typeof window === 'undefined') return '';

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Transparent background
  ctx.clearRect(0, 0, width, height);

  // Watermark text settings
  const fontSize = Math.max(12, Math.min(width * 0.025, 18));
  ctx.font = `${fontSize}px "Courier New", monospace`;
  ctx.fillStyle = 'rgba(208, 208, 208, 0.55)';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'bottom';

  const text = '© Krkhouse';
  const padding = 12;
  ctx.fillText(text, width - padding, height - padding);

  return canvas.toDataURL('image/png');
}

// Apply watermark overlay to a container element
export function applyWatermarkOverlay(container: HTMLElement, width: number, height: number): void {
  const existing = container.querySelector('[data-watermark]');
  if (existing) existing.remove();

  const dataUrl = createWatermarkDataUrl(width, height);
  if (!dataUrl) return;

  const overlay = document.createElement('div');
  overlay.setAttribute('data-watermark', 'true');
  overlay.style.cssText = `
    position: absolute;
    inset: 0;
    background-image: url(${dataUrl});
    background-repeat: no-repeat;
    background-position: bottom right;
    background-size: ${width}px ${height}px;
    pointer-events: none;
    z-index: 10;
  `;
  container.style.position = 'relative';
  container.appendChild(overlay);
}
