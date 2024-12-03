import React, { SVGProps } from "react";

export const PlusCircleIcon: React.FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    aria-hidden="true"
    fill="none"
    focusable="false"
    height="1em"
    width="1em"
    viewBox="0 0 24 24"
    role="presentation"
    {...props}
  >
    <circle cx="12" cy="12" r="12" fill="#4CAF50" />
    <path
      d="M12 6.5c.41 0 .75.34.75.75v4h4a.75.75 0 1 1 0 1.5h-4v4a.75.75 0 1 1-1.5 0v-4h-4a.75.75 0 1 1 0-1.5h4v-4c0-.41.34-.75.75-.75Z"
      fill="white"
    />
  </svg>
);

export default PlusCircleIcon;