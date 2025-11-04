// src/components/ui/feedback/BatchProgress.tsx
'use client';

import React from 'react';
import { Package, TrendingDown, TrendingUp } from 'lucide-react';

interface BatchProgressProps {
  yieldQuantity: number;
  availableQuantity: number;
  soldQuantity?: number;
  showLabels?: boolean;
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'horizontal' | 'circular';
}

export default function BatchProgress({
  yieldQuantity,
  availableQuantity,
  soldQuantity = 0,
  showLabels = true,
  showPercentage = true,
  size = 'md',
  variant = 'horizontal',
}: BatchProgressProps) {
  const availablePercentage = (availableQuantity / yieldQuantity) * 100;
  const soldPercentage = (soldQuantity / yieldQuantity) * 100;
  const remainingPercentage = 100 - availablePercentage - soldPercentage;

  const sizeConfig = {
    sm: { height: 'h-2', text: 'text-xs', icon: 'h-3 w-3' },
    md: { height: 'h-3', text: 'text-sm', icon: 'h-4 w-4' },
    lg: { height: 'h-4', text: 'text-base', icon: 'h-5 w-5' },
  };

  const config = sizeConfig[size];

  if (variant === 'circular') {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const availableStroke = (availablePercentage / 100) * circumference;
    const soldStroke = (soldPercentage / 100) * circumference;

    return (
      <div className="flex items-center gap-4">
        <div className="relative">
          <svg className="h-24 w-24 -rotate-90 transform" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-gray-200"
            />
            {/* Available quantity */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - availableStroke}
              className="text-green-500"
            />
            {/* Sold quantity */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - soldStroke}
              className="text-blue-500"
              transform="rotate(90 50 50)"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <Package className={`text-gray-600 ${config.icon}`} />
          </div>
        </div>

        {showLabels && (
          <div className={`space-y-1 ${config.text}`}>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-green-500" />
              <span>Disponível: {availableQuantity}</span>
            </div>
            {soldQuantity > 0 && (
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-blue-500" />
                <span>Vendido: {soldQuantity}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-gray-300" />
              <span>Usado: {yieldQuantity - availableQuantity - soldQuantity}</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Horizontal variant
  return (
    <div className="space-y-2">
      {showLabels && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className={`text-gray-600 ${config.icon}`} />
            <span className={`font-medium ${config.text}`}>
              Lote: {availableQuantity + soldQuantity}/{yieldQuantity}
            </span>
          </div>
          {showPercentage && (
            <span className={`text-gray-600 ${config.text}`}>
              {availablePercentage.toFixed(0)}% disponível
            </span>
          )}
        </div>
      )}

      <div className={`overflow-hidden rounded-full bg-gray-200 ${config.height}`}>
        <div className="flex h-full">
          {/* Available quantity */}
          <div
            className="bg-green-500 transition-all duration-300"
            style={{ width: `${availablePercentage}%` }}
            title={`Disponível: ${availableQuantity} unidades`}
          />
          {/* Sold quantity */}
          {soldQuantity > 0 && (
            <div
              className="bg-blue-500 transition-all duration-300"
              style={{ width: `${soldPercentage}%` }}
              title={`Vendido: ${soldQuantity} unidades`}
            />
          )}
          {/* Used/consumed quantity */}
          {remainingPercentage > 0 && (
            <div
              className="bg-gray-400 transition-all duration-300"
              style={{ width: `${remainingPercentage}%` }}
              title={`Usado: ${yieldQuantity - availableQuantity - soldQuantity} unidades`}
            />
          )}
        </div>
      </div>

      {showLabels && (
        <div className={`flex justify-between ${config.text} text-gray-600`}>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span>Disp: {availableQuantity}</span>
            </div>
            {soldQuantity > 0 && (
              <div className="flex items-center gap-1">
                <TrendingDown className="h-3 w-3 text-blue-500" />
                <span>Vend: {soldQuantity}</span>
              </div>
            )}
          </div>
          <span>Total: {yieldQuantity}</span>
        </div>
      )}
    </div>
  );
}
