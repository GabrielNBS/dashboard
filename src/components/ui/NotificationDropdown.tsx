'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Bell, CheckCheck, AlertTriangle, AlertOctagon, Info } from 'lucide-react';
import LordIcon from '@/components/ui/LordIcon';
import { useNotification, AppAlert } from '@/contexts/NotificationContext';
import Button from '@/components/ui/base/Button';

export default function NotificationDropdown() {
  const { alerts, unreadCount, markAsRead, markAllAsRead } = useNotification();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleAlertClick = (alert: AppAlert) => {
    markAsRead(alert.id);
    setIsOpen(false);
    if (alert.link) {
      const url = alert.targetId ? `${alert.link}?focus=${alert.targetId}` : alert.link;
      router.push(url);
    }
  };

  const getIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertOctagon className="text-destructive h-5 w-5" />;
      case 'warning':
        return <AlertTriangle className="text-on-warning h-5 w-5" />;
      default:
        return <Info className="text-on-info h-5 w-5" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="sm"
        className="hover:bg-muted relative rounded-lg p-1.5 transition-colors"
        aria-label="Notificações"
        onClick={() => setIsOpen(!isOpen)}
      >
        <LordIcon
          src="https://cdn.lordicon.com/vspbqszr.json"
          width={24}
          height={24}
          isActive={unreadCount > 0}
          colors={{
            primary: unreadCount > 0 ? 'hsl(var(--destructive))' : 'hsl(var(--muted-foreground))',
            secondary: unreadCount > 0 ? 'hsl(var(--destructive))' : 'hsl(var(--muted-foreground))',
          }}
        />
        {unreadCount > 0 && (
          <span className="bg-destructive absolute top-1.5 right-1.5 h-2 w-2 animate-pulse rounded-full" />
        )}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-popover border-border absolute top-full right-0 z-50 mt-2 w-80 overflow-hidden rounded-xl border shadow-xl"
          >
            <div className="border-border flex items-center justify-between border-b p-3">
              <h3 className="text-foreground font-semibold">Notificações</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-primary hover:text-primary/80 flex items-center gap-1 text-xs font-medium transition-colors"
                >
                  <CheckCheck className="h-3 w-3" />
                  Marcar todas como lidas
                </button>
              )}
            </div>

            <div className="max-h-[60vh] overflow-y-auto">
              {alerts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Bell className="text-muted-foreground/30 mb-2 h-10 w-10" />
                  <p className="text-muted-foreground text-sm">Nenhuma notificação</p>
                </div>
              ) : (
                <ul className="divide-border divide-y">
                  {alerts.map(alert => (
                    <li
                      key={alert.id}
                      className={`hover:bg-muted/50 cursor-pointer p-3 transition-colors ${
                        !alert.read ? 'bg-primary/5' : ''
                      }`}
                      onClick={() => handleAlertClick(alert)}
                    >
                      <div className="flex gap-3">
                        <div className="mt-0.5 flex-shrink-0">{getIcon(alert.severity)}</div>
                        <div className="flex-1 space-y-1">
                          <p
                            className={`text-sm font-medium ${
                              !alert.read ? 'text-foreground' : 'text-muted-foreground'
                            }`}
                          >
                            {alert.title}
                          </p>
                          <p className="text-muted-foreground text-xs leading-relaxed">
                            {alert.message}
                          </p>
                          <p className="text-muted-foreground/60 text-[10px]">
                            {new Date(alert.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                        {!alert.read && (
                          <div className="bg-primary mt-2 h-2 w-2 flex-shrink-0 rounded-full" />
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
