import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import MultiUploadsLogo from 'assets/images/LogoWithoutBG.png';
import Image from 'components/base/Image';
import { useI18n } from 'i18n/I18nContext';

const Logo = () => {
  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      height={94}
      width={94}
      border={4}
      borderColor="info.lighter"
      borderRadius="50%"
      position="absolute"
      top={0}
      left="50%"
      sx={(theme) => ({
        background: `linear-gradient(135deg, ${theme.palette.gradients.primary.state} 0%, ${theme.palette.gradients.primary.main} 100%)`,
        transform: 'translate(-50%, -50%)',
      })}
    >
      <Image src={MultiUploadsLogo} sx={{ width: 40, height: 40 }} />
    </Stack>
  );
};

const SidebarCard = () => {
  const { t } = useI18n();

  return (
    <Stack
      alignItems="center"
      direction="column"
      position="relative"
      borderRadius={6}
      width={1}
      pt={8}
      pb={6}
      mt="auto"
      sx={(theme) => ({
        background: `linear-gradient(135deg, ${theme.palette.gradients.primary.state} 0%, ${theme.palette.gradients.primary.main} 100%)`,
        position: 'relative',
      })}
    >
      <Logo />
      <Button sx={{ color: 'info.lighter', fontWeight: 700 }}>{t('sidebar.upgradePremium')}</Button>
      <Typography variant="body2" color="info.darker" lineHeight={1.75}>
        {t('sidebar.upgradeDesc1')} <br />
        {t('sidebar.upgradeDesc2')}
      </Typography>
    </Stack>
  );
};

export default SidebarCard;
