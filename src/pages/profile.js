'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import api from '@/lib/api';
import { User, Mail, Phone } from 'lucide-react';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users/me');
      setUser(response.data.data);
      setError('');
    } catch (err) {
      console.error('Error fetching user:', err);
      setError('Error al cargar el perfil');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-bg-main flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-text-secondary">Cargando perfil...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-bg-main py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-primary mb-8">👤 Mi Perfil</h1>

          {user && (
            <div className="card">
              <div className="flex items-center mb-8">
                <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="ml-6">
                  <h2 className="text-2xl font-bold text-primary">{user.name}</h2>
                  <p className="text-text-secondary">
                    {user.role === 'ADMIN' ? '⚙️ Administrador' : '👤 Usuario'}
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Phone */}
                <div className="flex items-center">
                  <Phone size={20} className="text-primary mr-4" />
                  <div>
                    <p className="text-sm text-text-secondary">Teléfono</p>
                    <p className="text-lg font-medium text-text-primary">{user.phone}</p>
                  </div>
                </div>

                {/* Plan */}
                <div className="flex items-center">
                  <User size={20} className="text-primary mr-4" />
                  <div>
                    <p className="text-sm text-text-secondary">Plan de Ahorro</p>
                    <p className="text-lg font-medium text-text-primary">{user.planType}</p>
                  </div>
                </div>

                {/* Created At */}
                <div>
                  <p className="text-sm text-text-secondary">Miembro desde</p>
                  <p className="text-lg font-medium text-text-primary">
                    {new Date(user.createdAt).toLocaleDateString('es-BO', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-200">
                <p className="text-sm text-text-secondary">
                  Para más acciones, contacta con el administrador del programa.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
