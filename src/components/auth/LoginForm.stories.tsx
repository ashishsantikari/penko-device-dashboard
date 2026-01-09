/* eslint-disable storybook/no-renderer-packages */
import type { Meta, StoryObj } from '@storybook/react';
import { LoginForm } from './LoginForm';
import { AuthProvider } from '@/providers/AuthProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const meta: Meta<typeof LoginForm> = {
  title: 'Auth/LoginForm',
  component: LoginForm,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => {
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
          },
        },
      });
      
      return (
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <div className="p-8">
              <Story />
            </div>
          </AuthProvider>
        </QueryClientProvider>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof LoginForm>;

export const Default: Story = {};

export const DarkTheme: Story = {
  parameters: {
    backgrounds: { default: 'dark' },
  },
  decorators: [
    (Story) => {
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
          },
        },
      });
      
      return (
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <div className="dark p-8">
              <Story />
            </div>
          </AuthProvider>
        </QueryClientProvider>
      );
    },
  ],
};
