import { useState, useEffect, useCallback } from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import IconifyIcon from 'components/base/IconifyIcon';

interface AdminStatCardProps {
  title: string;
  value: string | number;
  icon: string;
  color: string;
}

const AdminStatCard = ({ title, value, icon, color }: AdminStatCardProps) => (
  <Paper sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
    <Box>
      <Typography variant="h4" mb={0.5}>
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary" fontWeight={500}>
        {title}
      </Typography>
    </Box>
    <Stack
      alignItems="center"
      justifyContent="center"
      width={48}
      height={48}
      borderRadius="50%"
      bgcolor={`${color}15`}
    >
      <IconifyIcon icon={icon} sx={{ fontSize: 24, color }} />
    </Stack>
  </Paper>
);

interface DashboardStats {
  totalVideos: number;
  uploadsToday: number;
  statusBreakdown?: { published?: number; failed?: number };
  queue: { waiting: number; active: number; completed: number; failed: number };
  platformBreakdown?: { platform: string; count: number; successRate: number }[];
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('http://localhost:4000/api/dashboard/stats');
      const data = await res.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch dashboard stats:', err);
    } finally {
      if (loading) setLoading(false);
    }
  }, [loading]);

  useEffect(() => {
    fetchStats();
    // Poll every 3 seconds for live worker queue monitoring
    const interval = setInterval(fetchStats, 3000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  if (loading || !stats) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h3" mb={1}>
        Super Admin Monitor
      </Typography>
      <Typography variant="body2" color="text.disabled" mb={4}>
        Real-time monitoring of Platform Uploads and BullMQ Worker queues.
      </Typography>

      <Typography variant="h5" mb={2}>
        Platform Statistics
      </Typography>
      <Grid container spacing={3} mb={5}>
        <Grid item xs={12} sm={6} md={3}>
          <AdminStatCard
            title="Total Uploaded Videos"
            value={stats.totalVideos.toLocaleString()}
            icon="ic:round-video-library"
            color="#1877F2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <AdminStatCard
            title="Uploads Today"
            value={stats.uploadsToday.toLocaleString()}
            icon="ic:round-cloud-upload"
            color="#00A76F"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <AdminStatCard
            title="Uploaded Successfully"
            value={(stats.statusBreakdown?.published || 0).toLocaleString()}
            icon="ic:round-check-circle"
            color="#1877F2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <AdminStatCard
            title="Uploads Failed"
            value={(stats.statusBreakdown?.failed || 0).toLocaleString()}
            icon="ic:round-error"
            color="#FF5630"
          />
        </Grid>
      </Grid>

      {/* BullMQ Queue Monitor */}
      <Box mt={4}>
        <Stack direction="row" alignItems="center" spacing={1.5} mb={3}>
          <Typography variant="h5">BullMQ Worker Queue</Typography>
          <Chip
            label="Live"
            size="small"
            color="error"
            variant="outlined"
            icon={<IconifyIcon icon="mdi:record" />}
            sx={{ border: 0, bgcolor: 'error.lighter' }}
          />
        </Stack>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <AdminStatCard
              title="Jobs Waiting (Queued)"
              value={stats.queue.waiting.toLocaleString()}
              icon="mdi:clock-outline"
              color="#FFAB00"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AdminStatCard
              title="Jobs Active (Processing)"
              value={stats.queue.active.toLocaleString()}
              icon="mdi:cog-sync"
              color="#00A76F"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AdminStatCard
              title="Jobs Completed"
              value={stats.queue.completed.toLocaleString()}
              icon="mdi:check-all"
              color="#1877F2"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AdminStatCard
              title="Jobs Failed"
              value={stats.queue.failed.toLocaleString()}
              icon="mdi:alert-circle-outline"
              color="#FF5630"
            />
          </Grid>
        </Grid>
      </Box>

      {/* Platform Breakdown */}
      <Box mt={6}>
        <Typography variant="h5" mb={3}>
          Platform Analytics
        </Typography>
        <Grid container spacing={3}>
          {stats.platformBreakdown?.map((platform) => (
            <Grid item xs={12} sm={6} md={3} key={platform.platform}>
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" textTransform="capitalize" mb={2}>
                  {platform.platform}
                </Typography>
                <Box position="relative" display="inline-flex">
                  <CircularProgress
                    variant="determinate"
                    value={platform.successRate}
                    size={64}
                    thickness={4}
                    sx={{
                      color:
                        platform.successRate > 80
                          ? 'success.main'
                          : platform.successRate > 50
                            ? 'warning.main'
                            : 'error.main',
                    }}
                  />
                  <Typography
                    variant="caption"
                    position="absolute"
                    top={22}
                    left={0}
                    right={0}
                    fontWeight={700}
                  >
                    {platform.successRate}%
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" mt={2}>
                  {platform.count} total jobs
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
