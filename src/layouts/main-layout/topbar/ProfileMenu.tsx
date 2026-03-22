import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';
import ListItemIcon from '@mui/material/ListItemIcon';
import IconifyIcon from 'components/base/IconifyIcon';
import ProfileImage from 'assets/images/avatars/avatar1.png';
import { useI18n } from 'i18n/I18nContext';
import paths from 'routes/paths';

interface MenuItemDef {
  id: number;
  titleKey: string;
  icon: string;
  path?: string;
  action?: 'logout';
}

const menuItems: MenuItemDef[] = [
  {
    id: 1,
    titleKey: 'profile.viewProfile',
    icon: 'material-symbols:account-circle-outline',
    path: '/profile',
  },
  {
    id: 2,
    titleKey: 'profile.accountSettings',
    icon: 'material-symbols:settings-account-box-outline-rounded',
    path: '/settings',
  },
  {
    id: 3,
    titleKey: 'profile.logout',
    icon: 'material-symbols:logout',
    action: 'logout',
  },
];

const ProfileMenu = () => {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (item: MenuItemDef) => {
    handleProfileMenuClose();

    if (item.action === 'logout') {
      localStorage.clear();
      sessionStorage.clear();
      navigate(paths.signin);
      return;
    }

    if (item.path) {
      navigate(item.path);
    }
  };

  return (
    <>
      <ButtonBase
        onClick={handleProfileClick}
        aria-controls={open ? 'account-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        disableRipple
      >
        <Avatar
          src={ProfileImage}
          sx={{
            height: 44,
            width: 44,
            bgcolor: 'primary.main',
          }}
        />
      </ButtonBase>

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleProfileMenuClose}
        onClick={handleProfileMenuClose}
        sx={{
          mt: 1.5,
          '& .MuiList-root': {
            p: 0,
            width: 230,
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box p={1}>
          <MenuItem
            onClick={() => {
              handleProfileMenuClose();
              navigate('/profile');
            }}
            sx={{ '&:hover': { bgcolor: 'info.dark' } }}
          >
            <Avatar src={ProfileImage} sx={{ mr: 1, height: 42, width: 42 }} />
            <Stack direction="column">
              <Typography variant="body2" color="text.primary" fontWeight={600}>
                Jason Statham
              </Typography>
              <Typography variant="caption" color="text.secondary" fontWeight={400}>
                jason@example.com
              </Typography>
            </Stack>
          </MenuItem>
        </Box>

        <Divider sx={{ my: 0 }} />

        <Box p={1}>
          {menuItems.map((item, index) => (
            <Box key={item.id}>
              {item.action === 'logout' && index > 0 && <Divider sx={{ my: 0.5 }} />}
              <MenuItem
                onClick={() => handleMenuItemClick(item)}
                sx={{
                  py: 1,
                  color: item.action === 'logout' ? 'error.main' : 'text.secondary',
                }}
              >
                <ListItemIcon
                  sx={{
                    mr: 1,
                    color: item.action === 'logout' ? 'error.main' : 'text.secondary',
                    fontSize: 'h5.fontSize',
                  }}
                >
                  <IconifyIcon icon={item.icon} />
                </ListItemIcon>
                <Typography
                  variant="body2"
                  fontWeight={500}
                  color={item.action === 'logout' ? 'error.main' : 'text.secondary'}
                >
                  {t(item.titleKey)}
                </Typography>
              </MenuItem>
            </Box>
          ))}
        </Box>
      </Menu>
    </>
  );
};

export default ProfileMenu;
