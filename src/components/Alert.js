'use client';

import { AlertCircle, CheckCircle, Info } from 'lucide-react';

export default function Alert({ type = 'info', title, message, children }) {
  const styles = {
    info: 'bg-gradient-to-r from-primary/15 to-primary/5 dark:from-primary/25 dark:to-primary/10 border-primary/30 dark:border-primary/40 text-primary',
    success: 'bg-gradient-to-r from-accent/15 to-accent/5 dark:from-accent/25 dark:to-accent/10 border-accent/30 dark:border-accent/40 text-accent',
    warning: 'bg-gradient-to-r from-secondary/15 to-secondary/5 dark:from-secondary/25 dark:to-secondary/10 border-secondary/30 dark:border-secondary/40 text-secondary',
    error: 'bg-gradient-to-r from-red-50/100 to-red-50/50 dark:from-red-900/30 dark:to-red-900/10 border-red-200 dark:border-red-700 text-red-700 dark:text-red-300',
  };

  const icons = {
    info: <Info size={20} />,
    success: <CheckCircle size={20} />,
    warning: <AlertCircle size={20} />,
    error: <AlertCircle size={20} />,
  };

  return (
    <div className={`border rounded-lg p-4 flex gap-4 ${styles[type]}`}>
      <div className="flex-shrink-0">{icons[type]}</div>
      <div className="flex-1">
        {title && <h3 className="font-semibold mb-1">{title}</h3>}
        {message && <p className="text-sm">{message}</p>}
        {children}
      </div>
    </div>
  );
}
