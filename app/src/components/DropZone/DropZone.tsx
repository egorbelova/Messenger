import { useState, useEffect } from 'react';
import styles from './DropZone.module.scss';

export default function DropZone({ onFiles }) {
  const [dragging, setDragging] = useState(false);
  let dragCounter = 0;

  useEffect(() => {
    const handleDragOver = (e) => {
      e.preventDefault();
    };

    const handleDragEnter = (e) => {
      e.preventDefault();
      dragCounter++;
      setDragging(true);
    };

    const handleDragLeave = (e) => {
      e.preventDefault();
      dragCounter--;
      if (dragCounter <= 0) setDragging(false);
    };

    const handleDrop = (e) => {
      e.preventDefault();
      dragCounter = 0;
      setDragging(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0 && onFiles) {
        onFiles(files);
      }
    };

    window.addEventListener('dragover', handleDragOver);
    window.addEventListener('dragenter', handleDragEnter);
    window.addEventListener('dragleave', handleDragLeave);
    window.addEventListener('drop', handleDrop);

    return () => {
      window.removeEventListener('dragover', handleDragOver);
      window.removeEventListener('dragenter', handleDragEnter);
      window.removeEventListener('dragleave', handleDragLeave);
      window.removeEventListener('drop', handleDrop);
    };
  }, []);

  return dragging ? (
    <div className={styles.overlay}>Drop files here to upload</div>
  ) : null;
}
