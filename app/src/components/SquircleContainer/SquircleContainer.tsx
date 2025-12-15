import { useMemo, useRef, type HTMLAttributes } from 'react';

import { generateSquirclePath } from '../../utils/generateSquirclePath';
import { useResizeObserver } from '../../utils/useResizeObserver';

export const generateContinuousCornerPath = (
  width: number,
  height: number,
  radius: number = 20,
  precision: number = 2
) => {
  if (width === 0 || height === 0) return { pathString: '', curves: [] };

  const r = Math.min(radius, width / 2, height / 2);

  const path = [
    `M ${_setPrecision(r, precision)} 0`,
    `L ${_setPrecision(width - r, precision)} 0`,
    `C ${_setPrecision(width - r / 2, precision)} 0 ${_setPrecision(
      width,
      precision
    )} ${_setPrecision(r / 2, precision)} ${_setPrecision(
      width,
      precision
    )} ${_setPrecision(r, precision)}`, // top-right
    `L ${_setPrecision(width, precision)} ${_setPrecision(
      height - r,
      precision
    )}`,
    `C ${_setPrecision(width, precision)} ${_setPrecision(
      height - r / 2,
      precision
    )} ${_setPrecision(width - r / 2, precision)} ${_setPrecision(
      height,
      precision
    )} ${_setPrecision(width - r, precision)} ${_setPrecision(
      height,
      precision
    )}`, // bottom-right
    `L ${_setPrecision(r, precision)} ${_setPrecision(height, precision)}`,
    `C ${_setPrecision(r / 2, precision)} ${_setPrecision(
      height,
      precision
    )} 0 ${_setPrecision(height - r / 2, precision)} 0 ${_setPrecision(
      height - r,
      precision
    )}`, // bottom-left
    `L 0 ${_setPrecision(r, precision)}`,
    `C 0 ${_setPrecision(r / 2, precision)} ${_setPrecision(
      r / 2,
      precision
    )} 0 ${_setPrecision(r, precision)} 0`, // top-left
    'Z',
  ].join(' ');

  return { pathString: path, curves: [] };
};

const _setPrecision = (value: number, precision: number) =>
  parseFloat(value.toFixed(precision));

export const SquircleContainer = (
  props: HTMLAttributes<HTMLDivElement> & {
    roundness?: number;
    cornerRadiusPx?: number;
    strokeWidth?: number;
    strokeColor?: string;
    smoothness?: number;
  }
) => {
  const {
    roundness,
    cornerRadiusPx,
    strokeWidth,
    strokeColor,
    smoothness,
    ...rest
  } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const dimensions = useResizeObserver(containerRef);

  const effectiveRoundness = useMemo(() => {
    if (cornerRadiusPx != null) {
      const minSide = Math.min(dimensions.width, dimensions.height);
      if (minSide === 0) return roundness ?? 0.5;

      return Math.min(cornerRadiusPx / (minSide / 2), 1);
    }
    return roundness ?? 0.5;
  }, [cornerRadiusPx, roundness, dimensions.width, dimensions.height]);

  const { pathString } = useMemo(
    () =>
      generateContinuousCornerPath(
        dimensions.width,
        dimensions.height,
        cornerRadiusPx ?? 20
      ),
    [dimensions.width, dimensions.height, effectiveRoundness, smoothness]
  );

  return (
    <div
      ref={containerRef}
      {...rest}
      style={{
        ...rest.style,
        position: 'relative',
      }}
    >
      {/* Content */}
      <div
        style={{
          //   position: 'absolute',
          //   top: 0,
          //   left: 0,
          //   width: '100%',
          //   height: '100%',
          clipPath: `path("${pathString}")`,
        }}
      >
        {props.children}
      </div>
      {/* Border */}
      {strokeWidth && (
        <svg
          style={{
            position: 'absolute',
            top: `-${strokeWidth}px`,
            left: `-${strokeWidth}px`,
            width: `calc(100% + ${strokeWidth * 2}px)`,
            height: `calc(100% + ${strokeWidth * 2}px)`,
          }}
          viewBox={`-${strokeWidth} -${strokeWidth} ${
            dimensions.width + strokeWidth * 2
          } ${dimensions.height + strokeWidth * 2}`}
        >
          <path
            d={pathString}
            fill='none'
            stroke={strokeColor ?? '#555'}
            strokeWidth={strokeWidth}
          />
        </svg>
      )}
    </div>
  );
};
