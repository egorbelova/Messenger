// components/SVGSprites/SVGSprites.tsx
const SVGSprites: React.FC = () => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      style={{
        visibility: 'hidden',
        position: 'absolute',
        width: '0',
        height: '0',
      }}
    >
      <symbol id='chats-icon' viewBox='0 0 256 256'>
        <path d='M232.07 186.76a80 80 0 0 0-62.5-114.17a80 80 0 1 0-145.64 66.17l-7.27 24.71a16 16 0 0 0 19.87 19.87l24.71-7.27a80.39 80.39 0 0 0 25.18 7.35a80 80 0 0 0 108.34 40.65l24.71 7.27a16 16 0 0 0 19.87-19.86Zm-16.25 1.47L224 216l-27.76-8.17a8 8 0 0 0-6 .63a64.05 64.05 0 0 1-85.87-24.88a79.93 79.93 0 0 0 70.33-93.87a64 64 0 0 1 41.75 92.48a8 8 0 0 0-.63 6.04' />
      </symbol>

      <symbol id='arrow' viewBox='0 0 24 24'>
        <path
          fill='none'
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth='1.5'
          d='m10 17l5-5l-5-5'
        />
      </symbol>

      <symbol id='send-phone' viewBox='0 0 24 24'>
        <path
          fill='none'
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth='1.5'
          d='m6.998 10.247l.435.76c.277.485.415.727.415.993s-.138.508-.415.992l-.435.761c-1.238 2.167-1.857 3.25-1.375 3.788c.483.537 1.627.037 3.913-.963l6.276-2.746c1.795-.785 2.693-1.178 2.693-1.832c0-.654-.898-1.047-2.693-1.832L9.536 7.422c-2.286-1-3.43-1.5-3.913-.963c-.482.537.137 1.62 1.375 3.788Z'
        />
      </symbol>

      <symbol id='input-attach' viewBox='0 0 24 24'>
        <path
          d='M20 10.9696L11.9628 18.5497C10.9782 19.4783 9.64274 20 8.25028 20C6.85782 20 5.52239 19.4783
                4.53777 18.5497C3.55315 17.6211 3 16.3616 3 15.0483C3 13.7351 3.55315 12.4756 4.53777 11.547L12.575
                3.96687C13.2314 3.34779 14.1217 3 15.05 3C15.9783 3 16.8686 3.34779 17.525 3.96687C18.1814 4.58595
                18.5502 5.4256 18.5502 6.30111C18.5502 7.17662 18.1814 8.01628 17.525 8.63535L9.47904 16.2154C9.15083
                16.525 8.70569 16.6989 8.24154 16.6989C7.77738 16.6989 7.33224 16.525 7.00403 16.2154C6.67583 15.9059
                6.49144 15.4861 6.49144 15.0483C6.49144 14.6106 6.67583 14.1907 7.00403 13.8812L14.429 6.88674'
          strokeWidth='1.5'
          strokeLinecap='round'
          strokeLinejoin='round'
          fill='none'
        />
      </symbol>

      <symbol id='camera-svg' viewBox='0 0 24 24'>
        <path
          fill='none'
          d='M3,9A1,1,0,0,0,4,8V5A1,1,0,0,1,5,4H8A1,1,0,0,0,8,2H5A3,3,0,0,0,2,5V8A1,1,0,0,0,3,9ZM8,20H5a1,1,0,0,1-1-1V16a1,1,0,0,0-2,0v3a3,3,0,0,0,3,3H8a1,1,0,0,0,0-2ZM12,8a4,4,0,1,0,4,4A4,4,0,0,0,12,8Zm0,6a2,2,0,1,1,2-2A2,2,0,0,1,12,14ZM19,2H16a1,1,0,0,0,0,2h3a1,1,0,0,1,1,1V8a1,1,0,0,0,2,0V5A3,3,0,0,0,19,2Zm2,13a1,1,0,0,0-1,1v3a1,1,0,0,1-1,1H16a1,1,0,0,0,0,2h3a3,3,0,0,0,3-3V16A1,1,0,0,0,21,15Z'
        ></path>
      </symbol>

      <defs>
        <linearGradient id='strokeGradient'>
          <stop offset='0%' stopColor='#ffffff' />
          <stop offset='100%' stopColor='#ccc' />
        </linearGradient>

        <linearGradient
          id='strokeGradientCustomColor'
          x1='0%'
          y1='0%'
          x2='0%'
          y2='100%'
        >
          <stop offset='0%' stopColor='var(--myColor3)' />
          <stop offset='35%' stopColor='var(--myColor2)' />
          <stop offset='100%' stopColor='var(--myColor1)' />
        </linearGradient>
      </defs>
      <symbol id='search-icon' viewBox='0 0 17 48'>
        <path d='m16.2294 29.9556-4.1755-4.0821a6.4711 6.4711 0 1 0 -1.2839 1.2625l4.2005 4.1066a.9.9 0 1 0 1.2588-1.287zm-14.5294-8.0017a5.2455 5.2455 0 1 1 5.2455 5.2527 5.2549 5.2549 0 0 1 -5.2455-5.2527z' />
      </symbol>
      <symbol id='loading-chats' viewBox='0 0 300 300'>
        <path
          fill='none'
          strokeWidth='15'
          strokeLinecap='round'
          strokeDasharray='300 385'
          strokeDashoffset='0'
          d='M275 75c0 31-27 50-50 50-58 0-92-100-150-100-28 0-50 22-50 50s23 50 50 50c58 0 92-100 150-100 24 0 50 19 50 50Z'
        >
          <animate
            attributeName='stroke-dashoffset'
            calcMode='spline'
            dur='2'
            values='685;-685'
            keySplines='0 0 1 1'
            repeatCount='indefinite'
          ></animate>
        </path>
      </symbol>
      <symbol id='reply'>
        <path d='M6.598 5.013a.144.144 0 0 1 .202.134V6.3a.5.5 0 0 0 .5.5c.667 0 2.013.005 3.3.822c.984.624 1.99 1.76 2.595 3.876c-1.02-.983-2.185-1.516-3.205-1.799a8.7 8.7 0 0 0-1.921-.306a7 7 0 0 0-.798.008h-.013l-.005.001h-.001L7.3 9.9l-.05-.498a.5.5 0 0 0-.45.498v1.153c0 .108-.11.176-.202.134L2.614 8.254l-.042-.028a.147.147 0 0 1 0-.252l.042-.028zM7.8 10.386q.103 0 .223.006c.434.02 1.034.086 1.7.271c1.326.368 2.896 1.202 3.94 3.08a.5.5 0 0 0 .933-.305c-.464-3.71-1.886-5.662-3.46-6.66c-1.245-.79-2.527-.942-3.336-.971v-.66a1.144 1.144 0 0 0-1.767-.96l-3.994 2.94a1.147 1.147 0 0 0 0 1.946l3.994 2.94a1.144 1.144 0 0 0 1.767-.96z' />
      </symbol>
    </svg>
  );
};

export default SVGSprites;
