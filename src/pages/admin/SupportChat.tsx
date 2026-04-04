import { useState, useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Badge from '@mui/material/Badge';
import Divider from '@mui/material/Divider';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import IconifyIcon from 'components/base/IconifyIcon';
import { useAdminSupportInbox } from 'contexts/AdminSupportInboxContext';

// ─── Types ──────────────────────────────────────────────────

interface Ticket {
  ticketId: string;
  userId: string;
  userName: string;
  status: 'open' | 'closed';
  lastMessage: string;
  createdAt: string;
  updatedAt: string;
}

interface ChatMessage {
  ticketId: string;
  sender: 'user' | 'admin';
  senderName: string;
  text: string;
  createdAt: string;
  attachment?: {
    url: string;
    type: 'image' | 'video';
  };
}

const API_BASE = 'http://localhost:4000';

// ─── Component ──────────────────────────────────────────────

const SupportChat = () => {
  const { openTicketCount, refreshOpenTicketCount } = useAdminSupportInbox();
  const [tabValue, setTabValue] = useState<'open' | 'closed'>('open');
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [pendingPreviewUrl, setPendingPreviewUrl] = useState<string | null>(null);

  // ── Fetch tickets ─────────────────────────────────────
  const fetchTickets = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/support/tickets?status=${tabValue}`);
      const data = (await res.json()) as Ticket[];
      setTickets(data);
    } catch {
      // silent
    }
  }, [tabValue]);

  // ── WebSocket & Fetch Effect ──────────────────────────
  useEffect(() => {
    fetchTickets();
    const socket = io('http://localhost:4001/support', { withCredentials: true });
    socketRef.current = socket;

    socket.emit('join_admin');

    const onInboxChanged = () => fetchTickets();
    socket.on('support_inbox_changed', onInboxChanged);

    return () => {
      socket.off('support_inbox_changed', onInboxChanged);
      socket.disconnect();
    };
  }, [fetchTickets]);

  // Effect to handle incoming active messages
  useEffect(() => {
    if (!socketRef.current) return;
    const socket = socketRef.current;

    // We replace the handler so it captures the current selectedTicket properly
    socket.off('new_message');
    socket.on('new_message', (msg: ChatMessage & { _id?: string }) => {
      fetchTickets();
      void refreshOpenTicketCount();

      if (selectedTicket && msg.ticketId === selectedTicket.ticketId) {
        if (msg.sender !== 'admin') {
          setMessages((prev) => {
            if (msg._id && prev.some((m: ChatMessage & { _id?: string }) => m._id === msg._id))
              return prev;
            return [...prev, msg];
          });
        }
      }
    });
  }, [selectedTicket, fetchTickets, refreshOpenTicketCount]);

  // ── Fetch messages for selected ticket ────────────────
  const fetchMessages = useCallback(async () => {
    if (!selectedTicket) return;
    try {
      const res = await fetch(`${API_BASE}/api/support/messages/${selectedTicket.ticketId}`);
      const data = (await res.json()) as ChatMessage[];
      setMessages(data);
    } catch {
      // silent
    }
  }, [selectedTicket]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  useEffect(() => {
    setPendingFile(null);
  }, [selectedTicket?.ticketId]);

  useEffect(() => {
    if (!pendingFile) {
      setPendingPreviewUrl(null);
      return;
    }
    if (!pendingFile.type.startsWith('image/')) {
      setPendingPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(pendingFile);
    setPendingPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [pendingFile]);

  // ── Auto-scroll ───────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ── Send reply (text and/or staged file + caption) ────
  const handleSendReply = async () => {
    if (!selectedTicket) return;
    const textVal = replyText.trim();
    if (!textVal && !pendingFile) return;

    setSending(true);
    try {
      let attachment: ChatMessage['attachment'] | undefined;
      if (pendingFile) {
        const formData = new FormData();
        formData.append('file', pendingFile);
        const res = await fetch(`${API_BASE}/api/support/upload`, {
          method: 'POST',
          body: formData,
        });
        const data = (await res.json()) as {
          error?: string;
          url?: string;
          type?: 'image' | 'video';
        };
        if (data.error) {
          alert(data.error);
          return;
        }
        attachment = { url: data.url!, type: data.type! };
      }

      const optimisticMsg: ChatMessage = {
        ticketId: selectedTicket.ticketId,
        sender: 'admin',
        senderName: 'Support Agent',
        text: textVal,
        createdAt: new Date().toISOString(),
        ...(attachment && { attachment }),
      };

      setMessages((prev) => [...prev, optimisticMsg]);
      setReplyText('');
      setPendingFile(null);

      await fetch(`${API_BASE}/api/support/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketId: selectedTicket.ticketId,
          sender: 'admin',
          senderName: 'Support Agent',
          text: textVal,
          ...(attachment && { attachment }),
        }),
      });
      fetchTickets();
    } catch {
      alert('Send failed');
    } finally {
      setSending(false);
    }
  };

  const onAdminFilePicked = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPendingFile(file);
    e.target.value = '';
  };

  // ── Close ticket ──────────────────────────────────────
  const handleCloseTicket = async () => {
    if (!selectedTicket) return;
    try {
      await fetch(`${API_BASE}/api/support/ticket/${selectedTicket.ticketId}/close`, {
        method: 'PATCH',
      });
      setSelectedTicket(null);
      await fetchTickets();
      await refreshOpenTicketCount();
    } catch {
      // silent
    }
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    if (d.toDateString() === now.toDateString()) return 'Today';
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <Box>
      <Typography variant="h3" mb={0.5}>
        Customer Support
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Manage live support conversations with users
      </Typography>

      <Grid
        container
        spacing={2.5}
        sx={{
          height: 'calc(100vh - 220px)',
          minHeight: 500,
          maxHeight: 'calc(100vh - 220px)',
        }}
      >
        {/* ── Ticket List (Left Panel) ───────────────── */}
        <Grid item xs={12} md={4} sx={{ display: 'flex', minHeight: 0, maxHeight: '100%' }}>
          <Paper
            sx={{
              flex: 1,
              minHeight: 0,
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              borderRadius: 3,
            }}
          >
            <Tabs
              value={tabValue}
              onChange={(_, v) => {
                setTabValue(v);
                setSelectedTicket(null);
              }}
              variant="fullWidth"
              sx={{ borderBottom: 1, borderColor: 'divider', minHeight: 48 }}
            >
              <Tab
                value="open"
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Badge
                      badgeContent={openTicketCount}
                      color="error"
                      max={99}
                      invisible={openTicketCount === 0}
                      sx={{
                        '& .MuiBadge-badge': { fontWeight: 700, fontSize: '0.65rem' },
                      }}
                    >
                      <IconifyIcon icon="ic:round-mark-chat-unread" />
                    </Badge>
                    Open
                  </Box>
                }
                sx={{ minHeight: 48, fontWeight: 600 }}
              />
              <Tab
                value="closed"
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconifyIcon icon="ic:round-check-circle" />
                    Closed
                  </Box>
                }
                sx={{ minHeight: 48, fontWeight: 600 }}
              />
            </Tabs>

            <List sx={{ flexGrow: 1, overflowY: 'auto', p: 0 }}>
              {tickets.length === 0 && (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <IconifyIcon
                    icon="ic:round-inbox"
                    sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    No {tabValue} tickets
                  </Typography>
                </Box>
              )}
              {tickets.map((ticket) => (
                <Box key={ticket.ticketId}>
                  <ListItemButton
                    selected={selectedTicket?.ticketId === ticket.ticketId}
                    onClick={() => setSelectedTicket(ticket)}
                    sx={{ px: 2.5, py: 2 }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        sx={{
                          bgcolor:
                            selectedTicket?.ticketId === ticket.ticketId
                              ? 'primary.main'
                              : 'grey.300',
                          color:
                            selectedTicket?.ticketId === ticket.ticketId
                              ? 'primary.contrastText'
                              : 'text.primary',
                        }}
                      >
                        {ticket.userName.charAt(0).toUpperCase()}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" fontWeight={600} noWrap>
                            {ticket.userName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatDate(ticket.updatedAt)}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Typography variant="caption" color="text.secondary" noWrap display="block">
                          {ticket.lastMessage || 'No messages yet'}
                        </Typography>
                      }
                    />
                  </ListItemButton>
                  <Divider />
                </Box>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* ── Chat Area (Right Panel) ───────────────── */}
        <Grid item xs={12} md={8} sx={{ display: 'flex', minHeight: 0, maxHeight: '100%' }}>
          <Paper
            sx={{
              flex: 1,
              minHeight: 0,
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              borderRadius: 3,
            }}
          >
            {!selectedTicket ? (
              // Empty state
              <Box
                sx={{
                  flex: '1 1 auto',
                  minHeight: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  p: 4,
                }}
              >
                <IconifyIcon
                  icon="ic:round-forum"
                  sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }}
                />
                <Typography variant="h6" color="text.secondary" fontWeight={600}>
                  Select a conversation
                </Typography>
                <Typography variant="body2" color="text.disabled" mt={0.5}>
                  Pick a ticket from the left panel to start responding
                </Typography>
              </Box>
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1,
                  minHeight: 0,
                  overflow: 'hidden',
                }}
              >
                {/* Chat Header */}
                <Box
                  sx={{
                    flexShrink: 0,
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    borderBottom: 1,
                    borderColor: 'divider',
                  }}
                >
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    {selectedTicket.userName.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle1" fontWeight={700}>
                      {selectedTicket.userName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {selectedTicket.ticketId} · {selectedTicket.userId}
                    </Typography>
                  </Box>
                  <Chip
                    label={selectedTicket.status === 'open' ? 'Open' : 'Closed'}
                    size="small"
                    color={selectedTicket.status === 'open' ? 'success' : 'default'}
                    sx={{ fontWeight: 600 }}
                  />
                  {selectedTicket.status === 'open' && (
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={handleCloseTicket}
                      startIcon={<IconifyIcon icon="ic:round-close" />}
                      sx={{
                        color: 'red',
                        borderRadius: 99,
                        textTransform: 'none',
                        fontWeight: 600,
                      }}
                    >
                      Close Ticket
                    </Button>
                  )}
                </Box>

                {/* Messages — scrolls inside fixed panel */}
                <Box
                  sx={{
                    flex: '1 1 0',
                    minHeight: 0,
                    p: 2,
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1.5,
                    bgcolor: 'action.hover',
                  }}
                >
                  {messages.map((msg, i) => {
                    const isAdmin = msg.sender === 'admin';
                    return (
                      <Box
                        key={i}
                        sx={{
                          display: 'flex',
                          justifyContent: isAdmin ? 'flex-end' : 'flex-start',
                          alignItems: 'flex-end',
                          gap: 1,
                        }}
                      >
                        {!isAdmin && (
                          <Avatar sx={{ width: 28, height: 28, bgcolor: 'grey.400', fontSize: 14 }}>
                            {msg.senderName.charAt(0)}
                          </Avatar>
                        )}
                        <Box
                          sx={{
                            maxWidth: '70%',
                            p: 1.5,
                            borderRadius: 3,
                            borderBottomRightRadius: isAdmin ? 4 : 12,
                            borderBottomLeftRadius: isAdmin ? 12 : 4,
                            bgcolor: isAdmin ? 'primary.main' : 'background.paper',
                            color: isAdmin ? 'primary.contrastText' : 'text.primary',
                            boxShadow: 1,
                          }}
                        >
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                            {msg.attachment && (
                              <Box
                                sx={{
                                  borderRadius: 1,
                                  overflow: 'hidden',
                                  bgcolor: 'black',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  mb: 0.5,
                                }}
                              >
                                {msg.attachment.type === 'image' ? (
                                  <img
                                    src={msg.attachment.url}
                                    alt="Attachment"
                                    style={{
                                      maxWidth: '100%',
                                      maxHeight: 200,
                                      objectFit: 'contain',
                                    }}
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
                            {msg.text.trim() ? (
                              <Typography
                                variant="body2"
                                sx={{
                                  whiteSpace: 'pre-wrap',
                                  wordBreak: 'break-word',
                                  lineHeight: 1.5,
                                }}
                              >
                                {msg.text}
                              </Typography>
                            ) : null}
                            <Typography
                              variant="caption"
                              sx={{
                                display: 'block',
                                textAlign: 'right',
                                mt: 0.5,
                                opacity: 0.6,
                                fontSize: '0.62rem',
                              }}
                            >
                              {formatTime(msg.createdAt)}
                            </Typography>
                          </Box>
                        </Box>
                        {isAdmin && (
                          <Avatar
                            sx={{ width: 28, height: 28, bgcolor: 'primary.dark', fontSize: 14 }}
                          >
                            <IconifyIcon icon="ic:round-headset-mic" sx={{ fontSize: 16 }} />
                          </Avatar>
                        )}
                      </Box>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </Box>

                {/* Reply input (only for open tickets) */}
                {selectedTicket.status === 'open' && (
                  <Box
                    sx={{
                      flexShrink: 0,
                      p: 1.5,
                      borderTop: 1,
                      borderColor: 'divider',
                      bgcolor: 'background.paper',
                    }}
                  >
                    {pendingFile && (
                      <Box
                        sx={{
                          mb: 1,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                        }}
                      >
                        {pendingPreviewUrl ? (
                          <Box
                            component="img"
                            src={pendingPreviewUrl}
                            alt=""
                            sx={{
                              width: 56,
                              height: 56,
                              objectFit: 'cover',
                              borderRadius: 1,
                              border: 1,
                              borderColor: 'divider',
                            }}
                          />
                        ) : (
                          <Box
                            sx={{
                              width: 56,
                              height: 56,
                              borderRadius: 1,
                              border: 1,
                              borderColor: 'divider',
                              bgcolor: 'action.hover',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <IconifyIcon
                              icon="ic:round-videocam"
                              sx={{ fontSize: 28, opacity: 0.7 }}
                            />
                          </Box>
                        )}
                        <IconButton
                          size="small"
                          onClick={() => setPendingFile(null)}
                          aria-label="Remove attachment"
                          color="default"
                        >
                          <IconifyIcon icon="ic:round-close" />
                        </IconButton>
                      </Box>
                    )}
                    <TextField
                      fullWidth
                      variant="outlined"
                      placeholder="Type your reply as admin..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendReply();
                        }
                      }}
                      InputProps={{
                        sx: { borderRadius: 3, pr: 0.5 },
                        endAdornment: (
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <input
                              type="file"
                              ref={fileInputRef}
                              hidden
                              onChange={onAdminFilePicked}
                              accept="image/*,video/*"
                            />
                            <IconButton
                              color="primary"
                              onClick={() => fileInputRef.current?.click()}
                              disabled={sending}
                              sx={{ mr: 0.5 }}
                            >
                              <IconifyIcon icon="ic:round-attach-file" />
                            </IconButton>
                            <IconButton
                              color="primary"
                              onClick={handleSendReply}
                              disabled={(!replyText.trim() && !pendingFile) || sending}
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
                )}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SupportChat;
