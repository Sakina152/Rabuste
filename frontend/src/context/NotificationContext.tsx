import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useToast } from '@/hooks/use-toast';
import { getToken } from '@/utils/getToken';
import axios from 'axios';

interface Notification {
    _id: string;
    title: string;
    message: string;
    type: string;
    isRead: boolean;
    createdAt: string;
}

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    markAsRead: (id: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    fetchNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType>({
    notifications: [],
    unreadCount: 0,
    markAsRead: async (id) => { },
    markAllAsRead: async () => { },
    fetchNotifications: async () => { },
});

const getApiUrl = () => {
    if (import.meta.env.VITE_API_BASE_URL) return import.meta.env.VITE_API_BASE_URL;
    // If running locally, assume backend is on the same hostname at port 5000
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
        return "http://localhost:5000";
    }
    // For local network testing (e.g. mobile accessing computer IP)
    return `http://${window.location.hostname}:5000`;
};

const API_URL = getApiUrl();

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState<number>(0);
    const { toast } = useToast();
    const [socket, setSocket] = useState<any>(null);
    const [currentUser, setCurrentUser] = useState<any>(null);

    // Track login state
    useEffect(() => {
        const checkUser = () => {
            const userInfo = localStorage.getItem("userInfo");
            if (userInfo) {
                const parsed = JSON.parse(userInfo);
                if (parsed._id !== currentUser?._id) {
                    setCurrentUser(parsed);
                }
            } else if (currentUser) {
                setCurrentUser(null);
            }
        };

        checkUser();
        const interval = setInterval(checkUser, 2000); // Poll localStorage for changes
        return () => clearInterval(interval);
    }, [currentUser]);

    const fetchNotifications = useCallback(async () => {
        const token = await getToken();
        if (!token) {
            setNotifications([]);
            setUnreadCount(0);
            return;
        }

        try {
            const { data } = await axios.get(`${API_URL}/api/notifications`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(data);
            setUnreadCount(data.filter((n: Notification) => !n.isRead).length);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    }, []);

    useEffect(() => {
        let activeSocket: any = null;

        const initSocket = async () => {
            const token = await getToken();
            if (!token || !currentUser) return;

            try {
                const newSocket = io(API_URL, {
                    auth: { token }
                });

                newSocket.on('connect', () => {
                    console.log('Connected to notification socket for user:', currentUser._id);
                    newSocket.emit('join', currentUser._id);
                });

                newSocket.on('notification', (notification) => {
                    setNotifications(prev => [notification, ...prev]);
                    setUnreadCount(prev => prev + 1);

                    toast({
                        title: notification.title,
                        description: notification.message,
                        className: "bg-[#EED9C4] text-[#5C3A21] border-[#D4C4A8]",
                    });
                });

                setSocket(newSocket);
                activeSocket = newSocket;
            } catch (error) {
                console.error('Socket init error:', error);
            }
        };

        initSocket();
        fetchNotifications();

        return () => {
            if (activeSocket) {
                activeSocket.close();
            }
        };
    }, [currentUser, fetchNotifications, toast]);

    const markAsRead = async (id) => {
        const token = await getToken();
        try {
            await axios.put(`${API_URL}/api/notifications/${id}/read`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Remove from list immediately so it disappears from the box
            setNotifications(prev => prev.filter(n => n._id !== id));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    const markAllAsRead = async () => {
        const token = await getToken();
        try {
            await axios.put(`${API_URL}/api/notifications/read-all`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications([]); // Clear the notifications in the box as requested
            setUnreadCount(0);
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, markAllAsRead, fetchNotifications }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => useContext(NotificationContext);
