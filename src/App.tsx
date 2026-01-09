import { Route, Switch, Redirect } from 'wouter';
import { AuthProvider } from '@/providers/AuthProvider';
import { QueryProvider } from '@/providers/QueryProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { WebSocketDataProvider } from '@/components/providers/WebSocketDataProvider';
import { PrivateRoute } from '@/components/auth/PrivateRoute';
import { AppLayout } from '@/components/layout/AppLayout';
import { LoginPage } from '@/pages/LoginPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { DevicesPage } from '@/pages/DevicesPage';
import { DeviceDetailPage } from '@/pages/DeviceDetailPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { useAuth } from '@/hooks/useAuth';
import '@/i18n';

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Switch>
      <Route path="/login">
        {isAuthenticated ? <Redirect to="/" /> : <LoginPage />}
      </Route>
      
      <Route path="/">
        <PrivateRoute>
          <AppLayout>
            <DashboardPage />
          </AppLayout>
        </PrivateRoute>
      </Route>
      
      <Route path="/devices">
        <PrivateRoute>
          <AppLayout>
            <DevicesPage />
          </AppLayout>
        </PrivateRoute>
      </Route>
      
      <Route path="/devices/:id">
        <PrivateRoute>
          <AppLayout>
            <DeviceDetailPage />
          </AppLayout>
        </PrivateRoute>
      </Route>
      
      <Route path="/settings">
        <PrivateRoute>
          <AppLayout>
            <SettingsPage />
          </AppLayout>
        </PrivateRoute>
      </Route>

      <Route>
        <Redirect to="/" />
      </Route>
    </Switch>
  );
};

function App() {
  return (
    <ThemeProvider>
      <QueryProvider>
        <AuthProvider>
          <WebSocketDataProvider>
            <AppRoutes />
          </WebSocketDataProvider>
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}

export default App;
