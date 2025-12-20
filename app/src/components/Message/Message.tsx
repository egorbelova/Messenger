// components/Message/Message.tsx
import React, { useState, useEffect } from 'react';
import MessageTime from '../Message/MessageTime';
import { txtdecode } from '../../utils/index';
import { useUser } from '../../contexts/UserContext';
import { useMessages } from '../../contexts/MessagesContext';
import type { Message as MessageType } from '../../types';
import styles from './Message.module.scss';
import ProgressiveImage from './ProgressiveImage';
import { Icon } from '../Icons/AutoIcons';
import SmartMediaLayout from './SmartMediaLayout.tsx';
import Avatar from '../Avatar/Avatar.tsx';

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

interface MessageProps {
  message: MessageType;
  onContextMenu?: (e: React.MouseEvent) => void;
  isLastMessage?: boolean;
}

const Message: React.FC<MessageProps> = ({
  message,
  onContextMenu,
  isLastMessage = false,
}) => {
  const { user } = useUser();
  const { likeMessage } = useMessages();
  const currentUserId = user?.id || 0;
  const isOwnMessage = (): boolean => {
    // console.log('Like message:', message.files);

    return message.is_own;
  };
  // console.log(message?.files);
  const isMessageViewed = (): boolean => message.viewers?.length > 0;

  const handleMessageClick = () => {
    if (!isOwnMessage() && !isMessageViewed()) {
      console.log('Mark message as viewed:', message.id);
    }
  };

  // useEffect(() => {
  //   const observer = new IntersectionObserver((entries) => {
  //     entries.forEach((entry) => {
  //       if (entry.isIntersecting) {
  //         entry.target.classList.add('visible');
  //       } else {
  //         entry.target.classList.remove('visible');
  //       }
  //     });
  //   });

  //   const messageElement = document.querySelectorAll(`.message_div`);
  //   messageElement.forEach((el) => observer.observe(el));

  //   return () => {
  //     observer.disconnect();
  //   };
  // }, []);

  // useEffect(() => {
  //   const container = document.querySelector('#display');
  //   if (!container) return;

  //   const messages = Array.from(
  //     container.querySelectorAll<HTMLElement>('.message_div')
  //   ).map((el) => ({ el, currentY: 0 }));

  //   let lastScroll = container.scrollTop;

  //   const animate = () => {
  //     const scrollTop = container.scrollTop;
  //     const direction = scrollTop > lastScroll ? 1 : -1;
  //     lastScroll = scrollTop;

  //     const containerRect = container.getBoundingClientRect();

  //     messages.forEach((msg) => {
  //       const rect = msg.el.getBoundingClientRect();
  //       const offset = rect.top - containerRect.top;
  //       const center = containerRect.height / 2;

  //       const targetY = (offset - center) * 0.05 * direction;
  //       msg.currentY += (targetY - msg.currentY) * 0.1; // easing
  //       msg.el.style.transform = `translateY(${msg.currentY}px)`;
  //     });

  //     requestAnimationFrame(animate);
  //   };

  //   requestAnimationFrame(animate);

  //   return () => {
  //     messages.forEach((msg) => (msg.el.style.transform = ''));
  //   };
  // }, []);

  const handleDoubleClick = () => {};
  return (
    <div
      className={`temp_full ${
        isOwnMessage() ? 'own-message' : 'other-message'
      }`}
      onClick={handleMessageClick}
      onDoubleClick={handleDoubleClick}
      onContextMenu={onContextMenu}
    >
      {!isOwnMessage() && (
        <Avatar
          className={styles.avatar}
          // @ts-ignore
          displayName={message.user.username}
          // @ts-ignore
          imageUrl={message.user.profile.thumbnail_small}
        />
      )}
      <div
        className={`${styles.message_div} ${
          isOwnMessage() ? `${styles.darker} ${styles.right}` : ''
        }`}
      >
        {/* <SquircleContainer
          style={{
            maxWidth: '100%',
            height: 'fit-content',
          }}
          cornerRadiusPx={20}
          smoothness={1}
          // strokeColor='#99999988'
          // strokeWidth={isOwnMessage() ? undefined : 1}
        > */}
        <div className={styles.message}>
          {message.files && message.files.length > 0 && (
            <SmartMediaLayout files={message.files} />
          )}

          <div
            className={`${styles.message_div_temp_separator} ${
              !message.value ? styles.textEmpty : ''
            }`}
          >
            <div className='message_and_reaction'>
              {message.value && (
                <span className={styles.message__text}>{message.value}</span>
              )}
              {message.liked > 0 && <div className='message-reaction'>❤️</div>}
            </div>

            <div className={styles.message_div_subdata}>
              <div className='message_div_temp_time_view'>
                <MessageTime date={message.date} />

                <span id='viewed_span' className='viewed-status'>
                  {isOwnMessage() &&
                    (isMessageViewed() ? (
                      <Icon
                        name='Read'
                        className={styles['viewed-status__icon']}
                      />
                    ) : (
                      <Icon
                        name='Unread'
                        className={styles['viewed-status__icon']}
                      />
                    ))}
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* </SquircleContainer> */}
      </div>
    </div>
  );
};

const FilePreview: React.FC<{ file: File; isLast?: boolean }> = ({
  file,
  isLast,
}) => {
  // console.log(isLast);
  const getFileType = (filename: string): string => {
    const ext = filename.split('.').pop()?.toLowerCase() || '';
    if (
      [
        'jpg',
        'jpeg',
        'png',
        'gif',
        'webp',
        'bmp',
        'ico',
        'svg',
        'tiff',
      ].includes(ext)
    )
      return 'image';
    if (
      [
        'mp4',
        'mov',
        'avi',
        'webm',
        'mkv',
        'mpeg',
        'mp2',
        'mpg',
        'flv',
        'm4v',
        'mkv',
      ].includes(ext)
    )
      return 'video';
    if (['mp3', 'wav', 'ogg', 'flac', 'm4a'].includes(ext)) return 'audio';
    if (['pdf'].includes(ext)) return 'pdf';
    return 'document';
  };
  const fileType = getFileType(file.original_name || file.file_url);

  const previewMediaHandler = () => {
    // Implement media preview logic here
    console.log('Preview media:', file.file_url);
  };
  return (
    // <div className={`file-preview file-type-${fileType}`}>
    <>
      {fileType === 'image' && (
        <ProgressiveImage
          key={file.id}
          small={file.thumbnail_small_url}
          full={file.thumbnail_medium_url}
          // width={file.width}
          // height={file.height}
          // onClick={() => previewMediaHandler(file)}
          // priority={isLast}
          dominant_color={file.dominant_color}
        />
      )}
      {fileType === 'video' && (
        <video
          autoPlay
          muted
          preload='metadata'
          className='file-video mes_img'
          width={file.width}
          height={file.height}
        >
          <source src={file.file_url} type='video/mp4' />
          Your browser does not support the video tag.
        </video>
      )}
      {fileType === 'audio' && (
        <audio controls className='file-audio'>
          <source src={file.file_url} type='audio/mpeg' />
          Your browser does not support the audio tag.
        </audio>
      )}
      {fileType === 'pdf' && (
        <a
          href={file.file_url}
          target='_blank'
          rel='noopener noreferrer'
          className='file-pdf'
        >
          📄 PDF Document
        </a>
      )}
      {fileType === 'document' && (
        <a
          href={file.file_url}
          target='_blank'
          rel='noopener noreferrer'
          className='file-document'
        >
          📄 Document: {file.original_name || 'Download'}
        </a>
      )}
    </>
  );
};

export default Message;
