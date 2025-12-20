// components/MessageList/MessageList.tsx
import Message from '../Message/Message';
import { useChat } from '../../contexts/ChatContext';
import { useEffect, useCallback, useRef, useState } from 'react';
import ContextMenu from '../ContextMenu/ContextMenu';
import styles from './MessageList.module.scss';
import { createPortal } from 'react-dom';
import Avatar from '../Avatar/Avatar';

const MessageList: React.FC = () => {
  const { messages, updateMessages, selectedChat } = useChat();
  const selectedChatRef = useRef(selectedChat);
  const messagesRef = useRef(messages);

  useEffect(() => {
    selectedChatRef.current = selectedChat;
    messagesRef.current = messages;
  }, [selectedChat, messages]);

  const handleNewMessage = useCallback(
    (data: any) => {
      const currentSelectedChat = selectedChatRef.current;
      const currentMessages = messagesRef.current;

      if (!currentSelectedChat || data.room_id !== currentSelectedChat.id)
        return;

      const isDuplicate = currentMessages.some(
        (msg) => msg.id === data.data.id
      );
      if (isDuplicate) return;

      const newMessages = [data.data, ...currentMessages];
      updateMessages(newMessages, currentSelectedChat.id);
    },
    [updateMessages]
  );

  const [viewersVisible, setViewersVisible] = useState(false);
  const [currentViewers, setCurrentViewers] = useState<any[]>([]);

  const handleShowViewers = (msg: any) => {
    setCurrentViewers(msg.viewers || []);
    setViewersVisible(true);
  };

  // components/MessageList/MessageList.tsx
  // useEffect(() => {
  //   const handleMessageReaction = (data: any) => {
  //     const updatedMessages = messages.map((msg) =>
  //       msg.id === data.message_id ? { ...msg, reactions: data.data } : msg
  //     );
  //     updateMessages(updatedMessages, selectedChat!.id);
  //   };

  //   const handleMessageViewed = (data: any) => {
  //     const updatedMessages = messages.map((msg) =>
  //       msg.id === data.message_id ? { ...msg, viewed: true } : msg
  //     );
  //     // updateMessages(updatedMessages, selectedChat!.id);
  //   };

  //   websocketManager.on('message_reaction', handleMessageReaction);
  //   websocketManager.on('message_viewed', handleMessageViewed);

  //   return () => {
  //     websocketManager.off('message_reaction', handleMessageReaction);
  //     websocketManager.off('message_viewed', handleMessageViewed);
  //   };
  // }, [messages, selectedChat, updateMessages]);

  // useEffect(() => {
  //   // websocketManager.on('chat_message', handleNewMessage);

  //   return () => {
  //     // websocketManager.off('chat_message', handleNewMessage);
  //   };
  // }, [handleNewMessage]);

  const [menuPos, setMenuPos] = useState<{ x: number; y: number } | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [isMenuHiding, setIsMenuHiding] = useState(false);

  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setMenuVisible(false);
    setTimeout(() => {
      setMenuPos({ x: e.clientX, y: e.clientY });
      setMenuVisible(true);
      setIsMenuHiding(false);
    }, 0);
  };

  const handleClose = () => {
    setIsMenuHiding(true);
  };

  const handleAnimationEnd = () => {
    if (isMenuHiding) {
      setIsMenuHiding(false);
      setMenuVisible(false);
    }
  };

  const handleCopyMedia = async (msg: any) => {
    if (!msg?.files?.length) return;
    const firstFile = msg.files.find((file: any) =>
      ['image'].includes(file.category)
    );
    if (!firstFile) return;

    try {
      const response = await fetch(firstFile.file_url);
      const blob = await response.blob();

      try {
        const clipboardItem = new ClipboardItem({ [blob.type]: blob });
        await navigator.clipboard.write([clipboardItem]);
      } catch (err: any) {
        if (err.name === 'NotAllowedError' && blob.type.startsWith('image/')) {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.src = firstFile.file_url;
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
          });

          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0);

          const pngBlob = await new Promise<Blob | null>((resolve) =>
            canvas.toBlob(resolve, 'image/png')
          );
          if (!pngBlob) throw new Error('Failed to convert to PNG');

          const clipboardItemPNG = new ClipboardItem({ 'image/png': pngBlob });
          await navigator.clipboard.write([clipboardItemPNG]);
        } else {
          throw err;
        }
      }
    } catch (err) {
      console.error('Clipboard error:', err);
    }
  };

  const [menuMessage, setMenuMessage] = useState<any | null>(null);
  const [canCopyToClipboard, setCanCopyToClipboard] = useState(false);

  useEffect(() => {
    const checkClipboardAccess = async () => {
      try {
        if (!navigator.clipboard || !navigator.clipboard.write) {
          setCanCopyToClipboard(false);
          return;
        }

        if (navigator.permissions) {
          try {
            const result = await navigator.permissions.query({
              name: 'clipboard-write' as PermissionName,
            });
            setCanCopyToClipboard(result.state !== 'denied');
          } catch {
            await testClipboardWrite();
          }
        } else {
          await testClipboardWrite();
        }
      } catch {
        setCanCopyToClipboard(false);
      }
    };

    const testClipboardWrite = async () => {
      try {
        const testBlob = new Blob(['test'], { type: 'text/plain' });
        const testItem = new ClipboardItem({ 'text/plain': testBlob });
        await navigator.clipboard.write([testItem]);
        setCanCopyToClipboard(true);
      } catch {
        setCanCopyToClipboard(false);
      }
    };

    checkClipboardAccess();
  }, []);

  const handleSaveFile = async (msg: any) => {
    if (!msg?.files?.length) return;

    const firstFile = msg.files.find((file: any) =>
      ['image', 'video', 'audio', 'pdf', 'document'].includes(file.category)
    );
    if (!firstFile) return;

    try {
      const response = await fetch(firstFile.file_url);
      const blob = await response.blob();

      const filename =
        firstFile.original_name ||
        firstFile.file_url.split('/').pop() ||
        'download';
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error('Failed to download file', err);
      alert('Failed to download file.');
    }
  };

  const menuItems = [
    { label: 'Reply', icon: 'Reply', onClick: () => alert('Reply clicked') },
    { separator: true, label: '', onClick: () => {} },
    ...(menuMessage?.value
      ? [
          {
            label: 'Copy Text',
            icon: 'CopyText',
            onClick: () => handleCopyMessage(menuMessage),
          },
        ]
      : []),
    ...(menuMessage?.files?.some((f: any) => ['image'].includes(f.category)) &&
    canCopyToClipboard
      ? [
          {
            label: 'Copy Media',
            icon: 'CopyMedia',
            onClick: () => handleCopyMedia(menuMessage),
          },
        ]
      : []),
    ...(menuMessage?.files?.some((f: any) =>
      ['image', 'video', 'audio', 'pdf', 'document'].includes(f.category)
    )
      ? [
          {
            label: 'Save As...',
            icon: 'SaveAs',
            onClick: () => handleSaveFile(menuMessage),
          },
        ]
      : []),
    { separator: true, label: '', onClick: () => {} },
    { label: 'Edit', icon: 'Edit', onClick: () => alert('Edit clicked') },
    {
      label: 'Forward',
      icon: 'Forward',
      onClick: () => alert('Forward clicked'),
    },
    { label: 'Select', icon: 'Select', onClick: () => alert('Select clicked') },
    ...(menuMessage?.viewers?.length && menuMessage?.is_own
      ? [
          { separator: true, label: '', onClick: () => {} },

          {
            label: `${menuMessage.viewers.length} Seen`,
            icon: 'Read',
            onClick: () => handleShowViewers(menuMessage),
          },
        ]
      : []),
    { separator: true, label: '', onClick: () => {} },
    {
      label: 'Delete',
      icon: 'Delete',
      onClick: () => alert('Delete clicked'),
      danger: true,
    },
  ];

  const handleCopyMessage = (msg: any) => {
    if (!msg?.value) return;

    console.log(msg);

    const text = msg.value;

    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).catch((err) => {
        console.error('Clipboard error:', err);
        fallbackCopy(text);
      });
    } else {
      fallbackCopy(text);
    }
  };

  function fallbackCopy(text: string) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();

    try {
      document.execCommand('copy');
    } catch (e) {
      console.error('Fallback copy failed:', e);
    }

    document.body.removeChild(textarea);
  }

  const handleMessageContextMenu = (e: React.MouseEvent, message: any) => {
    e.preventDefault();

    setMenuVisible(false);

    setTimeout(() => {
      setMenuMessage(message);
      setMenuPos({ x: e.clientX, y: e.clientY });
      setMenuVisible(true);
      setIsMenuHiding(false);
    }, 0);
  };

  // if (!messages || messages.length === 0) {
  //   return (
  //     <div className='offset room_div room_body' id='display'>
  //       <div className='no-messages'>
  //         <p>No messages yet. Start a conversation!</p>
  //       </div>
  //     </div>
  //   );
  // }
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    el.scrollTo({
      top: el.scrollHeight,
      // behavior: 'smooth',
    });
  }, [messages]);

  // const lastMessageWithImage = [...messages].find((msg) =>
  //   msg.files?.some((f: any) => {
  //     const ext = f.original_name?.split('.').pop()?.toLowerCase() || '';
  //     return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'].includes(ext);
  //   })
  // );
  // console.log('lastMessageWithImage', lastMessageWithImage);

  const messageRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const messageId = Number(entry.target.getAttribute('data-id'));
          if (entry.isIntersecting && messageId) {
            console.log('Message viewed:', messageId);
          }
        });
      },
      {
        root: containerRef.current,
        threshold: 0.5,
      }
    );

    messageRefs.current.forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [messages]);

  return (
    <div className='offset room_div room_body' id='display' ref={containerRef}>
      {menuVisible && (
        <ContextMenu
          items={menuItems}
          position={menuPos}
          onClose={handleClose}
          onAnimationEnd={handleAnimationEnd}
          isHiding={isMenuHiding}
        />
      )}
      {viewersVisible && (
        <ViewersList
          viewers={currentViewers}
          onClose={() => setViewersVisible(false)}
        />
      )}
      {messages.map((message) =>
        message.value || message.files?.length ? (
          <Message
            key={message.id}
            message={message}
            onContextMenu={(e) => handleMessageContextMenu(e, message)}
            // isLastMessage={message.id === lastMessageWithImage?.id}
            isLastMessage={false}
          />
        ) : null
      )}
    </div>
  );
};

export default MessageList;

const ViewersList: React.FC<{ viewers: any[]; onClose: () => void }> = ({
  viewers,
  onClose,
}) => {
  return createPortal(
    <div className={styles['viewers-list-overlay']} onClick={onClose}>
      <div
        className={styles['viewers-list']}
        onClick={(e) => e.stopPropagation()}
      >
        <h4>Seen by:</h4>
        {viewers.map((v) => (
          <div key={v.user.id} className={styles['viewer-item']}>
            <Avatar
              displayName={v.user.username}
              imageUrl={v.user.profile.thumbnail_small}
              className='user-info-avatar'
            />
            <div className={styles['viewer-info']}>
              <span className={styles['viewer-name']}>{v.user.username}</span>
              <span className={styles['viewer-time']}>
                {new Date(v.read_date).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>,
    document.body
  );
};
