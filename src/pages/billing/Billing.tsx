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
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Link from '@mui/material/Link';
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

const TRUST_BADGES = [
  {
    icon: 'ic:round-verified-user',
    labelKey: 'billing.badge.securePayments',
    subKey: 'billing.badge.securePaymentsSub',
  },
  {
    icon: 'ic:round-replay',
    labelKey: 'billing.badge.moneyBack',
    subKey: 'billing.badge.moneyBackSub',
  },
  {
    icon: 'ic:round-support-agent',
    labelKey: 'billing.badge.support',
    subKey: 'billing.badge.supportSub',
  },
  {
    icon: 'ic:round-cancel',
    labelKey: 'billing.badge.cancelAnytime',
    subKey: 'billing.badge.cancelAnytimeSub',
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
      {/* Header */}
      <Box
        sx={{
          px: { xs: 2, md: 3.5 },
          bgcolor: 'white',
          borderBottom: 1,
          borderColor: 'divider',
          flexShrink: 0,
        }}
      >
        <Topbar isClosing={false} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      </Box>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, py: { xs: 4, md: 6 } }}>
        <Container maxWidth="lg">
          {/* Back Button */}
          <Button
            variant="outlined"
            onClick={() => navigate('/')}
            startIcon={<IconifyIcon icon="ic:round-arrow-back" />}
            size="small"
            sx={{
              mb: { xs: 4, md: 5 },
              fontWeight: 600,
              color: 'text.primary',
              borderColor: 'grey.300',
              textTransform: 'none',
              '&:hover': { borderColor: 'grey.600', bgcolor: 'transparent' },
            }}
          >
            {t('common.backToHome') || 'Back to Dashboard'}
          </Button>

          {/* ── Page Title ── */}
          <Box sx={{ textAlign: 'center', mb: { xs: 5, md: 7 } }}>
            <Typography
              fontWeight={800}
              color="text.primary"
              sx={{ fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.6rem' }, mb: 1.5 }}
            >
              {t('upgrade.title')}
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ maxWidth: 580, mx: 'auto', fontSize: { xs: '0.95rem', md: '1.05rem' } }}
            >
              {t('upgrade.description')}
            </Typography>
          </Box>

          {/* ── Pricing Cards ── */}
          <Grid container spacing={{ xs: 3, md: 4 }} alignItems="stretch">
            {PRICING_TIERS.map((tier) => {
              const isBest = tier.bestValue;
              return (
                <Grid item xs={12} sm={6} md={4} key={tier.id}>
                  <Card
                    elevation={isBest ? 12 : 2}
                    sx={{
                      height: '100%',
                      borderRadius: 4,
                      position: 'relative',
                      display: 'flex',
                      flexDirection: 'column',
                      overflow: 'hidden',
                      bgcolor: 'background.paper',
                      transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                      '&:hover': { transform: 'translateY(-6px)', boxShadow: isBest ? 16 : 8 },
                    }}
                  >
                    {isBest && (
                      <>
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 22,
                            right: -28,
                            backgroundColor: '#FF9800',
                            color: 'white',
                            fontWeight: 800,
                            px: 5,
                            py: 0.4,
                            fontSize: '0.7rem',
                            transform: 'rotate(45deg)',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
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
                            inset: 0,
                            border: '4px solid #FF9800',
                            borderRadius: 4,
                            zIndex: 1,
                            pointerEvents: 'none',
                          }}
                        />
                      </>
                    )}
                    <CardContent
                      sx={{
                        p: { xs: 2.5, sm: 3.5 },
                        display: 'flex',
                        flexDirection: 'column',
                        flexGrow: 1,
                        '&:last-child': { pb: { xs: 2.5, sm: 3.5 } },
                      }}
                    >
                      <Typography variant="h5" fontWeight={800} color="text.primary" gutterBottom>
                        {t(tier.titleKey)}
                      </Typography>

                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
                          <Typography
                            fontWeight={800}
                            color="text.primary"
                            sx={{ fontSize: { xs: '2rem', sm: '2.4rem' }, lineHeight: 1 }}
                          >
                            {formatPrice(tier.price)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" fontWeight={500}>
                            / month
                          </Typography>
                        </Box>
                      </Box>

                      <Divider sx={{ mb: 2.5 }} />

                      <List disablePadding sx={{ flexGrow: 1, mb: 3 }}>
                        <ListItem disableGutters sx={{ py: 0.6 }}>
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <IconifyIcon
                              icon="ic:round-cloud-upload"
                              sx={{ color: 'error.main', fontSize: 22 }}
                            />
                          </ListItemIcon>
                          <ListItemText
                            primary={`${tier.uploads} ${t('upgrade.dailyUploadsText')}`}
                            primaryTypographyProps={{
                              fontWeight: 700,
                              color: 'text.primary',
                              fontSize: '0.95rem',
                            }}
                          />
                        </ListItem>
                        {tier.features.map((feature, index) => (
                          <ListItem key={index} disableGutters sx={{ py: 0.6 }}>
                            <ListItemIcon sx={{ minWidth: 36 }}>
                              <IconifyIcon
                                icon="ic:round-check-circle"
                                sx={{ color: 'success.main', fontSize: 20 }}
                              />
                            </ListItemIcon>
                            <ListItemText
                              primary={t(feature.label)}
                              primaryTypographyProps={{
                                color: 'text.primary',
                                fontWeight: 500,
                                fontSize: '0.9rem',
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
                          py: 1.4,
                          fontWeight: 700,
                          borderRadius: 2,
                          textTransform: 'none',
                          fontSize: '0.95rem',
                          bgcolor: isBest ? '#FF9800' : 'primary.main',
                          color: 'white',
                          boxShadow: isBest ? '0 6px 16px -4px rgba(255,152,0,0.45)' : undefined,
                          '&:hover': { bgcolor: isBest ? '#f57c00' : 'primary.dark' },
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

          {/* ── Trust Badges ── */}
          <Grid
            container
            spacing={{ xs: 2, sm: 3 }}
            sx={{ mt: { xs: 6, md: 8 }, mb: { xs: 5, md: 7 } }}
          >
            {TRUST_BADGES.map((badge) => (
              <Grid item xs={12} sm={6} md={3} key={badge.labelKey}>
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={2}
                  sx={{
                    p: { xs: 2, sm: 2.5 },
                    borderRadius: 3,
                    bgcolor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                    height: '100%',
                  }}
                >
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      flexShrink: 0,
                      borderRadius: '50%',
                      bgcolor: 'primary.lighter',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <IconifyIcon icon={badge.icon} sx={{ fontSize: 24, color: 'primary.main' }} />
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" fontWeight={700} color="text.primary">
                      {t(badge.labelKey)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" lineHeight={1.4}>
                      {t(badge.subKey)}
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
            ))}
          </Grid>

          <Divider />

          {/* ── Enterprise CTA Banner ── */}
          <Box
            sx={{
              mt: { xs: 6, md: 8 },
              borderRadius: 4,
              p: { xs: 3, sm: 5 },
              background: (theme) =>
                `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
              color: 'white',
              textAlign: 'center',
            }}
          >
            <Typography
              fontWeight={800}
              color="white"
              sx={{ fontSize: { xs: '1.4rem', md: '1.8rem' }, mb: 1.5 }}
            >
              {t('billing.enterprise.title')}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                opacity: 0.88,
                mb: 3,
                maxWidth: 560,
                mx: 'auto',
                fontSize: { xs: '0.9rem', md: '1rem' },
              }}
            >
              {t('billing.enterprise.desc')}
            </Typography>
            <Button
              variant="contained"
              size="large"
              endIcon={<IconifyIcon icon="ic:round-mail" />}
              sx={{
                bgcolor: 'white',
                color: 'primary.dark',
                fontWeight: 700,
                textTransform: 'none',
                borderRadius: 2,
                px: 4,
                '&:hover': { bgcolor: 'grey.100' },
              }}
            >
              {t('billing.enterprise.cta')}
            </Button>
          </Box>
        </Container>
      </Box>

      {/* ── Footer ── */}
      <Box
        component="footer"
        sx={{
          borderTop: 1,
          borderColor: 'divider',
          bgcolor: 'white',
          py: 3,
          mt: 8,
        }}
      >
        <Container maxWidth="lg">
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            alignItems="center"
            justifyContent="space-between"
            spacing={2}
          >
            <Typography variant="body2" color="text.secondary" fontWeight={500}>
              © 2024{' '}
              <Link href="https://multiuploads.xyz" fontWeight={600} underline="hover">
                MultiUploads
              </Link>
              . {t('footer.allRights')}
            </Typography>
            <Stack
              direction="row"
              spacing={{ xs: 2, sm: 3 }}
              flexWrap="wrap"
              justifyContent={{ xs: 'center', sm: 'flex-end' }}
            >
              {(
                [
                  ['billing.footer.terms', '#!'],
                  ['billing.footer.privacy', '#!'],
                  ['billing.footer.contact', '#!'],
                ] as [string, string][]
              ).map(([key, href]) => (
                <Link
                  key={key}
                  href={href}
                  variant="body2"
                  color="text.secondary"
                  underline="hover"
                  fontWeight={500}
                  sx={{ '&:hover': { color: 'primary.main' } }}
                >
                  {t(key)}
                </Link>
              ))}
            </Stack>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};

export default Billing;
