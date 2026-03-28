import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import ButtonBase from '@mui/material/ButtonBase';
import IconButton from '@mui/material/IconButton';
import IconifyIcon from 'components/base/IconifyIcon';
import MultiUploadsLogo from 'assets/images/LogoWithBG.png';
import Image from 'components/base/Image';
import ProfileMenu from './ProfileMenu';
import LanguageSelect from './LanguageSelect';

interface TopbarProps {
  isClosing: boolean;
  mobileOpen: boolean;
  setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Topbar = ({ isClosing, mobileOpen, setMobileOpen }: TopbarProps) => {
  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  return (
    <Stack
      height={90}
      alignItems="center"
      justifyContent="space-between"
      bgcolor="transparent"
      zIndex={1200}
    >
      <Stack spacing={{ xs: 1.5, sm: 2 }} alignItems="center">
        <ButtonBase
          component={Link}
          href="/"
          disableRipple
          sx={{ lineHeight: 0, display: { xs: 'none', sm: 'block', md: 'none' } }}
        >
          <Image
            src={MultiUploadsLogo}
            alt="logo"
            height={44}
            width={44}
            sx={{ borderRadius: '8px' }}
          />
        </ButtonBase>

        <Toolbar sx={{ display: { xm: 'block', md: 'none' } }}>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleDrawerToggle}
          >
            <IconifyIcon icon="ic:baseline-menu" />
          </IconButton>
        </Toolbar>
      </Stack>

      <Stack spacing={{ xs: 1.5, sm: 2 }} alignItems="center">
        <LanguageSelect />
        <ProfileMenu />
      </Stack>
    </Stack>
  );
};

export default Topbar;
