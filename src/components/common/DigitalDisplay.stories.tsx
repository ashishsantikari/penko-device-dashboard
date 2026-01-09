/* eslint-disable storybook/no-renderer-packages */
import type { Meta, StoryObj } from '@storybook/react';
import { DigitalDisplay } from './DigitalDisplay';

const meta: Meta<typeof DigitalDisplay> = {
  title: 'Common/DigitalDisplay',
  component: DigitalDisplay,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DigitalDisplay>;

export const Default: Story = {
  args: {
    value: 245.67,
    decimals: 2,
    unit: 'kg',
    isOffline: false,
    status: 'active',
  },
};

export const Active: Story = {
  args: {
    value: 189.45,
    decimals: 2,
    unit: 'kg',
    isOffline: false,
    status: 'active',
  },
};

export const Idle: Story = {
  args: {
    value: 45.20,
    decimals: 2,
    unit: 'kg',
    isOffline: false,
    status: 'idle',
  },
};

export const Offline: Story = {
  args: {
    value: 532.15,
    decimals: 2,
    unit: 'kg',
    isOffline: true,
    status: 'active',
  },
};

export const Error: Story = {
  args: {
    value: 0.00,
    decimals: 2,
    unit: 'kg',
    isOffline: false,
    status: 'error',
  },
};

export const Maintenance: Story = {
  args: {
    value: 125.00,
    decimals: 2,
    unit: 'kg',
    isOffline: false,
    status: 'maintenance',
  },
};

export const WithLabel: Story = {
  args: {
    value: 375.89,
    decimals: 2,
    unit: 'kg',
    label: 'Scale A1',
    isOffline: false,
    status: 'active',
  },
};

export const DifferentDecimals: Story = {
  args: {
    value: 245.6789,
    decimals: 4,
    unit: 'kg',
    isOffline: false,
    status: 'active',
  },
};

export const ZeroWeight: Story = {
  args: {
    value: 0.00,
    decimals: 2,
    unit: 'kg',
    isOffline: false,
    status: 'active',
  },
};

export const LargeWeight: Story = {
  args: {
    value: 9999.99,
    decimals: 2,
    unit: 'kg',
    isOffline: false,
    status: 'active',
  },
};
