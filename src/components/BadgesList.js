import React from 'react';

export default function BadgesList({ badges = [] }) {
  if (!badges || badges.length === 0) {
    return (
      <div className="text-center py-6 sm:py-8">
        <p className="text-text-secondary text-sm sm:text-base">No has desbloqueado insignias aún.</p>
        <p className="text-xs text-text-secondary mt-2">¡Mantén depositando para desbloquear logros!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
      {badges.map((badge) => (
        <div
          key={badge.id}
          className="flex flex-col items-center p-2 sm:p-3 md:p-4 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900 dark:to-orange-900 rounded-lg border border-yellow-200 dark:border-yellow-700 hover:shadow-md transition"
          title={badge.description}
        >
          <div className="text-2xl sm:text-3xl md:text-4xl mb-1 sm:mb-2">{badge.emoji}</div>
          <h3 className="text-xs font-bold text-center text-yellow-800 dark:text-yellow-200 leading-tight line-clamp-2">
            {badge.name}
          </h3>
          <p className="text-xs text-yellow-600 dark:text-yellow-300 text-center mt-1 hidden sm:block">
            {new Date(badge.unlockedAt).toLocaleDateString('es-BO')}
          </p>
        </div>
      ))}
    </div>
  );
}
