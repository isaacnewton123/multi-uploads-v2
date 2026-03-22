import Grid from '@mui/material/Grid';
import UploadStatsCard from 'components/sections/dashboard/upload-stats/UploadStatsCard';
import PlatformStatus from 'components/sections/dashboard/platform-status/PlatformStatus';
import RecentUploads from 'components/sections/dashboard/recent-uploads/RecentUploads';
import QuickUpload from 'components/sections/dashboard/quick-upload/QuickUpload';
import { useI18n } from 'i18n/I18nContext';

const Dashboard = () => {
  const { t } = useI18n();

  return (
    <Grid container spacing={2.5}>
      {/* Stats Row */}
      <Grid item xs={12} sm={6} md={3}>
        <UploadStatsCard
          title={t('dashboard.uploadsToday')}
          value={12}
          icon="ic:round-cloud-upload"
          iconColor="primary.main"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <UploadStatsCard
          title={t('dashboard.remainingToday')}
          value={38}
          icon="ic:round-pending-actions"
          iconColor="warning.main"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <UploadStatsCard
          title={t('dashboard.connectedPlatforms')}
          value="2 / 4"
          icon="ic:round-link"
          iconColor="success.main"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <UploadStatsCard
          title={t('dashboard.totalVideos')}
          value={247}
          icon="ic:round-video-library"
          iconColor="secondary.main"
        />
      </Grid>

      {/* Platform Status + Quick Upload */}
      <Grid item xs={12} md={6} lg={5}>
        <PlatformStatus />
      </Grid>
      <Grid item xs={12} md={6} lg={7}>
        <QuickUpload />
      </Grid>

      {/* Recent Uploads */}
      <Grid item xs={12}>
        <RecentUploads />
      </Grid>
    </Grid>
  );
};

export default Dashboard;
