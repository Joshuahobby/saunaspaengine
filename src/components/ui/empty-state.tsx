import React from 'react';
import Link from 'next/link';

interface EmptyStateProps {
  icon: React.ElementType | string;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  mini?: boolean;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  mini = false,
}: EmptyStateProps) {
  const isStringIcon = typeof Icon === 'string';

  return (
    <div className={`w-full h-full flex flex-col items-center justify-center p-8 text-center ${mini ? '' : 'min-h-[400px] glass-card'}`}>
      <div className={`${mini ? 'size-12 mb-4' : 'size-20 mb-6'} bg-[var(--color-primary)]/10 rounded-full flex items-center justify-center text-[var(--color-primary)] shadow-lg ring-1 ring-[var(--color-primary)]/20`}>
        {isStringIcon ? (
          <span className="material-symbols-outlined text-4xl">{Icon}</span>
        ) : (
          <Icon className="size-10" />
        )}
      </div>
      <h3 className="text-2xl font-display font-bold text-[var(--text-main)] mb-2">
        {title}
      </h3>
      <p className="text-[var(--text-muted)] max-w-sm mb-8">
        {description}
      </p>

      {(actionLabel && actionHref) ? (
        <Link
          href={actionHref}
          className="inline-flex items-center justify-center h-12 px-6 rounded-xl bg-[var(--color-primary)] text-white font-bold hover:brightness-110 transition-all active:scale-95 touch-target"
        >
          {actionLabel}
        </Link>
      ) : (actionLabel && onAction) ? (
        <button
          onClick={onAction}
          className="inline-flex items-center justify-center h-12 px-6 rounded-xl bg-[var(--color-primary)] text-white font-bold hover:brightness-110 transition-all active:scale-95 touch-target focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:outline-none"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}
