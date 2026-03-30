import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useI18n } from 'i18n/I18nContext';
import IconifyIcon from 'components/base/IconifyIcon';
import Topbar from 'layouts/main-layout/topbar';

interface PricingFeature {
  label: string;
}

interface PricingTier {
  id: string;
  titleKey: string;
  price: number;
  uploads: number;
  bestValue?: boolean;
  features: PricingFeature[];
}

const PRICING_TIERS: PricingTier[] = [
  {
    id: 'basic',
    titleKey: 'upgrade.tierBasic',
    price: 4.55,
    uploads: 3,
    features: [
      { label: 'upgrade.featDaily' },
      { label: 'upgrade.featMetadata' },
      { label: 'upgrade.featThumbnails' },
      { label: 'upgrade.featSupportStandard' },
      { label: 'upgrade.featSingleUser' },
    ],
  },
  {
    id: 'premium',
    titleKey: 'upgrade.tierPremium',
    price: 9.09,
    uploads: 5,
    bestValue: true,
    features: [
      { label: 'upgrade.featAllBasic' },
      { label: 'upgrade.featAdvSettings' },
      { label: 'upgrade.featSubtitles' },
      { label: 'upgrade.featChapters' },
      { label: 'upgrade.featEndScreens' },
      { label: 'upgrade.featScheduled' },
      { label: 'upgrade.featTemplates' },
      { label: 'upgrade.featSupportPriority' },
    ],
  },
  {
    id: 'enterprise',
    titleKey: 'upgrade.tierEnterprise',
    price: 21.21,
    uploads: 10,
    features: [
      { label: 'upgrade.featAllPremium' },
      { label: 'upgrade.featWorkflows' },
      { label: 'upgrade.featAnalytics' },
      { label: 'upgrade.featAPI' },
      { label: 'upgrade.featCustomDev' },
      { label: 'upgrade.featDedicatedMgr' },
    ],
  },
];

const Billing = () => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(price);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50', display: 'flex', flexDirection: 'column' }}>
      {/* Existing Header Topbar */}
      <Box
        sx={{ px: { xs: 2.5, md: 3.5 }, bgcolor: 'white', borderBottom: 1, borderColor: 'divider' }}
      >
        <Topbar isClosing={false} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      </Box>

      {/* Back Button & Main Content */}
      <Box sx={{ pb: 8, pt: 4, px: { xs: 2.5, sm: 4 }, flexGrow: 1 }}>
        <Button
          variant="outlined"
          onClick={() => navigate('/')}
          startIcon={<IconifyIcon icon="ic:round-arrow-back" />}
          sx={{
            mb: { xs: 4, md: 6 },
            fontWeight: 600,
            color: 'text.primary',
            borderColor: 'grey.300',
            '&:hover': { borderColor: 'text.primary', bgcolor: 'transparent' },
          }}
        >
          {t('common.backToHome') || 'Back to Dashboard'}
        </Button>

        {/* Header Content */}
        <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
          <Typography variant="h2" mb={2} fontWeight={800} color="text.primary">
            {t('upgrade.title')}
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            sx={{ maxWidth: 640, mx: 'auto', fontSize: '1.1rem' }}
          >
            {t('upgrade.description')}
          </Typography>
        </Box>

        {/* Pricing Cards */}
        <Grid
          container
          spacing={4}
          justifyContent="center"
          alignItems="stretch"
          sx={{ maxWidth: 1200, mx: 'auto' }}
        >
          {PRICING_TIERS.map((tier) => {
            const isBest = tier.bestValue;

            return (
              <Grid item xs={12} md={4} key={tier.id}>
                <Card
                  elevation={isBest ? 12 : 2}
                  sx={{
                    height: '100%',
                    borderRadius: 4,
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    bgcolor: 'background.paper',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: 8,
                    },
                  }}
                >
                  {isBest && (
                    <>
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 24,
                          right: -32,
                          backgroundColor: '#FF9800',
                          color: 'white',
                          fontWeight: 800,
                          px: 5,
                          py: 0.5,
                          fontSize: '0.75rem',
                          transform: 'rotate(45deg)',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                          zIndex: 10,
                          letterSpacing: 1,
                          textTransform: 'uppercase',
                        }}
                      >
                        Best Value
                      </Box>
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          border: '4px solid',
                          borderColor: '#FF9800',
                          borderRadius: 4,
                          zIndex: 1,
                          pointerEvents: 'none',
                        }}
                      />
                    </>
                  )}
                  <CardContent
                    sx={{
                      p: { xs: 3, sm: 4 },
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%',
                    }}
                  >
                    <Typography
                      variant="h4"
                      component="h2"
                      fontWeight={800}
                      color="text.primary"
                      gutterBottom
                    >
                      {t(tier.titleKey)}
                    </Typography>

                    <Box sx={{ my: 2 }}>
                      <Typography variant="h3" component="p" fontWeight={800} color="text.primary">
                        {formatPrice(tier.price)}
                        <Typography
                          component="span"
                          variant="h6"
                          color="text.secondary"
                          sx={{ fontWeight: 600, ml: 0.5 }}
                        >
                          / month
                        </Typography>
                      </Typography>
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    <List sx={{ mb: 4, flexGrow: 1, p: 0 }}>
                      <ListItem sx={{ px: 0, py: 0.75 }}>
                        <ListItemIcon sx={{ minWidth: 40 }}>
                          <IconifyIcon
                            icon="ic:round-cloud-upload"
                            sx={{ color: 'error.main', fontSize: 24 }}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={`${tier.uploads} ${t('upgrade.dailyUploadsText')}`}
                          primaryTypographyProps={{
                            fontWeight: 800,
                            color: 'text.primary',
                            fontSize: '1.05rem',
                          }}
                        />
                      </ListItem>

                      {tier.features.map((feature, index) => (
                        <ListItem key={index} sx={{ px: 0, py: 0.75 }}>
                          <ListItemIcon sx={{ minWidth: 40 }}>
                            <IconifyIcon
                              icon="ic:round-check-circle"
                              sx={{ color: 'success.main', fontSize: 22 }}
                            />
                          </ListItemIcon>
                          <ListItemText
                            primary={t(feature.label)}
                            primaryTypographyProps={{
                              variant: 'body1',
                              color: 'text.primary',
                              fontWeight: 500,
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>

                    <Button
                      variant="contained"
                      fullWidth
                      size="large"
                      endIcon={<IconifyIcon icon="ic:round-arrow-forward" />}
                      sx={{
                        mt: 'auto',
                        py: 1.5,
                        fontWeight: 700,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontSize: '1rem',
                        bgcolor: isBest ? '#FF9800' : 'primary.main',
                        color: 'white',
                        boxShadow: isBest ? '0 8px 16px -4px rgba(255, 152, 0, 0.4)' : undefined,
                        '&:hover': {
                          bgcolor: isBest ? '#f57c00' : 'primary.dark',
                        },
                      }}
                    >
                      {t('upgrade.cta')}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </Box>
  );
};

export default Billing;
