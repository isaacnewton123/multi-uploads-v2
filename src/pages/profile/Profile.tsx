import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconifyIcon from 'components/base/IconifyIcon';
import ProfileImage from 'assets/images/avatars/avatar1.png';
import { useI18n } from 'i18n/I18nContext';

const profileData = {
  name: 'Jason Statham',
  email: 'jason@example.com',
  role: 'Content Creator',
  memberSince: 'Mar 2024',
  username: '@jasonstatham',
};

const Profile = () => {
  const { t } = useI18n();

  const stats = [
    {
      labelKey: 'profilePage.totalUploads',
      value: '247',
      color: 'primary.main',
      icon: 'ic:round-cloud-upload',
    },
    {
      labelKey: 'myVideos.published',
      value: '231',
      color: 'success.main',
      icon: 'ic:round-check-circle',
    },
    {
      labelKey: 'profilePage.connectedPlatforms',
      value: '2 / 4',
      color: 'warning.main',
      icon: 'ic:round-link',
    },
  ];

  const infoRows = [
    { labelKey: 'profilePage.fullName', value: profileData.name, icon: 'ic:round-person' },
    { labelKey: 'profilePage.email', value: profileData.email, icon: 'ic:round-email' },
    {
      labelKey: 'profilePage.username',
      value: profileData.username,
      icon: 'ic:round-alternate-email',
    },
    { labelKey: 'profilePage.role', value: profileData.role, icon: 'ic:round-shield' },
    {
      labelKey: 'profilePage.memberSince',
      value: profileData.memberSince,
      icon: 'ic:round-calendar-today',
    },
  ];

  return (
    <Grid container spacing={2.5}>
      <Grid item xs={12}>
        <Typography variant="h4">{t('profilePage.title')}</Typography>
        <Typography variant="body2" color="text.disabled" mt={0.5}>
          {t('profilePage.description')}
        </Typography>
      </Grid>

      <Grid item xs={12} md={5}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Avatar
            src={ProfileImage}
            sx={{
              width: 100,
              height: 100,
              mx: 'auto',
              mb: 2,
              border: 4,
              borderColor: 'primary.lighter',
            }}
          />
          <Typography variant="h5" fontWeight={700}>
            {profileData.name}
          </Typography>
          <Typography variant="body2" color="text.disabled" mt={0.5}>
            {profileData.email}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              display: 'inline-block',
              mt: 1.5,
              px: 2,
              py: 0.5,
              bgcolor: 'primary.lighter',
              color: 'primary.main',
              borderRadius: 2,
              fontWeight: 600,
            }}
          >
            {profileData.role}
          </Typography>
          <Divider sx={{ my: 3 }} />
          <Button
            variant="contained"
            fullWidth
            href="/settings"
            startIcon={<IconifyIcon icon="ic:round-edit" />}
            sx={{ borderRadius: 2 }}
          >
            {t('profilePage.editProfile')}
          </Button>
        </Paper>
      </Grid>

      <Grid item xs={12} md={7}>
        <Paper sx={{ p: 4, height: '100%' }}>
          <Typography variant="h6" mb={3}>
            {t('profilePage.accountInfo')}
          </Typography>
          <Stack direction="column" spacing={2.5}>
            {infoRows.map((info) => (
              <Stack key={info.labelKey} direction="row" spacing={2} alignItems="center">
                <Stack
                  direction="column"
                  alignItems="center"
                  justifyContent="center"
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    bgcolor: 'info.lighter',
                    flexShrink: 0,
                  }}
                >
                  <IconifyIcon icon={info.icon} sx={{ fontSize: 20, color: 'primary.main' }} />
                </Stack>
                <Box>
                  <Typography variant="caption" color="text.disabled">
                    {t(info.labelKey)}
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {info.value}
                  </Typography>
                </Box>
              </Stack>
            ))}
          </Stack>
        </Paper>
      </Grid>

      {stats.map((stat) => (
        <Grid item xs={12} sm={4} key={stat.labelKey}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Stack direction="column" alignItems="center" spacing={1}>
              <Stack
                direction="column"
                alignItems="center"
                justifyContent="center"
                sx={{ width: 48, height: 48, borderRadius: '50%', bgcolor: `${stat.color}15` }}
              >
                <IconifyIcon icon={stat.icon} sx={{ fontSize: 24, color: stat.color }} />
              </Stack>
              <Typography variant="h4" color={stat.color}>
                {stat.value}
              </Typography>
              <Typography variant="caption" color="text.disabled">
                {t(stat.labelKey)}
              </Typography>
            </Stack>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default Profile;
