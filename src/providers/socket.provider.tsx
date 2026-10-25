// @/providers/socket.provider.tsx
'use client';

import { envConfig } from '@/config';
import { NOTIFICATIONS_QUERY_KEYS } from '@/features/notifications/api/notifications.queries';
import { NotificationCount } from '@/features/notifications/api/types';
import { useAuthStore } from '@/stores';
import { authStorage } from '@/utils';
import { useQueryClient } from '@tanstack/react-query';
import { ReactNode, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

export function SocketProvider({ children }: { children: ReactNode }) {
    const { isAuthenticated, user } = useAuthStore();
    const queryClient = useQueryClient();
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        console.log(">>> [1] Bắt đầu Socket Hook. Auth:", isAuthenticated, "| User:", user?.id);

        if (!isAuthenticated || !user) {
            console.log(">>> [1.1] Bị chặn lại vì chưa có State Đăng nhập!");
            return;
        }

        const token = authStorage.getToken();

        // Tránh lỗi khi envConfig chưa nạp kịp
        const wsUrl = process.env.NEXT_PUBLIC_WS_URL || envConfig.NEXT_PUBLIC_WS_URL || 'http://localhost:8080/ws';
        const baseUrl = new URL(wsUrl).origin;

        console.log(">>> [2] Vượt qua Auth. Chuẩn bị gọi hàm io() tới:", baseUrl);

        const socket = io(baseUrl, {
            path: '/ws',
            query: { userId: user.id.toString() },
            extraHeaders: { Authorization: `Bearer ${token}` },
            // 🌟 Ép dùng thẳng WebSocket để xuyên qua Gateway mượt hơn, bỏ qua Long-polling
            transports: ['websocket'],
            reconnectionDelay: 5000,
        });

        socket.on('connect', () => {
            console.log('>>> [3] 🟢 Socket.IO ĐÃ KẾT NỐI THÀNH CÔNG! ID:', socket.id);
        });

        socket.on('connect_error', (err) => {
            console.error('>>> [4] 🔴 Socket.IO LỖI KẾT NỐI:', err.message);
        });

        const handleNotificationMessage = (data: any) => {
            try {
                console.log(">>> [5] NHẬN DATA TỪ SERVER: ", data);
                const newCounts: NotificationCount[] = Array.isArray(data)
                    ? data
                    : typeof data === 'string' ? JSON.parse(data) : [];

                const totalUnread = newCounts.reduce((sum, item) => sum + Number(item.count || 0), 0);

                queryClient.setQueryData(NOTIFICATIONS_QUERY_KEYS.unreadDetails(), newCounts);
                queryClient.setQueryData(NOTIFICATIONS_QUERY_KEYS.unreadTotal(), totalUnread);
                queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEYS.lists() });

            } catch (error) {
                console.error('Lỗi parse Payload:', error);
            }
        };

        socket.on('/topic/notifications', handleNotificationMessage);
        socket.on('/user/notifications', handleNotificationMessage);

        socketRef.current = socket;

        return () => {
            if (socketRef.current && socketRef.current.connected) {
                socketRef.current.disconnect();
                console.log('🔌 Socket.IO Đã dọn dẹp (Disconnected)');
            }
        };
    }, [isAuthenticated, user, queryClient]);

    return <>{children}</>;
}