interface File {
  id: number;
  file_url: string;
  category?: string;
  thumbnail_small_url?: string;
  thumbnail_medium_url?: string;
  file_type?: string;
  original_name?: string;
  height?: number;
  width?: number;
  dominant_color?: string;
}

interface LayoutItem {
  file: File;
  top: number;
  left: number;
  width: number;
  height: number;
}

const GAP = 3;
const MAX_W = 420;
const MAX_H = 560;
const MIN_W = 200;
const MIN_H = 200;
const RATIO_3_TOP = 0.62;

export function generateLayout(files: File[]): LayoutItem[] {
  const count = files.length;
  const result: LayoutItem[] = [];

  const W = Math.min(MAX_W, Math.max(MIN_W, MAX_W));
  let H = Math.min(MAX_H, Math.max(MIN_H, W));

  if (count === 1) {
    const file = files[0];
    const ratio = (file.height || H) / (file.width || W);
    const height = Math.min(Math.max(W * ratio, MIN_H), MAX_H);

    const width = Math.min(Math.max(W, MIN_W), MAX_W);

    result.push({
      file,
      top: 0,
      left: 0,
      width,
      height,
    });
    return result;
  }

  if (count === 2) {
    const half = (W - GAP) / 2;

    result.push({
      file: files[0],
      top: 0,
      left: 0,
      width: half,
      height: H,
    });

    result.push({
      file: files[1],
      top: 0,
      left: half + GAP,
      width: half,
      height: H,
    });
    return result;
  }

  if (count === 3) {
    const topH = H * RATIO_3_TOP;
    const bottomH = H - topH - GAP;
    const half = (W - GAP) / 2;

    result.push({
      file: files[0],
      top: 0,
      left: 0,
      width: W,
      height: topH,
    });

    result.push({
      file: files[1],
      top: topH + GAP,
      left: 0,
      width: half,
      height: bottomH,
    });

    result.push({
      file: files[2],
      top: topH + GAP,
      left: half + GAP,
      width: half,
      height: bottomH,
    });

    return result;
  }

  if (count === 4) {
    const topH = H * 0.45;
    const midH = H * 0.28;
    const bottomH = H - topH - midH - GAP * 2;

    result.push({
      file: files[0],
      top: 0,
      left: 0,
      width: W,
      height: topH,
    });

    result.push({
      file: files[1],
      top: topH + GAP,
      left: 0,
      width: W * 0.4 - GAP,
      height: midH,
    });

    result.push({
      file: files[2],
      top: topH + GAP,
      left: W * 0.4,
      width: W * 0.6,
      height: midH,
    });

    result.push({
      file: files[3],
      top: topH + midH + GAP * 2,
      left: 0,
      width: W,
      height: bottomH,
    });

    return result;
  }

  let y = 0;

  result.push({
    file: files[0],
    top: y,
    left: 0,
    width: W,
    height: H * 0.55,
  });
  y += H * 0.55 + GAP;

  const smallH = 100;
  let left = 0;

  for (let i = 1; i < files.length; i++) {
    result.push({
      file: files[i],
      top: y,
      left,
      width: 100,
      height: smallH,
    });

    left += 100 + GAP;
    if (left + 100 > W) {
      left = 0;
      y += smallH + GAP;
    }
  }

  return result;
}
