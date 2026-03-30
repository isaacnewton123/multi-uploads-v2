import { useState, useEffect, useCallback } from 'react';
import Grid from '@mui/material/Grid';
import UploadStatsCard from 'components/sections/dashboard/upload-stats/UploadStatsCard';
import PlatformStatus from 'components/sections/dashboard/platform-status/PlatformStatus';
import RecentUploads from 'components/sections/dashboard/recent-uploads/RecentUploads';
import QuickUpload from 'components/sections/dashboard/quick-upload/QuickUpload';
import { useI18n } from 'i18n/I18nContext';

interface VideoData {
  _id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  platforms: {
    platform: string;
    status: string;
    completedAt?: string;
  }[];
}

export interface DashboardStats {
  uploadsToday: number;
  totalVideos: number;
  publishedCount: number;
  processingCount: number;
  platformCounts: Record<string, { connected: boolean; published: number; failed: number }>;
  recentVideos: VideoData[];
}

const PLATFORM_LIST = ['youtube', 'facebook', 'instagram', 'tiktok'];

const Dashboard = () => {
  const { t } = useI18n();
  const [stats, setStats] = useState<DashboardStats>({
    uploadsToday: 0,
    totalVideos: 0,
    publishedCount: 0,
    processingCount: 0,
    platformCounts: {},
    recentVideos: [],
  });

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('http://localhost:4000/api/videos?limit=1000');
      const data = await res.json();
      if (!data.success) return;

      const videos: VideoData[] = data.data;
      const today = new Date().toDateString();

      const uploadsToday = videos.filter(
        (v) => new Date(v.createdAt).toDateString() === today,
      ).length;

      const totalVideos = videos.length;

      // Match exactly what MyVideos.tsx counts: unique videos by their top-level status
      const publishedCount = videos.filter((v) => v.status === 'published').length;

      let processingCount = 0;
      const platformCounts: Record<
        string,
        { connected: boolean; published: number; failed: number }
      > = {};

      PLATFORM_LIST.forEach((p) => {
        platformCounts[p] = { connected: false, published: 0, failed: 0 };
      });

      videos.forEach((v) => {
        v.platforms.forEach((p) => {
          if (!platformCounts[p.platform]) {
            platformCounts[p.platform] = { connected: false, published: 0, failed: 0 };
          }
          // A platform is "connected" if ANY upload was ever sent to it (regardless of status)
          platformCounts[p.platform].connected = true;

          if (p.status === 'published') {
            platformCounts[p.platform].published++;
          } else if (p.status === 'processing' || p.status === 'pending') {
            processingCount++;
          } else if (p.status === 'failed') {
            platformCounts[p.platform].failed++;
          }
        });
      });

      setStats({
        uploadsToday,
        totalVideos,
        publishedCount,
        processingCount,
        platformCounts,
        recentVideos: videos.slice(0, 5),
      });
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 15000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  const connectedCount = Object.values(stats.platformCounts).filter((p) => p.connected).length;

  return (
    <Grid container spacing={2.5}>
      {/* Stats Row */}
      <Grid item xs={12} sm={6} md={3}>
        <UploadStatsCard
          title={t('dashboard.uploadsToday')}
          value={stats.uploadsToday}
          icon="ic:round-cloud-upload"
          iconColor="primary.main"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <UploadStatsCard
          title={t('dashboard.published')}
          value={stats.publishedCount}
          icon="ic:round-check-circle"
          iconColor="success.main"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <UploadStatsCard
          title={t('dashboard.connectedPlatforms')}
          value={`${connectedCount} / ${PLATFORM_LIST.length}`}
          icon="ic:round-link"
          iconColor="#3b82f6"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <UploadStatsCard
          title={t('dashboard.totalVideos')}
          value={stats.totalVideos}
          icon="ic:round-video-library"
          iconColor="secondary.main"
        />
      </Grid>

      {/* Platform Status + Quick Upload */}
      <Grid item xs={12} md={6} lg={5}>
        <PlatformStatus platformCounts={stats.platformCounts} />
      </Grid>
      <Grid item xs={12} md={6} lg={7}>
        <QuickUpload />
      </Grid>

      {/* Recent Uploads */}
      <Grid item xs={12}>
        <RecentUploads videos={stats.recentVideos} />
      </Grid>
    </Grid>
  );
};

export default Dashboard;
