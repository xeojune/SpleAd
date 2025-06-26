import React from 'react';

interface SearchIconProps extends React.SVGProps<SVGSVGElement> {
  active?: boolean;
}

const SearchIcon: React.FC<SearchIconProps> = ({ active, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="23"
    height="23"
    viewBox="0 0 23 23"
    fill="none"
    {...props}
  >
    <path
      d="M22.1839 19.8527L18.4616 16.1318C21.2163 12.2548 20.8729 6.85672 17.3926 3.3776C13.522 -0.499361 7.24021 -0.499361 3.36188 3.3776C-0.516459 7.25456 -0.516459 13.5341 3.36188 17.4111C6.83443 20.8824 12.2423 21.2335 16.1206 18.4798L19.8429 22.2008C20.2018 22.5596 20.7793 22.5596 21.1382 22.2008L22.1839 21.1477C22.5429 20.7888 22.5429 20.2116 22.1839 19.8527ZM5.4142 15.3517C2.67517 12.6137 2.67517 8.16725 5.4142 5.42919C8.15322 2.69114 12.6012 2.69114 15.3402 5.42919C18.0793 8.16725 18.0793 12.6137 15.3402 15.3517C12.6012 18.0898 8.15322 18.0898 5.4142 15.3517Z"
      fill={active ? "#FF6EA5" : "#535F7B"}
    />
  </svg>
);

export default SearchIcon;