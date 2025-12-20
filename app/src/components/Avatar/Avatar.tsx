import React, { useState, useEffect, useRef } from 'react';
import { stringToColor, pSBC } from '../../utils/index';
import styles from './Avatar.module.scss';

export interface AvatarProps {
  displayName: string;
  imageUrl?: string | null;
  className?: string;
  mediaType?: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const Avatar: React.FC<AvatarProps> = ({
  displayName,
  imageUrl,
  className = '',
  mediaType = 'photo',
  onClick,
}) => {
  const avatarColor = stringToColor(displayName);
  const middleColor = pSBC(-0.6, avatarColor);
  const darkerColor = pSBC(-0.8, avatarColor);

  const getInitials = (name: string): string => {
    const words = name.trim().split(/\s+/);

    if (words.length === 0) return '';

    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    } else {
      const firstLetter = words[0].charAt(0).toUpperCase();
      const lastLetter = words[words.length - 1].charAt(0).toUpperCase();
      return firstLetter + lastLetter;
    }
  };

  const initials = getInitials(displayName);

  const avatarStyle = {
    ...(imageUrl
      ? {}
      : {
          background: `linear-gradient(0deg, ${darkerColor} 0%, ${middleColor} 35%, ${avatarColor} 100%)`,
        }),
  };

  const avatarRef = useRef<HTMLDivElement>(null);

  const [fontSize, setFontSize] = useState<number>(12);

  useEffect(() => {
    const el = avatarRef.current;
    if (!el) return;

    const updateFont = () => {
      setFontSize(el.clientWidth * 0.45);
    };

    updateFont();

    const observer = new ResizeObserver(() => updateFont());
    observer.observe(el);

    return () => observer.disconnect();
  }, [displayName, imageUrl]);

  return (
    <div
      ref={avatarRef}
      className={`${styles.profilePicture} ${className}`}
      style={avatarStyle}
      title={displayName}
      onClick={onClick}
    >
      {(() => {
        if (!imageUrl) {
          return (
            <span className={styles.avatarInitials} style={{ fontSize }}>
              {initials}
            </span>
          );
        }

        switch (mediaType) {
          case 'video':
            return (
              <video
                className={styles.avatarImage}
                src={imageUrl}
                muted
                autoPlay
                loop
                playsInline
              />
            );

          case 'photo':
          default:
            return (
              <img
                className={styles.avatarImage}
                src={imageUrl}
                alt={`${displayName} avatar`}
                loading='eager'
              />
            );
        }
      })()}
    </div>
  );
};

export default Avatar;
