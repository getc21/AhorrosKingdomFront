import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function DepositCalendar({ deposits = [] }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Crear mapa de depósitos por fecha (sin problemas de zona horaria)
  const depositsByDate = {};
  deposits.forEach((deposit) => {
    const dateObj = new Date(deposit.date || deposit.createdAt);
    // Usar el año, mes y día local, no UTC
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    const dateKey = `${year}-${month}-${day}`;
    
    if (!depositsByDate[dateKey]) {
      depositsByDate[dateKey] = [];
    }
    depositsByDate[dateKey].push(deposit);
  });

  // Obtener días del mes
  const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const monthName = currentDate.toLocaleDateString('es-BO', { month: 'long', year: 'numeric' });

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const today = new Date();
  const isCurrentMonth =
    today.getMonth() === currentDate.getMonth() && today.getFullYear() === currentDate.getFullYear();

  // Crear array de días
  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  return (
    <div className="card">
      <div className="mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-bold text-primary mb-3 sm:mb-4">📅 Calendario de Depósitos</h2>

        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-4 sm:mb-6 gap-2">
          <button
            onClick={prevMonth}
            className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
          >
            <ChevronLeft size={18} className="sm:w-5 sm:h-5" />
          </button>
          <h3 className="text-sm sm:text-lg font-semibold capitalize text-primary text-center flex-1">{monthName}</h3>
          <button
            onClick={nextMonth}
            className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
          >
            <ChevronRight size={18} className="sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Day Names */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-1 sm:mb-2">
          {['D', 'L', 'M', 'X', 'J', 'V', 'S'].map((day) => (
            <div key={day} className="text-center font-bold text-text-secondary text-xs sm:text-sm py-1 sm:py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {days.map((day, index) => {
            let dateKey = null;
            if (day) {
              const dateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
              const year = dateObj.getFullYear();
              const month = String(dateObj.getMonth() + 1).padStart(2, '0');
              const dayStr = String(day).padStart(2, '0');
              dateKey = `${year}-${month}-${dayStr}`;
            }
            const hasDeposits = dateKey && depositsByDate[dateKey];
            const depositsCount = hasDeposits ? depositsByDate[dateKey].length : 0;
            const totalAmount = hasDeposits
              ? depositsByDate[dateKey].reduce((sum, d) => sum + d.amount, 0)
              : 0;
            const isToday =
              isCurrentMonth &&
              day === today.getDate();

            return (
              <div
                key={index}
                className={`
                  aspect-square rounded-lg p-1 sm:p-2 flex flex-col items-center justify-center text-center relative
                  transition-all cursor-pointer text-xs sm:text-sm
                  ${!day ? 'bg-transparent' : ''}
                  ${hasDeposits ? 'bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 border-2 border-secondary' : 'bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'}
                  ${isToday ? 'ring-2 ring-primary' : ''}
                  hover:shadow-md
                `}
                title={hasDeposits ? `${depositsCount} depósito(s): Bs. ${totalAmount.toFixed(2)}` : 'Sin depósitos'}
              >
                {day && (
                  <>
                    <span className={`text-xs sm:text-sm font-semibold ${hasDeposits ? 'text-secondary dark:text-green-200' : 'text-text-secondary dark:text-gray-400'}`}>
                      {day}
                    </span>
                    {hasDeposits && (
                      <>
                        <span className="text-xs text-secondary dark:text-green-200 font-bold">
                          {depositsCount}
                        </span>
                        <span className="text-xs text-secondary dark:text-green-200 font-bold hidden sm:inline">
                          Bs. {totalAmount.toFixed(0)}
                        </span>
                      </>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <h4 className="font-semibold text-primary mb-3">📊 Leyenda</h4>
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 border-2 border-secondary rounded"></div>
            <span className="text-sm text-text-secondary">Día con depósito</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded"></div>
            <span className="text-sm text-text-secondary">Día sin depósito</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 ring-2 ring-primary bg-white dark:bg-gray-800 rounded"></div>
            <span className="text-sm text-text-secondary">Hoy</span>
          </div>
        </div>
      </div>

      {/* Monthly Summary */}
      {deposits.length > 0 && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
          <h4 className="font-semibold text-primary mb-3">📈 Resumen del Mes</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
              <p className="text-xs text-text-secondary mb-1">Depósitos</p>
              <p className="text-lg font-bold text-primary">
                {
                  Object.entries(depositsByDate)
                    .filter(([key]) => {
                      const [year, month] = key.split('-');
                      return (
                        parseInt(month) - 1 === currentDate.getMonth() &&
                        parseInt(year) === currentDate.getFullYear()
                      );
                    })
                    .reduce((count, [, deps]) => count + deps.length, 0)
                }
              </p>
            </div>
            <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
              <p className="text-xs text-text-secondary mb-1">Total Ahorrado</p>
              <p className="text-lg font-bold text-secondary">
                Bs. {
                  Object.entries(depositsByDate)
                    .filter(([key]) => {
                      const [year, month] = key.split('-');
                      return (
                        parseInt(month) - 1 === currentDate.getMonth() &&
                        parseInt(year) === currentDate.getFullYear()
                      );
                    })
                    .reduce((sum, [, deps]) => sum + deps.reduce((s, d) => s + d.amount, 0), 0)
                    .toFixed(2)
                }
              </p>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900 p-4 rounded-lg">
              <p className="text-xs text-text-secondary mb-1">Promedio</p>
              <p className="text-lg font-bold text-accent">
                Bs. {
                  (() => {
                    const monthDeposits = Object.entries(depositsByDate)
                      .filter(([key]) => {
                        const [year, month] = key.split('-');
                        return (
                          parseInt(month) - 1 === currentDate.getMonth() &&
                          parseInt(year) === currentDate.getFullYear()
                        );
                      })
                      .flatMap(([, deps]) => deps);
                    return monthDeposits.length > 0
                      ? (monthDeposits.reduce((sum, d) => sum + d.amount, 0) / monthDeposits.length).toFixed(2)
                      : '0.00';
                  })()
                }
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
