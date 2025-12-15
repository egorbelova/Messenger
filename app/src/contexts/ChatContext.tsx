// contexts/ChatContext.tsx
import React, {
  createContext,
  useCallback,
  useContext,
  useState,
  useEffect,
  useRef,
} from 'react';
import type { ReactNode } from 'react';
import type { Message, Chat } from '../types';
import { websocketManager } from '../utils/websocket-manager';
import { apiFetch } from '../utils/apiFetch';

interface ChatContextType {
  selectedChat: Chat | null;
  messages: Message[];
  chats: Chat[];
  loading: boolean;
  messagesCache: { [roomId: number]: Message[] };
  error: string | null;

  selectChat: (chat: Chat | null) => void;
  updateMessages: (messages: Message[], chatId: number) => void;
  setChats: (chats: Chat[]) => void;
  setLoading: (loading: boolean) => void;
  getCachedMessages: (roomId: number) => Message[] | null;
  updateChatLastMessage: (chatId: number, lastMessage: Message | null) => void;
  updateChatUnreadCount: (chatId: number, unreadCount: number) => void;

  fetchChats: () => Promise<void>;
  fetchMessages: (chatId: number) => Promise<void>;
  handleChatClick: (chatId: number) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messagesCache, setMessagesCache] = useState<{
    [roomId: number]: Message[];
  }>({});

  const selectedChatRef = useRef(selectedChat);
  const chatsRef = useRef(chats);

  useEffect(() => {
    selectedChatRef.current = selectedChat;
    chatsRef.current = chats;
  }, [selectedChat, chats]);

  const selectChat = useCallback((chat: Chat | null) => {
    setSelectedChat(chat);
  }, []);

  useEffect(() => {
    const handleNewMessage = (data: any) => {
      if (data.type === 'chat_message' && data.room_id && data.data) {
        const roomId = data.room_id;
        const newMessage = data.data;

        console.log('New message received for room:', data);

        setChats((prevChats) => {
          return prevChats.map((chat) =>
            chat.id === roomId
              ? {
                  ...chat,
                  last_message: newMessage,
                }
              : chat
          );
        });

        setMessagesCache((prevCache) => {
          const existingMessages = prevCache[roomId] || [];

          const isDuplicate = existingMessages.some(
            (msg) => msg.id === newMessage.id
          );
          if (isDuplicate) return prevCache;

          return {
            ...prevCache,
            [roomId]: [newMessage, ...existingMessages],
          };
        });

        if (selectedChatRef.current?.id === roomId) {
          setMessages((prevMessages) => {
            const isDuplicate = prevMessages.some(
              (msg) => msg.id === newMessage.id
            );
            return isDuplicate ? prevMessages : [...prevMessages, newMessage];
          });
        }
      }
    };

    websocketManager.on('chat_message', handleNewMessage);
    return () => {
      websocketManager.off('chat_message', handleNewMessage);
    };
  }, []);

  const updateMessages = useCallback(
    (newMessages: Message[], chatId: number) => {
      setMessages(newMessages);
      setMessagesCache((prev) => ({
        ...prev,
        [chatId]: newMessages,
      }));

      if (newMessages.length > 0) {
        const lastMessage = newMessages[newMessages.length - 1];

        setChats((prevChats) => {
          const targetChat = prevChats.find((chat) => chat.id === chatId);
          if (!targetChat) return prevChats;

          const currentLastMessage = targetChat.last_message;
          const shouldUpdate =
            !currentLastMessage || lastMessage.id !== currentLastMessage.id;

          if (!shouldUpdate) return prevChats;

          return prevChats.map((chat) =>
            chat.id === chatId
              ? {
                  ...chat,
                  last_message: lastMessage,
                }
              : chat
          );
        });
      }
    },
    []
  );

  const getCachedMessages = useCallback(
    (roomId: number) => {
      return messagesCache[roomId] || null;
    },
    [messagesCache]
  );

  const updateChatLastMessage = useCallback(
    (chatId: number, lastMessage: Message | null) => {
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === chatId ? { ...chat, last_message: lastMessage } : chat
        )
      );
    },
    []
  );

  const updateChatUnreadCount = useCallback(
    (chatId: number, unreadCount: number) => {
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === chatId ? { ...chat, unread_count: unreadCount } : chat
        )
      );
    },
    []
  );

  const fetchChats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiFetch('/api/getChats/', {
        method: 'GET',
      });
      if (!res.ok) throw new Error(`Failed: ${res.status}`);
      const data = await res.json();

      setChats(Array.isArray(data.chats) ? data.chats : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMessages = useCallback(
    async (chatId: number) => {
      try {
        const res = await apiFetch(`/api/GetMessages/${chatId}/`);
        if (!res.ok) throw new Error(`Failed: ${res.status}`);
        const data = await res.json();
        console.log(data);

        updateMessages(data.messages || [], chatId);
      } catch (err) {
        console.error(err);
        updateMessages([], chatId);
      }
    },
    [updateMessages]
  );

  const handleChatClick = useCallback(
    async (chatId: number) => {
      document.querySelector('.main_chat_window')?.classList.add('swiped');
      document.documentElement.style.setProperty(
        '--swipe-margin-inactive',
        `0%`
      );
      if (selectedChat?.id === chatId) return;

      const chat = chats.find((c) => c.id === chatId);
      if (!chat) return;

      selectChat(chat);

      const cached = getCachedMessages(chatId);
      if (cached?.length) {
        updateMessages(cached, chatId);
      } else {
        await fetchMessages(chatId);
      }
    },
    [
      chats,
      selectedChat,
      getCachedMessages,
      updateMessages,
      fetchMessages,
      selectChat,
    ]
  );

  const value: ChatContextType = {
    selectedChat,
    messages,
    chats,
    loading,
    error,
    messagesCache,
    selectChat,
    updateMessages,
    setChats,
    setLoading,
    getCachedMessages,
    updateChatLastMessage,
    updateChatUnreadCount,
    fetchChats,
    fetchMessages,
    handleChatClick,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
