import paths from './paths';

export interface SubMenuItem {
  subheader: string;
  pathName: string;
  path: string;
  icon?: string;
  active?: boolean;
  items?: SubMenuItem[];
}

export interface MenuItem {
  id: number | string;
  subheader: string;
  path?: string;
  icon?: string;
  avatar?: string;
  active?: boolean;
  items?: SubMenuItem[];
}

const adminSitemap: MenuItem[] = [
  {
    id: 1,
    subheader: 'Admin Dashboard',
    path: paths.adminDashboard,
    icon: 'ic:round-dashboard',
    active: true,
  },
  {
    id: 2,
    subheader: 'User Management',
    path: paths.adminUsers,
    icon: 'ic:round-people',
    active: true,
  },
  {
    id: 3,
    subheader: 'Transactions',
    path: paths.adminTransactions,
    icon: 'ic:round-receipt-long',
    active: true,
  },
  {
    id: 4,
    subheader: 'Upload History',
    path: paths.adminUploads,
    icon: 'ic:round-cloud-done',
    active: true,
  },
  {
    id: 5,
    subheader: 'Subscriptions',
    path: paths.adminSubscriptions,
    icon: 'ic:round-card-membership',
    active: true,
  },
  {
    id: 6,
    subheader: 'Announcements',
    path: paths.adminAnnouncements,
    icon: 'ic:round-campaign',
    active: true,
  },
  {
    id: 7,
    subheader: 'Error Logs',
    path: paths.adminErrors,
    icon: 'ic:round-error-outline',
    active: true,
  },
  {
    id: 8,
    subheader: 'System Settings',
    path: paths.adminSettings,
    icon: 'ic:round-settings-system-daydream',
    active: true,
  },
];

export default adminSitemap;
