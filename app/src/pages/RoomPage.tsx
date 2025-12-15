import React, { useEffect, useState } from 'react';
import ChooseList from '../components/ChooseList/ChooseList';
import MainChatWindow from '../components/MainChatWindow/MainChatWindow';
import { websocketManager } from '../utils/websocket-manager';
import './room.scss';
import { useUser } from '../contexts/UserContext';
// import BackgroundComponent from '../components/BackgroundComponent/BackgroundComponent';

const RoomPage: React.FC = () => {
  const { user } = useUser();
  const userId = user!.id;

  useEffect(() => {
    console.log('WS: connecting', userId);
    websocketManager.connect(userId);

    return () => {
      websocketManager.disconnect();
    };
  }, [userId]);
  console.log('ROOMROOMROOMROOMROOMROOMROOMROOMROOMROOM');
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if ('serviceWorker' in navigator) {
    console.log('Service Worker registration');
    navigator.serviceWorker.register('/sw.js');
  }

  return (
    <>
      {windowWidth > 768 && (
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
      {/* {windowWidth > 768 && <BackgroundComponent />} */}

      <ChooseList />
      <MainChatWindow />
    </>
  );
};

export default RoomPage;
