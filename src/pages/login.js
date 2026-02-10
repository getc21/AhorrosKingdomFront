import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Eye, EyeOff } from 'lucide-react';
import api from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ phone: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
          <h1 className="text-4xl font-bold gradient-text mb-2">Sistema de ahorros ENERGY</h1>
          <p className="text-text-secondary">Plan de Ahorro Comunitario</p>
        </div>

        <div className="card bg-gradient-card border border-cyan-500/30">
          <h2 className="text-2xl font-bold text-text-primary mb-6">Iniciar Sesión</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 text-red-300 rounded-lg">
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
                placeholder="Número de celular"
                required
                className="w-full px-4 py-2 bg-bg-card border border-cyan-500/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-text-primary placeholder-text-disabled"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="off"
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-2 bg-bg-card border border-cyan-500/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-text-primary placeholder-text-disabled pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-primary transition-colors"
                  title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="w-full px-4 py-2 bg-gradient-btn text-white rounded-lg font-medium hover:shadow-lg hover:shadow-primary/50 disabled:opacity-50 transition-all duration-300"
            >
              {loading ? 'Cargando...' : 'Iniciar Sesión'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
