import { useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import Chip from '@mui/material/Chip';
import Skeleton from '@mui/material/Skeleton';
import IconifyIcon from 'components/base/IconifyIcon';
import { useI18n } from 'i18n/I18nContext';
import { useNavigate } from 'react-router-dom';
import { usePlan, type PlanId } from 'providers/PlanContext';
import paths from 'routes/paths';

// ─── Visual config per plan (only UI concern — limits come from PlanContext) ─
interface PlanVisual {
  nameKey: string;
  color: string;
  gradient: string;
  icon: string;
}

const PLAN_VISUALS: Record<PlanId, PlanVisual> = {
  free: {
    nameKey: 'sidebar.planFree',
    color: '#94a3b8',
    gradient: 'linear-gradient(135deg, #64748b 0%, #94a3b8 100%)',
    icon: 'ic:round-star-border',
  },
  basic: {
    nameKey: 'sidebar.planBasic',
    color: '#3b82f6',
    gradient: 'linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%)',
    icon: 'ic:round-star-half',
  },
  premium: {
    nameKey: 'sidebar.planPremium',
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, #d97706 0%, #fbbf24 100%)',
    icon: 'ic:round-star',
  },
  enterprise: {
    nameKey: 'sidebar.planEnterprise',
    color: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #6d28d9 0%, #a78bfa 100%)',
    icon: 'ic:round-rocket-launch',
  },
};

// ─── Component ───────────────────────────────────────────────────────────────
const SidebarCard = () => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { planId, planConfig } = usePlan();

  const visual = PLAN_VISUALS[planId];
  const isTopPlan = planId === 'enterprise';

  const [uploadsToday, setUploadsToday] = useState<number | null>(null);
  const [dailyLimit, setDailyLimit] = useState<number>(planConfig.dailyUploadLimit);
  const [loading, setLoading] = useState(true);

  // ── Fetch real upload stats from backend ──────────────────────────────────
  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch(`http://localhost:4000/api/dashboard/stats?plan=${planId}`);
      if (!res.ok) throw new Error('stats fetch failed');
      const json = await res.json();
      if (json.success && json.data != null) {
        setUploadsToday(json.data.uploadsToday ?? 0);
        if (json.data.dailyLimit != null) {
          setDailyLimit(json.data.dailyLimit);
        }
      }
    } catch {
      setUploadsToday(0);
    } finally {
      setLoading(false);
    }
  }, [planId]);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30_000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  const used = uploadsToday ?? 0;
  const progress = Math.min(Math.round((used / dailyLimit) * 100), 100);
  const remaining = Math.max(dailyLimit - used, 0);

  return (
    <Box
      sx={{
        borderRadius: 3,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      {/* Gradient header */}
      <Box sx={{ background: visual.gradient, px: 2, py: 1.5 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={0.75}>
            <IconifyIcon icon={visual.icon} sx={{ fontSize: 16, color: 'white' }} />
            <Typography variant="caption" fontWeight={700} color="white" letterSpacing={0.4}>
              {t('sidebar.currentPlan').toUpperCase()}
            </Typography>
          </Stack>
          <Chip
            label={t(visual.nameKey)}
            size="small"
            sx={{
              bgcolor: 'rgba(255,255,255,0.25)',
              color: 'white',
              fontWeight: 700,
              fontSize: '0.7rem',
              height: 20,
            }}
          />
        </Stack>
      </Box>

      {/* Body */}
      <Box sx={{ px: 2, py: 1.75 }}>
        {/* Daily uploads row */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={0.75}>
          <Typography variant="caption" color="text.secondary" fontWeight={500}>
            {t('sidebar.dailyUploads')}
          </Typography>
          {loading ? (
            <Skeleton variant="text" width={36} height={16} />
          ) : (
            <Typography variant="caption" fontWeight={700} color="text.primary">
              {used} / {dailyLimit}
            </Typography>
          )}
        </Stack>

        {/* Progress bar */}
        {loading ? (
          <Skeleton variant="rounded" height={6} sx={{ mb: 1, borderRadius: 3 }} />
        ) : (
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 6,
              borderRadius: 3,
              mb: 1,
              bgcolor: 'action.hover',
              '& .MuiLinearProgress-bar': {
                borderRadius: 3,
                background: visual.gradient,
              },
            }}
          />
        )}

        {/* Remaining label */}
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
          {loading ? (
            <Skeleton variant="text" width="70%" height={16} />
          ) : remaining > 0 ? (
            <>
              <Box component="span" fontWeight={700} color="text.primary">
                {remaining}
              </Box>{' '}
              upload{remaining !== 1 ? 's' : ''} remaining today
            </>
          ) : (
            <Box component="span" color="error.main" fontWeight={600}>
              Daily limit reached
            </Box>
          )}
        </Typography>

        {/* CTA */}
        {!isTopPlan ? (
          <Button
            fullWidth
            size="small"
            variant="contained"
            onClick={() => navigate(paths.billing)}
            endIcon={
              <IconifyIcon icon="ic:round-arrow-forward" sx={{ fontSize: '14px !important' }} />
            }
            sx={{
              background: visual.gradient,
              fontWeight: 700,
              fontSize: '0.78rem',
              textTransform: 'none',
              borderRadius: 2,
              py: 0.75,
              boxShadow: 'none',
              '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.2)' },
            }}
          >
            {t('sidebar.upgradePlan')}
          </Button>
        ) : (
          <Button
            fullWidth
            size="small"
            variant="outlined"
            onClick={() => navigate(paths.billing)}
            sx={{
              fontWeight: 600,
              fontSize: '0.78rem',
              textTransform: 'none',
              borderRadius: 2,
              py: 0.75,
              borderColor: visual.color,
              color: visual.color,
              '&:hover': { borderColor: visual.color, bgcolor: `${visual.color}18` },
            }}
          >
            {t('sidebar.viewPlans')}
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default SidebarCard;
