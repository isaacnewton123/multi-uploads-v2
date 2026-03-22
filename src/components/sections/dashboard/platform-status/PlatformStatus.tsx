import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import IconifyIcon from 'components/base/IconifyIcon';
import { useI18n } from 'i18n/I18nContext';

interface PlatformCardProps {
  name: string;
  icon: string;
  connected: boolean;
  color: string;
}

const platformData: PlatformCardProps[] = [
  { name: 'YouTube Shorts', icon: 'mdi:youtube', connected: true, color: '#FF0000' },
  { name: 'Facebook Reels', icon: 'mdi:facebook', connected: true, color: '#1877F2' },
  { name: 'Instagram Reels', icon: 'mdi:instagram', connected: false, color: '#E4405F' },
  { name: 'TikTok', icon: 'ic:baseline-tiktok', connected: false, color: '#000000' },
];

const PlatformStatus = () => {
  const { t } = useI18n();

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" mb={2.5}>
        {t('dashboard.platformStatus')}
      </Typography>
      <Stack direction="column" spacing={2}>
        {platformData.map((platform) => (
          <Stack
            key={platform.name}
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            p={2}
            borderRadius={2}
            bgcolor="info.lighter"
          >
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Stack
                direction="column"
                alignItems="center"
                justifyContent="center"
                width={40}
                height={40}
                borderRadius="50%"
                sx={{ bgcolor: `${platform.color}15` }}
              >
                <IconifyIcon icon={platform.icon} sx={{ fontSize: 22, color: platform.color }} />
              </Stack>
              <Typography variant="subtitle1" fontWeight={600}>
                {platform.name}
              </Typography>
            </Stack>
            <Chip
              label={platform.connected ? t('dashboard.connected') : t('dashboard.notConnected')}
              size="small"
              sx={{
                fontWeight: 600,
                bgcolor: platform.connected ? 'success.lighter' : 'warning.lighter',
                color: platform.connected ? 'success.main' : 'warning.main',
              }}
            />
          </Stack>
        ))}
      </Stack>
    </Paper>
  );
};

export default PlatformStatus;
