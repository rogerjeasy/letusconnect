import React, { SVGProps } from "react";

export const TrashIcon: React.FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    aria-hidden="true"
    fill="none"
    focusable="false"
    height="1em"
    role="presentation"
    viewBox="0 0 24 24"
    width="1em"
    {...props}
  >
    <path
      d="M21 5.5h-4.18l-.39-1.56c-.22-.88-.85-1.62-1.63-1.92C14.02 2 13.01 2 12 2s-2.02 0-2.8.02c-.78.3-1.41 1.04-1.63 1.92L7.18 5.5H3c-.55 0-1 .45-1 1s.45 1 1 1h18c.55 0 1-.45 1-1s-.45-1-1-1ZM8.04 21c.4 1.03 1.52 2 3.96 2s3.56-.97 3.96-2l1.03-13H7.01l1.03 13ZM12 18c-.55 0-1-.45-1-1v-6c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1Z"
      fill="currentColor"
    />
  </svg>
);

export default TrashIcon;