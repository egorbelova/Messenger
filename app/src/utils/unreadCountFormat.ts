export const unreadCountFormat = (count: number): string => {
  if (count < 1000) {
    return count.toString();
  }

  if (count < 10000) {
    // 1000-9999: 1.2K, 4.5K, 9.9K
    const formatted = (Math.floor(count / 100) / 10).toFixed(1);
    return formatted.endsWith('.0')
      ? formatted.slice(0, -2) + 'K'
      : formatted + 'K';
  }

  if (count < 100000) {
    // 10000-99999: 10.2K, 45.2K, 99.9K
    const formatted = (Math.floor(count / 100) / 10).toFixed(1);
    return formatted.endsWith('.0')
      ? formatted.slice(0, -2) + 'K'
      : formatted + 'K';
  }

  if (count < 1000000) {
    // 100000-999999: 100K, 452K, 999K
    return Math.floor(count / 1000) + 'K';
  }

  if (count < 10000000) {
    // 1M-9.9M: 1.2M, 4.5M
    const formatted = (Math.floor(count / 100000) / 10).toFixed(1);
    return formatted.endsWith('.0')
      ? formatted.slice(0, -2) + 'M'
      : formatted + 'M';
  }

  if (count < 100000000) {
    // 10M-99.9M: 10.2M, 45.2M
    const formatted = (Math.floor(count / 100000) / 10).toFixed(1);
    return formatted.endsWith('.0')
      ? formatted.slice(0, -2) + 'M'
      : formatted + 'M';
  }

  if (count < 1000000000) {
    // 100M-999M: 100M, 452M
    return Math.floor(count / 1000000) + 'M';
  }

  // 1B+
  const formatted = (Math.floor(count / 100000000) / 10).toFixed(1);
  return formatted.endsWith('.0')
    ? formatted.slice(0, -2) + 'B'
    : formatted + 'B';
};
