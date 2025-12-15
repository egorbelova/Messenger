import { useState, useRef, useEffect, useCallback, act } from 'react';
import { ThemeManager } from '../../utils';
import SendArea from '../SendArea/SendArea';
import MessageList from '../MessageList/MessageList';
import ChatHeader from '../ChatHeader/ChatHeader';
import BackgroundComponent from '../BackgroundComponent/BackgroundComponent';
import { useChat } from '../../contexts/ChatContext';
import SideBarMedia from '../SideBarMedia/SideBarMedia';
import styles from './MainChatWindow.module.scss';

interface MainChatWindowProps {
  staticUrl?: string;
  username: string;
  usernameId: string;
  roomDetails: {
    id: string;
    name: string;
  };
  users: string;
  roomId?: number | null;
  userInfo?: {
    id: number;
    username: string;
    email: string;
  } | null;
}

interface AttachmentTab {
  id: string;
  label: string;
}

const MainChatWindow: React.FC = () => {
  const [message, setMessage] = useState('');

  const audioRef = useRef<HTMLAudioElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { selectedChat } = useChat();

  const [sideBarVisible, setSideBarVisible] = useState(false);

  const themeManager = ThemeManager.getInstance();
  themeManager.setTheme('L');

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const handleHeaderClick = () => {
    setSideBarVisible(true);
  };

  const [appearanceMenuVisible, setAppearanceMenuVisible] = useState(true);
  const tabs: Array<'chats' | 'appearance'> = ['chats', 'appearance'];
  const [activeTab, setActiveTab] = useState<'chats' | 'appearance'>(
    'appearance'
  );

  const handleNextTab = () => {
    const currentIndex = tabs.indexOf(activeTab);
    const nextIndex = (currentIndex + 1) % tabs.length;
    setActiveTab(tabs[nextIndex]);
  };

  const handlePrevTab = () => {
    const currentIndex = tabs.indexOf(activeTab);
    const prevIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    setActiveTab(tabs[prevIndex]);
  };

  return (
    <div className='main_chat_window'>
      {windowWidth <= 768 && (
        <video
          autoPlay
          muted
          loop
          playsInline
          // @ts-ignore
          fetchPriority='high'
          preload='metadata'
          style={{
            position: 'absolute',
            right: 0,
            bottom: 0,
            minWidth: '100%',
            minHeight: '100%',
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'cover',
            zIndex: -1,
          }}
        >
          <source
            src='Videos/blue-sky-seen-directly-with-some-clouds_480p_infinity.webm'
            type='video/webm'
          />
          <track kind='captions' label='English' />
          Your browser does not support the video tag.
        </video>
      )}
      {/* {windowWidth <= 768 && <BackgroundComponent />} */}
      {selectedChat && (
        <>
          <ChatHeader onChatInfoClick={handleHeaderClick} />
          <div className={`room_wrapper ${sideBarVisible ? 'shifted' : ''}`}>
            <MessageList />
            <SendArea />
          </div>
          <SideBarMedia
            {...(selectedChat.room_type === 'G'
              ? { members: selectedChat.users }
              : {})}
            files={[]}
            visible={sideBarVisible}
            onClose={() => setSideBarVisible(false)}
          />
        </>
      )}
      {!selectedChat && (
        <div className={styles.noChatContainer}>
          <div
            className={styles.menuSwitch}
            onClick={() => setAppearanceMenuVisible(!appearanceMenuVisible)}
          >
            {appearanceMenuVisible ? 'X' : '?'}
          </div>
          {!appearanceMenuVisible && (
            <div className={styles.noChatText}>
              Select a chat to start messaging
            </div>
          )}
          {appearanceMenuVisible && (
            <div className={styles.tipsMenu}>
              {activeTab === 'appearance' && (
                <div className={styles.mainContent}>
                  <div className={styles.header}>Appearance</div>
                </div>
              )}
              {activeTab === 'chats' && (
                <div className={styles.mainContent}>
                  <div className={styles.header}>Chats</div>
                </div>
              )}
              <div className={styles.pageSwitch}>
                <div className={styles.switchButton} onClick={handlePrevTab}>
                  {'<'} Previous Tip
                </div>
                <div className={styles.switchButton} onClick={handleNextTab}>
                  Next Tip {'>'}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MainChatWindow;
