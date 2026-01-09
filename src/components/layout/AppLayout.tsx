import React, { type ReactNode } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { SidebarProvider } from './SidebarContext';

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 p-6 bg-muted/20 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
