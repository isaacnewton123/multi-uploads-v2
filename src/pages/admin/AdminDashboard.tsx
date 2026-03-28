import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import IconifyIcon from 'components/base/IconifyIcon';
import { platformStats } from 'data/adminMockData';

interface AdminStatCardProps {
  title: string;
  value: string | number;
  icon: string;
  color: string;
}

// Re-using a pattern similar to the user dashboard stats, but custom for Admin
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

const AdminDashboard = () => {
  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h3" mb={1}>
        Platform Overview
      </Typography>
      <Typography variant="body2" color="text.disabled" mb={4}>
        Welcome to the Super Admin dashboard. Here is what's happening today.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <AdminStatCard
            title="Total Users"
            value={platformStats.totalUsers.toLocaleString()}
            icon="ic:round-people-alt"
            color="#1877F2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <AdminStatCard
            title="Active Users Today"
            value={platformStats.activeUsersToday.toLocaleString()}
            icon="ic:round-person-pin"
            color="#00A76F"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <AdminStatCard
            title="Videos Uploaded Today"
            value={platformStats.videosUploadedToday.toLocaleString()}
            icon="ic:round-cloud-upload"
            color="#FF5630"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <AdminStatCard
            title="Failed Uploads (24h)"
            value={platformStats.failedUploadsToday}
            icon="ic:round-error"
            color="#FFAB00"
          />
        </Grid>
      </Grid>

      {/* Platform API Usage Fake Visuals */}
      <Box mt={4}>
        <Typography variant="h5" mb={3}>
          API Quota Usage
        </Typography>
        <Grid container spacing={3}>
          {Object.entries(platformStats.apiUsage).map(([platform, usage]) => (
            <Grid item xs={12} sm={6} md={3} key={platform}>
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" textTransform="capitalize" mb={2}>
                  {platform} API
                </Typography>
                <Box position="relative" display="inline-flex">
                  <IconifyIcon
                    icon={usage > 80 ? 'ic:round-warning' : 'ic:round-check-circle'}
                    sx={{
                      fontSize: 64,
                      color: usage > 80 ? 'error.main' : 'success.main',
                      opacity: 0.2,
                    }}
                  />
                  <Typography variant="h4" position="absolute" top={16} left={0} right={0}>
                    {usage}%
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
