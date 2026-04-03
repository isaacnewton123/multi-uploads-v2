import { Suspense, lazy } from 'react';
import { Outlet, createBrowserRouter } from 'react-router-dom';
import paths, { rootPaths } from './paths';

const App = lazy(() => import('App'));
const MainLayout = lazy(() => import('layouts/main-layout'));
const AuthLayout = lazy(() => import('layouts/auth-layout'));
const Dashboard = lazy(() => import('pages/dashboard/Dashboard'));
const Upload = lazy(() => import('pages/upload/Upload'));
const MyVideos = lazy(() => import('pages/my-videos/MyVideos'));
const Profile = lazy(() => import('pages/profile/Profile'));
const Settings = lazy(() => import('pages/settings/Settings'));
const SignIn = lazy(() => import('pages/authentication/SignIn'));
const SignUp = lazy(() => import('pages/authentication/SignUp'));
const Billing = lazy(() => import('pages/billing/Billing'));
const Page404 = lazy(() => import('pages/errors/Page404'));

// Admin Routes
const AdminLayout = lazy(() => import('layouts/admin-layout'));
const AdminAuthLayout = lazy(() => import('layouts/admin-auth-layout'));
const AdminSignIn = lazy(() => import('pages/admin/AdminSignIn'));
const AdminDashboard = lazy(() => import('pages/admin/AdminDashboard'));
const UserManagement = lazy(() => import('pages/admin/UserManagement'));
const ErrorLogs = lazy(() => import('pages/admin/ErrorLogs'));
const SystemSettings = lazy(() => import('pages/admin/SystemSettings'));
const TransactionHistory = lazy(() => import('pages/admin/TransactionHistory'));
const UploadHistory = lazy(() => import('pages/admin/UploadHistory'));
const Announcements = lazy(() => import('pages/admin/Announcements'));
const SubscriptionDetail = lazy(() => import('pages/admin/SubscriptionDetail'));
const SupportChat = lazy(() => import('pages/admin/SupportChat'));

import PageLoader from 'components/loading/PageLoader';
import Progress from 'components/loading/Progress';

export const routes = [
  {
    element: (
      <Suspense fallback={<Progress />}>
        <App />
      </Suspense>
    ),
    children: [
      {
        path: rootPaths.root,
        element: (
          <MainLayout>
            <Suspense fallback={<PageLoader />}>
              <Outlet />
            </Suspense>
          </MainLayout>
        ),
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
          {
            path: 'upload',
            element: <Upload />,
          },
          {
            path: 'my-videos',
            element: <MyVideos />,
          },
          {
            path: 'profile',
            element: <Profile />,
          },
          {
            path: 'settings',
            element: <Settings />,
          },
        ],
      },
      {
        path: 'billing',
        element: (
          <Suspense fallback={<PageLoader />}>
            <Billing />
          </Suspense>
        ),
      },
      {
        path: rootPaths.authRoot,
        element: <AuthLayout />,
        children: [
          {
            path: paths.signin,
            element: <SignIn />,
          },
          {
            path: paths.signup,
            element: <SignUp />,
          },
        ],
      },
      // --- Admin Routes Start ---
      {
        path: rootPaths.adminRoot,
        element: (
          <AdminLayout>
            <Suspense fallback={<PageLoader />}>
              <Outlet />
            </Suspense>
          </AdminLayout>
        ),
        children: [
          {
            index: true,
            element: <AdminDashboard />,
          },
          {
            path: 'users',
            element: <UserManagement />,
          },
          {
            path: 'transactions',
            element: <TransactionHistory />,
          },
          {
            path: 'uploads',
            element: <UploadHistory />,
          },
          {
            path: 'subscriptions',
            element: <SubscriptionDetail />,
          },
          {
            path: 'announcements',
            element: <Announcements />,
          },
          {
            path: 'errors',
            element: <ErrorLogs />,
          },
          {
            path: 'settings',
            element: <SystemSettings />,
          },
          {
            path: 'support',
            element: <SupportChat />,
          },
        ],
      },
      {
        path: rootPaths.adminAuthRoot,
        element: <AdminAuthLayout />,
        children: [
          {
            path: 'sign-in',
            element: <AdminSignIn />,
          },
        ],
      },
      // --- Admin Routes End ---
      {
        path: '*',
        element: <Page404 />,
      },
    ],
  },
];

const router = createBrowserRouter(routes);

export default router;
