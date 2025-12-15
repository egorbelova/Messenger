// contexts/MessagesContext.tsx
import React, { createContext, useContext, useReducer } from 'react';

interface Message {
  id: number;
  value: string;
  date: string;
  user: number;
  room: number;
  liked: number;
}

interface MessagesState {
  messages: { [roomId: number]: Message[] };
  loading: boolean;
  error: string | null;
}

type MessagesAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOAD_MESSAGES'; payload: { roomId: number; messages: Message[] } }
  | { type: 'ADD_MESSAGE'; payload: { roomId: number; message: Message } }
  | {
      type: 'UPDATE_MESSAGE';
      payload: { roomId: number; messageId: number; updates: Partial<Message> };
    }
  | { type: 'DELETE_MESSAGE'; payload: { roomId: number; messageId: number } }
  | { type: 'LIKE_MESSAGE'; payload: { roomId: number; messageId: number } };

const initialState: MessagesState = {
  messages: {},
  loading: false,
  error: null,
};

const messagesReducer = (
  state: MessagesState,
  action: MessagesAction
): MessagesState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload };

    case 'LOAD_MESSAGES':
      return {
        ...state,
        messages: {
          ...state.messages,
          [action.payload.roomId]: action.payload.messages,
        },
      };

    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: {
          ...state.messages,
          [action.payload.roomId]: [
            ...(state.messages[action.payload.roomId] || []),
            action.payload.message,
          ],
        },
      };

    case 'UPDATE_MESSAGE':
      return {
        ...state,
        messages: {
          ...state.messages,
          [action.payload.roomId]: (
            state.messages[action.payload.roomId] || []
          ).map((msg) =>
            msg.id === action.payload.messageId
              ? { ...msg, ...action.payload.updates }
              : msg
          ),
        },
      };

    case 'DELETE_MESSAGE':
      return {
        ...state,
        messages: {
          ...state.messages,
          [action.payload.roomId]: (
            state.messages[action.payload.roomId] || []
          ).filter((msg) => msg.id !== action.payload.messageId),
        },
      };

    case 'LIKE_MESSAGE':
      return {
        ...state,
        messages: {
          ...state.messages,
          [action.payload.roomId]: (
            state.messages[action.payload.roomId] || []
          ).map((msg) =>
            msg.id === action.payload.messageId
              ? { ...msg, liked: msg.liked + 1 }
              : msg
          ),
        },
      };

    default:
      return state;
  }
};

interface MessagesContextType {
  state: MessagesState;
  dispatch: React.Dispatch<MessagesAction>;
  getRoomMessages: (roomId: number) => Message[];
  addMessage: (roomId: number, message: Message) => void;
  updateMessage: (
    roomId: number,
    messageId: number,
    updates: Partial<Message>
  ) => void;
  deleteMessage: (roomId: number, messageId: number) => void;
  likeMessage: (roomId: number, messageId: number) => void;
  loadMessages: (roomId: number, messages: Message[]) => void;
}

const MessagesContext = createContext<MessagesContextType | undefined>(
  undefined
);

export const MessagesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(messagesReducer, initialState);

  const getRoomMessages = (roomId: number): Message[] => {
    return state.messages[roomId] || [];
  };

  const addMessage = (roomId: number, message: Message) => {
    dispatch({ type: 'ADD_MESSAGE', payload: { roomId, message } });
  };

  const updateMessage = (
    roomId: number,
    messageId: number,
    updates: Partial<Message>
  ) => {
    dispatch({
      type: 'UPDATE_MESSAGE',
      payload: { roomId, messageId, updates },
    });
  };

  const deleteMessage = (roomId: number, messageId: number) => {
    dispatch({ type: 'DELETE_MESSAGE', payload: { roomId, messageId } });
  };

  const likeMessage = (roomId: number, messageId: number) => {
    dispatch({ type: 'LIKE_MESSAGE', payload: { roomId, messageId } });
  };

  const loadMessages = (roomId: number, messages: Message[]) => {
    dispatch({ type: 'LOAD_MESSAGES', payload: { roomId, messages } });
  };

  const value: MessagesContextType = {
    state,
    dispatch,
    getRoomMessages,
    addMessage,
    updateMessage,
    deleteMessage,
    likeMessage,
    loadMessages,
  };

  return (
    <MessagesContext.Provider value={value}>
      {children}
    </MessagesContext.Provider>
  );
};

export const useMessages = (): MessagesContextType => {
  const context = useContext(MessagesContext);
  if (!context) {
    throw new Error('useMessages must be used within a MessagesProvider');
  }
  return context;
};
