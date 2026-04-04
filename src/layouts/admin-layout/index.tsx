import { useState, PropsWithChildren } from 'react';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import IconifyIcon from 'components/base/IconifyIcon';
import { AdminSupportInboxProvider } from 'contexts/AdminSupportInboxContext';
import Sidebar from 'layouts/admin-layout/sidebar';

const AdminLayout = ({ children }: PropsWithChildren) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  return (
    <AdminSupportInboxProvider>
      <Stack width={1} minHeight="100vh">
        <Sidebar
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
          setIsClosing={setIsClosing}
        />
        <Stack
          component="main"
          direction="column"
          flexGrow={1}
          width={{ xs: 1, md: 'calc(100% - 78px)' }}
          px={{ xs: 2, sm: 3, md: 4 }}
          py={{ xs: 2, md: 3 }}
        >
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleDrawerToggle}
            sx={{ display: { md: 'none' }, alignSelf: 'flex-start', mb: 1 }}
          >
            <IconifyIcon icon="ic:baseline-menu" />
          </IconButton>
          {children}
        </Stack>
      </Stack>
    </AdminSupportInboxProvider>
  );
};

export default AdminLayout;
