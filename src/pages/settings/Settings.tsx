import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconifyIcon from 'components/base/IconifyIcon';
import { useI18n } from 'i18n/I18nContext';

const Settings = () => {
  const { t } = useI18n();

  return (
    <Grid container spacing={2.5}>
      <Grid item xs={12}>
        <Typography variant="h4">{t('settings.title')}</Typography>
        <Typography variant="body2" color="text.disabled" mt={0.5}>
          {t('settings.description')}
        </Typography>
      </Grid>

      {/* Profile Settings */}
      <Grid item xs={12} md={7}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h6" mb={3}>
            {t('settings.profileSettings')}
          </Typography>
          <Stack direction="column" spacing={3}>
            <Box>
              <Typography variant="subtitle2" color="text.primary" mb={1}>
                {t('settings.fullName')}
              </Typography>
              <TextField defaultValue="Jason Statham" variant="outlined" fullWidth />
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.primary" mb={1}>
                {t('settings.email')}
              </Typography>
              <TextField defaultValue="jason@example.com" variant="outlined" fullWidth />
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.primary" mb={1}>
                {t('settings.username')}
              </Typography>
              <TextField defaultValue="@jasonstatham" variant="outlined" fullWidth />
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.primary" mb={1}>
                {t('settings.bio')}
              </Typography>
              <TextField
                defaultValue="Content creator specializing in short-form videos."
                variant="outlined"
                fullWidth
                multiline
                rows={4}
              />
            </Box>
            <Box pt={1}>
              <Button
                variant="contained"
                startIcon={<IconifyIcon icon="ic:round-save" />}
                sx={{ borderRadius: 2, px: 4, py: 1.25 }}
              >
                {t('settings.saveChanges')}
              </Button>
            </Box>
          </Stack>
        </Paper>
      </Grid>

      {/* Notification Preferences */}
      <Grid item xs={12} md={5}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h6" mb={3}>
            {t('settings.notifications')}
          </Typography>
          <Stack direction="column" spacing={2.5}>
            {[
              { key: 'emailNotifications', defaultChecked: true },
              { key: 'uploadAlerts', defaultChecked: true },
              { key: 'platformAlerts', defaultChecked: false },
              { key: 'marketingEmails', defaultChecked: false },
            ].map((item, index) => (
              <Box key={item.key}>
                {index > 0 && <Divider sx={{ mb: 2.5 }} />}
                <FormControlLabel
                  control={<Switch defaultChecked={item.defaultChecked} color="primary" />}
                  label={
                    <Box ml={1}>
                      <Typography variant="subtitle2" fontWeight={600} color="text.primary">
                        {t(`settings.${item.key}`)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" mt={0.5}>
                        {t(`settings.${item.key}Desc`)}
                      </Typography>
                    </Box>
                  }
                  sx={{ ml: 0, alignItems: 'flex-start', width: '100%' }}
                />
              </Box>
            ))}
          </Stack>
        </Paper>
      </Grid>

      {/* Change Password */}
      <Grid item xs={12} md={7}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h6" mb={3}>
            {t('settings.changePassword')}
          </Typography>
          <Stack direction="column" spacing={3}>
            <Box>
              <Typography variant="subtitle2" color="text.primary" mb={1}>
                {t('settings.currentPassword')}
              </Typography>
              <TextField type="password" variant="outlined" fullWidth />
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.primary" mb={1}>
                {t('settings.newPassword')}
              </Typography>
              <TextField type="password" variant="outlined" fullWidth />
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.primary" mb={1}>
                {t('settings.confirmPassword')}
              </Typography>
              <TextField type="password" variant="outlined" fullWidth />
            </Box>
            <Box pt={1}>
              <Button
                variant="contained"
                startIcon={<IconifyIcon icon="ic:round-lock" />}
                sx={{ borderRadius: 2, px: 4, py: 1.25 }}
              >
                {t('settings.updatePassword')}
              </Button>
            </Box>
          </Stack>
        </Paper>
      </Grid>

      {/* Danger Zone */}
      <Grid item xs={12} md={5}>
        <Paper sx={{ p: 4, borderColor: 'error.main', borderWidth: 1, borderStyle: 'solid' }}>
          <Stack direction="row" spacing={1} alignItems="center" mb={2}>
            <IconifyIcon icon="ic:round-warning" sx={{ color: 'error.main', fontSize: 24 }} />
            <Typography variant="h6" color="error.main">
              {t('settings.dangerZone')}
            </Typography>
          </Stack>
          <Typography variant="body2" color="text.disabled" mb={3}>
            {t('settings.dangerDesc')}
          </Typography>
          <Button
            variant="contained"
            color="error"
            startIcon={<IconifyIcon icon="ic:round-delete-forever" />}
            sx={{ borderRadius: 2 }}
          >
            {t('settings.deleteAccount')}
          </Button>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Settings;
