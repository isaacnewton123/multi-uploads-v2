import { useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import IconifyIcon from 'components/base/IconifyIcon';
import { useI18n } from 'i18n/I18nContext';

const platformOptions = [
  { id: 'youtube', name: 'YouTube Shorts', icon: 'mdi:youtube', color: '#FF0000' },
  { id: 'facebook', name: 'Facebook Reels', icon: 'mdi:facebook', color: '#1877F2' },
  { id: 'instagram', name: 'Instagram Reels', icon: 'mdi:instagram', color: '#E4405F' },
  { id: 'tiktok', name: 'TikTok', icon: 'ic:baseline-tiktok', color: '#000000' },
];

const Upload = () => {
  const { t } = useI18n();
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['youtube']);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setVideoFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0]);
    }
  };

  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platformId) ? prev.filter((id) => id !== platformId) : [...prev, platformId],
    );
  };

  const handleSelectAll = () => {
    if (selectedPlatforms.length === platformOptions.length) {
      setSelectedPlatforms([]);
    } else {
      setSelectedPlatforms(platformOptions.map((p) => p.id));
    }
  };

  const handleUpload = () => {
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      alert('Upload simulation complete! Videos would be sent to: ' + selectedPlatforms.join(', '));
    }, 2000);
  };

  return (
    <Grid container spacing={2.5}>
      {/* Header */}
      <Grid item xs={12}>
        <Box>
          <Typography variant="h3">{t('upload.title')}</Typography>
          <Typography variant="body2" color="text.disabled" mt={1}>
            {t('upload.description')}
          </Typography>
        </Box>
      </Grid>

      {/* Left Column: Drop Zone */}
      <Grid item xs={12} md={7}>
        <Paper
          sx={{
            p: 4,
            border: 2,
            borderStyle: 'dashed',
            borderColor: dragActive ? 'primary.main' : 'info.main',
            bgcolor: dragActive ? 'primary.lighter' : 'info.lighter',
            borderRadius: 3,
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            '&:hover': {
              borderColor: 'primary.main',
              bgcolor: 'primary.lighter',
            },
          }}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => document.getElementById('video-file-input')?.click()}
        >
          <input
            id="video-file-input"
            type="file"
            accept="video/*"
            style={{ display: 'none' }}
            onChange={handleFileSelect}
          />
          <Stack direction="column" alignItems="center" spacing={2}>
            <Stack
              direction="column"
              alignItems="center"
              justifyContent="center"
              width={80}
              height={80}
              borderRadius="50%"
              bgcolor="info.main"
            >
              <IconifyIcon
                icon={videoFile ? 'ic:round-check-circle' : 'ic:round-cloud-upload'}
                sx={{ fontSize: 40, color: videoFile ? 'success.main' : 'primary.main' }}
              />
            </Stack>
            {videoFile ? (
              <>
                <Typography variant="h6">{videoFile.name}</Typography>
                <Typography variant="body2" color="text.disabled">
                  {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                </Typography>
                <Chip
                  label="Change video"
                  variant="outlined"
                  size="small"
                  sx={{ fontWeight: 600 }}
                />
              </>
            ) : (
              <>
                <Typography variant="h6">{t('upload.dragDrop')}</Typography>
                <Typography variant="body2" color="text.disabled">
                  {t('upload.dragDropHint')}
                </Typography>
              </>
            )}
          </Stack>
        </Paper>
      </Grid>

      {/* Right Column: Platform Selection + Thumbnail */}
      <Grid item xs={12} md={5}>
        <Stack direction="column" spacing={2.5} height="100%">
          {/* Platform Selection */}
          <Paper sx={{ p: 3 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
              <Typography variant="h5">{t('upload.selectPlatforms')}</Typography>
              <Button
                variant="text"
                size="small"
                onClick={handleSelectAll}
                sx={{ textTransform: 'none', fontWeight: 600, px: 2, py: 0.5, borderRadius: 2 }}
              >
                {selectedPlatforms.length === platformOptions.length
                  ? t('upload.deselectAll')
                  : t('upload.selectAll')}
              </Button>
            </Stack>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                gap: 2,
              }}
            >
              {platformOptions.map((platform) => {
                const isSelected = selectedPlatforms.includes(platform.id);
                return (
                  <Paper
                    key={platform.id}
                    elevation={0}
                    onClick={() => handlePlatformToggle(platform.id)}
                    sx={{
                      p: 2,
                      display: 'flex',
                      alignItems: 'center',
                      cursor: 'pointer',
                      border: 2,
                      borderColor: isSelected ? 'primary.main' : 'divider',
                      backgroundColor: isSelected ? 'primary.lighter' : 'transparent',
                      borderRadius: 3,
                      transition: 'all 0.2s',
                      '&:hover': {
                        borderColor: isSelected ? 'primary.main' : 'primary.light',
                        backgroundColor: isSelected ? 'primary.lighter' : 'action.hover',
                      },
                    }}
                  >
                    <IconifyIcon
                      icon={platform.icon}
                      sx={{
                        fontSize: 28,
                        color: platform.color,
                        mr: 1.5,
                        opacity: isSelected ? 1 : 0.7,
                        filter: isSelected ? 'none' : 'grayscale(100%)',
                      }}
                    />
                    <Typography
                      variant="body2"
                      fontWeight={isSelected ? 700 : 500}
                      color={isSelected ? 'text.primary' : 'text.secondary'}
                      sx={{ flexGrow: 1 }}
                    >
                      {platform.name}
                    </Typography>
                    {isSelected && (
                      <IconifyIcon
                        icon="ic:round-check-circle"
                        sx={{ fontSize: 24, color: 'primary.main' }}
                      />
                    )}
                  </Paper>
                );
              })}
            </Box>
          </Paper>

          {/* Thumbnail Upload */}
          <Paper sx={{ p: 3, flexGrow: 1 }}>
            <Typography variant="h5" mb={2}>
              {t('upload.thumbnail')}
            </Typography>
            <Stack
              direction="column"
              alignItems="center"
              justifyContent="center"
              p={3}
              borderRadius={2}
              bgcolor="info.lighter"
              border={2}
              borderColor="info.main"
              sx={{
                borderStyle: 'dashed',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': { borderColor: 'primary.main', bgcolor: 'primary.lighter' },
              }}
              onClick={() => document.getElementById('thumbnail-input')?.click()}
            >
              <input
                id="thumbnail-input"
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
              />
              <IconifyIcon
                icon="ic:round-add-photo-alternate"
                sx={{ fontSize: 36, color: 'primary.main', mb: 1 }}
              />
              <Typography variant="body2" fontWeight={600}>
                {t('upload.uploadThumbnail')}
              </Typography>
              <Typography variant="caption" color="text.disabled">
                {t('upload.thumbnailHint')}
              </Typography>
            </Stack>
          </Paper>
        </Stack>
      </Grid>

      {/* Video Details — full width */}
      <Grid item xs={12} md={7}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" mb={4}>
            {t('upload.videoDetails')}
          </Typography>
          <Stack direction="column" spacing={4}>
            <TextField
              label={t('upload.videoTitle')}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              variant="outlined"
              placeholder="Give your video a catchy title..."
              fullWidth
              required
            />
            <TextField
              label={t('upload.videoDescription')}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              variant="outlined"
              placeholder="Describe your video..."
              multiline
              rows={4}
              fullWidth
            />
            <TextField
              label={t('upload.tags')}
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              variant="outlined"
              placeholder="Enter tags separated by commas (e.g., cooking, recipe, shorts)"
              fullWidth
            />
          </Stack>
        </Paper>
      </Grid>

      {/* Schedule — right column */}
      <Grid item xs={12} md={5}>
        <Paper sx={{ p: 3, height: '100%' }}>
          <Typography variant="h5" mb={4}>
            {t('upload.schedule')}
          </Typography>
          <TextField
            label="Schedule Date & Time"
            type="datetime-local"
            variant="outlined"
            fullWidth
            InputLabelProps={{ shrink: true }}
            helperText={t('upload.scheduleHint')}
          />
        </Paper>
      </Grid>

      {/* Upload Button — full width */}
      <Grid item xs={12}>
        <Box>
          <Button
            variant="contained"
            size="large"
            onClick={handleUpload}
            disabled={!videoFile || selectedPlatforms.length === 0 || !title || uploading}
            startIcon={
              <IconifyIcon
                icon={uploading ? 'svg-spinners:ring-resize' : 'ic:round-cloud-upload'}
              />
            }
            sx={{ px: 4, py: 1.5, fontWeight: 700, fontSize: 16 }}
          >
            {uploading ? 'Uploading...' : t('upload.uploadButton')}
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Upload;
