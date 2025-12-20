import { useEffect, useRef } from 'react';

export default function ProgressiveImage({
  small,
  full,
  //   width,
  //   height,
  onClick = () => {},
  //   priority,
  dominant_color,
}) {
  const imgRef = useRef(null);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    const handleLoad = () => {
      img.classList.add('loaded');
    };

    const fullImg = new Image();

    fullImg.onload = async () => {
      try {
        await fullImg.decode();
      } catch (e) {}

      if (!img) return;

      img.src = full;
      img.addEventListener('load', handleLoad, { once: true });
    };

    fullImg.onerror = () => {
      console.warn('Failed to load full image:', full);
    };

    fullImg.src = full;
  }, [full]);

  return (
    <div style={{ background: dominant_color, width: '100%', height: '100%' }}>
      <img
        ref={imgRef}
        src={small}
        data-full={full}
        className='mes_img progressive-image'
        onClick={onClick}
        alt='Attachment'
        decoding='async'
        // loading={priority ? 'eager' : 'lazy'}
        // fetchPriority={priority ? 'high' : 'low'}
      />
    </div>
  );
}
