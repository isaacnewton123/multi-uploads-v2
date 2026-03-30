import { useState, useEffect, useCallback } from 'react';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Popover from '@mui/material/Popover';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import IconifyIcon from 'components/base/IconifyIcon';
import { useI18n } from 'i18n/I18nContext';

export interface AnnouncementEntry {
  _id: string;
  title: string;
  message: string;
  title_zh?: string;
  message_zh?: string;
  status: string;
  date: string;
}

export interface AlertEntry {
  _id: string;
  title: string;
  message: string;
  status: string;
  date: string;
  platform: string;
}

const Notifications = () => {
  const { locale, t } = useI18n();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  // Data State
  const [announcements, setAnnouncements] = useState<AnnouncementEntry[]>([]);
  const [systemAlerts, setSystemAlerts] = useState<AlertEntry[]>([]);

  // Tab State
  const [activeTab, setActiveTab] = useState(0);

  // Detail Modal State
  const [selectedItem, setSelectedItem] = useState<
    ((AnnouncementEntry | AlertEntry) & { isAnn?: boolean }) | null
  >(null);

  // Read State
  const [readAnns, setReadAnns] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('readAnnouncements') || '[]');
    } catch {
      return [];
    }
  });
  const [readAlerts, setReadAlerts] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('readAlerts') || '[]');
    } catch {
      return [];
    }
  });

  const fetchData = useCallback(async () => {
    try {
      // Fetch Announcements
      const resAnn = await fetch('http://localhost:4000/api/announcements');
      const dataAnn = await resAnn.json();
      if (dataAnn.success) {
        setAnnouncements(dataAnn.data.slice(0, 10));
      }

      // Fetch System Alerts (Recent videos)
      const resVid = await fetch('http://localhost:4000/api/videos?limit=10');
      const dataVid = await resVid.json();
      if (dataVid.success) {
        const alerts: AlertEntry[] = [];
        dataVid.data.forEach(
          (v: {
            _id: string;
            title: string;
            createdAt: string;
            updatedAt: string;
            platforms: { platform: string; status: string; completedAt: string }[];
          }) => {
            if (v.platforms && Array.isArray(v.platforms)) {
              v.platforms.forEach((p) => {
                if (p.status === 'published' || p.status === 'failed') {
                  const translatedMessage = (
                    p.status === 'published'
                      ? t('topbar.uploadSuccessMsg')
                      : t('topbar.uploadFailedMsg')
                  )
                    .replace('{title}', v.title)
                    .replace('{platform}', p.platform);

                  alerts.push({
                    _id: `${v._id}-${p.platform}`,
                    title:
                      p.status === 'published'
                        ? t('topbar.uploadSuccess')
                        : t('topbar.uploadFailed'),
                    message: translatedMessage,
                    status: p.status,
                    platform: p.platform,
                    date: p.completedAt || v.updatedAt || v.createdAt,
                  });
                }
              });
            }
          },
        );
        alerts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setSystemAlerts(alerts.slice(0, 10));
      }
    } catch (err) {
      console.error('Failed to fetch notification data:', err);
    }
  }, [locale, t]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000); // 10s poll
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleMarkAllRead = () => {
    const newAnns = announcements.map((a) => a._id);
    const newAlerts = systemAlerts.map((a) => a._id);

    const finalAnns = Array.from(new Set([...readAnns, ...newAnns]));
    const finalAlerts = Array.from(new Set([...readAlerts, ...newAlerts]));

    setReadAnns(finalAnns);
    setReadAlerts(finalAlerts);
    localStorage.setItem('readAnnouncements', JSON.stringify(finalAnns));
    localStorage.setItem('readAlerts', JSON.stringify(finalAlerts));
  };

  const markSingleAsRead = (id: string, isAnn: boolean) => {
    if (isAnn) {
      if (!readAnns.includes(id)) {
        const finalAnns = [...readAnns, id];
        setReadAnns(finalAnns);
        localStorage.setItem('readAnnouncements', JSON.stringify(finalAnns));
      }
    } else {
      if (!readAlerts.includes(id)) {
        const finalAlerts = [...readAlerts, id];
        setReadAlerts(finalAlerts);
        localStorage.setItem('readAlerts', JSON.stringify(finalAlerts));
      }
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleItemClick = (item: AnnouncementEntry | AlertEntry, isAnn: boolean) => {
    markSingleAsRead(item._id, isAnn);
    setSelectedItem({ ...item, isAnn });
  };

  const closeDetail = () => {
    setSelectedItem(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'notifications-popover' : undefined;

  const unreadAnnCount = announcements.filter((a) => !readAnns.includes(a._id)).length;
  const unreadAlertCount = systemAlerts.filter((a) => !readAlerts.includes(a._id)).length;
  const totalUnread = unreadAnnCount + unreadAlertCount;

  // Which list to show currently
  const currentList = activeTab === 0 ? announcements : systemAlerts;
  const isAnn = activeTab === 0;

  const getTitle = (item: AnnouncementEntry | AlertEntry, _isAnn: boolean) => {
    if (_isAnn && locale === 'zh' && (item as AnnouncementEntry).title_zh?.trim()) {
      return (item as AnnouncementEntry).title_zh;
    }
    return item.title;
  };

  const getMessage = (item: AnnouncementEntry | AlertEntry, _isAnn: boolean) => {
    if (_isAnn && locale === 'zh' && (item as AnnouncementEntry).message_zh?.trim()) {
      return (item as AnnouncementEntry).message_zh;
    }
    return item.message;
  };

  return (
    <>
      <IconButton aria-describedby={id} color="inherit" onClick={handleClick} sx={{ p: 1 }}>
        <Badge badgeContent={totalUnread} color="error" max={9}>
          <IconifyIcon
            icon="ic:round-notifications"
            sx={{ fontSize: 24, color: 'text.secondary' }}
          />
        </Badge>
      </IconButton>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: {
              width: 340,
              maxHeight: 500,
              mt: 1.5,
              borderRadius: 3,
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
            },
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="subtitle1" fontWeight={700}>
            {t('topbar.notifications')}
          </Typography>
          {totalUnread > 0 && (
            <Typography
              variant="caption"
              onClick={handleMarkAllRead}
              sx={{
                color: 'primary.main',
                cursor: 'pointer',
                fontWeight: 600,
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              {t('topbar.markAllRead')}
            </Typography>
          )}
        </Box>

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={handleTabChange} variant="fullWidth">
            <Tab
              label={
                <Badge
                  badgeContent={unreadAnnCount}
                  color="error"
                  sx={{ '& .MuiBadge-badge': { right: -15, top: 5 } }}
                >
                  {t('topbar.announce')}
                </Badge>
              }
              sx={{ textTransform: 'none', fontWeight: 600, minHeight: 48 }}
            />
            <Tab
              label={
                <Badge
                  badgeContent={unreadAlertCount}
                  color="error"
                  sx={{ '& .MuiBadge-badge': { right: -15, top: 5 } }}
                >
                  {t('topbar.system')}
                </Badge>
              }
              sx={{ textTransform: 'none', fontWeight: 600, minHeight: 48 }}
            />
          </Tabs>
        </Box>

        <Box sx={{ overflowY: 'auto', flexGrow: 1, maxHeight: 350 }}>
          <List sx={{ p: 0 }}>
            {currentList.length === 0 ? (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  {t('topbar.noNotifications')}
                </Typography>
              </Box>
            ) : (
              currentList.map((item: AnnouncementEntry | AlertEntry) => {
                const isUnread = isAnn
                  ? !readAnns.includes(item._id)
                  : !readAlerts.includes(item._id);

                let iconStr = 'ic:round-info';
                let iconColor = 'info.main';
                if (!isAnn) {
                  const alertItem = item as AlertEntry;
                  iconStr =
                    alertItem.status === 'published' ? 'ic:round-check-circle' : 'ic:round-error';
                  iconColor = alertItem.status === 'published' ? 'success.main' : 'error.main';
                }

                return (
                  <Box key={item._id}>
                    <ListItem
                      alignItems="flex-start"
                      onClick={() => handleItemClick(item, isAnn)}
                      sx={{
                        py: 1.5,
                        px: 2,
                        cursor: 'pointer',
                        bgcolor: isUnread ? 'primary.lighter' : 'transparent',
                        '&:hover': { bgcolor: 'action.hover' },
                      }}
                    >
                      <Box sx={{ mt: 0.5, mr: 1.5 }}>
                        <IconifyIcon icon={iconStr} sx={{ fontSize: 24, color: iconColor }} />
                      </Box>
                      <ListItemText
                        primary={
                          <Typography
                            variant="subtitle2"
                            fontWeight={isUnread ? 700 : 500}
                            color={isUnread ? 'text.primary' : 'text.secondary'}
                            sx={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {getTitle(item, isAnn)}
                          </Typography>
                        }
                        secondary={
                          <>
                            <Typography
                              variant="body2"
                              sx={{
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                mb: 0.5,
                                mt: 0.5,
                                color: isUnread ? 'text.primary' : 'text.secondary',
                              }}
                            >
                              {getMessage(item, isAnn)}
                            </Typography>
                            <Typography variant="caption" color="text.disabled">
                              {new Date(item.date).toLocaleString()}
                            </Typography>
                          </>
                        }
                      />
                      {isUnread && (
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            bgcolor: 'primary.main',
                            borderRadius: '50%',
                            mt: 1,
                            flexShrink: 0,
                          }}
                        />
                      )}
                    </ListItem>
                    <Divider component="li" />
                  </Box>
                );
              })
            )}
          </List>
        </Box>
      </Popover>

      {/* Detail Dialog */}
      <Dialog open={Boolean(selectedItem)} onClose={closeDetail} maxWidth="sm" fullWidth>
        {selectedItem && (
          <>
            <DialogTitle sx={{ pb: 1, display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <IconifyIcon
                icon={
                  selectedItem.isAnn
                    ? 'ic:round-campaign'
                    : selectedItem.status === 'published'
                      ? 'ic:round-check-circle'
                      : 'ic:round-error'
                }
                sx={{
                  fontSize: 28,
                  color: selectedItem.isAnn
                    ? 'warning.main'
                    : selectedItem.status === 'published'
                      ? 'success.main'
                      : 'error.main',
                }}
              />
              {getTitle(selectedItem, selectedItem.isAnn || false)}
            </DialogTitle>
            <DialogContent sx={{ pt: 2 }}>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', mb: 3 }}>
                {getMessage(selectedItem, selectedItem.isAnn || false)}
              </Typography>
              <Typography
                variant="caption"
                color="text.disabled"
                sx={{ display: 'block', textAlign: 'right' }}
              >
                Date: {new Date(selectedItem.date).toLocaleString()}
              </Typography>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button onClick={closeDetail} variant="contained" color="primary">
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  );
};

export default Notifications;
