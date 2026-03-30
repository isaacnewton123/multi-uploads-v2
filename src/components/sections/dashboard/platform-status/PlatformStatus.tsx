import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import IconifyIcon from 'components/base/IconifyIcon';
import { useI18n } from 'i18n/I18nContext';

interface PlatformCount {
  connected: boolean;
  published: number;
  failed: number;
}

interface PlatformStatusProps {
  platformCounts: Record<string, PlatformCount>;
}

const PLATFORMS = [
  { id: 'youtube', name: 'YouTube Shorts', icon: 'mdi:youtube', color: '#FF0000' },
  { id: 'facebook', name: 'Facebook Reels', icon: 'mdi:facebook', color: '#1877F2' },
  { id: 'instagram', name: 'Instagram Reels', icon: 'mdi:instagram', color: '#E4405F' },
  { id: 'tiktok', name: 'TikTok', icon: 'ic:baseline-tiktok', color: '#000000' },
];

const PlatformStatus = ({ platformCounts }: PlatformStatusProps) => {
  const { t } = useI18n();

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" mb={2.5}>
        {t('dashboard.platformStatus')}
      </Typography>
      <Stack direction="column" spacing={2}>
        {PLATFORMS.map((platform) => {
          const data = platformCounts[platform.id];
          const connected = data?.connected ?? false;

          return (
            <Stack
              key={platform.id}
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
                  sx={{ bgcolor: `${platform.color}18` }}
                >
                  <IconifyIcon icon={platform.icon} sx={{ fontSize: 22, color: platform.color }} />
                </Stack>
                <Stack>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {platform.name}
                  </Typography>
                </Stack>
              </Stack>
              <Chip
                label={connected ? t('dashboard.connected') : t('dashboard.notConnected')}
                size="small"
                sx={{
                  fontWeight: 600,
                  bgcolor: connected ? 'success.lighter' : 'warning.lighter',
                  color: connected ? 'success.main' : 'warning.main',
                }}
              />
            </Stack>
          );
        })}
      </Stack>
    </Paper>
  );
};

export default PlatformStatus;
