import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import { keyframes } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import { useI18n } from 'i18n/I18nContext';
import { rootPaths } from 'routes/paths';
import IconifyIcon from 'components/base/IconifyIcon';

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
  100% { transform: translateY(0px); }
`;

const Page404 = () => {
  const navigate = useNavigate();
  const { t } = useI18n();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        textAlign: 'center',
        px: 2,
        backgroundColor: 'background.default',
      }}
    >
      <Container maxWidth="sm">
        <Box sx={{ animation: `${float} 6s ease-in-out infinite`, mb: 4 }}>
          <Box
            sx={{
              position: 'relative',
              display: 'inline-flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {/* Background Icon/Shape */}
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 0,
                opacity: (theme) => (theme.palette.mode === 'dark' ? 0.05 : 0.05),
              }}
            >
              <IconifyIcon
                icon="solar:ghost-bold-duotone"
                style={{ fontSize: '20rem', color: 'inherit' }}
              />
            </Box>

            {/* 404 Text */}
            <Typography
              variant="h1"
              sx={{
                fontWeight: 900,
                fontSize: { xs: '6rem', sm: '10rem', md: '12rem' },
                lineHeight: 1,
                zIndex: 1,
                background: (theme) =>
                  `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0px 10px 20px rgba(0,0,0,0.05)',
              }}
            >
              404
            </Typography>
          </Box>
        </Box>

        <Typography
          variant="h3"
          sx={{ fontWeight: 700, mb: 2, fontSize: { xs: '1.75rem', sm: '2.5rem' } }}
        >
          {t('errors.pageNotFound')}
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mb: 5, fontSize: { xs: '1rem', sm: '1.125rem' }, lineHeight: 1.6 }}
        >
          {t('errors.pageNotFoundDescription')}
        </Typography>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
          <Button
            variant="contained"
            size="large"
            startIcon={<IconifyIcon icon="ic:round-home" />}
            onClick={() => navigate(rootPaths.root)}
            sx={{
              borderRadius: 3,
              px: { xs: 4, sm: 5 },
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 600,
              textTransform: 'none',
              boxShadow: (theme) => `0 8px 16px 0 ${theme.palette.primary.main}3d`,
              '&:hover': {
                boxShadow: (theme) => `0 12px 20px 0 ${theme.palette.primary.main}52`,
              },
            }}
          >
            {t('common.backToHome')}
          </Button>
        </Stack>
      </Container>
    </Box>
  );
};

export default Page404;
