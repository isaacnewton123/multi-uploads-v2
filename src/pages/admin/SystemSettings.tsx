import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import IconifyIcon from 'components/base/IconifyIcon';

const apiSections = [
  {
    title: 'YouTube Data API v3',
    icon: 'mdi:youtube',
    color: '#FF0000',
    fields: [
      { label: 'Client ID', value: 'yt_client_abc123', type: 'text' },
      { label: 'Client Secret', value: 'secret_abc123', type: 'password' },
    ],
  },
  {
    title: 'TikTok for Business API',
    icon: 'ic:baseline-tiktok',
    color: '#000000',
    fields: [
      { label: 'App ID', value: 'tt_app_890', type: 'text' },
      { label: 'App Secret', value: 'secret_tt_890', type: 'password' },
    ],
  },
  {
    title: 'Meta Graph API (Facebook / Instagram)',
    icon: 'mdi:facebook',
    color: '#1877F2',
    fields: [
      { label: 'App ID', value: 'meta_app_444', type: 'text' },
      { label: 'App Secret', value: 'secret_meta_444', type: 'password' },
    ],
  },
];

const SystemSettings = () => {
  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h3" mb={1}>
        System Settings
      </Typography>
      <Typography variant="body2" color="text.disabled" mb={3}>
        Manage global API configurations and platform toggles.
      </Typography>

      <Stack spacing={2.5}>
        {apiSections.map((section) => (
          <Paper key={section.title} sx={{ p: 3 }}>
            <Stack direction="row" alignItems="center" spacing={1.5} mb={2}>
              <IconifyIcon icon={section.icon} sx={{ fontSize: 22, color: section.color }} />
              <Typography variant="h6" fontWeight={600}>
                {section.title}
              </Typography>
            </Stack>
            <Divider sx={{ mb: 2.5 }} />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              {section.fields.map((field) => (
                <TextField
                  key={field.label}
                  fullWidth
                  label={field.label}
                  variant="outlined"
                  size="small"
                  type={field.type}
                  defaultValue={field.value}
                />
              ))}
            </Stack>
          </Paper>
        ))}

        <Box>
          <Button variant="contained" size="large" sx={{ fontWeight: 600, px: 4, borderRadius: 2 }}>
            Save Configurations
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};

export default SystemSettings;
