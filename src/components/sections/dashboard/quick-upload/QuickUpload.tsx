import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconifyIcon from 'components/base/IconifyIcon';
import { useNavigate } from 'react-router-dom';
import paths from 'routes/paths';
import { useI18n } from 'i18n/I18nContext';

const QuickUpload = () => {
  const navigate = useNavigate();
  const { t } = useI18n();

  return (
    <Paper
      sx={(theme) => ({
        p: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        height: '100%',
        minHeight: 200,
        background: `linear-gradient(135deg, ${theme.palette.gradients.primary.state} 0%, ${theme.palette.gradients.primary.main} 100%)`,
        borderRadius: 4,
      })}
    >
      <Stack
        direction="column"
        alignItems="center"
        justifyContent="center"
        width={64}
        height={64}
        borderRadius="50%"
        bgcolor="rgba(255,255,255,0.2)"
        mb={2}
      >
        <IconifyIcon icon="ic:round-cloud-upload" sx={{ fontSize: 32, color: 'info.lighter' }} />
      </Stack>
      <Typography variant="h4" color="info.lighter" mb={1}>
        {t('dashboard.uploadNewShort')}
      </Typography>
      <Typography variant="body2" color="info.darker" mb={3}>
        {t('dashboard.distributeDesc')}
      </Typography>
      <Button
        variant="contained"
        size="large"
        onClick={() => navigate(paths.upload)}
        sx={{
          bgcolor: 'info.lighter',
          color: 'primary.main',
          fontWeight: 700,
          px: 4,
          '&:hover': { bgcolor: 'info.main' },
        }}
      >
        {t('dashboard.startUpload')}
      </Button>
    </Paper>
  );
};

export default QuickUpload;
