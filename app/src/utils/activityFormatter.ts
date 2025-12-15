export const formatLastSeen = (lastSeenString: string | null): string => {
  if (!lastSeenString) {
    return 'long time ago';
  }

  try {
    const lastSeen = new Date(lastSeenString);
    const now = new Date();
    const diffMs = now.getTime() - lastSeen.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins <= 2) {
      return 'online';
    }

    if (lastSeen.toDateString() === now.toDateString()) {
      if (diffMins < 60) {
        return `${diffMins} min ago`;
      } else {
        return `today at ${lastSeen.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })}`;
      }
    }

    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (lastSeen.toDateString() === yesterday.toDateString()) {
      return `yesterday at ${lastSeen.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })}`;
    }

    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    if (lastSeen >= startOfWeek) {
      const days = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ];
      return `${days[lastSeen.getDay()]} at ${lastSeen.toLocaleTimeString(
        'en-US',
        {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        }
      )}`;
    }

    if (lastSeen.getFullYear() === now.getFullYear()) {
      return `${lastSeen.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })} at ${lastSeen.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })}`;
    }

    return `${lastSeen.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })}`;
  } catch (error) {
    console.error('Error formatting last seen:', error);
    return 'long time ago';
  }
};

export const formatLastSeenShort = (lastSeenString: string | null): string => {
  if (!lastSeenString) {
    return 'long ago';
  }

  try {
    const lastSeen = new Date(lastSeenString);
    const now = new Date();
    const diffMs = now.getTime() - lastSeen.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins <= 2) {
      return 'online';
    }

    if (diffMins < 60) {
      return `${diffMins}m ago`;
    }

    if (diffHours < 24) {
      return `${diffHours}h ago`;
    }

    if (diffDays === 1) {
      return 'yesterday';
    }

    if (diffDays < 7) {
      return `${diffDays}d ago`;
    }

    if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks}w ago`;
    }

    if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months}mo ago`;
    }

    const years = Math.floor(diffDays / 365);
    return `${years}y ago`;
  } catch (error) {
    return 'long ago';
  }
};

export const isUserOnline = (lastSeenString: string | null): boolean => {
  if (!lastSeenString) return false;

  try {
    const lastSeen = new Date(lastSeenString);
    const now = new Date();
    const diffMs = now.getTime() - lastSeen.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));

    return diffMins <= 5;
  } catch (error) {
    return false;
  }
};

export const formatTimeAMPM = (dateString: string | Date): string => {
  const date =
    typeof dateString === 'string' ? new Date(dateString) : dateString;

  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

export const formatDateTimeAMPM = (dateString: string | Date): string => {
  const date =
    typeof dateString === 'string' ? new Date(dateString) : dateString;
  const now = new Date();

  if (date.toDateString() === now.toDateString()) {
    return `Today at ${formatTimeAMPM(date)}`;
  }

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return `Yesterday at ${formatTimeAMPM(date)}`;
  }

  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  if (date >= startOfWeek) {
    const days = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    return `${days[date.getDay()]} at ${formatTimeAMPM(date)}`;
  }

  if (date.getFullYear() === now.getFullYear()) {
    return `${date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })} at ${formatTimeAMPM(date)}`;
  }

  return `${date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })} at ${formatTimeAMPM(date)}`;
};
