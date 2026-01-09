import React from 'react';
import { Keyboard, Maximize, Minimize } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface KeymapItem {
  key: string;
  modifiers?: string[];
  description: string;
}

interface KeymapHelpProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  keymaps: KeymapItem[];
}

export const KeymapHelp: React.FC<KeymapHelpProps> = ({ open, onOpenChange, keymaps }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="h-5 w-5" />
            Keyboard Shortcuts
          </DialogTitle>
          <DialogDescription>
            Press these keys to quickly navigate and control the app
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-3 mt-4">
          {keymaps.map((item, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
              <span className="text-sm text-muted-foreground">{item.description}</span>
              <div className="flex items-center gap-1">
                {item.modifiers?.map((mod, i) => (
                  <React.Fragment key={i}>
                    <kbd className="px-2 py-1 text-xs font-mono bg-muted rounded border">
                      {mod}
                    </kbd>
                    <span className="text-muted-foreground">+</span>
                  </React.Fragment>
                ))}
                <kbd className="px-2 py-1 text-xs font-mono bg-muted rounded border font-bold">
                  {item.key}
                </kbd>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t text-xs text-muted-foreground">
          Press <kbd className="px-1 py-0.5 bg-muted rounded">?</kbd> anywhere to toggle this help
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface FullscreenButtonProps {
  onClick: () => void;
  isFullscreen?: boolean;
  className?: string;
}

export const FullscreenButton: React.FC<FullscreenButtonProps> = ({
  onClick,
  isFullscreen = false,
  className,
}) => {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      className={className}
      title={isFullscreen ? 'Exit fullscreen (Esc)' : 'Enter fullscreen (F)'}
    >
      {isFullscreen ? (
        <>
          <Minimize className="h-4 w-4 mr-2" />
          Exit
        </>
      ) : (
        <>
          <Maximize className="h-4 w-4 mr-2" />
          Fullscreen
        </>
      )}
    </Button>
  );
};

export { Keyboard };
