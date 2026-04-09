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
      <div className={`${mini ? 'size-12 mb-4' : 'size-20 mb-6'} bg-primary/10 rounded-full flex items-center justify-center text-primary shadow-[0_0_40px_rgba(17,212,196,0.15)] ring-1 ring-primary/20`}>
        {isStringIcon ? (
          <span className="material-symbols-outlined text-4xl">{Icon}</span>
        ) : (
          <Icon className="size-10" />
        )}
      </div>
      <h3 className="text-2xl font-serif font-bold text-slate-800 dark:text-slate-100 mb-2">
        {title}
      </h3>
      <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-8">
        {description}
      </p>
      
      {(actionLabel && actionHref) ? (
        <Link
          href={actionHref}
          className="inline-flex items-center justify-center h-12 px-6 rounded-xl bg-primary text-teal-950 font-bold hover:shadow-[0_4px_20px_rgba(17,212,196,0.3)] transition-all active:scale-95 touch-target"
        >
          {actionLabel}
        </Link>
      ) : (actionLabel && onAction) ? (
        <button
          onClick={onAction}
          className="inline-flex items-center justify-center h-12 px-6 rounded-xl bg-primary text-teal-950 font-bold hover:shadow-[0_4px_20px_rgba(17,212,196,0.3)] transition-all active:scale-95 touch-target focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}
