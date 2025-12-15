import React from 'react';

type IconProps = React.SVGProps<SVGSVGElement>;

export const ReplyIcon = (props: IconProps) => (
  <svg
    viewBox='0 0 24 24'
    width='20'
    height='20'
    fill='currentColor'
    {...props}
  >
    <path d='M10 9V5l-7 7 7 7v-4c6 0 10 2 12 6-1-5-4-12-12-12z' />
  </svg>
);

export const EditIcon = (props: IconProps) => (
  <svg
    viewBox='0 0 24 24'
    width='20'
    height='20'
    fill='currentColor'
    {...props}
  >
    <path d='M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z'></path>
  </svg>
);

export const CopyIcon = (props: IconProps) => (
  <svg
    viewBox='0 0 24 24'
    width='20'
    height='20'
    fill='currentColor'
    {...props}
  >
    <path d='M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z'></path>
  </svg>
);

export const DeleteIcon = (props: IconProps) => (
  <svg
    viewBox='0 0 24 24'
    width='20'
    height='20'
    fill='currentColor'
    {...props}
  >
    <path d='M6 19c0 1.1.9 2 2 2h8a2 2 0 002-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z'></path>
  </svg>
);

export const ForwardIcon = (props: IconProps) => (
  <svg
    viewBox='0 0 24 24'
    width='20'
    height='20'
    fill='currentColor'
    {...props}
  >
    <path d='M5 4v7h11l-4-4 1.41-1.41L20.83 12l-7.42 7.41L12 17l4-4H5v7H3V4z' />
  </svg>
);
