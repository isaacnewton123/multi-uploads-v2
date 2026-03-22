import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Stack from '@mui/material/Stack';
import ButtonBase from '@mui/material/ButtonBase';
import ListItem from './list-items/ListItem';
import CollapseListItem from './list-items/CollapseListItem';
import MultiUploadsLogo from 'assets/images/LogoWithBG.png';
import Image from 'components/base/Image';
import SidebarCard from './SidebarCard';
import sitemap from 'routes/sitemap';

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
        <ButtonBase component={Link} href="/" disableRipple>
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
      <List component="nav" sx={{ mt: 2, mb: 6, p: 0, pl: expanded ? 3 : 1, pr: expanded ? 0 : 1 }}>
        {sitemap.map((route) =>
          route.items ? (
            <CollapseListItem key={route.id} {...route} />
          ) : (
            <ListItem key={route.id} {...route} expanded={expanded} />
          ),
        )}
      </List>

      {/* Premium card — only show when expanded */}
      {expanded && (
        <Box mt="auto" px={3} pt={10} pb={5}>
          <SidebarCard />
        </Box>
      )}
    </>
  );
};

export default DrawerItems;
