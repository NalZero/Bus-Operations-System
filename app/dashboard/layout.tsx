'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import '@/styles/style.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <html lang="en">
      <body>
        <div className={`app-wrapper ${isCollapsed ? 'collapsed' : ''}`}>
          <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
          <div className="layout-right">
            <Topbar />
            <div className="layout-content">{children}</div>
          </div>
        </div>
      </body>
    </html>
  );
}
