import { useState } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import DrawerItems from './DrawerItems';
import IconifyIcon from 'components/base/IconifyIcon';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsClosing: React.Dispatch<React.SetStateAction<boolean>>;
}

const collapsedWidth = 78;
const expandedWidth = 290;

const Sidebar = ({ mobileOpen, setMobileOpen, setIsClosing }: SidebarProps) => {
  const [hovered, setHovered] = useState(false);

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  return (
    <>
      {/* Spacer to push main content right on desktop */}
      <Box
        component="nav"
        sx={{
          width: { xs: 0, md: collapsedWidth },
          flexShrink: 0,
        }}
      />

      {/* Mobile drawer (temporary) */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onTransitionEnd={handleDrawerTransitionEnd}
        onClose={handleDrawerClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: expandedWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <IconButton
          onClick={handleDrawerClose}
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            zIndex: 1100,
            bgcolor: 'info.main',
            '&:hover': { bgcolor: 'error.lighter', color: 'error.main' },
            width: 32,
            height: 32,
          }}
        >
          <IconifyIcon icon="ic:round-close" sx={{ fontSize: 20 }} />
        </IconButton>
        <DrawerItems expanded={true} />
      </Drawer>

      {/* Desktop sidebar (fixed, hover expand) */}
      <Box
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        sx={{
          display: { xs: 'none', md: 'block' },
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100vh',
          width: hovered ? expandedWidth : collapsedWidth,
          bgcolor: 'background.paper',
          borderRight: 1,
          borderColor: 'info.main',
          overflowX: 'hidden',
          overflowY: 'auto',
          transition: 'width 0.25s ease',
          zIndex: 1200,
          '&::-webkit-scrollbar': {
            width: hovered ? 4 : 0,
          },
          '&::-webkit-scrollbar-thumb': {
            bgcolor: 'divider',
            borderRadius: 2,
          },
        }}
      >
        <DrawerItems expanded={hovered} />
      </Box>
    </>
  );
};

export default Sidebar;
