'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useIngredientContext } from '@/contexts/Ingredients/useIngredientContext';
import { getStockStatus } from '@/utils/calculations/calcSale';
import { useLocalStorage } from '@/hooks/ui/useLocalStorage';

export type AlertType = 'stock' | 'system' | 'other';
export type AlertSeverity = 'critical' | 'warning' | 'info';

export interface AppAlert {
  id: string;
  type: AlertType;
  title: string;
  message: string;
  severity: AlertSeverity;
  link?: string;
  targetId?: string;
  timestamp: number;
  read: boolean;
}

interface NotificationContextType {
  alerts: AppAlert[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const { state: ingredientState } = useIngredientContext();
  const [readAlertIds, setReadAlertIds] = useLocalStorage<string[]>('read_alerts', []);
  const [alerts, setAlerts] = useState<AppAlert[]>([]);

  // Generate alerts from ingredients
  useEffect(() => {
    const stockAlerts: AppAlert[] = [];

    ingredientState.ingredients.forEach(ingredient => {
      const maxQuantity = ingredient.maxQuantity;
      const status = getStockStatus(ingredient.totalQuantity, maxQuantity, ingredient.minQuantity);
      const stockPercentage = maxQuantity > 0 ? (ingredient.totalQuantity / maxQuantity) * 100 : 0;

      if (status === 'critico' || (status === 'atencao' && stockPercentage <= 20)) {
        stockAlerts.push({
          id: `stock-${ingredient.id}-${status}`, // Unique ID per status change
          type: 'stock',
          title: status === 'critico' ? 'Estoque Crítico' : 'Estoque Baixo',
          message: `${ingredient.name} está com ${stockPercentage.toFixed(0)}% do estoque.`,
          severity: status === 'critico' ? 'critical' : 'warning',
          link: '/store',
          targetId: ingredient.id,
          timestamp: Date.now(), // In a real app, this would be the time the event occurred
          read: false, // Will be checked against readAlertIds
        });
      }
    });

    // Merge with other alert sources here if needed

    // Update read status based on local storage
    const processedAlerts = stockAlerts.map(alert => ({
      ...alert,
      read: readAlertIds.includes(alert.id),
    }));

    // Sort by severity (critical first) then unread first
    processedAlerts.sort((a, b) => {
      if (a.severity === 'critical' && b.severity !== 'critical') return -1;
      if (a.severity !== 'critical' && b.severity === 'critical') return 1;
      if (!a.read && b.read) return -1;
      if (a.read && !b.read) return 1;
      return 0;
    });

    setAlerts(processedAlerts);
  }, [ingredientState.ingredients, readAlertIds]);

  const markAsRead = (id: string) => {
    if (!readAlertIds.includes(id)) {
      setReadAlertIds([...readAlertIds, id]);
    }
  };

  const markAllAsRead = () => {
    const allIds = alerts.map(a => a.id);
    const newIds = [...new Set([...readAlertIds, ...allIds])];
    setReadAlertIds(newIds);
  };

  const unreadCount = alerts.filter(a => !a.read).length;

  return (
    <NotificationContext.Provider value={{ alerts, unreadCount, markAsRead, markAllAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
};
