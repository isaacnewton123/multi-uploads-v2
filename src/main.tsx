import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import BreakpointsProvider from 'providers/BreakpointsProvider';
import { I18nProvider } from 'i18n/I18nContext';
import { PlanProvider } from 'providers/PlanContext';
import { NotificationProvider } from 'providers/NotificationContext';
import router from 'routes/router';
import { theme } from 'theme/theme';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <I18nProvider>
        <PlanProvider>
          <NotificationProvider>
            <BreakpointsProvider>
              <CssBaseline />
              <RouterProvider router={router} />
            </BreakpointsProvider>
          </NotificationProvider>
        </PlanProvider>
      </I18nProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
