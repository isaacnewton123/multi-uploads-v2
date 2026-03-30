import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import IconifyIcon from 'components/base/IconifyIcon';
import { useI18n } from 'i18n/I18nContext';

interface PlatformEntry {
  platform: string;
  status: string;
}

interface VideoData {
  _id: string;
  title: string;
  createdAt: string;
  // Top-level video status — same field MyVideos uses for Published/Processing/Failed
  status: string;
  platforms: PlatformEntry[];
}

interface RecentUploadsProps {
  videos: VideoData[];
}

const PLATFORM_ICONS: Record<string, { icon: string; color: string }> = {
  youtube: { icon: 'mdi:youtube', color: '#FF0000' },
  facebook: { icon: 'mdi:facebook', color: '#1877F2' },
  instagram: { icon: 'mdi:instagram', color: '#E4405F' },
  tiktok: { icon: 'ic:baseline-tiktok', color: '#000000' },
};

// Uses the video-level status (same as MyVideos) — not per-platform status
const STATUS_STYLE: Record<string, { bg: string; text: string; labelKey: string }> = {
  published: { bg: 'success.lighter', text: 'success.main', labelKey: 'myVideos.published' },
  partial: { bg: '#e0f2fe', text: '#0284c7', labelKey: 'myVideos.partial' },
  processing: { bg: 'warning.lighter', text: 'warning.main', labelKey: 'myVideos.processing' },
  pending: { bg: 'warning.lighter', text: 'warning.main', labelKey: 'myVideos.processing' },
  failed: { bg: 'error.lighter', text: 'error.main', labelKey: 'myVideos.failed' },
};

const RecentUploads = ({ videos }: RecentUploadsProps) => {
  const { t } = useI18n();

  const formatDate = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return t('dashboard.justNow');
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" mb={2.5}>
        {t('dashboard.recentUploads')}
      </Typography>

      {videos.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <IconifyIcon
            icon="ic:round-video-library"
            sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }}
          />
          <Typography variant="body2" color="text.secondary">
            {t('dashboard.noUploads')}
          </Typography>
        </Box>
      ) : (
        <Stack direction="column" spacing={2}>
          {videos.map((video) => {
            // Use top-level video status — same field MyVideos page reads
            const videoStatus = video.status ?? 'processing';
            const style = STATUS_STYLE[videoStatus] ?? STATUS_STYLE['processing'];

            return (
              <Stack
                key={video._id}
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                p={2}
                borderRadius={2}
                bgcolor="info.lighter"
              >
                {/* Left: Title + platform icons */}
                <Stack direction="column" spacing={0.75} sx={{ minWidth: 0, flex: 1, pr: 2 }}>
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    noWrap
                    sx={{ maxWidth: { xs: 160, sm: 260, md: 380 } }}
                  >
                    {video.title}
                  </Typography>
                  <Stack direction="row" spacing={0.5}>
                    {video.platforms.map((p) => {
                      const info = PLATFORM_ICONS[p.platform] ?? {
                        icon: 'ic:round-public',
                        color: '#888',
                      };
                      return (
                        <IconifyIcon
                          key={p.platform}
                          icon={info.icon}
                          sx={{ fontSize: 18, color: info.color }}
                        />
                      );
                    })}
                  </Stack>
                </Stack>

                {/* Right: overall status chip + time */}
                <Stack direction="column" alignItems="flex-end" spacing={0.5}>
                  <Chip
                    label={t(style.labelKey)}
                    size="small"
                    sx={{
                      fontWeight: 600,
                      bgcolor: style.bg,
                      color: style.text,
                    }}
                  />
                  <Typography variant="caption" color="text.disabled">
                    {formatDate(video.createdAt)}
                  </Typography>
                </Stack>
              </Stack>
            );
          })}
        </Stack>
      )}
    </Paper>
  );
};

export default RecentUploads;
