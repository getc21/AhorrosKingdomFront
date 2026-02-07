import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import api from '@/lib/api';
import { ArrowLeft, Trophy, Medal, Target } from 'lucide-react';

export default function RankingPage() {
  const router = useRouter();
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUserPosition, setCurrentUserPosition] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token) {
      router.push('/login');
      return;
    }

    if (userData) {
      setUser(JSON.parse(userData));
    }

    fetchRanking();
  }, [router]);

  const fetchRanking = async () => {
    try {
      setLoading(true);
      const response = await api.get('/dashboard/ranking');
      setRanking(response.data.data || []);
      
      // Find current user position
      const userData = localStorage.getItem('user');
      if (userData) {
        const parsed = JSON.parse(userData);
        const userPosition = response.data.data.findIndex(u => u.id === parsed.id);
        if (userPosition >= 0) {
          setCurrentUserPosition(userPosition);
        }
      }
      
      setError('');
    } catch (err) {
      console.error('Error fetching ranking:', err);
      setError('Error al cargar el ranking');
    } finally {
      setLoading(false);
    }
  };

  const getMedalIcon = (position) => {
    if (position === 0) return '🥇';
    if (position === 1) return '🥈';
    if (position === 2) return '🥉';
    return `#${position + 1}`;
  };

  const getMedalColor = (position) => {
    if (position === 0) return 'from-yellow-400 to-yellow-600';
    if (position === 1) return 'from-gray-300 to-gray-500';
    if (position === 2) return 'from-orange-400 to-orange-600';
    return 'from-blue-100 to-blue-300';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-main flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-secondary">Cargando ranking...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-main py-6 sm:py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => router.push('/dashboard')}
          className="flex items-center space-x-2 text-primary hover:text-blue-800 mb-6 sm:mb-8 text-sm sm:text-base"
        >
          <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
          <span>Volver</span>
        </button>

        <div className="text-center mb-8 sm:mb-12">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <Trophy size={32} className="sm:w-10 sm:h-10 text-yellow-500" />
            <h1 className="text-2xl sm:text-4xl font-bold text-primary">Tabla de Posiciones</h1>
            <Trophy size={32} className="sm:w-10 sm:h-10 text-yellow-500" />
          </div>
          <p className="text-text-secondary text-sm sm:text-lg">Ranking de los mayores ahorradores</p>
        </div>

        {error && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-100 text-red-700 rounded text-sm sm:text-base">
            {error}
          </div>
        )}

        {/* Current User Position Card */}
        {currentUserPosition !== null && (
          <div className={`mb-6 sm:mb-8 card border-2 border-primary bg-gradient-to-r ${getMedalColor(currentUserPosition)}`}>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs sm:text-sm font-bold text-gray-600 dark:text-gray-300 uppercase mb-1">Tu Posición</p>
                <p className="text-2xl sm:text-3xl font-bold text-white">{getMedalIcon(currentUserPosition)}</p>
              </div>
              <div className="text-right">
                <p className="text-lg sm:text-xl font-bold text-white truncate">{user?.name}</p>
                <p className="text-base sm:text-lg font-semibold text-white">
                  Bs. {ranking[currentUserPosition]?.totalSaved || 0}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Ranking Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="w-full min-w-max text-sm sm:text-base">
              <thead>
                <tr className="bg-gradient-to-r from-primary to-blue-800 text-white">
                  <th className="px-2 sm:px-4 py-3 sm:py-4 text-left font-bold text-xs sm:text-sm">Posición</th>
                  <th className="px-2 sm:px-4 py-3 sm:py-4 text-left font-bold text-xs sm:text-sm">Nombre</th>
                  <th className="hidden sm:table-cell px-2 sm:px-4 py-3 sm:py-4 text-center font-bold text-xs sm:text-sm">Depósitos</th>
                  <th className="px-2 sm:px-4 py-3 sm:py-4 text-right font-bold text-xs sm:text-sm">Ahorrado</th>
                  <th className="hidden md:table-cell px-2 sm:px-4 py-3 sm:py-4 text-right font-bold text-xs sm:text-sm">Progreso</th>
                </tr>
              </thead>
              <tbody>
                {ranking.length > 0 ? (
                  ranking.map((person, index) => (
                    <tr
                      key={person.id}
                      className={`border-b border-gray-200 dark:border-gray-700 transition-colors text-xs sm:text-sm ${
                        currentUserPosition === index
                          ? 'bg-yellow-50 dark:bg-yellow-900 font-semibold'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                      }`}
                    >
                      <td className="px-2 sm:px-4 py-2 sm:py-4 text-center">
                        <span className="text-lg sm:text-2xl">{getMedalIcon(index)}</span>
                      </td>
                      <td className="px-2 sm:px-4 py-2 sm:py-4">
                        <div>
                          <p className="font-semibold text-text-primary">{person.name}</p>
                          <p className="text-xs text-text-secondary hidden sm:block">{person.phone}</p>
                        </div>
                      </td>
                      <td className="hidden sm:table-cell px-2 sm:px-4 py-2 sm:py-4 text-center">
                        <span className="inline-block px-2 sm:px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs font-medium">
                          {person.depositCount}
                        </span>
                      </td>
                      <td className="px-2 sm:px-4 py-2 sm:py-4 text-right">
                        <p className="text-base sm:text-xl font-bold text-secondary">Bs. {person.totalSaved}</p>
                      </td>
                      <td className="hidden md:table-cell px-2 sm:px-4 py-2 sm:py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-20 sm:w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-secondary to-green-500 h-2 rounded-full transition-all"
                              style={{ width: `${person.progressPercent}%` }}
                            ></div>
                          </div>
                          <span className="text-xs sm:text-sm font-semibold text-text-primary min-w-[2.5rem]">
                            {person.progressPercent.toFixed(0)}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-4 py-6 sm:py-8 text-center text-text-secondary text-sm">
                      No hay participantes aún
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="card border-l-4 border-secondary">
            <p className="text-text-secondary text-xs sm:text-sm mb-2">Total Participantes</p>
            <p className="text-2xl sm:text-3xl font-bold text-secondary">{ranking.length}</p>
          </div>
          <div className="card border-l-4 border-primary">
            <p className="text-text-secondary text-xs sm:text-sm mb-2">Mayor Ahorrador</p>
            <p className="text-base sm:text-lg font-bold text-primary truncate">{ranking[0]?.name || 'N/A'}</p>
            <p className="text-xs sm:text-sm text-text-secondary">Bs. {ranking[0]?.totalSaved || 0}</p>
          </div>
          <div className="card border-l-4 border-accent">
            <p className="text-text-secondary text-xs sm:text-sm mb-2">Promedio Ahorrado</p>
            <p className="text-2xl sm:text-3xl font-bold text-accent">
              Bs. {(ranking.reduce((sum, p) => sum + p.totalSaved, 0) / ranking.length || 0).toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
