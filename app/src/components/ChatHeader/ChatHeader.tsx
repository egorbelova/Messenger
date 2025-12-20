import React, { useState } from 'react';
import Icon from '../Icon/Icon';
import { useChat } from '../../contexts/ChatContext';
import { useUser } from '../../contexts/UserContext';
import Avatar from '../Avatar/Avatar';
import { formatLastSeen } from '../../utils/activityFormatter';
import styles from './ChatHeader.module.scss';

interface ChatHeaderProps {
  onGoHome?: () => void;
  onChatInfoClick?: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  onGoHome,
  onChatInfoClick,
}) => {
  const { selectedChat, messages } = useChat();
  const { user } = useUser();

  const handleGoHome = (e: React.MouseEvent) => {
    e.stopPropagation();
    onGoHome?.();
  };

  if (!selectedChat) {
    return;
  }

  const getDisplayInfo = () => {
    if (selectedChat.room_type === 'G') {
      return {
        displayName: selectedChat.name || 'Group Chat',
        imageUrl: selectedChat.image,
        subtitle: `${selectedChat.users.length} members`,
      };
    } else {
      const interlocutor = selectedChat.users.find(
        (chatUser) => chatUser.id !== user?.id
      );
      return {
        displayName: interlocutor?.username || 'Deleted User',
        //@ts-ignore
        imageUrl: interlocutor?.profile?.primary_photo?.small,
        subtitle: formatLastSeen(interlocutor!.last_seen),
      };
    }
  };

  const [avatarModalVisible, setAvatarModalVisible] = useState(false);
  const avatarClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAvatarModalVisible(true);
  };

  const { displayName, imageUrl, subtitle } = getDisplayInfo();

  return (
    <div id='opponent_title_name' onClick={onChatInfoClick}>
      <div
        className='go_home_page'
        onClick={handleGoHome}
        role='button'
        tabIndex={0}
        // onKeyDown={(e) => e.key === 'Enter' && handleGoHome()}
        aria-label='Go back to home'
      >
        <Icon name='arrow' className='arrow-left' />
      </div>

      <div id='name' title={displayName}>
        <span className='title_name'>{displayName}</span>
        {subtitle && <span className='title_name_subtitle'>{subtitle}</span>}
      </div>

      <div className='opponent_photo_div'>
        <Avatar
          displayName={displayName}
          imageUrl={imageUrl}
          className={styles.avatar}
          onClick={avatarClick}
        />

        {avatarModalVisible && (
          <Avatar
            displayName={displayName}
            imageUrl={imageUrl}
            className='user-info-avatar big'
          />
        )}
      </div>
    </div>
  );
};

export default ChatHeader;
