import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { MenuItem } from 'routes/sitemap';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Tooltip from '@mui/material/Tooltip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconifyIcon from 'components/base/IconifyIcon';
import { useI18n } from 'i18n/I18nContext';

// Map sitemap subheader keys → i18n keys
const labelKeys: Record<string, string> = {
  Dashboard: 'nav.dashboard',
  Upload: 'nav.upload',
  'My Videos': 'nav.myVideos',
  Analytics: 'nav.analytics',
  Settings: 'nav.settings',
};

interface ListItemProps extends MenuItem {
  expanded?: boolean;
}

const ListItem = ({ subheader, icon, path, expanded = true }: ListItemProps) => {
  const location = useLocation();
  const { t } = useI18n();
  const [comingSoonOpen, setComingSoonOpen] = useState(false);

  const isActive =
    path === '/' || path === '/admin'
      ? location.pathname === path
      : path
        ? location.pathname.startsWith(path)
        : false;

  // Check if this is a "coming soon" item (path = '#!')
  const isComingSoon = path === '#!';

  const translatedLabel = t(labelKeys[subheader] || subheader) || subheader;

  const handleClick = (e: React.MouseEvent) => {
    if (isComingSoon) {
      e.preventDefault();
      setComingSoonOpen(true);
    }
  };

  const button = (
    <Stack
      mb={0.75}
      component={isComingSoon ? 'div' : Link}
      href={isComingSoon ? undefined : path}
      alignItems="center"
      justifyContent="space-between"
      onClick={handleClick}
      sx={{ textDecoration: 'none', cursor: 'pointer' }}
    >
      <ListItemButton
        sx={{
          borderRadius: expanded ? '12px 0 0 12px' : '12px',
          bgcolor: isActive ? 'primary.lighter' : 'transparent',
          justifyContent: expanded ? 'flex-start' : 'center',
          px: expanded ? 2 : 1.5,
          py: 1,
          minHeight: 44,
          transition: 'all 0.2s ease',
          '&:hover': {
            bgcolor: isActive ? 'primary.lighter' : 'action.hover',
          },
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: expanded ? 40 : 'auto',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          {icon && (
            <IconifyIcon
              icon={icon}
              fontSize="h4.fontSize"
              sx={{
                color: isActive ? 'primary.main' : 'text.disabled',
                opacity: isComingSoon ? 0.5 : 1,
              }}
            />
          )}
          {!expanded && isComingSoon && (
            <IconifyIcon
              icon="ic:round-lock"
              sx={{
                position: 'absolute',
                top: 0,
                right: -6,
                fontSize: 12,
                color: 'text.disabled',
              }}
            />
          )}
        </ListItemIcon>
        {expanded && (
          <ListItemText
            primary={translatedLabel}
            sx={{
              opacity: expanded ? 1 : 0,
              transition: 'opacity 0.2s ease',
              whiteSpace: 'nowrap',
              '& .MuiListItemText-primary': {
                color: isActive
                  ? 'primary.main'
                  : isComingSoon
                    ? 'text.disabled'
                    : 'text.secondary',
                fontWeight: isActive ? 600 : 500,
                fontSize: '0.9rem',
              },
            }}
          />
        )}
        {expanded && isComingSoon && (
          <IconifyIcon
            icon="ic:round-lock"
            sx={{
              color: 'text.disabled',
              fontSize: 18,
              ml: 1,
            }}
          />
        )}
      </ListItemButton>

      {/* Active indicator bar */}
      {expanded && (
        <Box
          height={36}
          width={4}
          borderRadius={10}
          bgcolor={isActive ? 'primary.main' : 'transparent'}
          flexShrink={0}
        />
      )}
    </Stack>
  );

  return (
    <>
      {!expanded ? (
        <Tooltip title={translatedLabel} placement="right" arrow>
          {button}
        </Tooltip>
      ) : (
        button
      )}

      {/* Coming Soon Modal */}
      <Dialog
        open={comingSoonOpen}
        onClose={() => setComingSoonOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 4,
            p: 2,
            minWidth: 360,
            textAlign: 'center',
          },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Stack direction="column" alignItems="center" spacing={1.5}>
            <Stack
              direction="column"
              alignItems="center"
              justifyContent="center"
              sx={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                bgcolor: 'warning.lighter',
              }}
            >
              <IconifyIcon
                icon="ic:round-rocket-launch"
                sx={{ fontSize: 32, color: 'warning.main' }}
              />
            </Stack>
            <Typography variant="h5" fontWeight={700}>
              {t('comingSoon.title')}
            </Typography>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" lineHeight={1.8}>
            {t('comingSoon.message')}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
          <Button
            variant="contained"
            onClick={() => setComingSoonOpen(false)}
            sx={{ borderRadius: 2, px: 4 }}
          >
            {t('comingSoon.close')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ListItem;
