export const rootPaths = {
  root: '/',
  pagesRoot: 'pages',
  authRoot: 'authentication',
  adminRoot: '/admin',
  adminAuthRoot: '/admin/auth',
};

export default {
  signin: `/${rootPaths.authRoot}/sign-in`,
  signup: `/${rootPaths.authRoot}/sign-up`,
  upload: '/upload',
  myVideos: '/my-videos',
  profile: '/profile',
  settings: '/settings',
  upgrade: '/billing',
  billing: '/billing',

  // Admin Routes
  adminSignin: '/admin/auth/sign-in',
  adminDashboard: '/admin',
  adminUsers: '/admin/users',
  adminTransactions: '/admin/transactions',
  adminUploads: '/admin/uploads',
  adminSubscriptions: '/admin/subscriptions',
  adminAnnouncements: '/admin/announcements',
  adminErrors: '/admin/errors',
  adminSettings: '/admin/settings',
  adminSupport: '/admin/support',
};
