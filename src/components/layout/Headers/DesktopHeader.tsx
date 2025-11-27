'use client';

import React from 'react';
import NotificationDropdown from '@/components/ui/NotificationDropdown';

export default function DesktopHeader() {
  return (
    <header className="mb-4 hidden justify-end py-4 lg:flex">
      <NotificationDropdown />
    </header>
  );
}
