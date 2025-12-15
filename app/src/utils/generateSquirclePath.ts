export const generateSquirclePath = (
  width: number,
  height: number,
  roundness: number = 0.5,
  precision: number = 2,
  smoothness: number = 1
) => {
  const halfWidth = width / 2;
  const halfHeight = height / 2;

  const [huggingX, huggingY] = _getShiftForHuggingCurves(width, height);
  const [roundX, roundY] = _getShiftForRoundCurves(width, height);

  let shiftX = _mapValue(roundness, 0, 1, huggingX, roundX);
  let shiftY = _mapValue(roundness, 0, 1, huggingY, roundY);

  shiftX *= smoothness;
  shiftY *= smoothness;

  const curves = [
    [
      { x: 0, y: _setPrecision(halfHeight, precision) },
      { x: 0, y: _setPrecision(halfHeight - shiftY, precision) },
      { x: _setPrecision(halfWidth - shiftX, precision), y: 0 },
      { x: _setPrecision(halfWidth, precision), y: 0 },
    ],
    [
      { x: _setPrecision(halfWidth, precision), y: 0 },
      { x: _setPrecision(halfWidth + shiftX, precision), y: 0 },
      {
        x: _setPrecision(width, precision),
        y: _setPrecision(halfHeight - shiftY, precision),
      },
      {
        x: _setPrecision(width, precision),
        y: _setPrecision(halfHeight, precision),
      },
    ],
    [
      {
        x: _setPrecision(width, precision),
        y: _setPrecision(halfHeight, precision),
      },
      {
        x: _setPrecision(width, precision),
        y: _setPrecision(halfHeight + shiftY, precision),
      },
      {
        x: _setPrecision(halfWidth + shiftX, precision),
        y: _setPrecision(height, precision),
      },
      {
        x: _setPrecision(halfWidth, precision),
        y: _setPrecision(height, precision),
      },
    ],
    [
      {
        x: _setPrecision(halfWidth, precision),
        y: _setPrecision(height, precision),
      },
      {
        x: _setPrecision(halfWidth - shiftX, precision),
        y: _setPrecision(height, precision),
      },
      { x: 0, y: _setPrecision(halfHeight + shiftY, precision) },
      { x: 0, y: _setPrecision(halfHeight, precision) },
    ],
  ];

  return {
    pathString: _getSVGPathString(curves),
    curves,
  };
};

const _getShiftForHuggingCurves = (width: number, height: number) => {
  if (width === 0 && height === 0) return [0, 0] as const;
  if (width === 0) return [0, height / 2] as const;
  if (height === 0) return [width / 2, 0] as const;

  const ratio = width / height;
  const effectiveRatio = Math.max(ratio, 1 / ratio);
  const pullStrength = 0.5 / Math.pow(effectiveRatio, 0.2);

  const long = 1 + pullStrength / (3 * (1 - pullStrength));
  const short = (1 + 2 * pullStrength) / (3 * pullStrength);

  const scaleX = width >= height ? long : short;
  const scaleY = width >= height ? short : long;

  return [(width / 2) * scaleX, (height / 2) * scaleY] as const;
};

const _getShiftForRoundCurves = (width: number, height: number) => {
  const scale = 0.5522847498307933; // (4 / 3) * Math.tan(Math.PI / 8);

  return [(width / 2) * scale, (height / 2) * scale] as const;
};

const _mapValue = (
  value: number,
  fromMin: number,
  fromMax: number,
  toMin: number,
  toMax: number
) => {
  const fromRange = fromMax - fromMin;
  const toRange = toMax - toMin;
  const normalizedValue = (value - fromMin) / fromRange;
  return toMin + normalizedValue * toRange;
};

const _getSVGPathString = (curves: { x: number; y: number }[][]) =>
  [
    `M ${curves[0][0].x} ${curves[0][0].y}`,
    ...curves.map(
      (curve) =>
        `C ${curve[1].x} ${curve[1].y} ${curve[2].x} ${curve[2].y} ${curve[3].x} ${curve[3].y}`
    ),
    'Z',
  ].join(' ');

const _setPrecision = (value: number, precision: number) =>
  parseFloat(value.toFixed(precision));
