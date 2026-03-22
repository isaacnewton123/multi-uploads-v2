import paths, { rootPaths } from './paths';

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

const sitemap: MenuItem[] = [
  {
    id: 1,
    subheader: 'Dashboard',
    path: rootPaths.root,
    icon: 'ic:round-home',
    active: true,
  },
  {
    id: 2,
    subheader: 'Upload',
    path: paths.upload,
    icon: 'ic:round-cloud-upload',
    active: true,
  },
  {
    id: 3,
    subheader: 'My Videos',
    path: paths.myVideos,
    icon: 'ic:round-video-library',
    active: true,
  },
  {
    id: 4,
    subheader: 'Analytics',
    path: '#!',
    icon: 'ic:round-bar-chart',
  },
  {
    id: 5,
    subheader: 'Settings',
    path: paths.settings,
    icon: 'ic:round-settings',
    active: true,
  },
];

export default sitemap;
