/* eslint-disable storybook/no-renderer-packages */
import type { Meta, StoryObj } from '@storybook/react';
import { DeviceStatusIcon } from './DeviceStatusIcon';

const meta: Meta<typeof DeviceStatusIcon> = {
  title: 'Devices/DeviceStatusIcon',
  component: DeviceStatusIcon,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof DeviceStatusIcon>;

export const ActiveConnected: Story = {
  args: {
    status: 'active',
    connectionStatus: 'connected',
    percentage: 95,
    size: 'large',
  },
};

export const Idle: Story = {
  args: {
    status: 'idle',
    connectionStatus: 'connected',
    percentage: 68,
    size: 'large',
  },
};

export const Error: Story = {
  args: {
    status: 'error',
    connectionStatus: 'error',
    percentage: 15,
    size: 'large',
  },
};

export const Maintenance: Story = {
  args: {
    status: 'maintenance',
    connectionStatus: 'connected',
    percentage: 0,
    size: 'large',
  },
};

export const SmallSize: Story = {
  args: {
    status: 'active',
    connectionStatus: 'connected',
    percentage: 95,
    size: 'small',
  },
};

export const MediumSize: Story = {
  args: {
    status: 'active',
    connectionStatus: 'connected',
    percentage: 95,
    size: 'medium',
  },
};

export const WithoutPercentage: Story = {
  args: {
    status: 'active',
    connectionStatus: 'connected',
    size: 'medium',
  },
};

export const DarkTheme: Story = {
  args: {
    status: 'active',
    connectionStatus: 'connected',
    percentage: 95,
    size: 'large',
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
  decorators: [
    (Story) => (
      <div className="dark">
        <Story />
      </div>
    ),
  ],
};
