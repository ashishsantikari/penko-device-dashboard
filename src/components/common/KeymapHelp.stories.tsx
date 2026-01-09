/* eslint-disable storybook/no-renderer-packages */
import type { Meta, StoryObj } from '@storybook/react';
import { KeymapHelp, FullscreenButton } from './KeymapHelp';
import { useState } from 'react';

const meta: Meta<typeof KeymapHelp> = {
  title: 'Common/KeymapHelp',
  component: KeymapHelp,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof KeymapHelp>;

const sampleKeymaps = [
  { key: 'F', description: 'Toggle fullscreen' },
  { key: '↑↓←→', description: 'Navigate between cards' },
  { key: 'Enter', description: 'Open device detail' },
  { key: 'Esc', description: 'Exit fullscreen' },
  { key: '?', description: 'Toggle this help' },
];

export const Default: Story = {
  args: {
    open: true,
    onOpenChange: () => {},
    keymaps: sampleKeymaps,
  },
};

export const WithModifiers: Story = {
  args: {
    open: true,
    onOpenChange: () => {},
    keymaps: [
      { key: 'F', description: 'Toggle page fullscreen' },
      { key: 'F', description: 'Toggle card fullscreen', modifiers: ['When card focused'] },
      { key: 'Ctrl', description: 'Select multiple', modifiers: ['+ Click'] },
    ],
  },
};

export const Closed: Story = {
  args: {
    open: false,
    onOpenChange: () => {},
    keymaps: sampleKeymaps,
  },
};

// FullscreenButton stories
const FullscreenButtonMeta: Meta<typeof FullscreenButton> = {
  title: 'Common/FullscreenButton',
  component: FullscreenButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export const FullscreenButtonStories = FullscreenButtonMeta;

export const EnterFullscreen: StoryObj<typeof FullscreenButton> = {
  args: {
    onClick: () => {},
    isFullscreen: false,
  },
};

export const ExitFullscreen: StoryObj<typeof FullscreenButton> = {
  args: {
    onClick: () => {},
    isFullscreen: true,
  },
};

// Interactive wrapper for KeymapHelp
const KeymapHelpDemo = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="space-y-4">
      <button 
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-primary text-primary-foreground rounded"
      >
        Open Keyboard Shortcuts
      </button>
      <KeymapHelp
        open={isOpen}
        onOpenChange={setIsOpen}
        keymaps={sampleKeymaps}
      />
    </div>
  );
};

export const Interactive: Story = {
  render: () => <KeymapHelpDemo />,
};
