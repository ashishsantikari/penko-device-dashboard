import React from 'react';
import { Link, useLocation } from 'wouter';
import { useTranslation } from 'react-i18next';
import { LayoutDashboard, Box, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSidebar } from './SidebarContext';
import { Button } from '@/components/ui/button';

export const Sidebar: React.FC = () => {
  const { t } = useTranslation();
  const [location] = useLocation();
  const { isCollapsed, toggleSidebar } = useSidebar();

  const navItems = [
    { path: '/', label: t('common.dashboard'), icon: LayoutDashboard },
    { path: '/devices', label: t('common.devices'), icon: Box },
    { path: '/settings', label: t('common.settings'), icon: Settings },
  ];

  return (
    <aside
      className={cn(
        'border-r bg-background flex flex-col transition-all duration-300 relative',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Toggle Button */}
      <div className="absolute -right-3 top-6 z-10">
        <Button
          variant="outline"
          size="icon"
          className="h-6 w-6 rounded-full bg-background border shadow-sm"
          onClick={toggleSidebar}
        >
          {isCollapsed ? (
            <ChevronRight className="h-3 w-3" />
          ) : (
            <ChevronLeft className="h-3 w-3" />
          )}
        </Button>
      </div>

      <nav className="space-y-2 p-4 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.path;

          return (
            <Link key={item.path} href={item.path}>
              <div
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors cursor-pointer',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  isCollapsed && 'justify-center px-2'
                )}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                {!isCollapsed && <span>{item.label}</span>}
              </div>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
