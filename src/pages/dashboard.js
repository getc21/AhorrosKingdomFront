import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ProgressBar from '@/components/ProgressBar';
import BadgesList from '@/components/BadgesList';
import DepositFilters from '@/components/DepositFilters';
import ExportDepositsButton from '@/components/ExportDepositsButton';
import DepositCalendar from '@/components/DepositCalendar';
import EventSelector from '@/components/EventSelector';
import Alert from '@/components/Alert';
import api from '@/lib/api';
import { useToast } from '@/contexts/ToastContext';
import { TrendingUp, Wallet, Target, AlertCircle, X, ShieldCheck, Key, Download } from 'lucide-react';

// Componente Modal fuera para mayor estabilidad
function PasswordChangeModal({ isOpen, onSubmit, onSkip, pwdData, setPwdData, loading, error }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center p-3 sm:p-4 z-[999999]">
      <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm" onClick={onSkip}></div>
      
      <div className="bg-bg-card rounded-xl max-w-md w-full max-h-screen overflow-y-auto shadow-2xl relative z-10 border border-cyan-500/30">
        <div className="bg-gradient-to-r from-primary to-secondary p-4 sm:p-6 text-white flex justify-between items-center sticky top-0">
          <div className="flex items-center gap-2 sm:gap-3">
            <ShieldCheck className="text-secondary flex-shrink-0" size={20} />
            <h2 className="text-base sm:text-xl font-bold">Seguridad Obligatoria</h2>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          <div className="bg-primary/10 border-l-4 border-primary p-3 sm:p-4 mb-4 sm:mb-6">
            <p className="text-blue-700 dark:text-blue-200 text-xs sm:text-sm">
              <strong>¡Hola!</strong> Por seguridad de tu cuenta, te recomendamos actualizar la contraseña temporal que te asignó el administrador.
            </p>
          </div>

          {error && (
            <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg text-xs sm:text-sm flex items-center gap-2">
              <AlertCircle size={14} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-3 sm:space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Contraseña Actual</label>
              <div className="relative">
                <Key className="absolute left-3 top-2.5 text-gray-400 flex-shrink-0" size={16} />
                <input
                  type="text"
                  style={{ WebkitTextSecurity: 'disc' }}
                  required
                  autoComplete="false"
                  value={pwdData.oldPassword}
                  onChange={(e) => setPwdData({ ...pwdData, oldPassword: e.target.value })}
                  className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 text-sm bg-bg-card border border-cyan-500/30 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none transition-all text-text-primary"
                  placeholder="Clave temporal"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Nueva Contraseña</label>
              <div className="relative">
                <ShieldCheck className="absolute left-3 top-2.5 text-gray-400 flex-shrink-0" size={16} />
                <input
                  type="text"
                  style={{ WebkitTextSecurity: 'disc' }}
                  required
                  autoComplete="false"
                  value={pwdData.newPassword}
                  onChange={(e) => setPwdData({ ...pwdData, newPassword: e.target.value })}
                  className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 text-sm bg-bg-card border border-cyan-500/30 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none transition-all text-text-primary"
                  placeholder="Mínimo 6 caracteres"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Confirmar Contraseña</label>
              <div className="relative">
                <ShieldCheck className="absolute left-3 top-2.5 text-gray-400 flex-shrink-0" size={16} />
                <input
                  type="text"
                  style={{ WebkitTextSecurity: 'disc' }}
                  required
                  autoComplete="false"
                  value={pwdData.confirmPassword}
                  onChange={(e) => setPwdData({ ...pwdData, confirmPassword: e.target.value })}
                  className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 text-sm bg-bg-card border border-cyan-500/30 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none transition-all text-text-primary"
                  placeholder="Repite la contraseña"
                />
              </div>
            </div>

            <div className="pt-3 sm:pt-4 flex flex-col gap-2 sm:gap-3">
              <button
                type="button"
                onClick={onSubmit}
                disabled={loading}
                className="w-full py-2 sm:py-3 text-sm sm:text-base bg-primary text-white rounded-lg font-bold hover:bg-blue-800 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? 'Guardando...' : 'Actualizar Contraseña'}
              </button>
              <button
                type="button"
                onClick={onSkip}
                className="w-full py-2 text-xs sm:text-sm text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
              >
                Continuar sin cambiar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const toast = useToast();
  const [dashboard, setDashboard] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [badges, setBadges] = useState([]);
  const [filteredDeposits, setFilteredDeposits] = useState([]);
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [events, setEvents] = useState([]);
  
  // Password change states
  const [showPwdModal, setShowPwdModal] = useState(false);
  const [pwdData, setPwdData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdError, setPwdError] = useState('');

  // Función para cargar eventos
  const fetchEvents = async () => {
    try {
      const response = await api.get('/events');
      setEvents(response.data.data || []);
    } catch (err) {
      console.error('Error fetching events:', err);
    }
  };

  useEffect(() => {
    // Verificar si hay token
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const userData = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    
    if (!token) {
      router.push('/login');
      return;
    }
    
    if (userData) {
      const parsedUser = JSON.parse(userData);
      console.log('User loaded in Dashboard:', parsedUser);
      setUser(parsedUser);
      
      // Cargar eventos para todos los usuarios
      fetchEvents();
      
      // Cargar usuarios si es admin
      if (parsedUser.role === 'ADMIN') {
        fetchUsers();
      }
      
      // Solo mostrar el modal si:
      // 1. El usuario tiene el flag needsPasswordChange activo (o no existe aún)
      // 2. No lo ha cerrado o ignorado ya en esta sesión específica del navegador
      const hasBeenDismissed = sessionStorage.getItem('pwd_modal_dismissed');
      
      // Verificación más flexible para el flag de contraseña
      const requiresChange = parsedUser.needsPasswordChange !== false;
      
      if (requiresChange && !hasBeenDismissed) {
        console.log('Password change required, showing modal in 1s...');
        setTimeout(() => {
          setShowPwdModal(true);
        }, 1000);
      }
    }
    
    fetchDashboard();
  }, [router]);

  // Re-fetch when event selection changes
  useEffect(() => {
    if (selectedEventId !== null) {
      fetchDashboard();
      if (user?.role === 'ADMIN') {
        fetchUsers();
      }
    }
  }, [selectedEventId]);

  const handleSkipPwdChange = async () => {
    try {
      setShowPwdModal(false);
      sessionStorage.setItem('pwd_modal_dismissed', 'true');
      
      const response = await api.post('/auth/skip-password-change');
      
      // Usar el usuario actualizado que viene del servidor
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setUser(response.data.user);
      }
      toast.showInfo('Cambio de contraseña ignorado');
    } catch (err) {
      console.error('Error skipping password change:', err);
      toast.showError('Error al ignorar el cambio de contraseña');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (pwdData.newPassword !== pwdData.confirmPassword) {
      setPwdError('Las contraseñas no coinciden');
      toast.showError('Las contraseñas no coinciden');
      return;
    }
    
    try {
      setPwdLoading(true);
      setPwdError('');
      const response = await api.post('/auth/change-password', {
        oldPassword: pwdData.oldPassword,
        newPassword: pwdData.newPassword
      });
      
      // Marcar como completado
      sessionStorage.setItem('pwd_modal_dismissed', 'true');
      
      // Usar el usuario actualizado que viene del servidor
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setUser(response.data.user);
      }
      
      setShowPwdModal(false);
      setPwdData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      toast.showSuccess('Contraseña actualizada exitosamente');
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Error al cambiar la contraseña';
      setPwdError(errorMsg);
      toast.showError(errorMsg);
    } finally {
      setPwdLoading(false);
    }
  };

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const url = selectedEventId 
        ? `/dashboard/me?eventId=${selectedEventId}` 
        : '/dashboard/me';
      const response = await api.get(url);
      setDashboard(response.data.data);
      setError('');
      
      // Inicializar depósitos filtrados
      if (response.data.data.depositHistory) {
        setFilteredDeposits(response.data.data.depositHistory);
      }
      
      // Cargar insignias
      fetchBadges();
    } catch (err) {
      console.error('Error fetching dashboard:', err);
      setError('Error al cargar el dashboard');
    } finally {
      setLoading(false);
    }
  };

  const fetchBadges = async () => {
    try {
      const url = selectedEventId 
        ? `/dashboard/badges/my?eventId=${selectedEventId}` 
        : '/dashboard/badges/my';
      const response = await api.get(url);
      setBadges(response.data.data.badges || []);
    } catch (err) {
      console.error('Error fetching badges:', err);
      // No es crítico si falla
    }
  };

  const fetchUsers = async () => {
    try {
      setUsersLoading(true);
      const url = selectedEventId 
        ? `/dashboard/ranking?eventId=${selectedEventId}` 
        : '/dashboard/ranking';
      const response = await api.get(url);
      setUsers(response.data.data || []);
    } catch (err) {
      console.error('Error fetching users:', err);
      // No es crítico si falla
    } finally {
      setUsersLoading(false);
    }
  };

  const generateUsersPDF = async () => {
    if (!users.length) return;
    
    try {
      // Cargar html2pdf dinámicamente
      const html2pdf = (await import('html2pdf.js')).default;
      
      // Crear contenido HTML
      const element = document.createElement('div');
      element.innerHTML = `
        <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
          <div style="text-align: center; border-bottom: 3px solid #00D4FF; padding-bottom: 20px; margin-bottom: 30px;">
            <div style="font-size: 24px; font-weight: bold; color: #00D4FF; margin-bottom: 10px;">Sistema de ahorros ENERGY</div>
            <h1 style="margin: 0; color: #00D4FF;">Reporte de Usuarios</h1>
            <div style="font-size: 12px; color: #666; margin-top: 10px;">Generado: ${new Date().toLocaleDateString('es-BO')}</div>
          </div>

          <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
            <thead>
              <tr style="background: #00D4FF; color: #0F172A;">
                <th style="padding: 12px; text-align: center; font-weight: bold; border-bottom: 2px solid #00D4FF;">Pos.</th>
                <th style="padding: 12px; text-align: left; font-weight: bold; border-bottom: 2px solid #00D4FF;">Nombre</th>
                <th style="padding: 12px; text-align: left; font-weight: bold; border-bottom: 2px solid #00D4FF;">Teléfono</th>
                <th style="padding: 12px; text-align: right; font-weight: bold; border-bottom: 2px solid #00D4FF;">Ahorrado (Bs.)</th>
                <th style="padding: 12px; text-align: center; font-weight: bold; border-bottom: 2px solid #00D4FF;">Depósitos</th>
                <th style="padding: 12px; text-align: center; font-weight: bold; border-bottom: 2px solid #00D4FF;">Avance %</th>
              </tr>
            </thead>
            <tbody>
              ${users
                .map(
                  (u, idx) => `
                <tr style="border-bottom: 1px solid #e5e7eb; background: ${idx % 2 === 0 ? '#fff' : '#f9fafb'};">
                  <td style="padding: 10px 12px; text-align: center; font-weight: bold;">
                    ${
                      u.position === 1
                        ? '🥇'
                        : u.position === 2
                        ? '🥈'
                        : u.position === 3
                        ? '🥉'
                        : `#${u.position}`
                    }
                  </td>
                  <td style="padding: 10px 12px;">${u.name}</td>
                  <td style="padding: 10px 12px;">${u.phone}</td>
                  <td style="padding: 10px 12px; text-align: right; font-weight: bold; color: #00B4D8;">Bs. ${u.totalSaved.toFixed(2)}</td>
                  <td style="padding: 10px 12px; text-align: center;"><span style="background: #00D4FF; color: #0F172A; padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: bold;">${u.depositCount}</span></td>
                  <td style="padding: 10px 12px; text-align: center;">${u.progressPercent?.toFixed(0) || 0}%</td>
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>

          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin-top: 30px; padding-top: 20px; border-top: 2px solid #00D4FF;">
            <div style="text-align: center;">
              <div style="font-weight: bold; color: #666; font-size: 12px; margin-bottom: 5px;">Total de Usuarios</div>
              <div style="font-size: 20px; font-weight: bold; color: #00D4FF;">${users.length}</div>
            </div>
            <div style="text-align: center;">
              <div style="font-weight: bold; color: #666; font-size: 12px; margin-bottom: 5px;">Total Ahorrado</div>
              <div style="font-size: 20px; font-weight: bold; color: #00D4FF;">Bs. ${users.reduce((sum, u) => sum + u.totalSaved, 0).toFixed(2)}</div>
            </div>
            <div style="text-align: center;">
              <div style="font-weight: bold; color: #666; font-size: 12px; margin-bottom: 5px;">Promedio por Usuario</div>
              <div style="font-size: 20px; font-weight: bold; color: #00D4FF;">Bs. ${(users.reduce((sum, u) => sum + u.totalSaved, 0) / users.length).toFixed(2)}</div>
            </div>
          </div>

          <div style="text-align: center; font-size: 11px; color: #999; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p>Este reporte es confidencial y de uso oficial. Generado automáticamente por Sistema de ahorros ENERGY.</p>
          </div>
        </div>
      `;

      const options = {
        margin: 10,
        filename: `Reporte_Usuarios_${new Date().toISOString().split('T')[0]}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { orientation: 'landscape', unit: 'mm', format: 'a4' }
      };

      html2pdf().set(options).from(element).save();
    } catch (error) {
      console.error('Error generando PDF:', error);
      toast.showError('Error al generar el PDF. Instala html2pdf: npm install html2pdf.js');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-main flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-secondary">Cargando dashboard...</p>
        </div>
        <PasswordChangeModal 
          isOpen={showPwdModal} 
          onSubmit={handleChangePassword}
          onSkip={handleSkipPwdChange}
          pwdData={pwdData}
          setPwdData={setPwdData}
          loading={pwdLoading}
          error={pwdError}
        />
      </div>
    );
  }

  // Admin Dashboard
  if (user?.role === 'ADMIN') {
    return (
      <div className="min-h-screen bg-bg-main py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-primary mb-2">👑 Panel de Administrador</h1>
              <p className="text-text-secondary">Bienvenido, {user.name}</p>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="card border-l-4 border-primary">
              <p className="text-text-secondary text-sm mb-2">Mi Información</p>
              <div className="text-sm space-y-1">
                <p><strong>Nombre:</strong> {user.name}</p>
                <p><strong>Teléfono:</strong> {user.phone}</p>
                <p><strong>Rol:</strong> <span className="text-primary font-bold">Administrador</span></p>
              </div>
            </div>
            <div className="card border-l-4 border-secondary">
              <p className="text-text-secondary text-sm mb-2">Tu Ahorro Personal</p>
              <p className="text-3xl font-bold text-secondary mb-1">Bs. {dashboard?.totalSaved?.toFixed(2) || '0.00'}</p>
              <p className="text-xs text-text-secondary">{dashboard?.depositCount || 0} depósitos</p>
            </div>
            <div className="card border-l-4 border-accent">
              <p className="text-text-secondary text-sm mb-2">Meta del Programa</p>
              <p className="text-3xl font-bold text-accent mb-1">Bs. {dashboard?.goal || 500}</p>
              <p className="text-xs text-text-secondary">{dashboard?.progressPercent?.toFixed(0) || 0}% completado</p>
            </div>
          </div>

          {/* Admin Functions */}
          <div className="space-y-6">
            <div className="card">
              <h2 className="text-2xl font-bold text-primary mb-4">⚙️ Funciones Administrativas</h2>
              <p className="text-text-secondary mb-4">Aquí podrás gestionar el sistema. Las siguientes funciones están disponibles:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button 
                  onClick={() => router.push('/usuarios')}
                  className="p-4 border-2 border-secondary rounded-lg hover:bg-secondary/10 hover:border-secondary/80 transition-all duration-300 text-left group"
                >
                  <h3 className="font-bold text-secondary mb-1 group-hover:text-primary transition-colors">👥 Gestionar Usuarios</h3>
                  <p className="text-sm text-text-secondary">Ver y editar información de participantes</p>
                </button>
                <button 
                  onClick={() => router.push('/depositos')}
                  className="p-4 border-2 border-primary rounded-lg hover:bg-primary/10 hover:border-primary/80 transition-all duration-300 text-left group"
                >
                  <h3 className="font-bold text-primary mb-1">📊 Gestionar Depósitos</h3>
                  <p className="text-sm text-text-secondary">Crear, ver y gestionar depósitos</p>
                </button>
                <button 
                  onClick={() => router.push('/eventos')}
                  className="p-4 border-2 border-accent rounded-lg hover:bg-accent/10 hover:border-accent/80 transition-all duration-300 text-left group"
                >
                  <h3 className="font-bold text-accent mb-1 group-hover:text-primary transition-colors">🎪 Gestionar Eventos</h3>
                  <p className="text-sm text-text-secondary">Crear y gestionar eventos de ahorro</p>
                </button>
                <button 
                  onClick={() => router.push('/reportes')}
                  className="p-4 border-2 border-secondary rounded-lg hover:bg-secondary/10 hover:border-secondary/80 transition-all duration-300 text-left group"
                >
                  <h3 className="font-bold text-secondary mb-1 group-hover:text-primary transition-colors">📈 Reportes</h3>
                  <p className="text-sm text-text-secondary">Ver estadísticas y reportes del programa</p>
                </button>
              </div>
            </div>

            {/* Tu Progreso Personal como Admin */}
            {dashboard && (
              <div className="card">
                <h2 className="text-xl font-bold text-primary mb-4">📈 Tu Progreso Personal (como participante)</h2>
                <ProgressBar current={dashboard.totalSaved} goal={dashboard.goal} />
                <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-secondary">Bs. {dashboard.totalSaved.toFixed(2)}</p>
                    <p className="text-xs text-text-secondary">Ahorrado</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-accent">Bs. {dashboard.remainingAmount.toFixed(2)}</p>
                    <p className="text-xs text-text-secondary">Falta</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary">{dashboard.depositCount}</p>
                    <p className="text-xs text-text-secondary">Depósitos</p>
                  </div>
                </div>
              </div>
            )}

            {/* Tabla de Usuarios */}
            <div className="card">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4 md:gap-0">
                <h2 className="text-2xl font-bold text-primary">👥 Resumen de Usuarios</h2>
                <button
                  onClick={generateUsersPDF}
                  disabled={usersLoading || users.length === 0}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-btn text-white rounded-lg hover:shadow-lg hover:shadow-primary/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-sm sm:text-base"
                  title="Descargar reporte en PDF"
                >
                  <Download size={20} />
                  <span>Descargar PDF</span>
                </button>
              </div>

              {/* Dropdown de Eventos */}
              <div className="mb-6 max-w-md">
                <label className="block text-sm font-semibold text-text-primary mb-2">
                  Filtrar por Evento
                </label>
                <select
                  value={selectedEventId || ''}
                  onChange={(e) => setSelectedEventId(e.target.value || null)}
                  className="w-full px-4 py-2 bg-bg-card border border-cyan-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-text-primary"
                >
                  <option value="">Todos los eventos</option>
                  {events.map((event) => (
                    <option key={event._id} value={event._id}>
                      {event.emoji} {event.name}
                    </option>
                  ))}
                </select>
              </div>
              {usersLoading ? (
                <div className="text-center py-8">
                  <div className="inline-block">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                  <p className="text-text-secondary mt-2">Cargando usuarios...</p>
                </div>
              ) : users.length > 0 ? (
                <div className="overflow-x-auto -mx-4 sm:mx-0">
                  <table className="w-full min-w-max">
                    <thead>
                      <tr className="border-b border-primary/30 bg-primary/5">
                        <th className="text-left py-3 px-4 font-semibold text-sm text-primary">Posición</th>
                        <th className="text-left py-3 px-4 font-semibold text-sm text-primary">Nombre</th>
                        <th className="text-left py-3 px-4 font-semibold text-sm text-primary">Teléfono</th>
                        <th className="text-right py-3 px-4 font-semibold text-sm text-primary">Total Ahorrado</th>
                        <th className="text-center py-3 px-4 font-semibold text-sm text-primary">Depósitos</th>
                        <th className="text-center py-3 px-4 font-semibold text-sm text-primary">Progreso</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u.id} className="border-b border-primary/20 hover:bg-primary/10 dark:hover:bg-primary/10 transition-colors duration-200">
                          <td className="py-3 px-4 text-sm">
                            {u.position === 1 && <span className="text-xl">🥇</span>}
                            {u.position === 2 && <span className="text-xl">🥈</span>}
                            {u.position === 3 && <span className="text-xl">🥉</span>}
                            {u.position > 3 && <span className="font-bold text-text-secondary">#{u.position}</span>}
                          </td>
                          <td className="py-3 px-4 text-sm font-semibold text-text-primary">{u.name}</td>
                          <td className="py-3 px-4 text-sm text-text-secondary">{u.phone}</td>
                          <td className="py-3 px-4 text-sm text-right font-bold text-primary">Bs. {u.totalSaved.toFixed(2)}</td>
                          <td className="py-3 px-4 text-sm text-center">
                            <span className="inline-block bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-semibold border border-primary/30">
                              {u.depositCount}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm text-center">
                            <div className="flex items-center justify-center">
                              <div className="w-full max-w-xs bg-primary/10 rounded-full h-2 border border-primary/20">
                                <div 
                                  className="bg-gradient-btn h-2 rounded-full transition-all"
                                  style={{ width: `${Math.min((u.totalSaved / 500) * 100, 100)}%` }}
                                ></div>
                              </div>
                              <span className="ml-2 text-xs font-semibold text-text-secondary w-12 text-right">{u.progressPercent?.toFixed(0) || 0}%</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center text-text-secondary py-8">No hay usuarios registrados aún</p>
              )}
            </div>
          </div>
        </div>
        <PasswordChangeModal 
          isOpen={showPwdModal} 
          onSubmit={handleChangePassword}
          onSkip={handleSkipPwdChange}
          pwdData={pwdData}
          setPwdData={setPwdData}
          loading={pwdLoading}
          error={pwdError}
        />
      </div>
    );
  }

  // User Dashboard
  return (
    <div className="min-h-screen bg-bg-main py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-primary mb-8">📊 Mi Dashboard</h1>

        {/* Event Selector */}
        <div className="mb-8 max-w-md">
          <label className="block text-sm font-semibold text-primary mb-2">
            Selecciona un Evento
          </label>
          <EventSelector 
            selectedEventId={selectedEventId} 
            onEventChange={setSelectedEventId}
          />
        </div>

        {error && <Alert type="error" message={error} className="mb-6" />}

        {dashboard && (
          <div className="space-y-6">
            {/* Motivational Message */}
              {dashboard.motivationalMessage && (
                <Alert
                  type="success"
                  title="💬 Mensaje de Motivación"
                  message={dashboard.motivationalMessage}
                />
              )}

              {/* Main Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Total Saved Card */}
                <div className="card border-l-4 border-secondary">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-text-secondary text-sm">Total Ahorrado</p>
                      <p className="text-3xl font-bold text-secondary">
                        Bs. {dashboard.totalSaved.toFixed(2)}
                      </p>
                    </div>
                    <Wallet size={40} className="text-secondary opacity-20" />
                  </div>
                </div>

                {/* Remaining Goal Card */}
                <div className="card border-l-4 border-accent">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-text-secondary text-sm">Falta para la Meta</p>
                      <p className="text-3xl font-bold text-accent">
                        Bs. {dashboard.remainingAmount.toFixed(2)}
                      </p>
                    </div>
                    <Target size={40} className="text-accent opacity-20" />
                  </div>
                </div>
              </div>

              {/* Progress Section */}
              <div className="card">
                <div className="flex items-center mb-4">
                  <TrendingUp size={24} className="text-secondary mr-2" />
                  <h2 className="text-xl font-bold text-primary">Progreso hacia la Meta</h2>
                </div>
                <ProgressBar current={dashboard.totalSaved} goal={dashboard.goal} />
                <p className="text-center text-sm text-text-secondary mt-4">
                  Has depositado <strong>{dashboard.depositCount}</strong> vez/veces
                </p>
              </div>

              {/* Badges Section */}
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="text-2xl mr-3">🏅</div>
                    <div>
                      <h2 className="text-xl font-bold text-primary">Tus Insignias</h2>
                      <p className="text-xs text-text-secondary">Desbloquea logros completando objetivos</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-primary bg-primary/20 px-3 py-1 rounded-full border border-primary/30">
                    {badges.length}
                  </span>
                </div>
                <BadgesList badges={badges.slice(0, 5)} />
                <button
                  onClick={() => router.push('/badges')}
                  className="w-full mt-4 py-2 px-4 bg-gradient-btn hover:shadow-lg hover:shadow-primary/50 text-white font-semibold rounded-lg transition-all duration-300"
                >
                  Ver Todas las Insignias →
                </button>
              </div>

              {/* Rules and Ranking */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Rules */}
                <div className="card bg-gradient-card border border-primary/30">
                  <div className="flex items-start">
                    <AlertCircle size={20} className="text-primary mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-primary mb-2">📋 Reglas del Programa</h3>
                      <ul className="text-sm text-text-secondary space-y-1">
                        <li>✓ Depósito mínimo: Bs. 5</li>
                        <li>✓ Los depósitos se realizan solo en reuniones oficiales</li>
                        <li>✓ No se permiten retiros.</li>
                        <li>✓ Meta: Bs. {dashboard.goal}</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Ranking Button */}
                <button
                  onClick={() => router.push('/ranking')}
                  className="card bg-gradient-to-br from-accent/20 to-accent/10 border-2 border-accent/40 hover:shadow-lg hover:shadow-accent/30 transition cursor-pointer"
                >
                  <div className="flex flex-col items-center justify-center h-full py-4">
                    <div className="text-4xl mb-3">🏆</div>
                    <h3 className="font-bold text-lg text-accent mb-1">Tabla de Posiciones</h3>
                    <p className="text-sm text-text-secondary">Ver el ranking de ahorristas</p>
                  </div>
                </button>
              </div>

              {/* Deposit History */}
              <div className="card">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3 sm:gap-0">
                  <h2 className="text-lg sm:text-xl font-bold text-primary">💰 Historial de Depósitos</h2>
                  {dashboard.depositHistory && dashboard.depositHistory.length > 0 && (
                    <ExportDepositsButton 
                      user={user} 
                      deposits={dashboard.depositHistory}
                      eventName={
                        selectedEventId && events && events.length > 0
                          ? events.find(e => e._id.toString() === selectedEventId.toString())?.name || 'Todos los eventos'
                          : 'Todos los eventos'
                      }
                    />
                  )}
                </div>
                
                {/* Filters */}
                {dashboard.depositHistory && dashboard.depositHistory.length > 0 && (
                  <DepositFilters 
                    deposits={dashboard.depositHistory} 
                    onFiltered={setFilteredDeposits}
                  />
                )}
                
                {filteredDeposits && filteredDeposits.length > 0 ? (
                  <div className="overflow-x-auto -mx-4 sm:mx-0">
                    <table className="w-full min-w-max text-sm sm:text-base">
                      <thead>
                        <tr className="border-b border-primary/30">
                          <th className="text-left py-2 sm:py-3 px-3 sm:px-4 font-semibold text-xs sm:text-sm text-text-secondary">Fecha</th>
                          <th className="text-left py-2 sm:py-3 px-3 sm:px-4 font-semibold text-xs sm:text-sm text-text-secondary">Descripción</th>
                          <th className="text-right py-2 sm:py-3 px-3 sm:px-4 font-semibold text-xs sm:text-sm text-text-secondary">Monto (Bs.)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredDeposits.map((deposit) => (
                          <tr key={deposit.id} className="border-b border-primary/20 hover:bg-primary/10">
                            <td className="py-2 sm:py-3 px-3 sm:px-4 text-xs sm:text-sm">
                              {new Date(deposit.date).toLocaleDateString('es-BO')}
                            </td>
                            <td className="py-2 sm:py-3 px-3 sm:px-4 text-xs sm:text-sm truncate">{deposit.description}</td>
                            <td className="py-2 sm:py-3 px-3 sm:px-4 text-right text-xs sm:text-sm font-semibold text-secondary">
                              Bs. {deposit.amount.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : dashboard.depositHistory && dashboard.depositHistory.length > 0 ? (
                  <p className="text-text-secondary text-center py-6 text-sm sm:text-base">
                    📭 No hay depósitos que coincidan con los filtros aplicados
                  </p>
                ) : (
                  <p className="text-text-secondary text-center py-6 text-sm sm:text-base">
                    No tienes depósitos registrados aún
                  </p>
                )}
              </div>

              {/* Deposit Calendar */}
              {dashboard.depositHistory && dashboard.depositHistory.length > 0 && (
                <DepositCalendar deposits={dashboard.depositHistory} />
              )}
            </div>
          )}
        </div>
        <PasswordChangeModal 
          isOpen={showPwdModal} 
          onSubmit={handleChangePassword}
          onSkip={handleSkipPwdChange}
          pwdData={pwdData}
          setPwdData={setPwdData}
          loading={pwdLoading}
          error={pwdError}
        />
      </div>
    );
}
