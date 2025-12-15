import React from "react";

export type IconName = "Arrow" | "Attachment" | "Chats" | "CopyMedia" | "CopyText" | "Cross" | "Delete" | "Edit" | "Forward" | "Read" | "Reply" | "SaveAs" | "Select" | "Selfie" | "SendDestkop" | "SendMobile" | "Unread";
export type IconProps = React.SVGProps<SVGSVGElement> & {
  name: IconName;
};

export const IconsSprite = () => (
  <svg style={{ display: "none" }} xmlns="http://www.w3.org/2000/svg">
    <symbol id="icon-Arrow" viewBox="0 0 24 24"><title>Arrow-ios-forward-outline SVG Icon</title><path fill="currentColor" d="M10 19a1 1 0 0 1-.64-.23a1 1 0 0 1-.13-1.41L13.71 12L9.39 6.63a1 1 0 0 1 .15-1.41a1 1 0 0 1 1.46.15l4.83 6a1 1 0 0 1 0 1.27l-5 6A1 1 0 0 1 10 19"/></symbol>
    <symbol id="icon-Attachment" viewBox="0 0 24 24">
<path
    d="M20 10.9696L11.9628 18.5497C10.9782 19.4783 9.64274 20 8.25028 20C6.85782 20 5.52239 19.4783
                4.53777 18.5497C3.55315 17.6211 3 16.3616 3 15.0483C3 13.7351 3.55315 12.4756 4.53777 11.547L12.575
                3.96687C13.2314 3.34779 14.1217 3 15.05 3C15.9783 3 16.8686 3.34779 17.525 3.96687C18.1814 4.58595
                18.5502 5.4256 18.5502 6.30111C18.5502 7.17662 18.1814 8.01628 17.525 8.63535L9.47904 16.2154C9.15083
                16.525 8.70569 16.6989 8.24154 16.6989C7.77738 16.6989 7.33224 16.525 7.00403 16.2154C6.67583 15.9059
                6.49144 15.4861 6.49144 15.0483C6.49144 14.6106 6.67583 14.1907 7.00403 13.8812L14.429 6.88674"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    fill="none"
/>
</symbol>
    <symbol id="icon-Chats" viewBox="0 0 256 256"><path fill="#fff" d="M232.07 186.76a80 80 0 0 0-62.5-114.17a80 80 0 1 0-145.64 66.17l-7.27 24.71a16 16 0 0 0 19.87 19.87l24.71-7.27a80.39 80.39 0 0 0 25.18 7.35a80 80 0 0 0 108.34 40.65l24.71 7.27a16 16 0 0 0 19.87-19.86Zm-16.25 1.47L224 216l-27.76-8.17a8 8 0 0 0-6 .63a64.05 64.05 0 0 1-85.87-24.88a79.93 79.93 0 0 0 70.33-93.87a64 64 0 0 1 41.75 92.48a8 8 0 0 0-.63 6.04"/></symbol>
    <symbol id="icon-CopyMedia" viewBox="0 0 24 24"><title>Image SVG Icon</title><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"><path d="M2 6a4 4 0 0 1 4-4h12a4 4 0 0 1 4 4v12a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4z"/><circle cx="8.5" cy="8.5" r="2.5"/><path d="M14.526 12.621L6 22h12.133A3.867 3.867 0 0 0 22 18.133V18c0-.466-.175-.645-.49-.99l-4.03-4.395a2 2 0 0 0-2.954.006"/></g></symbol>
    <symbol id="icon-CopyText" viewBox="0 0 24 24"><title>Copy SVG Icon</title><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"><path d="M8 4v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7.242a2 2 0 0 0-.602-1.43L16.083 2.57A2 2 0 0 0 14.685 2H10a2 2 0 0 0-2 2"/><path d="M16 18v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h2"/></g></symbol>
    <symbol id="icon-Cross" viewBox="0 0 24 24"><title>Cross SVG Icon</title><path fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M20 20L4 4m16 0L4 20"/></symbol>
    <symbol id="icon-Delete" viewBox="0 0 16 16"><title>Delete-16-regular SVG Icon</title><path fill="currentColor" d="M7 3h2a1 1 0 0 0-2 0M6 3a2 2 0 1 1 4 0h4a.5.5 0 0 1 0 1h-.564l-1.205 8.838A2.5 2.5 0 0 1 9.754 15H6.246a2.5 2.5 0 0 1-2.477-2.162L2.564 4H2a.5.5 0 0 1 0-1zm1 3.5a.5.5 0 0 0-1 0v5a.5.5 0 0 0 1 0zM9.5 6a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-1 0v-5a.5.5 0 0 1 .5-.5m-4.74 6.703A1.5 1.5 0 0 0 6.246 14h3.508a1.5 1.5 0 0 0 1.487-1.297L12.427 4H3.573z"/></symbol>
    <symbol id="icon-Edit" viewBox="0 0 24 24"><title>Edit SVG Icon</title><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"><path d="m16.475 5.408l2.117 2.117m-.756-3.982L12.109 9.27a2.118 2.118 0 0 0-.58 1.082L11 13l2.648-.53c.41-.082.786-.283 1.082-.579l5.727-5.727a1.853 1.853 0 1 0-2.621-2.621"/><path d="M19 15v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h3"/></g></symbol>
    <symbol id="icon-Forward" viewBox="0 0 24 24"><title>Arrow-forward-thick SVG Icon</title><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m22 11l-7-9v5C3.047 7 1.668 16.678 2 22c.502-2.685.735-7 13-7v5z"/></symbol>
    <symbol id="icon-Read" viewBox="0 0 16 11"><title>msg-dblcheck</title><path d="M11.0714 0.652832C10.991 0.585124 10.8894 0.55127 10.7667 0.55127C10.6186 0.55127 10.4916 0.610514 10.3858 0.729004L4.19688 8.36523L1.79112 6.09277C1.7488 6.04622 1.69802 6.01025 1.63877 5.98486C1.57953 5.95947 1.51817 5.94678 1.45469 5.94678C1.32351 5.94678 1.20925 5.99544 1.11192 6.09277L0.800883 6.40381C0.707784 6.49268 0.661235 6.60482 0.661235 6.74023C0.661235 6.87565 0.707784 6.98991 0.800883 7.08301L3.79698 10.0791C3.94509 10.2145 4.11224 10.2822 4.29844 10.2822C4.40424 10.2822 4.5058 10.259 4.60313 10.2124C4.70046 10.1659 4.78086 10.1003 4.84434 10.0156L11.4903 1.59863C11.5623 1.5013 11.5982 1.40186 11.5982 1.30029C11.5982 1.14372 11.5348 1.01888 11.4078 0.925781L11.0714 0.652832ZM8.6212 8.32715C8.43077 8.20866 8.2488 8.09017 8.0753 7.97168C7.99489 7.89128 7.8891 7.85107 7.75791 7.85107C7.6098 7.85107 7.4892 7.90397 7.3961 8.00977L7.10411 8.33984C7.01947 8.43717 6.97715 8.54508 6.97715 8.66357C6.97715 8.79476 7.0237 8.90902 7.1168 9.00635L8.1959 10.0791C8.33132 10.2145 8.49636 10.2822 8.69102 10.2822C8.79681 10.2822 8.89838 10.259 8.99571 10.2124C9.09304 10.1659 9.17556 10.1003 9.24327 10.0156L15.8639 1.62402C15.9358 1.53939 15.9718 1.43994 15.9718 1.32568C15.9718 1.1818 15.9125 1.05697 15.794 0.951172L15.4386 0.678223C15.3582 0.610514 15.2587 0.57666 15.1402 0.57666C14.9964 0.57666 14.8715 0.635905 14.7657 0.754395L8.6212 8.32715Z"></path></symbol>
    <symbol id="icon-Reply" viewBox="0 0 24 24"><title>Reply SVG Icon</title><g fill="none"><path d="M2 10.981L8.973 2v4.99c11.952 0 13.316 9.688 12.984 15.01l-.007-.041c-.502-2.685-.712-6.986-12.977-6.986v4.99L2 10.98z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></g></symbol>
    <symbol id="icon-SaveAs" viewBox="0 0 24 24"><title>Download SVG Icon</title><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15V3m0 12l-4-4m4 4l4-4M2 17l.621 2.485A2 2 0 0 0 4.561 21h14.878a2 2 0 0 0 1.94-1.515L22 17"/></symbol>
    <symbol id="icon-Select" viewBox="0 0 24 24"><title>Circle-check SVG Icon</title><g fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="m8 12.5l3 3l5-6"/><circle cx="12" cy="12" r="10"/></g></symbol>
    <symbol id="icon-Selfie" viewBox="0 0 24 24">
  <path d="M3,9A1,1,0,0,0,4,8V5A1,1,0,0,1,5,4H8A1,1,0,0,0,8,2H5A3,3,0,0,0,2,5V8A1,1,0,0,0,3,9ZM8,20H5a1,1,0,0,1-1-1V16a1,1,0,0,0-2,0v3a3,3,0,0,0,3,3H8a1,1,0,0,0,0-2ZM12,8a4,4,0,1,0,4,4A4,4,0,0,0,12,8Zm0,6a2,2,0,1,1,2-2A2,2,0,0,1,12,14ZM19,2H16a1,1,0,0,0,0,2h3a1,1,0,0,1,1,1V8a1,1,0,0,0,2,0V5A3,3,0,0,0,19,2Zm2,13a1,1,0,0,0-1,1v3a1,1,0,0,1-1,1H16a1,1,0,0,0,0,2h3a3,3,0,0,0,3-3V16A1,1,0,0,0,21,15Z"></path>
</symbol>
    <symbol id="icon-SendDestkop" viewBox="0 0 24 24">
<path
    d="M21.66,12a2,2,0,0,1-1.14,1.81L5.87,20.75A2.08,2.08,0,0,1,5,21a2,2,0,0,1-1.82-2.82L5.46,13H11a1,1,0,0,0,0-2H5.46L3.18,5.87A2,2,0,0,1,5.86,3.25h0l14.65,6.94A2,2,0,0,1,21.66,12Z"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
/>
</symbol>
    <symbol id="icon-SendMobile" viewBox="0 0 24 24">
    <path fill="none" strokeWidth="1.5" d="m6.998 10.247l.435.76c.277.485.415.727.415.993s-.138.508-.415.992l-.435.761c-1.238 2.167-1.857 3.25-1.375 3.788c.483.537 1.627.037 3.913-.963l6.276-2.746c1.795-.785 2.693-1.178 2.693-1.832c0-.654-.898-1.047-2.693-1.832L9.536 7.422c-2.286-1-3.43-1.5-3.913-.963c-.482.537.137 1.62 1.375 3.788Z"/>
</symbol>
    <symbol id="icon-Unread" viewBox="0 0 12 11"><title>msg-check</title><path d="M11.1549 0.652832C11.0745 0.585124 10.9729 0.55127 10.8502 0.55127C10.7021 0.55127 10.5751 0.610514 10.4693 0.729004L4.28038 8.36523L1.87461 6.09277C1.8323 6.04622 1.78151 6.01025 1.72227 5.98486C1.66303 5.95947 1.60166 5.94678 1.53819 5.94678C1.407 5.94678 1.29275 5.99544 1.19541 6.09277L0.884379 6.40381C0.79128 6.49268 0.744731 6.60482 0.744731 6.74023C0.744731 6.87565 0.79128 6.98991 0.884379 7.08301L3.88047 10.0791C4.02859 10.2145 4.19574 10.2822 4.38194 10.2822C4.48773 10.2822 4.58929 10.259 4.68663 10.2124C4.78396 10.1659 4.86436 10.1003 4.92784 10.0156L11.5738 1.59863C11.6458 1.5013 11.6817 1.40186 11.6817 1.30029C11.6817 1.14372 11.6183 1.01888 11.4913 0.925781L11.1549 0.652832Z"></path></symbol>
  </svg>
);

const iconViewBoxes: Record<IconName, string> = {
  "Arrow": "0 0 24 24",
  "Attachment": "0 0 24 24",
  "Chats": "0 0 256 256",
  "CopyMedia": "0 0 24 24",
  "CopyText": "0 0 24 24",
  "Cross": "0 0 24 24",
  "Delete": "0 0 16 16",
  "Edit": "0 0 24 24",
  "Forward": "0 0 24 24",
  "Read": "0 0 16 11",
  "Reply": "0 0 24 24",
  "SaveAs": "0 0 24 24",
  "Select": "0 0 24 24",
  "Selfie": "0 0 24 24",
  "SendDestkop": "0 0 24 24",
  "SendMobile": "0 0 24 24",
  "Unread": "0 0 12 11"
};

export const Icon: React.FC<IconProps> = ({ name, ...props }) => (
  <svg viewBox={iconViewBoxes[name]} {...props}>
    <use href={`#icon-${name}`} />
  </svg>
);

export const iconsList = {
  "Arrow": "icon-Arrow",
  "Attachment": "icon-Attachment",
  "Chats": "icon-Chats",
  "CopyMedia": "icon-CopyMedia",
  "CopyText": "icon-CopyText",
  "Cross": "icon-Cross",
  "Delete": "icon-Delete",
  "Edit": "icon-Edit",
  "Forward": "icon-Forward",
  "Read": "icon-Read",
  "Reply": "icon-Reply",
  "SaveAs": "icon-SaveAs",
  "Select": "icon-Select",
  "Selfie": "icon-Selfie",
  "SendDestkop": "icon-SendDestkop",
  "SendMobile": "icon-SendMobile",
  "Unread": "icon-Unread"
};
