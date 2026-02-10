import React, { useState } from 'react';
import { ChevronDown, X } from 'lucide-react';

export default function DepositFilters({ deposits = [], onFiltered }) {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    searchText: '',
    minAmount: '',
    maxAmount: '',
    startDate: '',
    endDate: '',
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    applyFilters({ ...filters, [name]: value });
  };

  const applyFilters = (activeFilters) => {
    let filtered = [...deposits];

    // Filtro por texto en descripción
    if (activeFilters.searchText) {
      filtered = filtered.filter((d) =>
        (d.description || '').toLowerCase().includes(activeFilters.searchText.toLowerCase())
      );
    }

    // Filtro por monto mínimo
    if (activeFilters.minAmount) {
      const min = parseFloat(activeFilters.minAmount);
      filtered = filtered.filter((d) => d.amount >= min);
    }

    // Filtro por monto máximo
    if (activeFilters.maxAmount) {
      const max = parseFloat(activeFilters.maxAmount);
      filtered = filtered.filter((d) => d.amount <= max);
    }

    // Filtro por fecha de inicio
    if (activeFilters.startDate) {
      const startDate = new Date(activeFilters.startDate);
      filtered = filtered.filter((d) => new Date(d.date || d.createdAt) >= startDate);
    }

    // Filtro por fecha de fin
    if (activeFilters.endDate) {
      const endDate = new Date(activeFilters.endDate);
      endDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter((d) => new Date(d.date || d.createdAt) <= endDate);
    }

    onFiltered(filtered);
  };

  const resetFilters = () => {
    setFilters({
      searchText: '',
      minAmount: '',
      maxAmount: '',
      startDate: '',
      endDate: '',
    });
    onFiltered(deposits);
  };

  const hasActiveFilters = Object.values(filters).some((v) => v !== '');

  return (
    <div className="mb-4 sm:mb-6">
      {/* Botón Toggle */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="flex items-center gap-2 px-3 sm:px-4 py-2 text-sm sm:text-base bg-gradient-to-r from-primary/15 to-secondary/15 dark:from-primary/25 dark:to-secondary/20 hover:from-primary/25 hover:to-secondary/25 border border-primary/30 dark:border-primary/40 text-primary rounded-lg transition font-semibold w-full sm:w-auto hover:shadow-md"
      >
        <span className="truncate">🔍 Filtros Avanzados</span>
        {hasActiveFilters && (
          <span className="ml-auto sm:ml-2 inline-block px-2 py-1 bg-gradient-btn text-white text-xs rounded-full flex-shrink-0">
            {Object.values(filters).filter((v) => v !== '').length}
          </span>
        )}
        <ChevronDown
          size={18}
          className={`transition-transform ${showFilters ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Panel de Filtros */}
      {showFilters && (
        <div className="mt-3 sm:mt-4 p-4 sm:p-6 card bg-gradient-to-br from-primary/10 to-accent/5 dark:from-primary/20 dark:to-accent/15 border border-primary/30 dark:border-primary/40 rounded-lg shadow-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {/* Búsqueda de Texto */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-primary mb-2">
                📝 Descripción
              </label>
              <input
                type="text"
                name="searchText"
                value={filters.searchText}
                onChange={handleFilterChange}
                placeholder="Buscar por descripción..."
                className="w-full px-2 sm:px-3 py-2 text-sm bg-bg-card dark:bg-gray-800 border border-primary/20 dark:border-primary/30 rounded-lg text-text-primary dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>

            {/* Monto Mínimo */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-primary mb-2">
                💰 Monto Mínimo (Bs)
              </label>
              <input
                type="number"
                name="minAmount"
                value={filters.minAmount}
                onChange={handleFilterChange}
                placeholder="Ej: 10"
                className="w-full px-2 sm:px-3 py-2 text-sm bg-bg-card dark:bg-gray-800 border border-primary/20 dark:border-primary/30 rounded-lg text-text-primary dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>

            {/* Monto Máximo */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-primary mb-2">
                💵 Monto Máximo (Bs)
              </label>
              <input
                type="number"
                name="maxAmount"
                value={filters.maxAmount}
                onChange={handleFilterChange}
                placeholder="Ej: 500"
                className="w-full px-2 sm:px-3 py-2 text-sm bg-bg-card dark:bg-gray-800 border border-primary/20 dark:border-primary/30 rounded-lg text-text-primary dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>

            {/* Fecha de Inicio */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-primary mb-2">
                📅 Desde
              </label>
              <input
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
                className="w-full px-2 sm:px-3 py-2 text-sm bg-bg-card dark:bg-gray-800 border border-primary/20 dark:border-primary/30 rounded-lg text-text-primary dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>

            {/* Fecha de Fin */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-primary mb-2">
                📅 Hasta
              </label>
              <input
                type="date"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
                className="w-full px-2 sm:px-3 py-2 text-sm bg-bg-card dark:bg-gray-800 border border-primary/20 dark:border-primary/30 rounded-lg text-text-primary dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>

            {/* Botón Resetear */}
            {hasActiveFilters && (
              <div className="flex items-end">
                <button
                  onClick={resetFilters}
                  className="w-full flex items-center justify-center gap-2 px-3 sm:px-4 py-2 text-sm bg-gradient-to-r from-accent/20 to-accent/10 dark:from-accent/30 dark:to-accent/20 hover:from-accent/30 hover:to-accent/20 text-accent border border-accent/30 rounded-lg transition font-semibold hover:shadow-md"
                >
                  <X size={16} />
                  Limpiar Filtros
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
