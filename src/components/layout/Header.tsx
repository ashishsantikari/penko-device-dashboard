import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { LogOut, Globe } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ThemeToggle } from './ThemeToggle';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <header className="border-b bg-background">
      <div className="flex h-16 items-center justify-between px-6">
        <h1 className="text-xl font-bold">Your Brand Platform</h1>
        
        <div className="flex items-center gap-3">
          <ThemeToggle />
          
          <Select value={i18n.language} onValueChange={changeLanguage}>
            <SelectTrigger className="w-24">
              <Globe className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">EN</SelectItem>
              <SelectItem value="de">DE</SelectItem>
            </SelectContent>
          </Select>
          
          <span className="text-sm text-muted-foreground">
            {user?.name || user?.username}
          </span>
          
          <Button variant="outline" size="sm" onClick={logout}>
            <LogOut className="h-4 w-4 mr-2" />
            {t('common.logout')}
          </Button>
        </div>
      </div>
    </header>
  );
};
