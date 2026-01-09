# Storybook Components Documentation

## Overview

This project uses Storybook for component documentation and testing. Storybook is configured with:
- **Framework**: React + Vite
- **Addons**: Vitest, Accessibility (a11y), Docs, Onboarding
- **Location**: `.storybook/`

---

## Components with Storybook Stories

### ✅ **Already Implemented**

#### 1. **DeviceCard** (`src/components/devices/DeviceCard.stories.tsx`)
**Stories:**
- `Active` - Device in active state with live metrics
- `Idle` - Device in idle state
- `Error` - Device with error status
- `DarkTheme` - Active state in dark theme
- `LiveUpdating` - Demonstrates real-time weight updates (WebSocket simulation)

**Features:**
- Uses QueryClientProvider for data mocking
- Simulates live weight updates every second
- Demonstrates different device states and metrics

---

#### 2. **AnimatedValue** (`src/components/common/AnimatedValue.stories.tsx`)
**Stories:**
- `Default` - Standard animated value with 2s update interval
- `FastChanges` - Rapid updates every 500ms
- `SlowChanges` - Slow updates every 5s
- `DarkTheme` - Dark theme variant

**Features:**
- Demonstrates animated number transitions
- Shows pulse animation on value change
- Custom formatValue function for weight display

---

#### 3. **DeviceStatusIcon** (`src/components/devices/DeviceStatusIcon.stories.tsx`)
**Stories:**
- Various status combinations (Active, Idle, Error, Maintenance)
- Different sizes (Small, Medium, Large)
- Different battery percentages

---

#### 4. **Button** (`src/stories/Button.stories.ts`)
**Stories:**
- Primary, Secondary, Large, Small
- Standard Storybook example component

---

#### 5. **Header** (`src/stories/Header.stories.ts`)
**Stories:**
- Logged In, Logged Out
- Standard Storybook example component

---

#### 6. **Page** (`src/stories/Page.stories.ts`)
**Stories:**
- Logged In, Logged Out
- Standard Storybook example component

---

### 🆕 **Newly Created**

#### 7. **DigitalDisplay** (`src/components/common/DigitalDisplay.stories.tsx`)
**Stories:**
- `Default` - Standard 7-segment display
- `Active` - Active state (red solid)
- `Idle` - Idle state (blue dotted)
- `Offline` - Offline state (gray dotted)
- `Error` - Error state
- `Maintenance` - Maintenance state
- `WithLabel` - Display with device label
- `DifferentDecimals` - 4 decimal places
- `ZeroWeight` - Zero weight display
- `LargeWeight` - Large weight value (9999.99)

**Features:**
- Shows all status variants
- Demonstrates 7-segment LED display
- Different weight values and formats

---

#### 8. **KeymapHelp** (`src/components/common/KeymapHelp.stories.tsx`)
**Stories:**
- `Default` - Standard keyboard shortcuts dialog
- `WithModifiers` - Shortcuts with modifier keys
- `Closed` - Dialog in closed state
- `Interactive` - Click to open/close

**Features:**
- Demonstrates keyboard shortcuts help modal
- Shows various key combinations
- Interactive demo with state management

---

#### 9. **FullscreenButton** (part of KeymapHelp stories)
**Stories:**
- `EnterFullscreen` - Button to enter fullscreen
- `ExitFullscreen` - Button to exit fullscreen

---

#### 10. **DeviceDetailModal** (`src/components/devices/DeviceDetailModal.stories.tsx`)
**Stories:**
- `Open` - Modal open with device data
- `Closed` - Modal in closed state
- `NoMetrics` - Device without metrics
- `Unstable` - Device with unstable readings
- `Offline` - Offline device
- `NoLocation` - Device without location info
- `NoDevice` - No device selected (null)

**Features:**
- Shows all modal states
- Demonstrates weight measurements display
- Device information panel
- Stability and temperature indicators

---

#### 11. **DeviceStatusIndicator** (`src/components/devices/DeviceStatusIndicator.stories.tsx`)
**Stories:**
- `Connected` - Connected status badge
- `Disconnected` - Disconnected status badge
- `Error` - Error status badge
- `Connecting` - Connecting status badge
- `IconVariant` - Icon variant (active)
- `IconDisconnected` - Icon variant (disconnected)
- `IconError` - Icon variant (error)
- `WithPercentage` - With battery percentage
- `Maintenance` - Maintenance status

**Features:**
- Badge and icon variants
- All connection statuses
- Different device statuses

---

#### 12. **LoginForm** (`src/components/auth/LoginForm.stories.tsx`)
**Stories:**
- `Default` - Standard login form
- `DarkTheme` - Login form in dark theme

**Features:**
- Wrapped with AuthProvider and QueryClientProvider
- Shows both light and dark themes

---

## Summary Statistics

### Total Components with Stories: **12**

### By Category:

**Device Components (6):**
- ✅ DeviceCard
- ✅ DeviceStatusIcon
- ✅ DeviceDetailModal
- ✅ DeviceStatusIndicator
- ⏳ DashboardDeviceCard (needs stories)
- ⏳ DeviceTable (needs stories)
- ⏳ DeviceSearch (needs stories)

**Common Components (3):**
- ✅ AnimatedValue
- ✅ DigitalDisplay
- ✅ KeymapHelp

**Auth Components (1):**
- ✅ LoginForm
- ⏳ PrivateRoute (needs stories)

**Layout Components (0):**
- ⏳ Sidebar (needs stories)
- ⏳ Header (has example story, needs app-specific)
- ⏳ AppLayout (needs stories)
- ⏳ ThemeToggle (needs stories)

**UI Components (2):**
- ✅ Button (example)
- ⏳ All other UI components (alert, switch, dialog, etc. - need stories)

---

## Running Storybook

```bash
# Start Storybook development server
npm run storybook

# Build static Storybook
npm run build-storybook

# Run Vitest tests
npm run test
```

Storybook will be available at: `http://localhost:6006`

---

## Story Patterns Used

### 1. **Basic Component Story**
```typescript
export const Default: Story = {
  args: {
    // Component props
  },
};
```

### 2. **With Decorators (Providers)**
```typescript
export const WithData: Story = {
  decorators: [
    (Story) => {
      const queryClient = new QueryClient();
      return (
        <QueryClientProvider client={queryClient}>
          <Story />
        </QueryClientProvider>
      );
    },
  ],
};
```

### 3. **With Parameters (Themes)**
```typescript
export const DarkTheme: Story = {
  parameters: {
    backgrounds: { default: 'dark' },
  },
};
```

### 4. **Interactive Stories**
```typescript
const InteractiveDemo = () => {
  const [state, setState] = useState(false);
  return <Component onChange={setState} />;
};

export const Interactive: Story = {
  render: () => <InteractiveDemo />,
};
```

---

## Future Enhancements

### Components Needing Stories:
1. **DashboardDeviceCard** - Card component for dashboard
2. **DeviceTable** - Table view of devices
3. **DeviceSearch** - Search input component
4. **Sidebar** - Navigation sidebar
5. **ThemeToggle** - Dark/light mode toggle
6. **AppLayout** - Main application layout
7. **All UI Components:**
   - Alert
   - Switch
   - Dialog
   - Select
   - Input
   - Card
   - Badge
   - etc.

### Recommended Additions:
- Accessibility tests (a11y addon)
- Visual regression testing
- Interaction tests with Vitest
- Documentation pages (MDX)

---

## Notes

- All stories use TypeScript for type safety
- Stories are organized by category in the Storybook sidebar
- Mock data is provided for components that need it
- Dark theme variants are included where applicable
- Interactive stories demonstrate component behavior
