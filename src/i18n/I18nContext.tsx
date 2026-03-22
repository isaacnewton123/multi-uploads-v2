import { createContext, useContext, useState, PropsWithChildren, useCallback } from 'react';

export type Locale = 'en' | 'zh';

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

// ─── Translation dictionaries ────────────────────────────────────────────────

const translations: Record<Locale, Record<string, string>> = {
  en: {
    // Sidebar
    'nav.dashboard': 'Dashboard',
    'nav.upload': 'Upload',
    'nav.myVideos': 'My Videos',
    'nav.analytics': 'Analytics',
    'nav.settings': 'Settings',

    // Profile dropdown
    'profile.viewProfile': 'View Profile',
    'profile.accountSettings': 'Account Settings',
    'profile.logout': 'Logout',

    // Dashboard
    'dashboard.uploadsToday': 'Uploads Today',
    'dashboard.remainingToday': 'Remaining Today',
    'dashboard.connectedPlatforms': 'Connected Platforms',
    'dashboard.totalVideos': 'Total Videos',
    'dashboard.platformStatus': 'Platform Status',
    'dashboard.connected': 'Connected',
    'dashboard.notConnected': 'Not Connected',
    'dashboard.uploadNewShort': 'Upload New Short',
    'dashboard.distributeDesc': 'Distribute your video to all platforms in one click',
    'dashboard.startUpload': 'Start Upload',
    'dashboard.recentUploads': 'Recent Uploads',

    // Upload page
    'upload.title': 'Upload Video',
    'upload.description':
      'Upload a short-form video and distribute it to multiple platforms at once.',
    'upload.dragDrop': 'Drag & drop your video here',
    'upload.dragDropHint': 'Vertical format recommended (9:16) • Max 60 seconds',
    'upload.browseFiles': 'Browse Files',
    'upload.selectPlatforms': 'Select Platforms',
    'upload.thumbnail': 'Thumbnail',
    'upload.uploadThumbnail': 'Upload Thumbnail',
    'upload.thumbnailHint': 'Optional • 1280×720 (16:9)',
    'upload.videoDetails': 'Video Details',
    'upload.videoTitle': 'Title',
    'upload.videoDescription': 'Description',
    'upload.tags': 'Tags',
    'upload.schedule': 'Schedule',
    'upload.scheduleHint': 'Leave empty to publish immediately after processing',
    'upload.uploadButton': 'Upload & Distribute',

    // My Videos page
    'myVideos.title': 'My Videos',
    'myVideos.description': 'All your uploaded short-form videos and their distribution status.',
    'myVideos.totalVideos': 'Total Videos',
    'myVideos.published': 'Published',
    'myVideos.processing': 'Processing',
    'myVideos.failed': 'Failed',
    'myVideos.allVideos': 'All Videos',

    // Profile page
    'profilePage.title': 'My Profile',
    'profilePage.description': 'Your personal information and account overview.',
    'profilePage.editProfile': 'Edit Profile',
    'profilePage.accountInfo': 'Account Information',
    'profilePage.fullName': 'Full Name',
    'profilePage.email': 'Email',
    'profilePage.username': 'Username',
    'profilePage.role': 'Role',
    'profilePage.memberSince': 'Member Since',
    'profilePage.totalUploads': 'Total Uploads',
    'profilePage.connectedPlatforms': 'Connected Platforms',

    // Settings page
    'settings.title': 'Account Settings',
    'settings.description': 'Manage your account preferences and security settings.',
    'settings.profileSettings': 'Profile Settings',
    'settings.fullName': 'Full Name',
    'settings.email': 'Email Address',
    'settings.username': 'Username',
    'settings.bio': 'Bio',
    'settings.saveChanges': 'Save Changes',
    'settings.notifications': 'Notification Preferences',
    'settings.emailNotifications': 'Email Notifications',
    'settings.emailNotificationsDesc': 'Receive email updates about your uploads',
    'settings.uploadAlerts': 'Upload Alerts',
    'settings.uploadAlertsDesc': 'Get notified when uploads complete or fail',
    'settings.platformAlerts': 'Platform Alerts',
    'settings.platformAlertsDesc': 'Notify when platform connection changes',
    'settings.marketingEmails': 'Marketing Emails',
    'settings.marketingEmailsDesc': 'Tips, product updates, and promotions',
    'settings.changePassword': 'Change Password',
    'settings.currentPassword': 'Current Password',
    'settings.newPassword': 'New Password',
    'settings.confirmPassword': 'Confirm New Password',
    'settings.updatePassword': 'Update Password',
    'settings.dangerZone': 'Danger Zone',
    'settings.dangerDesc':
      'Once you delete your account, there is no going back. This will permanently remove all your videos, settings, and connected platforms.',
    'settings.deleteAccount': 'Delete Account',

    // Coming soon modal
    'comingSoon.title': 'Coming Soon',
    'comingSoon.message':
      'Analytics dashboard is currently under development. Stay tuned for powerful insights into your video performance!',
    'comingSoon.close': 'Got it',

    // Sidebar card
    'sidebar.upgradePremium': 'Upgrade to Premium',
    'sidebar.upgradeDesc1': 'Get more daily uploads!',
    'sidebar.upgradeDesc2': 'Upload to all platforms at once.',

    // Footer
    'footer.allRights': 'All rights reserved.',
  },

  zh: {
    // Sidebar
    'nav.dashboard': '仪表板',
    'nav.upload': '上传',
    'nav.myVideos': '我的视频',
    'nav.analytics': '分析',
    'nav.settings': '设置',

    // Profile dropdown
    'profile.viewProfile': '查看个人资料',
    'profile.accountSettings': '账户设置',
    'profile.logout': '退出登录',

    // Dashboard
    'dashboard.uploadsToday': '今日上传',
    'dashboard.remainingToday': '今日剩余',
    'dashboard.connectedPlatforms': '已连接平台',
    'dashboard.totalVideos': '总视频数',
    'dashboard.platformStatus': '平台状态',
    'dashboard.connected': '已连接',
    'dashboard.notConnected': '未连接',
    'dashboard.uploadNewShort': '上传新短视频',
    'dashboard.distributeDesc': '一键将您的视频分发到所有平台',
    'dashboard.startUpload': '开始上传',
    'dashboard.recentUploads': '最近上传',

    // Upload page
    'upload.title': '上传视频',
    'upload.description': '上传短视频并一次性分发到多个平台。',
    'upload.dragDrop': '将视频拖放到此处',
    'upload.dragDropHint': '建议竖屏格式 (9:16) • 最长60秒',
    'upload.browseFiles': '浏览文件',
    'upload.selectPlatforms': '选择平台',
    'upload.thumbnail': '缩略图',
    'upload.uploadThumbnail': '上传缩略图',
    'upload.thumbnailHint': '可选 • 1280×720 (16:9)',
    'upload.videoDetails': '视频详情',
    'upload.videoTitle': '标题',
    'upload.videoDescription': '描述',
    'upload.tags': '标签',
    'upload.schedule': '定时发布',
    'upload.scheduleHint': '留空则在处理完成后立即发布',
    'upload.uploadButton': '上传并分发',

    // My Videos page
    'myVideos.title': '我的视频',
    'myVideos.description': '您上传的所有短视频及其分发状态。',
    'myVideos.totalVideos': '总视频数',
    'myVideos.published': '已发布',
    'myVideos.processing': '处理中',
    'myVideos.failed': '失败',
    'myVideos.allVideos': '全部视频',

    // Profile page
    'profilePage.title': '我的资料',
    'profilePage.description': '您的个人信息和账户概览。',
    'profilePage.editProfile': '编辑资料',
    'profilePage.accountInfo': '账户信息',
    'profilePage.fullName': '姓名',
    'profilePage.email': '邮箱',
    'profilePage.username': '用户名',
    'profilePage.role': '角色',
    'profilePage.memberSince': '注册时间',
    'profilePage.totalUploads': '总上传数',
    'profilePage.connectedPlatforms': '已连接平台',

    // Settings page
    'settings.title': '账户设置',
    'settings.description': '管理您的账户偏好和安全设置。',
    'settings.profileSettings': '个人资料设置',
    'settings.fullName': '姓名',
    'settings.email': '邮箱地址',
    'settings.username': '用户名',
    'settings.bio': '个人简介',
    'settings.saveChanges': '保存更改',
    'settings.notifications': '通知偏好',
    'settings.emailNotifications': '邮件通知',
    'settings.emailNotificationsDesc': '接收有关上传的邮件更新',
    'settings.uploadAlerts': '上传提醒',
    'settings.uploadAlertsDesc': '上传完成或失败时收到通知',
    'settings.platformAlerts': '平台提醒',
    'settings.platformAlertsDesc': '平台连接状态变更时通知',
    'settings.marketingEmails': '营销邮件',
    'settings.marketingEmailsDesc': '使用技巧、产品更新和促销信息',
    'settings.changePassword': '修改密码',
    'settings.currentPassword': '当前密码',
    'settings.newPassword': '新密码',
    'settings.confirmPassword': '确认新密码',
    'settings.updatePassword': '更新密码',
    'settings.dangerZone': '危险区域',
    'settings.dangerDesc':
      '一旦删除您的账户，将无法恢复。这将永久删除您的所有视频、设置和已连接的平台。',
    'settings.deleteAccount': '删除账户',

    // Coming soon modal
    'comingSoon.title': '即将推出',
    'comingSoon.message': '分析仪表板目前正在开发中。敬请期待关于您视频表现的强大洞察功能！',
    'comingSoon.close': '知道了',

    // Sidebar card
    'sidebar.upgradePremium': '升级高级版',
    'sidebar.upgradeDesc1': '获取更多每日上传次数！',
    'sidebar.upgradeDesc2': '一键上传到所有平台。',

    // Footer
    'footer.allRights': '版权所有。',
  },
};

// ─── Context ──────────────────────────────────────────────────────────────────

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider = ({ children }: PropsWithChildren) => {
  const [locale, setLocaleState] = useState<Locale>(() => {
    const saved = localStorage.getItem('locale');
    return (saved === 'zh' ? 'zh' : 'en') as Locale;
  });

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('locale', newLocale);
  }, []);

  const t = useCallback(
    (key: string): string => {
      return translations[locale][key] || translations['en'][key] || key;
    },
    [locale],
  );

  return <I18nContext.Provider value={{ locale, setLocale, t }}>{children}</I18nContext.Provider>;
};

export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
