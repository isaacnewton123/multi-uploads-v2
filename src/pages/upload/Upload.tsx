import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import LinearProgress from '@mui/material/LinearProgress';
import IconifyIcon from 'components/base/IconifyIcon';
import { useI18n } from 'i18n/I18nContext';
import { usePlan } from 'providers/PlanContext';
import { useNotification } from 'providers/NotificationContext';
import UploadSuccessModal from './UploadSuccessModal';

const platformOptions = [
  { id: 'youtube', name: 'YouTube Shorts', icon: 'mdi:youtube', color: '#FF0000' },
  { id: 'facebook', name: 'Facebook Reels', icon: 'mdi:facebook', color: '#1877F2' },
  { id: 'instagram', name: 'Instagram Reels', icon: 'mdi:instagram', color: '#E4405F' },
  { id: 'tiktok', name: 'TikTok', icon: 'ic:baseline-tiktok', color: '#000000' },
];

const Upload = () => {
  const navigate = useNavigate();
  const { t } = useI18n();
  const { planId } = usePlan();
  const { showNotification } = useNotification();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['youtube']);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [uploading, setUploading] = useState(false);

  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSpeed, setUploadSpeed] = useState('');

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

  const handleUpload = async () => {
    if (!videoFile) return;
    setUploading(true);
    setUploadProgress(0);
    setUploadSpeed('');

    try {
      const formData = new FormData();
      formData.append('videoFile', videoFile);
      if (thumbnailFile) {
        formData.append('thumbnailFile', thumbnailFile);
      }
      formData.append('title', title);
      formData.append('description', description);
      formData.append('tags', tags);
      formData.append('platforms', JSON.stringify(selectedPlatforms));
      formData.append('plan', planId);
      if (scheduledAt) {
        formData.append('scheduledAt', new Date(scheduledAt).toISOString());
      }

      // Use XHR so we get real onprogress events
      const data = await new Promise<{ success: boolean; error?: string }>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        let lastLoaded = 0;
        let lastTime = Date.now();

        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const pct = Math.round((e.loaded / e.total) * 95); // cap at 95 until server confirms
            setUploadProgress(pct);

            // Calculate speed
            const now = Date.now();
            const dt = (now - lastTime) / 1000; // seconds
            if (dt > 0) {
              const bytesPerSec = (e.loaded - lastLoaded) / dt;
              const mbps = (bytesPerSec / (1024 * 1024)).toFixed(1);
              setUploadSpeed(`${mbps} MB/s`);
            }
            lastLoaded = e.loaded;
            lastTime = Date.now();
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(JSON.parse(xhr.responseText));
          } else {
            reject(new Error(`HTTP ${xhr.status}`));
          }
        };

        xhr.onerror = () => reject(new Error('Network error'));

        xhr.open('POST', 'http://localhost:4000/api/upload');
        xhr.send(formData);
      });

      if (data.success) {
        setUploadProgress(100);
        setUploadSpeed(t('upload.done'));

        // Reset form
        setVideoFile(null);
        setThumbnailFile(null);
        setTitle('');
        setDescription('');
        setTags('');
        setScheduledAt('');
        setUploadProgress(0);
        setUploadSpeed('');
        const videoInput = document.getElementById('video-file-input') as HTMLInputElement;
        if (videoInput) videoInput.value = '';
        const thumbInput = document.getElementById('thumbnail-input') as HTMLInputElement;
        if (thumbInput) thumbInput.value = '';
        setShowSuccessModal(true);
      } else {
        const errorMessage = data.error || 'Server rejected the file.';
        const isLimitError = errorMessage.toLowerCase().includes('limit reached');

        showNotification({
          title: isLimitError ? 'Upload Limit Reached' : t('upload.failed') || 'Upload Failed',
          message: errorMessage,
          type: 'error',
          ...(isLimitError
            ? {
                primaryButtonText: 'Upgrade Plan',
                onPrimaryClick: () => navigate('/billing'),
                secondaryButtonText: t('upload.close') || 'Close',
              }
            : {}),
        });
        setUploadProgress(0);
      }
    } catch (err: unknown) {
      console.error(err);

      const errorMessage = err instanceof Error ? err.message : 'Server error occurred.';
      const isLimitError = errorMessage.toLowerCase().includes('limit reached');

      showNotification({
        title: isLimitError ? 'Upload Limit Reached' : t('upload.failed') || 'Upload Failed',
        message: errorMessage,
        type: 'error',
        ...(isLimitError
          ? {
              primaryButtonText: 'Upgrade Plan',
              onPrimaryClick: () => navigate('/billing'),
              secondaryButtonText: t('upload.close') || 'Close',
            }
          : {}),
      });
      setUploadProgress(0);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
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
                  <Typography
                    variant="h6"
                    sx={{
                      wordBreak: 'break-all',
                      px: { xs: 2, sm: 4 },
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {videoFile.name}
                  </Typography>
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
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setThumbnailFile(e.target.files[0]);
                    }
                  }}
                />
                <IconifyIcon
                  icon={thumbnailFile ? 'ic:round-check-circle' : 'ic:round-add-photo-alternate'}
                  sx={{
                    fontSize: 36,
                    color: thumbnailFile ? 'success.main' : 'primary.main',
                    mb: 1,
                  }}
                />
                <Typography variant="body2" fontWeight={600}>
                  {thumbnailFile ? thumbnailFile.name : t('upload.uploadThumbnail')}
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
                placeholder={t('upload.titlePlaceholder')}
                fullWidth
                required
                InputLabelProps={{ sx: { color: 'text.primary' } }}
                sx={{ '& input': { color: 'text.primary' } }}
              />
              <TextField
                label={t('upload.videoDescription')}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                variant="outlined"
                placeholder={t('upload.descriptionPlaceholder')}
                multiline
                rows={4}
                fullWidth
                InputLabelProps={{ sx: { color: 'text.primary' } }}
                sx={{ '& textarea': { color: 'text.primary' } }}
              />
              <TextField
                label={t('upload.tags')}
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                variant="outlined"
                placeholder={t('upload.tagsPlaceholder')}
                fullWidth
                InputLabelProps={{ sx: { color: 'text.primary' } }}
                sx={{ '& input': { color: 'text.primary' } }}
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
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              variant="outlined"
              fullWidth
              InputLabelProps={{ shrink: true }}
              helperText={t('upload.scheduleHint')}
            />
          </Paper>
        </Grid>

        {/* Upload Button + Progress — full width */}
        <Grid item xs={12}>
          {!uploading ? (
            <Button
              variant="contained"
              size="large"
              onClick={handleUpload}
              disabled={!videoFile || selectedPlatforms.length === 0 || !title}
              startIcon={<IconifyIcon icon="ic:round-cloud-upload" />}
              sx={{ px: 4, py: 1.5, fontWeight: 700, fontSize: 16 }}
            >
              {t('upload.uploadButton')}
            </Button>
          ) : (
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                background:
                  'linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(168,85,247,0.08) 100%)',
                border: '1px solid',
                borderColor: 'primary.light',
              }}
            >
              <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <IconifyIcon
                    icon="svg-spinners:ring-resize"
                    sx={{ fontSize: 22, color: 'primary.main' }}
                  />
                  <Typography variant="subtitle1" fontWeight={700}>
                    {uploadProgress < 95
                      ? `${t('upload.uploading')} ${uploadProgress}%`
                      : t('upload.processing')}
                  </Typography>
                </Stack>
                {/* Speed Badge */}
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={0.75}
                  sx={{
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 99,
                    bgcolor: uploadProgress < 95 ? 'success.dark' : 'warning.dark',
                    opacity: 0.9,
                  }}
                >
                  <IconifyIcon
                    icon={uploadProgress < 95 ? 'ic:round-speed' : 'svg-spinners:three-dots'}
                    sx={{ fontSize: 16, color: 'white' }}
                  />
                  <Typography variant="caption" fontWeight={700} color="white">
                    {uploadSpeed}
                  </Typography>
                </Stack>
              </Stack>

              {/* Progress Bar */}
              <LinearProgress
                variant="determinate"
                value={uploadProgress}
                sx={{
                  height: 10,
                  borderRadius: 5,
                  bgcolor: 'rgba(0,0,0,0.08)',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 5,
                    background: 'linear-gradient(90deg, #6366f1, #a855f7)',
                  },
                }}
              />

              {/* File info row */}
              <Stack direction="row" justifyContent="space-between" mt={1}>
                <Typography variant="caption" color="text.secondary">
                  {videoFile?.name}
                </Typography>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                  {videoFile ? `${(videoFile.size / (1024 * 1024)).toFixed(1)} MB` : ''}
                </Typography>
              </Stack>
            </Paper>
          )}
        </Grid>
      </Grid>

      <UploadSuccessModal open={showSuccessModal} onClose={() => setShowSuccessModal(false)} />
    </>
  );
};

export default Upload;
