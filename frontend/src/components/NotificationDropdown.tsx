import React from 'react';
import { Coffee, Bell, CheckCircle2, Clock, Info } from 'lucide-react';
import { useNotifications } from '@/context/NotificationContext';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

const NotificationDropdown = () => {
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative hover:bg-accent/10 transition-colors"
                >
                    <Coffee className="w-5 h-5 text-foreground" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 w-4 h-4 bg-[#EED9C4] text-[#5C3A21] text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-background animate-in zoom-in duration-300">
                            {unreadCount}
                        </span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="w-64 p-0 bg-background/95 backdrop-blur-md border-border/40 shadow-2xl rounded-[2.5rem] overflow-hidden"
                align="end"
                sideOffset={8}
                alignOffset={-40} // Nudge it right to be closer to screen edge
            >
                <div className="p-4 border-b border-border/40 flex items-center justify-between bg-accent/5">
                    <h4 className="font-display font-bold text-base tracking-tight text-foreground/90 italic">Notifications</h4>
                    {unreadCount > 0 && (
                        <button
                            onClick={markAllAsRead}
                            className="text-[9px] text-accent hover:underline font-bold tracking-widest uppercase"
                        >
                            Clear All
                        </button>
                    )}
                </div>
                <ScrollArea className="h-[200px]">
                    {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                            <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center mb-2">
                                <Bell className="w-4 h-4 text-accent/40" />
                            </div>
                            <p className="text-[11px] text-muted-foreground italic">All caught up!</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-border/10">
                            {notifications.map((n) => (
                                <div
                                    key={n._id}
                                    onClick={() => !n.isRead && markAsRead(n._id)}
                                    className={cn(
                                        "p-4 hover:bg-accent/5 transition-all cursor-pointer relative group",
                                        !n.isRead && "bg-accent/5"
                                    )}
                                >
                                    <div className="flex gap-3">
                                        <div className={cn(
                                            "mt-0.5 w-7 h-7 rounded-xl flex items-center justify-center shrink-0 border border-border/10",
                                            n.type === 'ORDER_UPDATE' ? "bg-emerald-500/10 text-emerald-500" : "bg-accent/10 text-accent"
                                        )}>
                                            {n.type === 'ORDER_UPDATE' ? <CheckCircle2 className="w-3 h-3" /> : <Info className="w-3 h-3" />}
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-center justify-between">
                                                <p className={cn(
                                                    "text-xs leading-none",
                                                    !n.isRead ? "font-bold text-foreground" : "font-medium text-foreground/70"
                                                )}>
                                                    {n.title}
                                                </p>
                                                {!n.isRead && (
                                                    <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                                                )}
                                            </div>
                                            <p className="text-[10px] text-muted-foreground/80 leading-snug line-clamp-2 italic">
                                                {n.message}
                                            </p>
                                            <div className="flex items-center gap-1 pt-1 opacity-60">
                                                <Clock className="w-2.5 h-2.5" />
                                                <p className="text-[8px] font-bold uppercase tracking-tight">
                                                    {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </PopoverContent>
        </Popover>
    );
};

export default NotificationDropdown;
