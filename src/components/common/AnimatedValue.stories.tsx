/* eslint-disable storybook/no-renderer-packages */
import type { Meta, StoryObj } from '@storybook/react';
import { AnimatedValue } from './AnimatedValue';
import { useEffect, useState } from 'react';

// Wrapper component for animated value demonstration
const AnimatedValueDemo = ({ initialValue, changeInterval }: { initialValue: number; changeInterval: number }) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    const interval = setInterval(() => {
      setValue((prev) => {
        const change = (Math.random() - 0.5) * 10;
        return Math.max(0, prev + change);
      });
    }, changeInterval);

    return () => clearInterval(interval);
  }, [changeInterval]);

  const formatWeight = (val: number | string) => {
    const num = typeof val === 'number' ? val : parseFloat(val.toString());
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="p-8">
      <div className="text-4xl font-bold">
        <AnimatedValue value={value} formatValue={formatWeight} />
        <span className="text-2xl text-muted-foreground ml-2">kg</span>
      </div>
      <p className="text-sm text-muted-foreground mt-4">
        Value changes every {changeInterval}ms. Watch for the pulse animation!
      </p>
    </div>
  );
};

const meta: Meta<typeof AnimatedValueDemo> = {
  title: 'Common/AnimatedValue',
  component: AnimatedValueDemo,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof AnimatedValueDemo>;

export const Default: Story = {
  args: {
    initialValue: 125.50,
    changeInterval: 2000,
  },
};

export const FastChanges: Story = {
  args: {
    initialValue: 200.00,
    changeInterval: 500,
  },
};

export const SlowChanges: Story = {
  args: {
    initialValue: 300.00,
    changeInterval: 5000,
  },
};

export const DarkTheme: Story = {
  args: {
    initialValue: 125.50,
    changeInterval: 2000,
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
