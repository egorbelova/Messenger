import React, { useMemo } from 'react';
import styles from './SmartMediaLayout.module.scss';
import { generateLayout } from './SmartMediaLayout';
import ProgressiveImage from './ProgressiveImage';

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

interface Props {
  files: File[];
  onClick?: (file: File) => void;
}

const SmartMediaLayout: React.FC<Props> = ({ files, onClick }) => {
  const layout = useMemo(() => generateLayout(files), [files]);

  const MAX_W = 420;
  const MAX_H = 560;
  const MIN_W = 200;
  const MIN_H = 200;

  const singleFile = files.length === 1 ? files[0] : null;

  const containerWidth =
    files.length > 1
      ? MAX_W
      : Math.min(Math.max(singleFile?.width || MIN_W, MIN_W), MAX_W);

  const containerHeight =
    files.length > 1
      ? Math.min(
          layout.reduce(
            (max, item) => Math.max(max, item.top + item.height),
            0
          ),
          MAX_H
        )
      : Math.min(Math.max(singleFile?.height || MIN_H, MIN_H), MAX_H);

  return (
    <div
      className={styles.wrapper}
      style={{
        width: containerWidth,
        height: containerHeight,
      }}
    >
      {layout.map((item) => (
        <div
          key={item.file.id}
          className={styles.item}
          style={{
            top: item.top,
            left: item.left,
            width: item.width,
            height: item.height,
          }}
          onClick={() => onClick?.(item.file)}
        >
          {item.file.category === 'video' ? (
            <video
              src={item.file.file_url}
              muted
              autoPlay
              loop
              playsInline
              className={styles.media}
            />
          ) : (
            <ProgressiveImage
              small={item.file.thumbnail_small_url}
              full={item.file.thumbnail_medium_url}
              dominant_color={item.file.dominant_color}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default SmartMediaLayout;
