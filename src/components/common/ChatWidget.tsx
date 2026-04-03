import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { io, Socket } from 'socket.io-client';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import Badge from '@mui/material/Badge';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Zoom from '@mui/material/Zoom';
import Fade from '@mui/material/Fade';
import Chip from '@mui/material/Chip';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import { useTheme } from '@mui/material/styles';
import IconifyIcon from 'components/base/IconifyIcon';
import firdhaImg from 'assets/images/Firdha.webp';
import { useI18n } from 'i18n/I18nContext';

// ─── Types ──────────────────────────────────────────────────

type ChatMode = 'ai' | 'support';

interface Message {
  id: string;
  sender: 'ai' | 'user' | 'system' | 'admin';
  text: string;
  timestamp: Date;
  isEscalation?: boolean;
  attachment?: {
    url: string;
    type: 'image' | 'video';
  };
}

// ─── Constants ──────────────────────────────────────────────

const ESCALATION_THRESHOLD = 6;
const API_BASE = 'http://localhost:4000';

// ─── Component ──────────────────────────────────────────────

const ChatWidget = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const { t } = useI18n();

  // Build locale-aware welcome messages
  const WELCOME_MSG = useMemo<Message>(
    () => ({
      id: 'welcome',
      sender: 'ai',
      text: t('chat.welcomeMessage'),
      timestamp: new Date(),
    }),
    [t],
  );

  const SUPPORT_WELCOME = useMemo<Message>(
    () => ({
      id: 'support-welcome',
      sender: 'admin',
      text: t('chat.supportWelcome'),
      timestamp: new Date(),
    }),
    [t],
  );

  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<ChatMode>('ai');
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isPulsing, setIsPulsing] = useState(true);
  const [showTooltip, setShowTooltip] = useState(true);
  const [isTooltipLeaving, setIsTooltipLeaving] = useState(false);
  const [hasShownEscalation, setHasShownEscalation] = useState(false);
  const [ticketId, setTicketId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [aiMessages, setAiMessages] = useState<Message[]>([]);
  const [supportMessages, setSupportMessages] = useState<Message[]>([]);

  // Initialise / update welcome messages when locale changes
  useEffect(() => {
    setAiMessages((prev) => {
      if (prev.length === 0) return [WELCOME_MSG];
      return prev.map((m) => (m.id === 'welcome' ? WELCOME_MSG : m));
    });
    setSupportMessages((prev) => {
      if (prev.length === 0) return [SUPPORT_WELCOME];
      return prev.map((m) => (m.id === 'support-welcome' ? SUPPORT_WELCOME : m));
    });
  }, [WELCOME_MSG, SUPPORT_WELCOME]);

  const messages = mode === 'ai' ? aiMessages : supportMessages;

  // ── Theme-aware palette ─────────────────────────────────
  const colors = {
    chatBg: isDark ? '#1e1e2e' : '#ffffff',
    messageAreaBg: isDark ? '#16161e' : '#f4f6f8',
    aiBubbleBg: isDark ? '#2a2a3d' : '#f0f0f5',
    aiBubbleText: isDark ? '#e0e0e0' : '#1a1a2e',
    userBubbleBg: '#6366f1',
    userBubbleText: '#ffffff',
    escalationBg: isDark ? '#1e1e2e' : '#faf8ff',
    escalationBorder: isDark ? '#6366f1' : '#c4b5fd',
    inputBg: isDark ? '#1e1e2e' : '#ffffff',
    typingBg: isDark ? '#2a2a3d' : '#e8e8f0',
    timestamp: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.35)',
    adminBubbleBg: isDark ? '#1a3a2a' : '#e8f5e9',
    adminBubbleText: isDark ? '#a5d6a7' : '#1b5e20',
  };

  // ── Welcome tooltip auto-dismiss ────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTooltipLeaving(true);
      setTimeout(() => setShowTooltip(false), 500);
    }, 8000);
    return () => clearTimeout(timer);
  }, []);

  // ── Pulsing animation cycle ─────────────────────────────
  useEffect(() => {
    const cycle = () => {
      setIsPulsing(true);
      const pause = setTimeout(() => setIsPulsing(false), 4000);
      return pause;
    };
    let pause = cycle();
    const interval = setInterval(() => {
      clearTimeout(pause);
      pause = cycle();
    }, 10000);
    return () => {
      clearTimeout(pause);
      clearInterval(interval);
    };
  }, []);

  // ── Auto-scroll ─────────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiMessages, supportMessages, isTyping, mode]);

  // ── WebSocket Integration ────────────────────────────────
  useEffect(() => {
    // Connect to Socket.IO running on port 4001
    const socket = io('http://localhost:4001/support', {
      withCredentials: true,
    });
    socketRef.current = socket;

    socket.on('new_message', (msg: Message & { _id?: string; createdAt?: string }) => {
      // Ignore user messages echoed back (we appended optimistically)
      if (msg.sender !== 'user') {
        const incoming: Message = {
          id: msg._id || `srv-${Date.now()}`,
          sender: msg.sender as 'admin' | 'user',
          text: msg.text,
          timestamp: new Date(msg.createdAt || Date.now()),
          attachment: msg.attachment,
        };
        setSupportMessages((prev) => {
          if (msg._id && prev.some((m) => m.id === msg._id)) return prev;
          return [...prev, incoming];
        });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // ── Sync Support Chat History ─────────────────────────────
  useEffect(() => {
    if (mode === 'support' && ticketId && isOpen) {
      if (socketRef.current) {
        socketRef.current.emit('join_ticket', ticketId);
      }

      // Fetch history once on join rather than polling
      fetch(`${API_BASE}/api/support/messages/${ticketId}`)
        .then((res) => res.json())
        .then((data: Array<Message & { _id?: string; createdAt: string }>) => {
          const mapped: Message[] = data.map((m, i) => ({
            id: m._id || `init-${i}`,
            sender: m.sender === 'admin' ? 'admin' : 'user',
            text: m.text,
            timestamp: new Date(m.createdAt),
            attachment: m.attachment,
          }));
          setSupportMessages([SUPPORT_WELCOME, ...mapped]);
        })
        .catch(() => {});
    }
  }, [mode, ticketId, isOpen]);

  // ── Escalation injection ────────────────────────────────
  const maybeInjectEscalation = useCallback(
    (msgList: Message[]) => {
      if (hasShownEscalation) return msgList;
      if (msgList.length >= ESCALATION_THRESHOLD) {
        setHasShownEscalation(true);
        return [
          ...msgList,
          {
            id: `esc-${Date.now()}`,
            sender: 'system' as const,
            text: '',
            timestamp: new Date(),
            isEscalation: true,
          },
        ];
      }
      return msgList;
    },
    [hasShownEscalation],
  );

  // ── Attachments ─────────────────────────────────────────
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length || !ticketId) return;
    const file = e.target.files[0];

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`${API_BASE}/api/support/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (data.error) {
        alert(data.error);
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }

      // Send the image/video message
      const textVal =
        inputVal.trim() || (data.type === 'image' ? '📷 Image sent' : '🎥 Video sent');

      const userMsg: Message = {
        id: Date.now().toString(),
        sender: 'user',
        text: textVal,
        timestamp: new Date(),
        attachment: data,
      };

      setSupportMessages((prev) => [...prev, userMsg]);
      setInputVal('');

      await fetch(`${API_BASE}/api/support/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketId,
          sender: 'user',
          senderName: 'Guest User',
          text: userMsg.text,
          attachment: userMsg.attachment,
        }),
      });
    } catch {
      alert('Upload failed');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // ── Switch to support mode ──────────────────────────────
  const switchToSupport = async () => {
    setMode('support');

    if (!ticketId) {
      try {
        const res = await fetch(`${API_BASE}/api/support/ticket`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: 'anonymous', userName: 'Guest User' }),
        });
        const data = (await res.json()) as { ticketId: string };
        setTicketId(data.ticketId);
      } catch {
        // fallback
        setTicketId(`LOCAL-${Date.now()}`);
      }
    }
  };

  // ── Switch back to AI mode ──────────────────────────────
  const switchToAI = () => {
    setMode('ai');
  };

  // ── Send message ────────────────────────────────────────
  const handleSend = async () => {
    const text = inputVal.trim();
    if (!text) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date(),
    };

    if (mode === 'ai') {
      setAiMessages((prev) => [...prev, userMsg]);
      setInputVal('');
      setIsTyping(true);

      try {
        const res = await fetch(`${API_BASE}/api/chat/firdha`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: text }),
        });
        const data = (await res.json()) as { reply?: string; error?: string };

        const aiReply: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: data.reply ?? data.error ?? t('chat.errorFallback'),
          timestamp: new Date(),
        };

        setAiMessages((prev) => maybeInjectEscalation([...prev, aiReply]));
      } catch {
        const errorMsg: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: t('chat.errorOffline'),
          timestamp: new Date(),
        };
        setHasShownEscalation(true);
        setAiMessages((prev) => [
          ...prev,
          errorMsg,
          {
            id: `esc-err-${Date.now()}`,
            sender: 'system',
            text: '',
            timestamp: new Date(),
            isEscalation: true,
          },
        ]);
      } finally {
        setIsTyping(false);
      }
    } else {
      // Support mode — send to backend
      setSupportMessages((prev) => [...prev, userMsg]);
      setInputVal('');

      if (ticketId) {
        try {
          await fetch(`${API_BASE}/api/support/message`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ticketId,
              sender: 'user',
              senderName: 'Guest User',
              text,
            }),
          });
        } catch {
          // silent
        }
      }
    }
  };

  // ── Toggle / Close chat ─────────────────────────────────
  const openChat = () => {
    setIsOpen(true);
    setIsPulsing(false);
    if (showTooltip) {
      setIsTooltipLeaving(true);
      setTimeout(() => setShowTooltip(false), 500);
    }
  };

  const closeChat = () => {
    setIsOpen(false);
  };

  const toggleChat = () => {
    if (isOpen) closeChat();
    else openChat();
  };

  // ── Bubble color by sender ──────────────────────────────
  const getBubbleStyle = (sender: string) => {
    if (sender === 'user') return { bg: colors.userBubbleBg, text: colors.userBubbleText };
    if (sender === 'admin') return { bg: colors.adminBubbleBg, text: colors.adminBubbleText };
    return { bg: colors.aiBubbleBg, text: colors.aiBubbleText };
  };

  // ── Render ──────────────────────────────────────────────
  return (
    <>
      {/* ── Welcome Tooltip ──────────────────────────── */}
      {showTooltip && !isOpen && (
        <Paper
          elevation={4}
          sx={{
            position: 'fixed',
            bottom: 100,
            right: 24,
            width: 230,
            p: 1.5,
            borderRadius: 3,
            bgcolor: colors.chatBg,
            zIndex: 1301,
            animation: isTooltipLeaving ? 'tooltipOut 0.5s ease forwards' : 'tooltipIn 0.5s ease',
            '&:after': {
              content: '""',
              position: 'absolute',
              bottom: -8,
              right: 20,
              width: 16,
              height: 16,
              bgcolor: colors.chatBg,
              transform: 'rotate(45deg)',
              boxShadow: '4px 4px 5px rgba(0,0,0,0.05)',
            },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar src={firdhaImg} sx={{ width: 36, height: 36 }} />
            <Typography variant="body2" fontWeight={600} lineHeight={1.3}>
              {t('chat.tooltipText')}
            </Typography>
          </Box>
        </Paper>
      )}

      {/* ── Floating Action Button ────────────────────── */}
      <Fab
        color="primary"
        aria-label="chat"
        onClick={toggleChat}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1301,
          boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)',
          background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
          animation: isPulsing && !isOpen ? 'pulse 1.2s infinite ease-in-out' : 'none',
          '&:hover': {
            background: 'linear-gradient(135deg, #4f46e5 0%, #9333ea 100%)',
          },
        }}
      >
        {isOpen ? (
          <IconifyIcon icon="ic:round-close" sx={{ fontSize: 28, color: 'white' }} />
        ) : (
          <Badge color="error" variant="dot">
            <IconifyIcon
              icon="ic:round-chat-bubble-outline"
              sx={{ fontSize: 28, color: 'white' }}
            />
          </Badge>
        )}
      </Fab>

      {/* ── Chat Window ───────────────────────────────── */}
      {isOpen && (
        <ClickAwayListener onClickAway={closeChat}>
          <Zoom in={isOpen}>
            <Paper
              elevation={16}
              sx={{
                position: 'fixed',
                bottom: 90,
                right: 24,
                width: { xs: 'calc(100vw - 48px)', sm: 380 },
                height: { xs: 'calc(100vh - 140px)', sm: 520 },
                maxHeight: 'calc(100vh - 120px)',
                zIndex: 1300,
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 4,
                overflow: 'hidden',
                bgcolor: colors.chatBg,
                border: '1px solid',
                borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
              }}
            >
              {/* ─ Header ─────────────────────────────────── */}
              <Box
                sx={{
                  p: 2,
                  background:
                    mode === 'ai'
                      ? 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)'
                      : 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  transition: 'background 0.3s ease',
                }}
              >
                {mode === 'ai' ? (
                  <Avatar
                    src={firdhaImg}
                    sx={{ width: 44, height: 44, border: '2px solid rgba(255,255,255,0.3)' }}
                  />
                ) : (
                  <Avatar sx={{ width: 44, height: 44, bgcolor: 'rgba(255,255,255,0.2)' }}>
                    <IconifyIcon icon="ic:round-headset-mic" sx={{ fontSize: 24 }} />
                  </Avatar>
                )}
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle1" fontWeight={700} lineHeight={1.2}>
                    {mode === 'ai' ? t('chat.headerAI') : t('chat.headerSupport')}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      opacity: 0.85,
                      fontSize: '0.72rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                    }}
                  >
                    <Box
                      sx={{
                        width: 7,
                        height: 7,
                        borderRadius: '50%',
                        bgcolor: '#4ade80',
                        boxShadow: '0 0 6px #4ade80',
                      }}
                    />
                    {mode === 'ai'
                      ? t('chat.statusAI')
                      : `${t('chat.statusSupport')} ${ticketId ?? ''}`}
                  </Typography>
                </Box>

                {/* Back to AI button (visible in support mode) */}
                {mode === 'support' && (
                  <Chip
                    label={t('chat.backToAI')}
                    size="small"
                    onClick={switchToAI}
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      fontWeight: 600,
                      fontSize: '0.7rem',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
                    }}
                  />
                )}

                <IconButton size="small" onClick={closeChat} sx={{ color: 'white' }}>
                  <IconifyIcon icon="ic:round-close" />
                </IconButton>
              </Box>

              {/* ─ Messages ───────────────────────────────── */}
              <Box
                sx={{
                  flexGrow: 1,
                  p: 2,
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1.5,
                  bgcolor: colors.messageAreaBg,
                }}
              >
                {messages.map((msg) => {
                  // ── Escalation CTA card ──
                  if (msg.isEscalation) {
                    return (
                      <Fade in key={msg.id}>
                        <Paper
                          elevation={0}
                          sx={{
                            p: 2,
                            borderRadius: 3,
                            bgcolor: colors.escalationBg,
                            border: '1px dashed',
                            borderColor: colors.escalationBorder,
                            textAlign: 'center',
                          }}
                        >
                          <IconifyIcon
                            icon="ic:round-headset-mic"
                            sx={{ fontSize: 28, color: '#059669', mb: 0.5 }}
                          />
                          <Typography variant="body2" fontWeight={600} mb={0.5}>
                            {t('chat.escalationTitle')}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            display="block"
                            mb={1.5}
                          >
                            {t('chat.escalationDesc')}
                          </Typography>
                          <Button
                            variant="contained"
                            size="small"
                            startIcon={<IconifyIcon icon="ic:round-support-agent" />}
                            onClick={switchToSupport}
                            sx={{
                              borderRadius: 99,
                              textTransform: 'none',
                              fontWeight: 600,
                              px: 2.5,
                              background: 'linear-gradient(90deg, #059669, #10b981)',
                              color: '#fff',
                              '&:hover': { opacity: 0.9 },
                            }}
                          >
                            {t('chat.escalationButton')}
                          </Button>
                        </Paper>
                      </Fade>
                    );
                  }

                  // ── Regular messages ──
                  const isUser = msg.sender === 'user';
                  const bubble = getBubbleStyle(msg.sender);
                  return (
                    <Box
                      key={msg.id}
                      sx={{
                        display: 'flex',
                        justifyContent: isUser ? 'flex-end' : 'flex-start',
                        alignItems: 'flex-end',
                        gap: 1,
                      }}
                    >
                      {!isUser && (
                        <Avatar
                          src={msg.sender === 'ai' ? firdhaImg : undefined}
                          sx={{
                            width: 26,
                            height: 26,
                            mb: 0.5,
                            bgcolor: msg.sender === 'admin' ? '#059669' : undefined,
                            fontSize: 14,
                          }}
                        >
                          {msg.sender === 'admin' && (
                            <IconifyIcon icon="ic:round-headset-mic" sx={{ fontSize: 16 }} />
                          )}
                        </Avatar>
                      )}

                      <Box
                        sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, maxWidth: '78%' }}
                      >
                        {msg.attachment && (
                          <Box
                            sx={{
                              borderRadius: 2,
                              overflow: 'hidden',
                              bgcolor: 'black',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            {msg.attachment.type === 'image' ? (
                              <img
                                src={msg.attachment.url}
                                alt="Attachment"
                                style={{ maxWidth: '100%', maxHeight: 200, objectFit: 'contain' }}
                              />
                            ) : (
                              <video
                                src={msg.attachment.url}
                                controls
                                style={{ maxWidth: '100%', maxHeight: 200 }}
                              />
                            )}
                          </Box>
                        )}
                        <Box
                          sx={{
                            p: 1.5,
                            borderRadius: 3,
                            borderBottomRightRadius: isUser ? 4 : 12,
                            borderBottomLeftRadius: isUser ? 12 : 4,
                            bgcolor: bubble.bg,
                            color: bubble.text,
                            boxShadow: isDark
                              ? '0 1px 3px rgba(0,0,0,0.3)'
                              : '0 1px 4px rgba(0,0,0,0.08)',
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              whiteSpace: 'pre-wrap',
                              wordBreak: 'break-word',
                              lineHeight: 1.6,
                              '& strong': { fontWeight: 700 },
                            }}
                            dangerouslySetInnerHTML={{
                              __html: msg.text
                                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                .replace(/\n/g, '<br/>'),
                            }}
                          />
                          <Typography
                            variant="caption"
                            sx={{
                              display: 'block',
                              textAlign: 'right',
                              mt: 0.5,
                              color: isUser ? 'rgba(255,255,255,0.6)' : colors.timestamp,
                              fontSize: '0.62rem',
                            }}
                          >
                            {msg.timestamp.toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  );
                })}

                {/* Typing indicator */}
                {isTyping && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar src={firdhaImg} sx={{ width: 26, height: 26 }} />
                    <Paper
                      elevation={0}
                      sx={{ py: 1, px: 1.5, borderRadius: 3, bgcolor: colors.typingBg }}
                    >
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        {[0, 0.2, 0.4].map((delay) => (
                          <Box
                            key={delay}
                            sx={{
                              width: 6,
                              height: 6,
                              borderRadius: '50%',
                              bgcolor: isDark ? 'grey.500' : 'grey.400',
                              animation: 'bounce 1.4s infinite ease-in-out both',
                              animationDelay: `${delay}s`,
                            }}
                          />
                        ))}
                      </Box>
                    </Paper>
                  </Box>
                )}
                <div ref={messagesEndRef} />
              </Box>

              {/* ─ Input ──────────────────────────────────── */}
              <Box
                sx={{
                  p: 1.5,
                  borderTop: '1px solid',
                  borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
                  bgcolor: colors.inputBg,
                }}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  hidden
                  onChange={handleFileUpload}
                  accept="image/*,video/*"
                />
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder={
                    mode === 'ai' ? t('chat.placeholderAI') : t('chat.placeholderSupport')
                  }
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  InputProps={{
                    sx: { borderRadius: 3, pr: 0.5 },
                    endAdornment: (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {mode === 'support' && (
                          <IconButton
                            color="primary"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading || isTyping}
                            sx={{ mr: 0.5 }}
                          >
                            <IconifyIcon icon="ic:round-attach-file" />
                          </IconButton>
                        )}
                        <IconButton
                          color="primary"
                          onClick={handleSend}
                          disabled={(!inputVal.trim() && !isUploading) || isTyping}
                        >
                          <IconifyIcon icon="ic:round-send" />
                        </IconButton>
                      </Box>
                    ),
                  }}
                  size="small"
                  maxRows={3}
                  multiline
                />
              </Box>
            </Paper>
          </Zoom>
        </ClickAwayListener>
      )}

      {/* ── CSS Keyframes ─────────────────────────────── */}
      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.12); }
          100% { transform: scale(1); }
        }
        @keyframes tooltipIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes tooltipOut {
          from { opacity: 1; transform: translateY(0); }
          to { opacity: 0; transform: translateY(10px); }
        }
      `}</style>
    </>
  );
};

export default ChatWidget;
