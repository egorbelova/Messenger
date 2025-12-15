const MATERIAL_COLORS = [
  '#3B82F6', // clean blue
  '#00A2FF', // electric blue soft
  '#06B6D4', // cyan
  '#22D3EE', // light cyan
  '#8B5CF6', // soft purple
  '#A855F7', // vibrant purple
  '#C084FC', // lavender
  '#EC4899', // rose
  '#F472B6', // soft pink
  '#EF4444', // red
  '#6366F1', // indigo
] as const;

function shadeColor(color: string, percent: number) {
  const num = parseInt(color.slice(1), 16);
  let r = (num >> 16) + percent;
  let g = ((num >> 8) & 0x00ff) + percent;
  let b = (num & 0x0000ff) + percent;

  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));

  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

export function stringToColor(str: string): string {
  if (!str) return MATERIAL_COLORS[0];

  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.codePointAt(i)! + ((hash << 5) - hash);
  }

  const baseColor = MATERIAL_COLORS[Math.abs(hash) % MATERIAL_COLORS.length];

  const variation = (hash % 21) - 10;
  return shadeColor(baseColor, variation);
}
