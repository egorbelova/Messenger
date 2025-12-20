import React, {
  useEffect,
  useRef,
  useCallback,
  useLayoutEffect,
  memo,
  useMemo,
  useState,
} from 'react';
import ChatListItem from './ChatListItem';
import { useChat } from '../../contexts/ChatContext';
import { useUser } from '../../contexts/UserContext';
import type { Chat, User } from '../../types';

const ChatList: React.FC = () => {
  const { user } = useUser();
  const { chats, selectedChat, loading, error, fetchChats, handleChatClick } =
    useChat();
  const currentUserId = user?.id;

  const loadingContainerRef = useRef<HTMLDivElement>(null);
  const chatListRef = useRef<HTMLDivElement>(null);
  const chatItemsRef = useRef<Map<number, HTMLFormElement>>(new Map());

  const [animatedChats, setAnimatedChats] = useState<Chat[]>([]);
  const prevChatIdsRef = useRef<number[]>([]);

  const setChatItemRef = useCallback(
    (chatId: number, element: HTMLFormElement | null) => {
      if (element) chatItemsRef.current.set(chatId, element);
      else chatItemsRef.current.delete(chatId);
    },
    []
  );

  const sortedChats = useMemo(() => {
    if (!chats.length) return [];

    return [...chats].sort((a, b) => {
      const dateA = a.last_message
        ? new Date(a.last_message.date).getTime()
        : 0;
      const dateB = b.last_message
        ? new Date(b.last_message.date).getTime()
        : 0;

      if (dateA === 0 && dateB === 0) return 0;
      if (dateA === 0) return 1;
      if (dateB === 0) return -1;

      return dateB - dateA;
    });
  }, [chats]);

  useLayoutEffect(() => {
    if (!sortedChats.length) {
      setAnimatedChats([]);
      prevChatIdsRef.current = [];
      return;
    }

    const currentChatIds = sortedChats.map((chat) => chat.id);
    const prevChatIds = prevChatIdsRef.current;

    if (prevChatIds.length === 0) {
      setAnimatedChats(sortedChats);
      prevChatIdsRef.current = currentChatIds;
      return;
    }
    const orderChanged =
      prevChatIds.length !== currentChatIds.length ||
      prevChatIds.some((id, index) => id !== currentChatIds[index]);

    if (!orderChanged) {
      setAnimatedChats(sortedChats);
      return;
    }

    const prevPositions = new Map<number, DOMRect>();
    chatItemsRef.current.forEach((el, id) => {
      prevPositions.set(id, el.getBoundingClientRect());
    });

    setAnimatedChats(sortedChats);
    prevChatIdsRef.current = currentChatIds;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        chatItemsRef.current.forEach((el, id) => {
          const prevRect = prevPositions.get(id);
          if (!prevRect) return;

          const newRect = el.getBoundingClientRect();
          const dx = prevRect.left - newRect.left;
          const dy = prevRect.top - newRect.top;

          if (dx !== 0 || dy !== 0) {
            el.style.transition = 'none';
            el.style.transform = `translate(${dx}px, ${dy}px)`;

            el.offsetHeight;

            requestAnimationFrame(() => {
              el.style.transition = 'transform 0.3s ease';
              el.style.transform = '';
            });
          }
        });
      });
    });
  }, [sortedChats]);

  const getInterlocutor = useCallback(
    (chat: Chat): User | null =>
      chat.room_type === 'D' && currentUserId
        ? chat.users.find((u) => u.id !== currentUserId) || null
        : null,
    [currentUserId]
  );

  const getChatType = useCallback(
    (roomType: 'D' | 'G'): 'dialog' | 'group' =>
      roomType === 'D' ? 'dialog' : 'group',
    []
  );

  const getChatDisplayName = useCallback(
    (chat: Chat): string => {
      if (chat.room_type === 'G')
        return chat.name || chat.users.map((u) => u.username).join(', ');
      const interlocutor = getInterlocutor(chat);
      return interlocutor ? interlocutor.username : 'Unknown User';
    },
    [getInterlocutor]
  );

  useEffect(() => {
    if (!loading && chats.length > 0) {
      chatListRef.current?.classList.add('active');
      loadingContainerRef.current?.classList.add('hidden');
    }
  }, [loading, chats.length]);

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);
  if (loading)
    return (
      <div className='loading_chats_container' ref={loadingContainerRef}>
        <div className='loading-text'>Loading chats...</div>
      </div>
    );

  if (error)
    return (
      <div className='error-container'>
        <div className='error-message'>{error}</div>
        <button onClick={fetchChats} className='retry-button'>
          Try Again
        </button>
      </div>
    );

  return (
    <div id='users_search' className='users_search' ref={chatListRef}>
      {animatedChats.length === 0 ? (
        <div className='no-chats'>
          <div className='no-chats-text'>No chats found</div>
          <button onClick={fetchChats} className='retry-button'>
            Refresh
          </button>
        </div>
      ) : (
        animatedChats.map((chat) => (
          <MemoizedChatListItem
            key={chat.id}
            chat={chat}
            displayName={getChatDisplayName(chat)}
            interlocutor={getInterlocutor(chat)}
            chatType={getChatType(chat.room_type)}
            lastMessage={chat.last_message}
            unread_count={chat.unread_count}
            isActive={selectedChat?.id === chat.id}
            onChatClick={handleChatClick}
            ref={(el) => setChatItemRef(chat.id, el)}
          />
        ))
      )}
    </div>
  );
};

export default ChatList;

const MemoizedChatListItem = memo(ChatListItem);
