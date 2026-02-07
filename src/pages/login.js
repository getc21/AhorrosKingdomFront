import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import api from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ phone: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    console.log('Submit clicked!', formData);
    setError('');
    setLoading(true);

    try {
      console.log('Posting to /auth/login...');
      const response = await api.post('/auth/login', {
        phone: formData.phone,
        password: formData.password,
      });
      
      console.log('Response:', response.data);
      if (response.data.token) {
        // Limpiar cualquier estado previo de sesión (importante para el modal de contraseña)
        sessionStorage.removeItem('pwd_modal_dismissed');
        
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        router.push('/dashboard');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Teléfono o contraseña incorrectos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-main flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">🏰 Ahorros Kingdom</h1>
          <p className="text-text-secondary">Plan de Ahorro Comunitario</p>
        </div>

        <div className="card">
          <h2 className="text-2xl font-bold text-text-primary mb-6">Iniciar Sesión</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                Teléfono
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+591-XXXXXXXX"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                Acceso
              </label>
              <input
                type="text"
                style={{ WebkitTextSecurity: 'disc' }}
                name="password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="off"
                placeholder="••••••••"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="w-full px-4 py-2 bg-blue-900 text-white rounded-lg font-medium hover:bg-blue-800 disabled:opacity-50"
            >
              {loading ? 'Cargando...' : 'Iniciar Sesión'}
            </button>
          </div>
        </div>

        <div className="mt-6 card bg-accent bg-opacity-10">
          <p className="text-sm text-text-secondary">
            <strong>Credenciales de prueba (Admin):</strong>
            <br />
            Teléfono: +591-admin-001
            <br />
            Contraseña: admin123
          </p>
        </div>
      </div>
    </div>
  );
}
