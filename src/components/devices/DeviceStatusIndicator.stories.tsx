/* eslint-disable storybook/no-renderer-packages */
import type { Meta, StoryObj } from '@storybook/react';
import { DeviceStatusIndicator } from './DeviceStatusIndicator';
import { ConnectionStatus } from '@/types/device';

const meta: Meta<typeof DeviceStatusIndicator> = {
  title: 'Devices/DeviceStatusIndicator',
  component: DeviceStatusIndicator,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DeviceStatusIndicator>;

export const Connected: Story = {
  args: {
    status: ConnectionStatus.CONNECTED,
    deviceStatus: 'active',
    percentage: 95,
    variant: 'badge',
  },
};

export const Disconnected: Story = {
  args: {
    status: ConnectionStatus.DISCONNECTED,
    deviceStatus: 'idle',
    percentage: 0,
    variant: 'badge',
  },
};

export const Error: Story = {
  args: {
    status: ConnectionStatus.ERROR,
    deviceStatus: 'error',
    percentage: 15,
    variant: 'badge',
  },
};

export const Connecting: Story = {
  args: {
    status: ConnectionStatus.CONNECTING,
    deviceStatus: 'active',
    percentage: 50,
    variant: 'badge',
  },
};

export const IconVariant: Story = {
  args: {
    status: ConnectionStatus.CONNECTED,
    deviceStatus: 'active',
    percentage: 85,
    variant: 'icon',
  },
};

export const IconDisconnected: Story = {
  args: {
    status: ConnectionStatus.DISCONNECTED,
    deviceStatus: 'idle',
    percentage: 0,
    variant: 'icon',
  },
};

export const IconError: Story = {
  args: {
    status: ConnectionStatus.ERROR,
    deviceStatus: 'error',
    percentage: 10,
    variant: 'icon',
  },
};

export const WithPercentage: Story = {
  args: {
    status: ConnectionStatus.CONNECTED,
    deviceStatus: 'active',
    percentage: 75,
    variant: 'badge',
  },
};

export const Maintenance: Story = {
  args: {
    status: ConnectionStatus.CONNECTED,
    deviceStatus: 'maintenance',
    percentage: 60,
    variant: 'badge',
  },
};
