import React, { forwardRef } from 'react';
import {
  txtdecode,
  lastMessageDateFormat,
  unreadCountFormat,
} from '../../utils/index';
import Avatar from '../Avatar/Avatar';
import type { User } from '../../types';
import styles from './ChatListItem.module.scss';

export interface ChatListItemProps {
  chat: {
    id: number;
    name: string | null;
    users: User[];
    room_type: 'D' | 'G';
    image: string | null;
  };
  displayName: string;
  interlocutor: User | null;
  chatType: 'dialog' | 'group';
  lastMessage: any | null;
  unread_count: number;
  isActive: boolean;
  onChatClick: (chatId: number) => void;
}

const ChatListItem = forwardRef<HTMLFormElement, ChatListItemProps>(
  (
    {
      chat,
      displayName,
      interlocutor,
      chatType,
      lastMessage,
      unread_count,
      isActive,
      onChatClick,
    },
    ref
  ) => {
    const lastMessageDate =
      lastMessage && lastMessageDateFormat(lastMessage.date);

    const lastMessageText = lastMessage && lastMessage.value;

    const lastMessageFiles = lastMessage?.files?.slice(0, 3) || [];

    const unread_counter = unreadCountFormat(unread_count);

    const getAvatarUrl = (): string | null => {
      if (chat.image) {
        return chat.image;
      }
      //@ts-ignore
      if (
        chatType === 'dialog' &&
        //@ts-ignore
        interlocutor?.profile?.primary_photo?.small
      ) {
        //@ts-ignore
        return interlocutor.profile.primary_photo.small;
      }
      return null;
    };

    const avatarUrl = getAvatarUrl();

    const goToChat = (
      e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
    ): void => {
      e.preventDefault();
      e.stopPropagation();
      onChatClick(chat.id);
    };

    return (
      // <SquircleContainer
      //   style={{
      //     width: '100%',
      //     height: '100%',
      //   }}
      //   cornerRadiusPx={20}
      //   smoothness={1}
      // >
      <a
        href={`#${chat.id}`}
        className={`users_full_form ${isActive ? 'active' : ''}`}
        onMouseDown={goToChat}
      >
        <Avatar
          displayName={displayName}
          imageUrl={avatarUrl}
          className={styles.avatar}
        />

        <div className='username_and_last_message'>
          <div className='users'>
            <div className='chat_name'>{displayName}</div>
            <div className='room_last_message_date'>{lastMessageDate}</div>
          </div>
          <div className='room_last_message'>
            <div className='last_message_text'>
              {lastMessageFiles.length > 0 && (
                <div className='last_message_files'>
                  {lastMessageFiles.map((file: any, index: number) => {
                    switch (file.category) {
                      case 'image':
                        return (
                          <img
                            key={index}
                            className='last_message_file'
                            src={file.thumbnail_small_url}
                            alt={
                              file.original_name || `Attachment ${index + 1}`
                            }
                          />
                        );
                      case 'video':
                        return (
                          <video
                            key={index}
                            className='last_message_file'
                            src={file.thumbnail_small_url}
                            loop
                            muted
                            playsInline
                            autoPlay
                          />
                        );
                      default:
                        return (
                          <a
                            key={index}
                            href={file.file_url}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='last_message_file'
                          >
                            {file.original_name || `Attachment ${index + 1}`}
                          </a>
                        );
                    }
                  })}
                </div>
              )}

              {lastMessageText
                ? lastMessageText
                : `${lastMessageFiles.length} Photos`}
            </div>
            {unread_count > 0 && (
              <span className='unread_messages_count'>{unread_counter}</span>
            )}
          </div>
        </div>
      </a>
      // </SquircleContainer>
    );
  }
);

ChatListItem.displayName = 'ChatListItem';

export default ChatListItem;
