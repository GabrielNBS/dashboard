'use client';

import dynamic from 'next/dynamic';

const LordIcon = dynamic(() => import('./LordIcon'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        width: '24px',
        height: '24px',
        backgroundColor: 'transparent',
      }}
    />
  ),
});

export default LordIcon;
