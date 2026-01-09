import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslation } from 'react-i18next';
import { Globe, Keyboard, Lock, Save, Check, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface UserSettings {
  language: string;
  keyboardShortcutsEnabled: boolean;
}

export const SettingsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  
  // Settings state
  const [settings, setSettings] = useState<UserSettings>({
    language: i18n.language || 'en',
    keyboardShortcutsEnabled: true,
  });
  
  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // UI state
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  
  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({
          ...prev,
          ...parsed,
          language: i18n.language || parsed.language || 'en',
        }));
      } catch (e) {
        console.error('Failed to parse settings:', e);
      }
    }
  }, [i18n.language]);
  
  // Handle language change immediately
  const handleLanguageChange = async (value: string) => {
    setSettings(prev => ({ ...prev, language: value }));
    
    // Apply language change immediately
    if (value !== i18n.language) {
      await i18n.changeLanguage(value);
      // Also save to localStorage immediately
      const currentSettings = localStorage.getItem('userSettings');
      const parsed = currentSettings ? JSON.parse(currentSettings) : {};
      localStorage.setItem('userSettings', JSON.stringify({
        ...parsed,
        language: value,
      }));
    }
  };
  
  // Save settings to localStorage
  const saveSettings = async () => {
    setIsSaving(true);
    try {
      localStorage.setItem('userSettings', JSON.stringify(settings));
      
      // Apply language change immediately
      if (settings.language !== i18n.language) {
        await i18n.changeLanguage(settings.language);
      }
      
      setSaveMessage(t('common.settingsSaved'));
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      setSaveMessage(t('common.settingsFailed'));
    } finally {
      setIsSaving(false);
    }
  };
  
  // Handle password change
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');
    
    // Validation
    if (!currentPassword) {
      setPasswordError(t('common.passwordRequired'));
      return;
    }
    
    if (!newPassword) {
      setPasswordError(t('common.passwordRequired'));
      return;
    }
    
    if (newPassword.length < 6) {
      setPasswordError(t('common.passwordTooShort'));
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError(t('common.passwordMismatch'));
      return;
    }
    
    // Mock password change - in real app, this would call an API
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, accept any current password
      // In production, verify current password against backend
      setPasswordSuccess(t('common.passwordChanged'));
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      setPasswordError(t('common.passwordFailed'));
    }
  };
  
  return (
    <div className="container mx-auto space-y-6 py-6">
      <div>
        <h1 className="text-3xl font-bold">{t('settings.title')}</h1>
        <p className="text-muted-foreground mt-1">
          {t('settings.description')}
        </p>
      </div>
      
      {/* Language Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            {t('settings.languageTitle')}
          </CardTitle>
          <CardDescription>
            {t('settings.languageDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="language">{t('settings.defaultLanguage')}</Label>
            <Select
              value={settings.language}
              onValueChange={handleLanguageChange}
            >
              <SelectTrigger className="w-full max-w-xs">
                <SelectValue placeholder={t('settings.selectLanguage')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">
                  {t('settings.availableLanguages.en')}
                </SelectItem>
                <SelectItem value="de">
                  {t('settings.availableLanguages.de')}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      
      {/* Keyboard Shortcuts Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Keyboard className="h-5 w-5" />
            {t('settings.keyboardShortcutsTitle')}
          </CardTitle>
          <CardDescription>
            {t('settings.keyboardShortcutsDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="keyboard-shortcuts">{t('settings.enableKeyboardShortcuts')}</Label>
              <p className="text-sm text-muted-foreground">
                {t('settings.keyboardShortcutsHint')}
              </p>
            </div>
            <Switch
              id="keyboard-shortcuts"
              checked={settings.keyboardShortcutsEnabled}
              onCheckedChange={(checked: boolean) => 
                setSettings(prev => ({ ...prev, keyboardShortcutsEnabled: checked }))
              }
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Password Change */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            {t('settings.passwordTitle')}
          </CardTitle>
          <CardDescription>
            {t('settings.passwordDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            {passwordError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{passwordError}</AlertDescription>
              </Alert>
            )}
            
            {passwordSuccess && (
              <Alert className="bg-green-50 border-green-200">
                <Check className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">{passwordSuccess}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="current-password">{t('common.currentPassword')}</Label>
              <Input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder={t('settings.currentPasswordPlaceholder')}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="new-password">{t('common.newPassword')}</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder={t('settings.newPasswordPlaceholder')}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirm-password">{t('common.confirmPassword')}</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={t('settings.confirmPasswordPlaceholder')}
              />
            </div>
            
            <Button type="submit" className="w-full sm:w-auto">
              <Lock className="h-4 w-4 mr-2" />
              {t('common.changePassword')}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      {/* Save Settings Button */}
      <div className="flex items-center justify-between pt-4 border-t">
        <div>
          {saveMessage && (
            <p className={`text-sm ${saveMessage.includes(t('common.settingsFailed')) ? 'text-red-500' : 'text-green-600'}`}>
              {saveMessage}
            </p>
          )}
        </div>
        <Button 
          onClick={saveSettings} 
          disabled={isSaving}
          size="lg"
        >
          {isSaving ? (
            <>
              <Save className="h-4 w-4 mr-2 animate-spin" />
              {t('settings.saving')}
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              {t('settings.saveSettings')}
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
