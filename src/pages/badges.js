import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import api from '@/lib/api';
import { ArrowLeft } from 'lucide-react';

const AVAILABLE_BADGES = [
  {
    id: 'primer_deposito',
    name: 'Primer Paso',
    description: 'Haz tu primer depósito',
    emoji: '🎯',
  },
  {
    id: 'cinco_depositos',
    name: 'Constante',
    description: 'Realiza 5 depósitos',
    emoji: '⭐',
  },
  {
    id: 'diez_depositos',
    name: 'Dedicado',
    description: 'Realiza 10 depósitos',
    emoji: '✨',
  },
  {
    id: 'cuarto_meta',
    name: 'Comienzo Prometedor',
    description: 'Ahorra 25% de tu meta',
    emoji: '📈',
  },
  {
    id: 'mitad_meta',
    name: 'A Mitad del Camino',
    description: 'Ahorra 50% de tu meta',
    emoji: '🔥',
  },
  {
    id: 'tres_cuartos_meta',
    name: 'Casi Allá',
    description: 'Ahorra 75% de tu meta',
    emoji: '💪',
  },
  {
    id: 'meta_completa',
    name: 'Campeón',
    description: 'Alcanza tu meta de Bs. 500',
    emoji: '🏆',
  },
  {
    id: 'top_tres',
    name: 'Top 3 Ahorrista',
    description: 'Posiciónate en el top 3 del ranking',
    emoji: '🥇',
  },
  {
    id: 'deposito_grande',
    name: 'Generoso',
    description: 'Realiza un depósito de Bs. 100 o más',
    emoji: '💰',
  },
];

export default function BadgesPage() {
  const router = useRouter();
  const [myBadges, setMyBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      router.push('/login');
      return;
    }

    fetchBadges();
  }, []);

  const fetchBadges = async () => {
    try {
      setLoading(true);
      const response = await api.get('/dashboard/badges/my');
      setMyBadges(response.data.data.badges || []);
    } catch (err) {
      console.error('Error fetching badges:', err);
      setError('Error al cargar las insignias');
    } finally {
      setLoading(false);
    }
  };

  const isBadgeUnlocked = (badgeId) => {
    return myBadges.some((b) => b.id === badgeId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-main flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-secondary">Cargando insignias...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-main py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-primary hover:text-primary-dark mb-8 transition"
        >
          <ArrowLeft size={20} />
          <span className="font-semibold">Volver</span>
        </button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">🏅 Sistema de Insignias</h1>
          <p className="text-text-secondary">Desbloquea insignias completando objetivos</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="card border-l-4 border-secondary">
            <p className="text-text-secondary text-sm mb-2">Insignias Desbloqueadas</p>
            <p className="text-3xl font-bold text-secondary">{myBadges.length}</p>
          </div>
          <div className="card border-l-4 border-primary">
            <p className="text-text-secondary text-sm mb-2">Insignias Totales</p>
            <p className="text-3xl font-bold text-primary">{AVAILABLE_BADGES.length}</p>
          </div>
          <div className="card border-l-4 border-accent">
            <p className="text-text-secondary text-sm mb-2">Progreso</p>
            <p className="text-3xl font-bold text-accent">
              {Math.round((myBadges.length / AVAILABLE_BADGES.length) * 100)}%
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="card mb-8">
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-gradient-to-r from-secondary to-primary h-4 rounded-full transition-all duration-500"
              style={{ width: `${(myBadges.length / AVAILABLE_BADGES.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {AVAILABLE_BADGES.map((badge) => {
            const isUnlocked = isBadgeUnlocked(badge.id);
            const myBadge = myBadges.find((b) => b.id === badge.id);

            return (
              <div
                key={badge.id}
                className={`card transition-all ${
                  isUnlocked
                    ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 shadow-lg'
                    : 'bg-gray-50 border border-gray-200 opacity-60'
                }`}
              >
                <div className="flex flex-col items-center">
                  <div
                    className={`text-6xl mb-4 transition-transform ${
                      isUnlocked ? 'scale-100' : 'scale-50 opacity-50'
                    }`}
                  >
                    {badge.emoji}
                  </div>

                  <h3 className="text-lg font-bold text-center text-gray-800 mb-2">
                    {badge.name}
                  </h3>

                  <p className="text-sm text-text-secondary text-center mb-4">
                    {badge.description}
                  </p>

                  {isUnlocked ? (
                    <div className="w-full">
                      <div className="bg-green-100 border border-green-300 rounded-lg p-3 text-center mb-2">
                        <p className="text-xs font-semibold text-green-700">✓ Desbloqueada</p>
                      </div>
                      <p className="text-xs text-text-secondary text-center">
                        {new Date(myBadge.unlockedAt).toLocaleDateString('es-BO')}
                      </p>
                    </div>
                  ) : (
                    <div className="w-full">
                      <div className="bg-gray-200 border border-gray-300 rounded-lg p-3 text-center">
                        <p className="text-xs font-semibold text-gray-600">Bloqueada</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Info Section */}
        <div className="mt-12 card bg-blue-50 border border-blue-200">
          <div className="flex gap-4">
            <div className="text-2xl">ℹ️</div>
            <div>
              <h3 className="font-bold text-primary mb-2">¿Cómo desbloquear insignias?</h3>
              <ul className="text-sm text-text-secondary space-y-1">
                <li>✓ <strong>Primer Paso:</strong> Realiza tu primer depósito</li>
                <li>✓ <strong>Constante:</strong> Haz al menos 5 depósitos</li>
                <li>✓ <strong>Dedicado:</strong> Acumula 10 o más depósitos</li>
                <li>✓ <strong>Comienzo Prometedor:</strong> Ahorra Bs. 125 (25% de 500)</li>
                <li>✓ <strong>A Mitad del Camino:</strong> Ahorra Bs. 250 (50% de 500)</li>
                <li>✓ <strong>Casi Allá:</strong> Ahorra Bs. 375 (75% de 500)</li>
                <li>✓ <strong>Campeón:</strong> Alcanza tu meta de Bs. 500</li>
                <li>✓ <strong>Top 3 Ahorrista:</strong> Posiciónate en el top 3 del ranking</li>
                <li>✓ <strong>Generoso:</strong> Realiza un depósito de Bs. 100 o más</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
