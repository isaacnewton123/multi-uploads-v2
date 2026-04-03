import { createContext, useContext, useState, useCallback, type PropsWithChildren } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';
import IconifyIcon from 'components/base/IconifyIcon';
import { useI18n } from 'i18n/I18nContext';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface NotificationOptions {
  title: string;
  message: string;
  type?: NotificationType;
  primaryButtonText?: string;
  onPrimaryClick?: () => void;
  secondaryButtonText?: string;
  onSecondaryClick?: () => void;
}

interface NotificationContextProps {
  showNotification: (options: NotificationOptions) => void;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

export const NotificationProvider = ({ children }: PropsWithChildren) => {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<NotificationOptions>({
    title: '',
    message: '',
    type: 'info',
  });

  const showNotification = useCallback((opts: NotificationOptions) => {
    setOptions({
      title: opts.title,
      message: opts.message,
      type: opts.type || 'info',
      primaryButtonText: opts.primaryButtonText,
      onPrimaryClick: opts.onPrimaryClick,
      secondaryButtonText: opts.secondaryButtonText,
      onSecondaryClick: opts.onSecondaryClick,
    });
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const getIconData = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return { icon: 'ic:round-check-circle', color: 'success.main' };
      case 'error':
        return { icon: 'ic:round-error', color: 'error.main' };
      case 'warning':
        return { icon: 'ic:round-warning', color: 'warning.main' };
      case 'info':
      default:
        return { icon: 'ic:round-info', color: 'info.main' };
    }
  };

  const { icon, color } = getIconData(options.type || 'info');

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 4, overflow: 'hidden', textAlign: 'center' } }}
      >
        <DialogContent sx={{ pt: 5, pb: 2, px: { xs: 2, sm: 4 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <IconifyIcon icon={icon} sx={{ fontSize: 72, color: color }} />
          </Box>

          <Typography variant="h5" fontWeight={800} mb={1.5}>
            {options.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
            {options.message}
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
          {options.secondaryButtonText && (
            <Button
              variant="outlined"
              onClick={() => {
                if (options.onSecondaryClick) options.onSecondaryClick();
                handleClose();
              }}
              sx={{
                px: 3,
                borderRadius: 99,
                color: 'text.primary',
                borderColor: 'grey.300',
                width: { xs: '100%', sm: 'auto' },
              }}
            >
              {options.secondaryButtonText}
            </Button>
          )}
          <Button
            variant="contained"
            onClick={() => {
              if (options.onPrimaryClick) options.onPrimaryClick();
              handleClose();
            }}
            sx={{
              px: { xs: 3, sm: 4 },
              borderRadius: 99,
              fontWeight: 700,
              width: { xs: '100%', sm: 'auto' },
              boxShadow: 'none',
              ...(options.secondaryButtonText && {
                background: 'linear-gradient(90deg, #6366f1, #a855f7)',
              }),
              '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.1)' },
              mb: { xs: 1.5, sm: 0 },
            }}
          >
            {options.primaryButtonText || t('upload.close') || 'Close'}
          </Button>
        </DialogActions>
      </Dialog>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
