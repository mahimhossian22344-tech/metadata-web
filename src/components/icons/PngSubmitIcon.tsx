import React from 'react';

export interface PlatformIconProps {
  className?: string;
  isSelected?: boolean;
}

/**
 * PNG Platform / Pngtree Graphical Icon (100% Vector Icon, No Text)
 * Clean stylized tree canopy and trunk in vibrant green & white.
 */
export const PngSubmitIcon: React.FC<PlatformIconProps> = ({ className = 'w-6 h-6' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="PNG Platform"
  >
    <defs>
      <linearGradient id="pngtree-icon-grad" x1="4" y1="2" x2="20" y2="18" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#34d399" />
        <stop offset="100%" stopColor="#00d084" />
      </linearGradient>
    </defs>
    
    {/* Stylized Pngtree Canopy (lush cloud / tree silhouette) */}
    <path
      d="M12 3C9 3 6.5 5.2 6 8.1C4.4 8.9 3.2 10.6 3.2 12.6C3.2 15.4 5.4 17.6 8.2 17.6H15.8C18.6 17.6 20.8 15.4 20.8 12.6C20.8 10.3 19.3 8.4 17.2 7.9C16.7 5.1 14.5 3 12 3Z"
      fill="url(#pngtree-icon-grad)"
    />

    {/* Tree Trunk & Ground Base */}
    <path
      d="M12 13V21M12 21H9.5M12 21H14.5"
      stroke="#ffffff"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* Tree Branches / Leaf Accent Veins */}
    <path
      d="M12 7V13M12 9.5L9.5 11.5M12 11L14.5 12.5"
      stroke="#ffffff"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity="0.9"
    />
  </svg>
);

