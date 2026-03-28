import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';
import IconifyIcon from 'components/base/IconifyIcon';
import ListItem from './list-items/ListItem';
import CollapseListItem from './list-items/CollapseListItem';
import MultiUploadsLogo from 'assets/images/LogoWithBG.png';
import Image from 'components/base/Image';
import adminSitemap from 'routes/adminSitemap';
import paths from 'routes/paths';
interface DrawerItemsProps {
  expanded: boolean;
}

const DrawerItems = ({ expanded }: DrawerItemsProps) => {
  return (
    <>
      {/* Logo */}
      <Stack
        pt={3}
        pb={3}
        px={expanded ? 4.5 : 0}
        justifyContent={expanded ? 'flex-start' : 'center'}
        alignItems="center"
        position="sticky"
        top={0}
        borderBottom={1}
        borderColor="info.main"
        bgcolor="info.lighter"
        zIndex={1000}
        sx={{ transition: 'all 0.25s ease' }}
      >
        <ButtonBase component={Link} href={paths.adminDashboard} disableRipple>
          <Image
            src={MultiUploadsLogo}
            alt="logo"
            height={40}
            width={40}
            sx={{ borderRadius: '8px' }}
          />
        </ButtonBase>
      </Stack>

      {/* Navigation */}
      <List component="nav" sx={{ mt: 2, p: 0, pl: expanded ? 3 : 1, pr: expanded ? 0 : 1 }}>
        {adminSitemap.map((route) =>
          route.items ? (
            <CollapseListItem key={route.id} {...route} />
          ) : (
            <ListItem key={route.id} {...route} expanded={expanded} />
          ),
        )}
      </List>

      {/* Logout */}
      <Box mt="auto" px={expanded ? 3 : 1} pb={3}>
        <ButtonBase
          component={Link}
          href={paths.adminSignin}
          disableRipple
          sx={{
            width: '100%',
            py: 1.25,
            px: expanded ? 2 : 0,
            borderRadius: 3,
            justifyContent: expanded ? 'flex-start' : 'center',
            gap: 1.5,
            color: 'error.main',
            transition: 'all 0.2s ease',
            '&:hover': {
              bgcolor: 'error.lighter',
            },
          }}
        >
          <IconifyIcon icon="ic:round-logout" sx={{ fontSize: 22 }} />
          {expanded && (
            <Typography variant="body2" fontWeight={600}>
              Logout
            </Typography>
          )}
        </ButtonBase>
      </Box>
    </>
  );
};

export default DrawerItems;
