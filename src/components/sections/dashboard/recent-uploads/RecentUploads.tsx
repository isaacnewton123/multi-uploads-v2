import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import IconifyIcon from 'components/base/IconifyIcon';
import { useI18n } from 'i18n/I18nContext';

interface Upload {
  id: number;
  title: string;
  platforms: {
    name: string;
    icon: string;
    color: string;
    status: 'success' | 'processing' | 'failed';
  }[];
  date: string;
}

const recentUploadsData: Upload[] = [
  {
    id: 1,
    title: 'Morning Routine Tips #shorts',
    platforms: [
      { name: 'YouTube', icon: 'mdi:youtube', color: '#FF0000', status: 'success' },
      { name: 'TikTok', icon: 'ic:baseline-tiktok', color: '#000000', status: 'success' },
      { name: 'Instagram', icon: 'mdi:instagram', color: '#E4405F', status: 'processing' },
    ],
    date: '2 hours ago',
  },
  {
    id: 2,
    title: 'Quick Recipe: 60-Second Pasta',
    platforms: [
      { name: 'YouTube', icon: 'mdi:youtube', color: '#FF0000', status: 'success' },
      { name: 'Facebook', icon: 'mdi:facebook', color: '#1877F2', status: 'success' },
    ],
    date: '5 hours ago',
  },
  {
    id: 3,
    title: 'Sunset Timelapse 🌅',
    platforms: [
      { name: 'TikTok', icon: 'ic:baseline-tiktok', color: '#000000', status: 'failed' },
      { name: 'Instagram', icon: 'mdi:instagram', color: '#E4405F', status: 'success' },
    ],
    date: 'Yesterday',
  },
  {
    id: 4,
    title: 'Life Hack: Organize Your Desk',
    platforms: [
      { name: 'YouTube', icon: 'mdi:youtube', color: '#FF0000', status: 'processing' },
      { name: 'Facebook', icon: 'mdi:facebook', color: '#1877F2', status: 'success' },
      { name: 'TikTok', icon: 'ic:baseline-tiktok', color: '#000000', status: 'success' },
      { name: 'Instagram', icon: 'mdi:instagram', color: '#E4405F', status: 'success' },
    ],
    date: 'Yesterday',
  },
];

const statusColors = {
  success: { bg: 'success.lighter', text: 'success.main', label: 'Published' },
  processing: { bg: 'warning.lighter', text: 'warning.main', label: 'Processing' },
  failed: { bg: 'error.lighter', text: 'error.main', label: 'Failed' },
};

const RecentUploads = () => {
  const { t } = useI18n();

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" mb={2.5}>
        {t('dashboard.recentUploads')}
      </Typography>
      <Stack direction="column" spacing={2}>
        {recentUploadsData.map((upload) => (
          <Stack
            key={upload.id}
            direction="column"
            p={2}
            borderRadius={2}
            bgcolor="info.lighter"
            spacing={1.5}
          >
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="subtitle1" fontWeight={600} noWrap sx={{ maxWidth: 300 }}>
                {upload.title}
              </Typography>
              <Typography variant="caption" color="text.disabled">
                {upload.date}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {upload.platforms.map((platform) => {
                const statusStyle = statusColors[platform.status];
                return (
                  <Chip
                    key={platform.name}
                    icon={
                      <IconifyIcon
                        icon={platform.icon}
                        sx={{ fontSize: 16, color: `${platform.color} !important` }}
                      />
                    }
                    label={statusStyle.label}
                    size="small"
                    sx={{
                      fontWeight: 600,
                      bgcolor: statusStyle.bg,
                      color: statusStyle.text,
                      '& .MuiChip-icon': { ml: 0.5 },
                    }}
                  />
                );
              })}
            </Stack>
          </Stack>
        ))}
      </Stack>
    </Paper>
  );
};

export default RecentUploads;
