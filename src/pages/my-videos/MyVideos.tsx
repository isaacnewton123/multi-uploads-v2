import { useState, useEffect, useCallback } from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import IconifyIcon from 'components/base/IconifyIcon';
import { useI18n } from 'i18n/I18nContext';

interface PlatformTarget {
  platform: 'youtube' | 'facebook' | 'instagram' | 'tiktok';
  status: string;
}

interface VideoEntry {
  _id: string;
  title: string;
  platforms: PlatformTarget[];
  createdAt: string;
  status: 'published' | 'processing' | 'failed' | 'partial';
  views: number;
  thumbnailUrl?: string;
}

const platformIcons = {
  youtube: { icon: 'mdi:youtube', color: '#FF0000' },
  facebook: { icon: 'mdi:facebook', color: '#1877F2' },
  instagram: { icon: 'mdi:instagram', color: '#E4405F' },
  tiktok: { icon: 'ic:baseline-tiktok', color: '#000000' },
};

const statusColors: Record<string, { bg: string; text: string }> = {
  published: { bg: 'success.lighter', text: 'success.main' },
  partial: { bg: '#e0f2fe', text: '#0284c7' }, // Explicit blue colors for Partial
  processing: { bg: 'warning.lighter', text: 'warning.main' },
  failed: { bg: 'error.lighter', text: 'error.main' },
};

const formatViews = (views: number) => {
  if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
  return String(views);
};

const MyVideos = () => {
  const { t } = useI18n();
  const [videosData, setVideosData] = useState<VideoEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [retryingIds, setRetryingIds] = useState<Set<string>>(new Set());

  const fetchVideos = useCallback(async () => {
    try {
      const res = await fetch('http://localhost:4000/api/videos');
      const data = await res.json();
      if (data.success && data.data) {
        setVideosData(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch videos:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVideos();
    // Refresh periodically for real-time status updates
    const interval = setInterval(fetchVideos, 5000);
    return () => clearInterval(interval);
  }, [fetchVideos]);

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
            {loading ? (
              <Stack alignItems="center" py={4}>
                <CircularProgress />
              </Stack>
            ) : videosData.length === 0 ? (
              <Stack alignItems="center" py={4}>
                <Typography color="text.secondary">No videos uploaded yet</Typography>
              </Stack>
            ) : (
              videosData.map((video) => {
                const statusStyle = statusColors[video.status] || statusColors.processing;
                return (
                  <Stack
                    key={video._id}
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
                        sx={{
                          width: 48,
                          height: 48,
                          minWidth: 48,
                          overflow: 'hidden',
                          backgroundImage: video.thumbnailUrl
                            ? `url(${video.thumbnailUrl})`
                            : 'none',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }}
                        borderRadius={2}
                        bgcolor="background.paper"
                      >
                        {!video.thumbnailUrl && (
                          <IconifyIcon
                            icon="ic:round-play-circle-outline"
                            sx={{ fontSize: 24, color: 'primary.main' }}
                          />
                        )}
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
                          {new Date(video.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
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
                        {video.platforms.map((p) => {
                          const platformInfo = platformIcons[p.platform] || {
                            icon: 'mdi:help',
                            color: '#999',
                          };
                          const isFailed = p.status === 'failed';
                          return (
                            <Stack
                              key={p.platform}
                              direction="column"
                              alignItems="center"
                              justifyContent="center"
                              width={28}
                              height={28}
                              borderRadius="50%"
                              sx={{
                                bgcolor: isFailed ? 'error.lighter' : `${platformInfo.color}15`,
                                border: isFailed ? 1 : 0,
                                borderColor: 'error.main',
                              }}
                              title={`${p.platform} (${p.status})`}
                            >
                              <IconifyIcon
                                icon={platformInfo.icon}
                                sx={{
                                  fontSize: 16,
                                  color: isFailed ? 'error.main' : platformInfo.color,
                                }}
                              />
                            </Stack>
                          );
                        })}
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
                      <Stack direction="row" spacing={1} alignItems="center">
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
                        {(video.status === 'failed' || video.status === 'partial') && (
                          <Box
                            component="button"
                            disabled={retryingIds.has(video._id)}
                            onClick={async () => {
                              if (retryingIds.has(video._id)) return;
                              setRetryingIds((prev) => new Set(prev).add(video._id));
                              try {
                                const res = await fetch(
                                  `http://localhost:4000/api/videos/${video._id}/retry`,
                                  { method: 'POST' },
                                );
                                const data = await res.json();
                                if (data.success) fetchVideos();
                              } catch (e) {
                                console.error('Retry failed', e);
                              } finally {
                                setRetryingIds((prev) => {
                                  const next = new Set(prev);
                                  next.delete(video._id);
                                  return next;
                                });
                              }
                            }}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: 28,
                              height: 28,
                              borderRadius: 1,
                              border: 0,
                              bgcolor: 'primary.lighter',
                              color: 'primary.main',
                              cursor: retryingIds.has(video._id) ? 'not-allowed' : 'pointer',
                              opacity: retryingIds.has(video._id) ? 0.6 : 1,
                              '&:hover': {
                                bgcolor: retryingIds.has(video._id)
                                  ? 'primary.lighter'
                                  : 'primary.light',
                                color: retryingIds.has(video._id) ? 'primary.main' : 'primary.dark',
                              },
                            }}
                            title="Retry Failed Uploads"
                          >
                            {retryingIds.has(video._id) ? (
                              <CircularProgress size={14} color="inherit" />
                            ) : (
                              <IconifyIcon icon="mdi:refresh" sx={{ fontSize: 18 }} />
                            )}
                          </Box>
                        )}
                      </Stack>
                    </Stack>
                  </Stack>
                );
              })
            )}
          </Stack>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default MyVideos;
