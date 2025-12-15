// components/Message/MessageTime.tsx
import React from 'react';

interface MessageTimeProps {
  date: string;
  className?: string;
}

const MessageTime: React.FC<MessageTimeProps> = ({ date, className = '' }) => {
  const formatTime = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      let hours = date.getHours();
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      return `${hours}:${minutes} ${ampm}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  return <span className={`time-left ${className}`}>{formatTime(date)}</span>;
};

export default MessageTime;
