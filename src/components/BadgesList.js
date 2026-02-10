import React from 'react';

export default function BadgesList({ badges = [] }) {
  if (!badges || badges.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12 px-4 bg-gradient-to-br from-primary/10 to-accent/10 dark:from-primary/20 dark:to-accent/20 rounded-lg border border-primary/20 dark:border-primary/30">
        <div className="text-4xl mb-3">🏅</div>
        <p className="text-text-secondary text-sm sm:text-base font-medium">No has desbloqueado insignias aún.</p>
        <p className="text-xs text-text-secondary/70 mt-2">¡Mantén depositando para desbloquear logros!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
      {badges.map((badge, index) => {
        // Alternar colores de la paleta para las insignias
        const colors = [
          { bg: 'from-primary/15 to-primary/5 dark:from-primary/25 dark:to-primary/10', border: 'border-primary/30', text: 'text-primary' },
          { bg: 'from-secondary/15 to-secondary/5 dark:from-secondary/25 dark:to-secondary/10', border: 'border-secondary/30', text: 'text-secondary' },
          { bg: 'from-accent/15 to-accent/5 dark:from-accent/25 dark:to-accent/10', border: 'border-accent/30', text: 'text-accent' },
        ];
        const color = colors[index % colors.length];

        return (
          <div
            key={badge.id}
            className={`flex flex-col items-center p-2 sm:p-3 md:p-4 bg-gradient-to-br ${color.bg} rounded-lg border ${color.border} hover:shadow-lg transition-all duration-200 cursor-default group`}
            title={badge.description}
          >
            <div className="text-2xl sm:text-3xl md:text-4xl mb-1 sm:mb-2 group-hover:scale-110 transition-transform duration-200">{badge.emoji}</div>
            <h3 className={`text-xs font-bold text-center ${color.text} leading-tight line-clamp-2`}>
              {badge.name}
            </h3>
            <p className={`text-xs ${color.text} text-center mt-1 hidden sm:block opacity-70 group-hover:opacity-100 transition-opacity`}>
              {new Date(badge.unlockedAt).toLocaleDateString('es-BO')}
            </p>
          </div>
        );
      })}
    </div>
  );
}
