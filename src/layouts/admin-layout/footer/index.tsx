import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import { useI18n } from 'i18n/I18nContext';

const Footer = () => {
  const { t } = useI18n();

  return (
    <Typography
      mt={0.5}
      px={1}
      py={3}
      color="text.secondary"
      variant="body2"
      sx={{ textAlign: { xs: 'center', md: 'right' } }}
      letterSpacing={0.5}
      fontWeight={500}
    >
      © 2024{' '}
      <Link href="https://multiuploads.xyz" fontWeight={600}>
        {'MultiUploads'}
      </Link>
      . {t('footer.allRights')}
    </Typography>
  );
};

export default Footer;
