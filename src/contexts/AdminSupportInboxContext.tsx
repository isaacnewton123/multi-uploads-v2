import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import { io, type Socket } from 'socket.io-client';

const API_BASE = 'http://localhost:4000';

type AdminSupportInboxContextValue = {
  openTicketCount: number;
  refreshOpenTicketCount: () => Promise<void>;
};

const AdminSupportInboxContext = createContext<AdminSupportInboxContextValue | null>(null);

export function AdminSupportInboxProvider({ children }: PropsWithChildren) {
  const [openTicketCount, setOpenTicketCount] = useState(0);

  const refreshOpenTicketCount = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/support/tickets?status=open`);
      if (!res.ok) return;
      const data = (await res.json()) as unknown;
      setOpenTicketCount(Array.isArray(data) ? data.length : 0);
    } catch {
      // silent
    }
  }, []);

  useEffect(() => {
    void refreshOpenTicketCount();
    const interval = window.setInterval(() => void refreshOpenTicketCount(), 30_000);

    const socket: Socket = io('http://localhost:4001/support', { withCredentials: true });
    socket.emit('join_admin');
    const onInboxChange = () => void refreshOpenTicketCount();
    socket.on('support_inbox_changed', onInboxChange);

    return () => {
      window.clearInterval(interval);
      socket.off('support_inbox_changed', onInboxChange);
      socket.disconnect();
    };
  }, [refreshOpenTicketCount]);

  const value = useMemo(
    () => ({ openTicketCount, refreshOpenTicketCount }),
    [openTicketCount, refreshOpenTicketCount],
  );

  return (
    <AdminSupportInboxContext.Provider value={value}>{children}</AdminSupportInboxContext.Provider>
  );
}

export function useAdminSupportInbox(): AdminSupportInboxContextValue {
  const ctx = useContext(AdminSupportInboxContext);
  return (
    ctx ?? {
      openTicketCount: 0,
      refreshOpenTicketCount: async () => {},
    }
  );
}
