import React, { useState, useEffect, useRef } from 'react';
import styles from './ContextMenu.module.scss';
import { createPortal } from 'react-dom';
import { Icon } from '../Icons/AutoIcons';

interface MenuItem {
  label: string;
  icon?: string;
  onClick: () => void;
  danger?: boolean;
  separator?: boolean;
}

interface ContextMenuProps {
  items: MenuItem[];
  position: { x: number; y: number };
  onClose: () => void;
  onAnimationEnd?: () => void;
  isHiding?: boolean;
}

const ContextMenu: React.FC<ContextMenuProps> = ({
  items,
  position,
  onClose,
  onAnimationEnd,
  isHiding,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(position);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      const menu = menuRef.current;
      if (!menu) return;

      const rect = menu.getBoundingClientRect();
      const margin = 50;

      if (
        event.clientX < rect.left - margin ||
        event.clientX > rect.right + margin ||
        event.clientY < rect.top - margin ||
        event.clientY > rect.bottom + margin
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', onClose);
    window.addEventListener('scroll', onClose, true);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', onClose);
      window.removeEventListener('scroll', onClose, true);
    };
  }, [onClose]);

  useEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;

    const originX =
      position.x > window.innerWidth - menu.offsetWidth ? 'right' : 'left';
    const originY =
      position.y > window.innerHeight - menu.offsetHeight ? 'bottom' : 'top';

    const x = position.x + (originX === 'left' ? 0 : -menu.offsetWidth);
    const y = position.y + (originY === 'top' ? 0 : -menu.offsetHeight);

    setPos({ x, y });

    menu.style.setProperty('--scaleOriginX', originX);
    menu.style.setProperty('--scaleOriginY', originY);

    setVisible(true);
  }, [position]);

  return createPortal(
    <div
      ref={menuRef}
      onTransitionEnd={onAnimationEnd}
      className={`${styles['context-menu']} 
        ${visible ? styles['context-menu--visible'] : ''} 
        ${isHiding ? styles['context-menu--hiding'] : ''}`}
      style={{
        position: 'fixed',
        left: pos.x,
        top: pos.y,
      }}
    >
      {items.map((item, idx) =>
        item.separator ? (
          <div key={idx} className={styles['context-menu__separator']} />
        ) : (
          <div
            key={idx}
            className={`${styles['context-menu__item']} ${
              item.danger ? styles['context-menu__item--danger'] : ''
            }`}
            style={{ animationDelay: `${idx * 25}ms` }}
            onClick={() => {
              item.onClick();
              onClose();
            }}
          >
            {item.icon && (
              <Icon
                // @ts-ignore
                name={item.icon}
                className={styles['context-menu__item--icon']}
              />
            )}
            <span>{item.label}</span>
          </div>
        )
      )}
    </div>,
    document.body
  );
};

export default ContextMenu;
