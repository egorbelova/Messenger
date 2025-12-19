// components/MediaModal.tsx
import React, { useEffect, useState } from 'react';
import styles from './MediaModal.module.scss';

interface File {
  id: number;
  file_url: string;
  category?: string;
  thumbnail_small_url?: string;
  thumbnail_medium_url?: string;
  dominant_color?: string;
}

interface MediaModalProps {
  file: File;
  onClose: () => void;
  containerRect?: DOMRect | null;
}

const MediaModal: React.FC<MediaModalProps> = ({
  file,
  onClose,
  containerRect,
}) => {
  const [animateFrom, setAnimateFrom] = useState<React.CSSProperties>({});

  useEffect(() => {
    if (containerRect) {
      setAnimateFrom({
        position: 'fixed',
        top: containerRect.top,
        left: containerRect.left,
        width: containerRect.width,
        height: containerRect.height,
        transformOrigin: 'center center',
      });
    }
  }, [containerRect]);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={`${styles.modal} ${styles.animateIn}`}
        style={animateFrom}
        onClick={(e) => e.stopPropagation()}
      >
        <button className={styles.close} onClick={onClose}>
          ×
        </button>

        <div className={styles.mediaContainer}>
          {file.category === 'video' ? (
            <video
              src={file.file_url}
              autoPlay
              controls
              className={styles.fullMedia}
            />
          ) : (
            <img
              src={file.thumbnail_medium_url || file.file_url}
              //@ts-ignore
              alt={file.original_name || 'Media'}
              className={styles.fullMedia}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MediaModal;
