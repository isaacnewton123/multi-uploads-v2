import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';
import IconifyIcon from 'components/base/IconifyIcon';
import { useI18n } from 'i18n/I18nContext';

interface UploadSuccessModalProps {
  open: boolean;
  onClose: () => void;
}

const UploadSuccessModal = ({ open, onClose }: UploadSuccessModalProps) => {
  const { t } = useI18n();
  const navigate = useNavigate();

  const handleGoToMyVideos = () => {
    onClose();
    navigate('/my-videos');
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { borderRadius: 4, overflow: 'hidden', textAlign: 'center' } }}
    >
      <DialogContent sx={{ pt: 5, pb: 2, px: { xs: 2, sm: 4 } }}>
        {/* Success icon */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <IconifyIcon icon="ic:round-check-circle" sx={{ fontSize: 72, color: 'success.main' }} />
        </Box>

        <Typography variant="h5" fontWeight={800} mb={1.5}>
          {t('upload.queued')}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
          {t('upload.queuedDesc')}
        </Typography>
      </DialogContent>

      <DialogActions
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column-reverse', sm: 'row' },
          justifyContent: 'center',
          gap: 1.5,
          px: { xs: 2, sm: 4 },
          pb: { xs: 3, sm: 4 },
          pt: 2,
          '& > :not(style) ~ :not(style)': { ml: { xs: 0, sm: 1.5 } }, // Override MUI default margin
        }}
      >
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{
            px: 3,
            borderRadius: 99,
            borderColor: 'grey.400',
            color: 'text.primary',
            width: { xs: '100%', sm: 'auto' },
            '&:hover': { borderColor: 'grey.600', bgcolor: 'action.hover' },
          }}
        >
          {t('upload.close')}
        </Button>
        <Button
          variant="contained"
          onClick={handleGoToMyVideos}
          startIcon={<IconifyIcon icon="ic:round-video-library" />}
          sx={{
            px: 3,
            borderRadius: 99,
            width: { xs: '100%', sm: 'auto' },
            background: 'linear-gradient(90deg, #6366f1, #a855f7)',
            '&:hover': { opacity: 0.9 },
            mb: { xs: 1.5, sm: 0 },
          }}
        >
          {t('upload.goToMyVideos')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UploadSuccessModal;
