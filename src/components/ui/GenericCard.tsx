import React, { useState } from 'react';
import { Badge } from '@/components/ui/base/Badge';
import Button from '@/components/ui/base/Button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/base/Card';
import { Progress } from '@/components/ui/Progress';
import { Edit2, Trash2 } from 'lucide-react';

export interface CardableItem {
  id?: string;
  uid?: string;
  name: string;
}

// Badge configuration for status indicators
export interface BadgeConfig {
  text: string;
  variant?: 'default' | 'outline' | 'danger' | 'warning' | 'normal';
  icon?: React.ReactNode;
}

// Action button configuration
export interface ActionConfig<T> {
  icon: React.ReactNode;
  label: string;
  onClick: (item: T) => void;
  variant?: 'ghost' | 'destructive' | 'edit' | 'default';
  tooltip?: string;
}

// Progress bar configuration
export interface ProgressConfig {
  value: number;
  max?: number;
  label?: string;
  status?: 'normal' | 'critico' | 'atencao';
  showPercentage?: boolean;
}

// Tab configuration interface
export interface TabConfig {
  key: string;
  label: string;
  count?: number;
  content: React.ReactNode;
}

// Main card configuration interface
export interface GenericCardProps<T extends CardableItem> {
  item: T;

  // Header configuration
  title?: string; // Defaults to item.name
  subtitle?: string;
  badges?: BadgeConfig[];

  // Content configuration - can be tabs or simple content
  tabs?: TabConfig[];
  mainMetrics?: Array<{
    label: string;
    value: string | number | React.ReactNode; // Support for complex content like JSX elements
    className?: string;
    icon?: React.ReactNode;
  }>;

  progress?: ProgressConfig;

  // Expandable details section (legacy support)
  details?: {
    title: string;
    icon?: React.ReactNode;
    content: React.ReactNode;
  };

  // Footer configuration
  footerInfo?: Array<{
    label: string;
    value: string;
  }>;

  // Actions
  actions?: ActionConfig<T>[];

  // Styling
  className?: string;
  variant?: 'default' | 'compact' | 'detailed' | 'modern';
}

/**
 * Generic card component that can be used for products, ingredients, or any other entity
 * Eliminates code duplication across different card implementations
 *
 * @param item - The item to display
 * @param title - Card title (defaults to item.name)
 * @param subtitle - Optional subtitle
 * @param badges - Status badges to display
 * @param tabs - Tab configuration for modern variant
 * @param mainMetrics - Key metrics to highlight
 * @param progress - Progress bar configuration
 * @param details - Expandable details section
 * @param footerInfo - Footer information
 * @param actions - Action buttons (edit, delete, etc.)
 * @param className - Additional CSS classes
 * @param variant - Card layout variant
 */
export function GenericCard<T extends CardableItem>({
  item,
  title,
  subtitle,
  badges = [],
  tabs = [],
  mainMetrics = [],
  progress,
  details,
  footerInfo = [],
  actions = [],
  className = '',
  variant = 'default',
}: GenericCardProps<T>) {
  const [activeTab, setActiveTab] = useState(tabs.length > 0 ? tabs[0].key : '');
  const cardTitle = title || item.name;

  // Modern variant with tabs
  if (variant === 'modern' && tabs.length > 0) {
    return (
      <div className={`border-border bg-card rounded-xl border shadow-sm ${className}`}>
        {/* Header minimalista */}
        <div className="border-border border-b px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex items-start justify-between">
            <div className="min-w-0 flex-1">
              <h3 className="text-foreground mb-1 text-base font-semibold sm:mb-2 sm:text-lg">
                {cardTitle}
              </h3>
              {subtitle && (
                <p className="text-muted-foreground mb-2 text-xs sm:text-sm">{subtitle}</p>
              )}

              {/* Badges */}
              {badges.length > 0 && (
                <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                  {badges.map((badge, index) => (
                    <span
                      key={index}
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        badge.variant === 'danger'
                          ? 'text-on-bad bg-bad'
                          : badge.variant === 'warning'
                            ? 'text-on-warning bg-warning'
                            : 'text-on-info bg-info'
                      }`}
                    >
                      {badge.icon && <span className="mr-1">{badge.icon}</span>}
                      {badge.text}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Action buttons */}
            {actions.length > 0 && (
              <div className="ml-2 flex gap-1 sm:gap-2">
                {actions.map((action, index) => (
                  <Button
                    key={index}
                    onClick={() => action.onClick(item)}
                    variant="ghost"
                    size="sm"
                    className={`hover:bg-muted rounded-lg p-1.5 transition-colors sm:p-2 ${
                      action.variant === 'destructive'
                        ? 'text-muted-foreground hover:text-destructive'
                        : 'text-muted-foreground hover:text-accent'
                    }`}
                    aria-label={action.label}
                  >
                    {action.icon}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Tabs minimalistas */}
        <div className="border-border border-b px-4 py-2 sm:px-6 sm:py-3">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map(tab => (
              <Button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                variant={activeTab === tab.key ? 'default' : 'ghost'}
                size="sm"
                className={`flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition-all sm:px-3 sm:py-1.5 sm:text-sm ${
                  activeTab === tab.key
                    ? 'border-accent bg-accent/20 text-accent-foreground border'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <span className="whitespace-nowrap">{tab.label}</span>
                {tab.count && (
                  <span
                    className={`rounded-full px-1 py-0.5 text-xs sm:px-1.5 ${
                      activeTab === tab.key
                        ? 'bg-accent/30 text-accent-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </Button>
            ))}
          </div>
        </div>

        {/* Conteúdo das tabs */}
        <div className="p-4 sm:p-6">{tabs.find(tab => tab.key === activeTab)?.content}</div>
      </div>
    );
  }

  // Legacy/default variant
  return (
    <Card
      className={`flex overflow-hidden rounded-xl border-0 shadow-lg transition-all hover:shadow-md ${className}`}
    >
      <div className="flex w-full flex-col">
        {/* Header Section */}
        <CardHeader className="text-surface p-3 sm:p-4">
          <div className="flex items-start justify-between">
            <div className="min-w-0 flex-1">
              <CardTitle className="text-muted-foreground mb-1 flex items-center gap-2 text-lg font-bold sm:text-xl">
                {cardTitle}
              </CardTitle>

              {subtitle && (
                <p className="text-muted-foreground mb-2 text-xs sm:text-sm">{subtitle}</p>
              )}

              {/* Badges */}
              {badges.length > 0 && (
                <div className="mt-2 flex flex-wrap items-center gap-1 sm:gap-2">
                  {badges.map((badge, index) => (
                    <Badge key={index} variant={badge.variant || 'outline'}>
                      {badge.icon && <span className="mr-1">{badge.icon}</span>}
                      {badge.text}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Action buttons */}
            {actions.length > 0 && (
              <div className="ml-2 flex gap-1">
                {actions.map((action, index) => (
                  <Button
                    key={index}
                    type="button"
                    onClick={() => action.onClick(item)}
                    variant={action.variant || 'ghost'}
                    className="text-primary hover:bg-primary/20 h-11 w-11 p-0 sm:h-10 sm:w-10"
                    aria-label={action.label}
                    tooltip={action.tooltip ? { tooltipContent: action.tooltip } : undefined}
                  >
                    {action.icon}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </CardHeader>

        {/* Content Section */}
        <CardContent className="p-3 sm:p-4">
          {/* Main metrics grid */}
          {mainMetrics.length > 0 && (
            <div
              className={`mb-3 grid gap-2 sm:mb-4 sm:gap-3 ${
                mainMetrics.length === 1
                  ? 'grid-cols-1'
                  : mainMetrics.length === 2
                    ? 'grid-cols-1 sm:grid-cols-2'
                    : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3'
              }`}
            >
              {mainMetrics.map((metric, index) => (
                <div
                  key={index}
                  className={`bg-muted/50 rounded-lg p-2 sm:p-3 ${metric.className || ''}`}
                >
                  <div className="mb-1 flex items-center gap-1 sm:gap-2">
                    {metric.icon}
                    <p className="text-muted-foreground text-xs font-medium">{metric.label}</p>
                  </div>
                  {/* Handle both string/number values and React elements */}
                  {typeof metric.value === 'string' || typeof metric.value === 'number' ? (
                    <p className="text-primary text-base font-bold sm:text-lg">{metric.value}</p>
                  ) : (
                    <div className="text-primary text-base font-bold sm:text-lg">
                      {metric.value}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Progress bar */}
          {progress && (
            <div className="mb-4">
              <div className="text-muted-foreground mb-1 flex justify-between text-xs">
                <span>{progress.label}</span>
                {progress.showPercentage && <span>{Math.round(progress.value)}%</span>}
              </div>
              <Progress
                value={progress.value}
                className="h-2"
                max={progress.max || 100}
                stats={progress.status || 'normal'}
              />
            </div>
          )}

          {/* Expandable details */}
          {details && (
            <details className="group">
              <summary className="flex cursor-pointer items-center justify-between py-2 font-medium">
                <div className="flex items-center gap-2">
                  {details.icon}
                  <span>{details.title}</span>
                </div>
                <svg
                  className="text-muted-foreground h-5 w-5 transition-transform group-open:rotate-180"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </summary>
              <div className="mt-3">{details.content}</div>
            </details>
          )}
        </CardContent>

        {/* Footer Section */}
        {footerInfo.length > 0 && (
          <CardFooter className="text-muted-foreground flex justify-between p-3 text-xs">
            {footerInfo.map((info, index) => (
              <span key={index}>
                {info.label}: {info.value}
              </span>
            ))}
          </CardFooter>
        )}
      </div>
    </Card>
  );
}

// ============================================================
// 🔹 Predefined action configurations for common use cases
// ============================================================

/**
 * Standard edit action configuration
 */
export function createEditAction<T extends CardableItem>(
  onEdit: (item: T) => void,
  tooltip = 'Editar'
): ActionConfig<T> {
  return {
    icon: <Edit2 className="h-4 w-4" />,
    label: 'Editar',
    onClick: onEdit,
    variant: 'ghost',
    tooltip,
  };
}

/**
 * Standard delete action configuration
 */
export function createDeleteAction<T extends CardableItem>(
  onDelete: (item: T) => void,
  tooltip = 'Excluir'
): ActionConfig<T> {
  return {
    icon: <Trash2 className="h-4 w-4" />,
    label: 'Excluir',
    onClick: onDelete,
    variant: 'ghost',
    tooltip,
  };
}
