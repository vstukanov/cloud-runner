import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider, ConfigType } from './providers/ConfigProvider';
import { SessionProvider, useSession } from './providers/SessionProvider';
import { AppRouter } from './AppRouter';
import { AppLoginPage } from './AppLoginPage';
import { AppLayout } from './AppLayout';

const envUrl =
  process.env.NODE_ENV === 'development'
    ? '/api'
    : (process.env.REACT_APP_API_HOST as string);

const config: ConfigType = {
  baseURL: envUrl,
};

function Router() {
  const { user } = useSession();

  if (!user) {
    return <AppLoginPage />;
  }

  return (
    <AppLayout>
      <AppRouter />
    </AppLayout>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <ConfigProvider config={config}>
        <SessionProvider>
          <Router />
        </SessionProvider>
      </ConfigProvider>
    </BrowserRouter>
  );
}
