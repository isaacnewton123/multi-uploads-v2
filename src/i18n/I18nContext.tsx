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
    'dashboard.justNow': 'Just now',
    'dashboard.noUploads': 'No uploads yet. Start uploading your first video!',
    'dashboard.published': 'Published',

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
    'upload.uploading': 'Uploading...',
    'upload.processing': 'Processing...',
    'upload.done': 'Done',
    'upload.queued': 'Upload Queued!',
    'upload.queuedDesc':
      "Your video has been received and is now in the processing queue. We'll distribute it to your selected platforms automatically.",
    'upload.close': 'Close',
    'upload.goToMyVideos': 'Go to My Videos',
    'upload.titlePlaceholder': 'Give your video a catchy title...',
    'upload.descriptionPlaceholder': 'Describe your video...',
    'upload.tagsPlaceholder': 'Enter tags separated by commas (e.g., cooking, recipe, shorts)',
    'upload.selectAll': 'Select All',
    'upload.deselectAll': 'Deselect All',

    // My Videos page
    'myVideos.title': 'My Videos',
    'myVideos.description': 'All your uploaded short-form videos and their distribution status.',
    'myVideos.totalVideos': 'Total Videos',
    'myVideos.published': 'Published',
    'myVideos.processing': 'Processing',
    'myVideos.failed': 'Failed',
    'myVideos.partial': 'Partial',
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

    // Sidebar plan card
    'sidebar.currentPlan': 'Current Plan',
    'sidebar.planFree': 'Free',
    'sidebar.planBasic': 'Basic',
    'sidebar.planPremium': 'Premium',
    'sidebar.planEnterprise': 'Enterprise',
    'sidebar.dailyUploads': 'Daily Uploads',
    'sidebar.uploadsUsed': '{used} of {total} used',
    'sidebar.viewPlans': 'View Plans',
    'sidebar.upgradePlan': 'Upgrade Plan',

    // Upgrade / Pricing
    'upgrade.title': 'Choose Your Plan',
    'upgrade.description':
      'Select the perfect plan to streamline your multi-platform content distribution.',
    'upgrade.tierBasic': 'Basic',
    'upgrade.tierPremium': 'Premium',
    'upgrade.tierEnterprise': 'Enterprise',
    'upgrade.dailyUploadsText': 'Daily Uploads',
    'upgrade.featDaily': 'Daily Upload',
    'upgrade.featMetadata': 'Basic video metadata',
    'upgrade.featThumbnails': 'Custom thumbnails',
    'upgrade.featSupportStandard': 'Standard support via AI & Live Chat',
    'upgrade.featSingleUser': 'Single user access',
    'upgrade.featAllBasic': 'All Basic features',
    'upgrade.featAdvSettings': 'Advanced video settings',
    'upgrade.featSubtitles': 'Upload subtitles & captions',
    'upgrade.featChapters': 'Define video chapters',
    'upgrade.featEndScreens': 'Add end screens & cards',
    'upgrade.featScheduled': 'Scheduled uploads',
    'upgrade.featTemplates': 'Video templates',
    'upgrade.featSupportPriority': 'Priority AI & Live Chat support',
    'upgrade.featAllPremium': 'All Premium features',
    'upgrade.featWorkflows': 'Custom upload workflows',
    'upgrade.featAnalytics': 'Analytics & Insights',
    'upgrade.featAPI': 'API access',
    'upgrade.featCustomDev': 'Custom features development',
    'upgrade.featDedicatedMgr': 'Dedicated support manager',
    'upgrade.cta': 'Select Plan',

    // Billing page
    'billing.badge.securePayments': 'Secure Payments',
    'billing.badge.securePaymentsSub': 'SSL encrypted & PCI compliant',
    'billing.badge.moneyBack': '30-Day Money Back',
    'billing.badge.moneyBackSub': 'No questions asked refund',
    'billing.badge.support': '24/7 Support',
    'billing.badge.supportSub': 'AI + live chat always on',
    'billing.badge.cancelAnytime': 'Cancel Anytime',
    'billing.badge.cancelAnytimeSub': 'No lock-in contracts',
    'billing.enterprise.title': 'Need a custom solution?',
    'billing.enterprise.desc':
      'If you have specific requirements — more accounts, custom integrations, or a dedicated team — contact us for a tailored plan.',
    'billing.enterprise.cta': 'Contact Us',
    'billing.footer.terms': 'Terms of Use',
    'billing.footer.privacy': 'Privacy Policy',
    'billing.footer.contact': 'Contact',

    // Footer
    'footer.allRights': 'All rights reserved.',

    // Common
    'common.backToHome': 'Back to Home',
    'common.goBack': 'Go Back',

    // Errors
    'errors.pageNotFound': 'Page Not Found',
    'errors.pageNotFoundDescription': "Oops! We can't seem to find the page you're looking for.",

    // Topbar Notifications
    'topbar.notifications': 'Notifications',
    'topbar.markAllRead': 'Mark all read',
    'topbar.announce': 'Announce',
    'topbar.system': 'System',
    'topbar.noNotifications': 'No notifications to show.',

    // System Alerts
    'topbar.uploadSuccess': 'Upload Success',
    'topbar.uploadFailed': 'Upload Failed',
    'topbar.uploadSuccessMsg': '"{title}" successfully uploaded to {platform}',
    'topbar.uploadFailedMsg': 'Failed to upload "{title}" to {platform}.',

    // Chat Widget (user-facing)
    'chat.welcomeMessage':
      "Hi! I'm **Firdha**, your AI Assistant 🤖✨\n\nI can help you with video optimization, upload issues, plan upgrades, and more.\n\nHow can I help you today?",
    'chat.supportWelcome':
      "You're now connected to **Customer Service** 🎧\n\nPlease describe your issue and our team will respond shortly.",
    'chat.tooltipText': 'Need help? Chat with Firdha here 💬',
    'chat.headerAI': 'Firdha AI',
    'chat.headerSupport': 'Customer Service',
    'chat.statusAI': 'Online · AI Assistant',
    'chat.statusSupport': 'Online · Ticket',
    'chat.backToAI': 'Back to AI',
    'chat.escalationTitle': 'Need more help?',
    'chat.escalationDesc': 'Want to speak with our customer service team?',
    'chat.escalationButton': 'Contact Customer Service',
    'chat.placeholderAI': 'Ask Firdha anything...',
    'chat.placeholderSupport':
      'Optional caption — pick a file to preview, then Send (or text only)',
    'chat.errorOffline': "I'm having trouble connecting right now. Please try again in a moment.",
    'chat.errorFallback': 'Sorry, I had trouble processing that.',
    'chat.ticketClosedByAdmin': 'Support closed this conversation.',
    'chat.ticketClosedHint':
      'You can go back to the AI assistant, or tap “Contact Customer Service” again to open a new ticket.',
    'chat.statusTicketClosed': 'Ticket closed',
    'chat.placeholderTicketClosed': 'This ticket is closed — start a new chat from help below.',
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
    'dashboard.justNow': '刚刚',
    'dashboard.noUploads': '还没有上传内容，快去上传您的第一个视频吧！',
    'dashboard.published': '已发布',

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
    'upload.uploading': '上传中...',
    'upload.processing': '处理中...',
    'upload.done': '完成',
    'upload.queued': '上传已排队！',
    'upload.queuedDesc': '您的视频已接收，现在正在处理队列中。我们将自动分发到您选择的平台。',
    'upload.close': '关闭',
    'upload.goToMyVideos': '前往我的视频',
    'upload.titlePlaceholder': '为您的视频起个吸引人的标题...',
    'upload.descriptionPlaceholder': '描述您的视频内容...',
    'upload.tagsPlaceholder': '用逗号分隔标签（例如：烹饪、食谱、短视频）',
    'upload.selectAll': '全选',
    'upload.deselectAll': '取消全选',

    // My Videos page
    'myVideos.title': '我的视频',
    'myVideos.description': '您上传的所有短视频及其分发状态。',
    'myVideos.totalVideos': '总视频数',
    'myVideos.published': '已发布',
    'myVideos.processing': '处理中',
    'myVideos.failed': '失败',
    'myVideos.partial': '部分成功',
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
    // Sidebar plan card
    'sidebar.currentPlan': '当前套餐',
    'sidebar.planFree': '免费版',
    'sidebar.planBasic': '基础版',
    'sidebar.planPremium': '高级版',
    'sidebar.planEnterprise': '企业版',
    'sidebar.dailyUploads': '每日上传',
    'sidebar.uploadsUsed': '已用 {used} / {total}',
    'sidebar.viewPlans': '查看套餐',
    'sidebar.upgradePlan': '升级套餐',

    // Upgrade / Pricing
    'upgrade.title': '选择您的计划',
    'upgrade.description': '为您的多平台内容分发选择最合适的发布计划。',
    'upgrade.tierBasic': '基础版',
    'upgrade.tierPremium': '高级版',
    'upgrade.tierEnterprise': '企业版',
    'upgrade.dailyUploadsText': '次每日上传',
    'upgrade.featDaily': '每日上传',
    'upgrade.featMetadata': '基础视频元数据',
    'upgrade.featThumbnails': '自定义缩略图',
    'upgrade.featSupportStandard': 'AI及在线聊天标准支持',
    'upgrade.featSingleUser': '单人账户连接',
    'upgrade.featAllBasic': '包含所有基础版功能',
    'upgrade.featAdvSettings': '高级视频设置',
    'upgrade.featSubtitles': '上传字幕及标题',
    'upgrade.featChapters': '自定义视频章节',
    'upgrade.featEndScreens': '添加片尾及卡片',
    'upgrade.featScheduled': '定时发布上传',
    'upgrade.featTemplates': '视频预设模板',
    'upgrade.featSupportPriority': '专属AI及在线聊天支持',
    'upgrade.featAllPremium': '包含所有高级版功能',
    'upgrade.featWorkflows': '自定义上传工作流',
    'upgrade.featAnalytics': '数据分析与洞察',
    'upgrade.featAPI': 'API 接口管理',
    'upgrade.featCustomDev': '定制功能开发',
    'upgrade.featDedicatedMgr': '专属技术支持经理',
    'upgrade.cta': '选择计划',

    // Billing page
    'billing.badge.securePayments': '安全支付',
    'billing.badge.securePaymentsSub': 'SSL 加密与 PCI 合规',
    'billing.badge.moneyBack': '30天退款保证',
    'billing.badge.moneyBackSub': '无需理由，直接退款',
    'billing.badge.support': '24/7 支持',
    'billing.badge.supportSub': 'AI + 在线客服全天候',
    'billing.badge.cancelAnytime': '随时取消',
    'billing.badge.cancelAnytimeSub': '无绑定合约',
    'billing.enterprise.title': '需要定制方案？',
    'billing.enterprise.desc':
      '如果您有特定需求——更多账户、自定义集成或专属团队——请联系我们获取定制计划。',
    'billing.enterprise.cta': '联系我们',
    'billing.footer.terms': '使用条款',
    'billing.footer.privacy': '隐私政策',
    'billing.footer.contact': '联系我们',

    // Footer
    'footer.allRights': '版权所有。',

    // Common
    'common.backToHome': '返回首页',
    'common.goBack': '返回上一页',

    // Errors
    'errors.pageNotFound': '页面未找到',
    'errors.pageNotFoundDescription': '哎呀！我们找不到您要找的页面。',

    // Topbar Notifications
    'topbar.notifications': '通知',
    'topbar.markAllRead': '全部标为已读',
    'topbar.announce': '公告',
    'topbar.system': '系统',
    'topbar.noNotifications': '暂无新通知。',

    // System Alerts
    'topbar.uploadSuccess': '上传成功',
    'topbar.uploadFailed': '上传失败',
    'topbar.uploadSuccessMsg': '"{title}" 已成功上传到 {platform}',
    'topbar.uploadFailedMsg': '未能将 "{title}" 上传到 {platform}。',

    // Chat Widget (user-facing)
    'chat.welcomeMessage':
      '嗨！我是 **Firdha**，您的 AI 助手 🤖✨\n\n我可以帮助您解决视频优化、上传问题、套餐升级等问题。\n\n今天我能为您做些什么？',
    'chat.supportWelcome': '您已连接到 **客户服务** 🎧\n\n请描述您的问题，我们的团队会尽快回复。',
    'chat.tooltipText': '需要帮助？和 Firdha 聊聊吧 💬',
    'chat.headerAI': 'Firdha AI',
    'chat.headerSupport': '客户服务',
    'chat.statusAI': '在线 · AI 助手',
    'chat.statusSupport': '在线 · 工单',
    'chat.backToAI': '返回 AI',
    'chat.escalationTitle': '需要更多帮助？',
    'chat.escalationDesc': '想联系我们的客户服务团队吗？',
    'chat.escalationButton': '联系客户服务',
    'chat.placeholderAI': '向 Firdha 提问...',
    'chat.placeholderSupport': '可写说明 — 选文件预览后点发送，或只发文字',
    'chat.errorOffline': '我目前连接遇到问题，请稍后再试。',
    'chat.errorFallback': '抱歉，处理您的请求时遇到了问题。',
    'chat.ticketClosedByAdmin': '客服已结束此会话。',
    'chat.ticketClosedHint': '可返回 AI 助手，或再次点击「联系客户服务」开启新工单。',
    'chat.statusTicketClosed': '工单已关闭',
    'chat.placeholderTicketClosed': '此工单已关闭 — 请通过下方帮助发起新会话。',
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
