import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface DeviceSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export const DeviceSearch: React.FC<DeviceSearchProps> = ({ value, onChange }) => {
  const { t } = useTranslation();

  return (
    <div className="relative">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder={t('devices.search')}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-8"
      />
    </div>
  );
};
