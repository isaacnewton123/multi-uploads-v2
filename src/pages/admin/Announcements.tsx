import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import IconifyIcon from 'components/base/IconifyIcon';
import { announcementsData as initialData } from 'data/adminMockData';

const statusStyle: Record<string, { bg: string; text: string }> = {
  Active: { bg: '#E8F5E9', text: '#2E7D32' },
  Expired: { bg: '#EFEBE9', text: '#5D4037' },
};

const Announcements = () => {
  const [announcements, setAnnouncements] = useState(initialData);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (!subject.trim() || !message.trim()) return;
    const newAnnouncement = {
      id: announcements.length + 1,
      title: subject,
      message,
      date: new Date().toISOString().split('T')[0],
      status: 'Active',
    };
    setAnnouncements([newAnnouncement, ...announcements]);
    setSubject('');
    setMessage('');
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h3" mb={1}>
        Announcements
      </Typography>
      <Typography variant="body2" color="text.disabled" mb={3}>
        Broadcast messages to all users on the platform.
      </Typography>

      {/* Create Announcement Form */}
      <Paper sx={{ p: 4, mb: 4, borderRadius: 3, maxWidth: 800 }}>
        <Typography variant="h5" fontWeight={600} mb={3}>
          New Announcement
        </Typography>
        <Stack spacing={3}>
          <TextField
            fullWidth
            label="Subject *"
            variant="outlined"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
          <TextField
            fullWidth
            label="Your Message *"
            variant="outlined"
            multiline
            rows={6}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Box>
            <Button
              variant="contained"
              endIcon={<IconifyIcon icon="ic:round-send" />}
              onClick={handleSend}
              disabled={!subject.trim() || !message.trim()}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: 2,
                px: 4,
                py: 1.5,
                bgcolor: '#1E5AAB', // Matching the blue in the screenshot
                '&:hover': {
                  bgcolor: '#154585',
                },
              }}
            >
              Send Message
            </Button>
          </Box>
        </Stack>
      </Paper>

      {/* Announcement List (Horizontal) */}
      <Box>
        <Typography variant="h5" fontWeight={600} mb={3}>
          Past Announcements
        </Typography>
        <Grid container spacing={3}>
          {announcements.map((item) => {
            const style = statusStyle[item.status] || statusStyle.Expired;
            return (
              <Grid item xs={12} sm={6} md={4} xl={3} key={item.id}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    mb={2}
                  >
                    <Typography variant="subtitle1" fontWeight={700} sx={{ pr: 2 }}>
                      {item.title}
                    </Typography>
                    <Chip
                      label={item.status}
                      size="small"
                      sx={{ fontWeight: 600, bgcolor: style.bg, color: style.text }}
                    />
                  </Stack>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3, flexGrow: 1 }}>
                    {item.message}
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Typography variant="caption" color="text.disabled" fontWeight={500}>
                    Posted: {item.date}
                  </Typography>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </Box>
  );
};

export default Announcements;
