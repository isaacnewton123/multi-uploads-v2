import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import IconifyIcon from 'components/base/IconifyIcon';
import { useI18n } from 'i18n/I18nContext';

interface VideoEntry {
  id: number;
  title: string;
  platforms: { name: string; icon: string; color: string }[];
  date: string;
  status: 'published' | 'processing' | 'failed';
  views: number;
}

const videosData: VideoEntry[] = [
  {
    id: 1,
    title: 'Morning Routine Tips #shorts',
    platforms: [
      { name: 'YouTube', icon: 'mdi:youtube', color: '#FF0000' },
      { name: 'TikTok', icon: 'ic:baseline-tiktok', color: '#000000' },
      { name: 'Instagram', icon: 'mdi:instagram', color: '#E4405F' },
    ],
    date: 'Mar 20, 2026',
    status: 'published',
    views: 12400,
  },
  {
    id: 2,
    title: 'Quick Recipe: 60-Second Pasta',
    platforms: [
      { name: 'YouTube', icon: 'mdi:youtube', color: '#FF0000' },
      { name: 'Facebook', icon: 'mdi:facebook', color: '#1877F2' },
    ],
    date: 'Mar 19, 2026',
    status: 'published',
    views: 8750,
  },
  {
    id: 3,
    title: 'Sunset Timelapse 🌅',
    platforms: [
      { name: 'TikTok', icon: 'ic:baseline-tiktok', color: '#000000' },
      { name: 'Instagram', icon: 'mdi:instagram', color: '#E4405F' },
    ],
    date: 'Mar 18, 2026',
    status: 'failed',
    views: 0,
  },
  {
    id: 4,
    title: 'Life Hack: Organize Your Desk',
    platforms: [
      { name: 'YouTube', icon: 'mdi:youtube', color: '#FF0000' },
      { name: 'Facebook', icon: 'mdi:facebook', color: '#1877F2' },
      { name: 'TikTok', icon: 'ic:baseline-tiktok', color: '#000000' },
      { name: 'Instagram', icon: 'mdi:instagram', color: '#E4405F' },
    ],
    date: 'Mar 17, 2026',
    status: 'processing',
    views: 3200,
  },
  {
    id: 5,
    title: 'Dance Challenge 2026 🔥',
    platforms: [{ name: 'TikTok', icon: 'ic:baseline-tiktok', color: '#000000' }],
    date: 'Mar 16, 2026',
    status: 'published',
    views: 45200,
  },
  {
    id: 6,
    title: 'Travel Vlog: Tokyo Street Food',
    platforms: [
      { name: 'YouTube', icon: 'mdi:youtube', color: '#FF0000' },
      { name: 'Instagram', icon: 'mdi:instagram', color: '#E4405F' },
    ],
    date: 'Mar 15, 2026',
    status: 'published',
    views: 22100,
  },
];

const statusColors = {
  published: { bg: 'success.lighter', text: 'success.main' },
  processing: { bg: 'warning.lighter', text: 'warning.main' },
  failed: { bg: 'error.lighter', text: 'error.main' },
};

const formatViews = (views: number) => {
  if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
  return String(views);
};

const MyVideos = () => {
  const { t } = useI18n();

  return (
    <Grid container spacing={2.5}>
      {/* Header */}
      <Grid item xs={12}>
        <Box>
          <Typography variant="h3">{t('myVideos.title')}</Typography>
          <Typography variant="body2" color="text.disabled" mt={1}>
            {t('myVideos.description')}
          </Typography>
        </Box>
      </Grid>

      {/* Stats Summary Row */}
      <Grid item xs={6} sm={3}>
        <Paper sx={{ p: 2.5, textAlign: 'center' }}>
          <Typography variant="h4" color="primary.main">
            {videosData.length}
          </Typography>
          <Typography variant="caption" color="text.disabled">
            {t('myVideos.totalVideos')}
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={6} sm={3}>
        <Paper sx={{ p: 2.5, textAlign: 'center' }}>
          <Typography variant="h4" color="success.main">
            {videosData.filter((v) => v.status === 'published').length}
          </Typography>
          <Typography variant="caption" color="text.disabled">
            {t('myVideos.published')}
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={6} sm={3}>
        <Paper sx={{ p: 2.5, textAlign: 'center' }}>
          <Typography variant="h4" color="warning.main">
            {videosData.filter((v) => v.status === 'processing').length}
          </Typography>
          <Typography variant="caption" color="text.disabled">
            {t('myVideos.processing')}
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={6} sm={3}>
        <Paper sx={{ p: 2.5, textAlign: 'center' }}>
          <Typography variant="h4" color="error.main">
            {videosData.filter((v) => v.status === 'failed').length}
          </Typography>
          <Typography variant="caption" color="text.disabled">
            {t('myVideos.failed')}
          </Typography>
        </Paper>
      </Grid>

      {/* Video List */}
      <Grid item xs={12}>
        <Paper sx={{ p: { xs: 2, sm: 3 }, overflow: 'hidden' }}>
          <Typography variant="h5" mb={2.5}>
            {t('myVideos.allVideos')}
          </Typography>
          <Stack direction="column" spacing={2}>
            {videosData.map((video) => {
              const statusStyle = statusColors[video.status];
              return (
                <Stack
                  key={video.id}
                  direction={{ xs: 'column', sm: 'row' }}
                  alignItems={{ xs: 'flex-start', sm: 'center' }}
                  justifyContent="space-between"
                  spacing={{ xs: 1.5, sm: 2 }}
                  p={2}
                  borderRadius={2}
                  bgcolor="info.lighter"
                  sx={{ overflow: 'hidden' }}
                >
                  {/* Left: Thumbnail + Title */}
                  <Stack direction="row" alignItems="center" spacing={2} minWidth={0} flex={1}>
                    <Stack
                      direction="column"
                      alignItems="center"
                      justifyContent="center"
                      sx={{ width: 48, height: 48, minWidth: 48 }}
                      borderRadius={2}
                      bgcolor="background.paper"
                    >
                      <IconifyIcon
                        icon="ic:round-play-circle-outline"
                        sx={{ fontSize: 24, color: 'primary.main' }}
                      />
                    </Stack>
                    <Box minWidth={0} flex={1}>
                      <Typography
                        variant="subtitle1"
                        fontWeight={600}
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {video.title}
                      </Typography>
                      <Typography variant="caption" color="text.disabled">
                        {video.date}
                      </Typography>
                    </Box>
                  </Stack>

                  {/* Right: Platforms + Views + Status */}
                  <Stack
                    direction="row"
                    spacing={1.5}
                    alignItems="center"
                    flexShrink={0}
                    flexWrap="wrap"
                    useFlexGap
                    sx={{ rowGap: 1 }}
                  >
                    {/* Platform icons */}
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      {video.platforms.map((platform) => (
                        <Stack
                          key={platform.name}
                          direction="column"
                          alignItems="center"
                          justifyContent="center"
                          width={28}
                          height={28}
                          borderRadius="50%"
                          sx={{ bgcolor: `${platform.color}15` }}
                        >
                          <IconifyIcon
                            icon={platform.icon}
                            sx={{ fontSize: 16, color: platform.color }}
                          />
                        </Stack>
                      ))}
                    </Stack>

                    {/* Views */}
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <IconifyIcon
                        icon="ic:round-visibility"
                        sx={{ fontSize: 18, color: 'text.disabled' }}
                      />
                      <Typography variant="body2" color="text.disabled" fontWeight={500}>
                        {formatViews(video.views)}
                      </Typography>
                    </Stack>

                    {/* Status chip */}
                    <Chip
                      label={t(`myVideos.${video.status}`)}
                      size="small"
                      sx={{
                        fontWeight: 600,
                        bgcolor: statusStyle.bg,
                        color: statusStyle.text,
                        minWidth: 85,
                      }}
                    />
                  </Stack>
                </Stack>
              );
            })}
          </Stack>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default MyVideos;
