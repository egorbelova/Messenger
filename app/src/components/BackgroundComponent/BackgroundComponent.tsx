import React, { useEffect, useRef } from 'react';
import StaticBackgroundFixedZoom from '../../utils/StaticBackgroundFixedZoom';

const BackgroundComponent: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const gradientCanvasRef = useRef<HTMLCanvasElement>(null);
  const patternCanvasRef = useRef<HTMLCanvasElement>(null);
  const backgroundInstance = useRef<StaticBackgroundFixedZoom | null>(null);

  useEffect(() => {
    if (
      !containerRef.current ||
      !gradientCanvasRef.current ||
      !patternCanvasRef.current
    )
      return;

    backgroundInstance.current = new StaticBackgroundFixedZoom(
      gradientCanvasRef.current,
      patternCanvasRef.current,
      containerRef.current
    );
  }, []);

  return (
    <div ref={containerRef} className='background-container'>
      <canvas ref={gradientCanvasRef} id='gradient-canvas' />
      <canvas ref={patternCanvasRef} id='pattern-canvas' />
    </div>
  );
};

export default BackgroundComponent;
