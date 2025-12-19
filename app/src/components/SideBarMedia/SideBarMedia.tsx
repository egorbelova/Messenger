import React, { useEffect, useState, useRef } from 'react';
import ProgressiveImage from '../Message/ProgressiveImage';
import styles from './SideBarMedia.module.scss';
import Avatar from '../Avatar/Avatar';
import Input from './Input';
import { formatLastSeen } from '../../utils/activityFormatter';
import { Icon } from '../Icons/AutoIcons';
import { useChat } from '../../contexts/ChatContext';
import { useUser } from '../../contexts/UserContext';

interface FileItem {
  id: number;
  file_url: string;
  category: 'image' | 'video' | 'audio' | 'document' | 'pdf';
  thumbnail_small_url?: string;
  thumbnail_medium_url?: string;
  width?: number;
  height?: number;
}

interface Member {
  id: number;
  username: string;
  last_seen?: string;
  thumbnail_small?: string;
}

interface SideBarMediaProps {
  files: FileItem[];
  visible: boolean;
  members?: Member[];
  onClose?: () => void;
}

const SideBarMedia: React.FC<SideBarMediaProps> = ({
  files,
  onClose,
  visible,
  members,
}) => {
  const hasImages = files.some((f) => f.category === 'image');
  const hasVideos = files.some((f) => f.category === 'video');
  const { selectedChat } = useChat();
  const { user } = useUser();

  const initialTab = hasImages
    ? 'images'
    : hasVideos
    ? 'videos'
    : members?.length
    ? 'members'
    : null;
  const [activeTab, setActiveTab] = useState<
    'images' | 'videos' | 'members' | null
  >(initialTab);

  const filterFiles = () => {
    switch (activeTab) {
      case 'images':
        return files.filter((f) => f.category === 'image');
      case 'videos':
        return files.filter((f) => f.category === 'video');
      default:
        return [];
    }
  };

  const displayedFiles = filterFiles();

  const [interlocutorEditVisible, setInterlocutorEditVisible] = useState(false);

  const onInterlocutorEditBack = () => setInterlocutorEditVisible(false);
  const onInterlocutorEdit = () => setInterlocutorEditVisible(true);

  const getDisplayInfo = () => {
    console.log(selectedChat);
    if (selectedChat.room_type === 'G') {
      return {
        displayName: selectedChat.name || 'Group Chat',
        //@ts-ignore
        imageSmall: selectedChat.image,
        //@ts-ignore
        imageMedium: selectedChat.image,
        //@ts-ignore
        photoRoll: [],
        subtitle: `${selectedChat.users.length} members`,
      };
    } else {
      const interlocutor = selectedChat.users.find(
        (chatUser) => chatUser.id !== user?.id
      );
      return {
        displayName: interlocutor?.username || 'Deleted User',
        //@ts-ignore
        imageSmall: interlocutor?.profile?.primary_photo?.small,
        //@ts-ignore
        imageMedium: interlocutor?.profile?.primary_photo?.medium,

        photoRoll:
          //@ts-ignore
          interlocutor?.profile?.photos?.filter((photo) => !photo.is_primary) ||
          [],
        subtitle: formatLastSeen(interlocutor!.last_seen),
      };
    }
  };

  const { displayName, imageSmall, imageMedium, photoRoll, subtitle } =
    getDisplayInfo();

  const [value, setValue] = useState(displayName);

  useEffect(() => {
    if (!interlocutorEditVisible) {
      setValue(displayName);
    }
  }, [interlocutorEditVisible, displayName]);

  const [isAvatarRollerOpen, setIsAvatarRollerOpen] = useState(false);

  useEffect(() => {
    setIsAvatarRollerOpen(false);
    setRollPosition(0);
  }, [selectedChat]);

  const sidebarRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sidebarRef.current || !imageSmall) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY > 0 && isAvatarRollerOpen) {
        setIsAvatarRollerOpen(false);
        setRollPosition(0);
      }

      if (
        e.deltaY < 0 &&
        sidebarRef.current.scrollTop === 0 &&
        !isAvatarRollerOpen
      ) {
        setIsAvatarRollerOpen(true);
        setRollPosition(0);
      }
    };

    const sidebar = sidebarRef.current;
    sidebar.addEventListener('wheel', handleWheel, { passive: true });

    return () => {
      sidebar.removeEventListener('wheel', handleWheel);
    };
  }, [isAvatarRollerOpen, selectedChat]);

  const [rollPosition, setRollPosition] = useState(0);

  const handleRollPositionChange = () => {
    if (interlocutorEditVisible || !isAvatarRollerOpen) return;
    if (rollPosition === photoRoll!.length) {
      setRollPosition(0);
    } else {
      setRollPosition(rollPosition + 1);
    }
  };

  useEffect(() => {
    setRollPosition(0);
  }, [interlocutorEditVisible]);

  return (
    <div
      className={`${styles.sidebar} ${visible ? styles.visible : ''}`}
      ref={sidebarRef}
    >
      <div className={styles.header}>
        <div
          onClick={interlocutorEditVisible ? onInterlocutorEditBack : onClose}
          className={styles.button}
        >
          {interlocutorEditVisible ? (
            <Icon name='Arrow' style={{ transform: 'rotate(180deg)' }} />
          ) : (
            <Icon name='Cross' />
          )}
        </div>

        <div
          className={`${styles.button} ${
            interlocutorEditVisible ? styles.hidden : ''
          }`}
          onClick={onInterlocutorEdit}
        >
          Edit
        </div>
      </div>

      <div
        className={`${styles['sidebar__avatar-container']} ${
          isAvatarRollerOpen && !interlocutorEditVisible
            ? styles['sidebar__avatar-container--roller']
            : ''
        } `}
      >
        <div
          className={`${styles['sidebar__avatar-wrapper']} ${
            interlocutorEditVisible
              ? styles['sidebar__avatar-wrapper--edit']
              : ''
          } ${
            isAvatarRollerOpen && !interlocutorEditVisible
              ? styles['sidebar__avatar-wrapper--roller']
              : ''
          }`}
          style={{ transform: `translateX(${rollPosition * -100}%)` }}
          onClick={handleRollPositionChange}
        >
          <Avatar
            displayName={displayName}
            imageUrl={isAvatarRollerOpen ? imageMedium : imageSmall}
            className={`${styles['sidebar__avatar']}`}
            onClick={
              imageSmall && !interlocutorEditVisible
                ? () => {
                    setIsAvatarRollerOpen(true);
                  }
                : undefined
            }
          />
          {photoRoll &&
            photoRoll.map((photo, index) => (
              <Avatar
                key={index}
                displayName={displayName}
                imageUrl={photo.medium}
                className={`${styles['sidebar__avatar']} ${
                  isAvatarRollerOpen && !interlocutorEditVisible
                    ? ''
                    : styles.hidden
                }`}
              />
            ))}
        </div>
        <div className={styles['sidebar__info']}>
          <div
            contentEditable={interlocutorEditVisible}
            suppressContentEditableWarning
            className={styles['sidebar__name']}
            onInput={
              interlocutorEditVisible
                ? (e) => setValue((e.target as HTMLDivElement).innerText)
                : undefined
            }
          >
            {value}
          </div>
          <span className={styles['sidebar__subtitle']}>{subtitle}</span>
        </div>
      </div>

      <div
        className={`${styles.sidebar__media} ${
          interlocutorEditVisible ? styles.hidden : ''
        }`}
      >
        <div className={styles.tabs}>
          {members && (
            <button
              className={`${styles.tab} ${
                activeTab === 'members' ? styles.active : ''
              }`}
              onClick={() => setActiveTab('members')}
            >
              Members
            </button>
          )}
          {hasImages && (
            <button
              className={`${styles.tab} ${
                activeTab === 'images' ? styles.active : ''
              }`}
              onClick={() => setActiveTab('images')}
            >
              Images
            </button>
          )}
          {hasVideos && (
            <button
              className={`${styles.tab} ${
                activeTab === 'videos' ? styles.active : ''
              }`}
              onClick={() => setActiveTab('videos')}
            >
              Videos
            </button>
          )}
        </div>

        <div className={styles.content}>
          {activeTab === 'members' && members && (
            <div className={styles.membersList}>
              {members.map((member) => (
                <div key={member.id} className={styles.memberItem}>
                  <Avatar
                    className={styles.memberAvatar}
                    displayName={member.username}
                    //@ts-ignore
                    imageUrl={member?.profile?.primary_photo?.small || ''}
                  />
                  <div className={styles.memberInfo}>
                    <span className={styles.memberName}>{member.username}</span>
                    <span className={styles.memberLastSeen}>
                      {formatLastSeen(member.last_seen)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {(activeTab === 'images' || activeTab === 'videos') &&
            displayedFiles.length > 0 && (
              <div className={styles.grid}>
                {displayedFiles.map((file) => {
                  if (file.category === 'image') {
                    return (
                      <ProgressiveImage
                        key={file.id}
                        small={file.thumbnail_small_url}
                        full={file.thumbnail_medium_url || file.file_url}
                        dominant_color='#eee'
                      />
                    );
                  }
                  if (file.category === 'video') {
                    return (
                      <video
                        key={file.id}
                        src={file.file_url}
                        className={styles.mediaItem}
                        controls
                      />
                    );
                  }
                  return null;
                })}
              </div>
            )}
        </div>
      </div>
      {interlocutorEditVisible && (
        <div className={`${styles.interlocutorEdit} ${styles.visible}`}>
          <div className={styles.form}>
            {selectedChat.room_type === 'D' && (
              <>
                {/* <Input placeholder='First Name' isRequired />
                <Input placeholder='Last Name' />
                <Input placeholder='Notes' /> */}
              </>
            )}
            {selectedChat.room_type === 'G' && (
              <>
                <Input
                  placeholder='Group Name'
                  isRequired
                  value={value}
                  onChange={setValue}
                />
                {/* <Input placeholder='Description' /> */}
              </>
            )}

            <div className={`${styles.button} ${styles.save}`}>Save</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SideBarMedia;
