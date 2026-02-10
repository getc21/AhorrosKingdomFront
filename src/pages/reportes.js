import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import api from '@/lib/api';
import { TrendingUp, Users, DollarSign, Target, ArrowUp, ArrowLeft } from 'lucide-react';

export default function ReportesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reportData, setReportData] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const userData = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    
    if (!token) {
      router.push('/login');
      return;
    }

    if (userData) {
      setUser(JSON.parse(userData));
    }

    if (userData && JSON.parse(userData).role !== 'ADMIN') {
      router.push('/dashboard');
      return;
    }
    
    fetchReportData();
  }, [router]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const [usersRes, depositsRes, dashboardRes] = await Promise.all([
        api.get('/users'),
        api.get('/deposits'),
        api.get('/dashboard/me'),
      ]);

      const users = usersRes.data.data || [];
      const deposits = depositsRes.data.data || [];
      const dashboardInfo = dashboardRes.data.data || {};

      // Procesar datos para estadísticas
      const totalUsers = users.length;
      const activeUsers = users.filter(u => u.isActive).length;
      const totalDeposits = deposits.length;
      const totalAmount = deposits.reduce((sum, d) => sum + (d.amount || 0), 0);
      const averageDeposit = totalDeposits > 0 ? totalAmount / totalDeposits : 0;

      // Estadísticas por plan
      const planStats = {};
      users.forEach(user => {
        const plan = user.planType || 'Sin Plan';
        if (!planStats[plan]) {
          planStats[plan] = { name: plan, users: 0, totalSaved: 0 };
        }
        planStats[plan].users += 1;
      });

      deposits.forEach(deposit => {
        if (deposit.userId) {
          const userId = typeof deposit.userId === 'object' ? deposit.userId._id : deposit.userId;
          const userPlan = users.find(u => u._id === userId)?.planType || 'Sin Plan';
          if (planStats[userPlan]) {
            planStats[userPlan].totalSaved += deposit.amount || 0;
          }
        }
      });

      const planData = Object.values(planStats);

      // Depósitos por mes (últimos 6 meses)
      const monthlyDeposits = {};
      const now = new Date();
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthKey = date.toLocaleString('es-ES', { month: 'short', year: 'numeric' });
        monthlyDeposits[monthKey] = { name: monthKey, amount: 0, count: 0 };
      }

      deposits.forEach(deposit => {
        if (deposit.createdAt) {
          const date = new Date(deposit.createdAt);
          const monthKey = date.toLocaleString('es-ES', { month: 'short', year: 'numeric' });
          if (monthlyDeposits[monthKey]) {
            monthlyDeposits[monthKey].amount += deposit.amount || 0;
            monthlyDeposits[monthKey].count += 1;
          }
        }
      });

      const monthlyData = Object.values(monthlyDeposits);

      // Usuarios por estado
      const statusData = [
        {
          name: 'Activos',
          value: activeUsers,
          color: '#10b981',
        },
        {
          name: 'Inactivos',
          value: totalUsers - activeUsers,
          color: '#ef4444',
        },
      ];

      setReportData({
        totalUsers,
        activeUsers,
        totalDeposits,
        totalAmount,
        averageDeposit,
        planData,
        monthlyData,
        statusData,
        dashboardInfo,
      });
      setError('');
    } catch (err) {
      console.error('Error fetching report data:', err);
      setError('Error al cargar los reportes');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-main flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-secondary">Cargando reportes...</p>
        </div>
      </div>
    );
  }

  if (!user?.role === 'ADMIN') {
    return (
      <div className="min-h-screen bg-bg-main flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">No tienes permiso para ver esta página</p>
          <button 
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 bg-primary text-white rounded-lg"
          >
            Volver al Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-main py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => router.push('/dashboard')}
          className="flex items-center space-x-2 text-primary hover:text-blue-800 mb-8"
        >
          <ArrowLeft size={20} />
          <span>Volver al Dashboard</span>
        </button>

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-primary mb-2">📈 Reportes y Estadísticas</h1>
            <p className="text-text-secondary">Análisis completo del programa de ahorro</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 text-red-300 rounded">
            {error}
          </div>
        )}

        {reportData && (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
              <div className="card border-l-4 border-primary">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-text-secondary text-sm mb-1">Total Usuarios</p>
                    <p className="text-3xl font-bold text-primary">{reportData.totalUsers}</p>
                  </div>
                  <Users className="text-primary" size={24} />
                </div>
              </div>

              <div className="card border-l-4 border-primary">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-text-secondary text-sm mb-1">Usuarios Activos</p>
                    <p className="text-3xl font-bold text-secondary">{reportData.activeUsers}</p>
                  </div>
                  <ArrowUp className="text-secondary" size={24} />
                </div>
              </div>

              <div className="card border-l-4 border-primary">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-text-secondary text-sm mb-1">Total Depósitos</p>
                    <p className="text-3xl font-bold text-primary">{reportData.totalDeposits}</p>
                  </div>
                  <DollarSign className="text-primary" size={24} />
                </div>
              </div>

              <div className="card border-l-4 border-secondary">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-text-secondary text-sm mb-1">Total Ahorrado</p>
                    <p className="text-3xl font-bold text-primary">Bs. {reportData.totalAmount.toFixed(2)}</p>
                  </div>
                  <Target className="text-primary" size={24} />
                </div>
              </div>

              <div className="card border-l-4 border-accent">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-text-secondary text-sm mb-1">Promedio por Depósito</p>
                    <p className="text-3xl font-bold text-accent">Bs. {reportData.averageDeposit.toFixed(2)}</p>
                  </div>
                  <TrendingUp className="text-accent" size={24} />
                </div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Depósitos por Mes */}
              <div className="card">
                <h2 className="text-xl font-bold text-primary mb-4">Depósitos por Mes</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={reportData.monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E3A5F" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} tick={{ fill: '#CBD5E1', fontSize: 12 }} />
                    <YAxis tick={{ fill: '#CBD5E1', fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #00D4FF', borderRadius: '8px', color: '#F1F5F9' }}
                      labelStyle={{ color: '#F1F5F9' }}
                    />
                    <Legend wrapperStyle={{ color: '#CBD5E1' }} />
                    <Bar dataKey="amount" fill="#00D4FF" name="Monto (Bs.)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="count" fill="#00B4D8" name="Cantidad" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Usuarios por Estado */}
              <div className="card">
                <h2 className="text-xl font-bold text-primary mb-4">Usuarios por Estado</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={reportData.statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {reportData.statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #00D4FF', borderRadius: '8px', color: '#F1F5F9' }}
                      labelStyle={{ color: '#F1F5F9' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Plan Statistics Table */}
            {reportData.planData.length > 0 && (
              <div className="card">
                <h2 className="text-xl font-bold text-primary mb-4">Estadísticas por Plan</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b-2 border-cyan-500/30 bg-cyan-500/5">
                        <th className="text-left py-3 px-4 font-bold text-primary">Plan</th>
                        <th className="text-center py-3 px-4 font-bold text-primary">Usuarios</th>
                        <th className="text-right py-3 px-4 font-bold text-primary">Total Ahorrado (Bs.)</th>
                        <th className="text-right py-3 px-4 font-bold text-primary">Promedio por Usuario (Bs.)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.planData.map((plan, index) => (
                        <tr key={index} className="border-b border-cyan-500/20 hover:bg-cyan-500/10 transition-colors duration-200">
                          <td className="py-3 px-4 font-medium text-text-primary">{plan.name}</td>
                          <td className="text-center py-3 px-4 text-text-secondary">{plan.users}</td>
                          <td className="text-right py-3 px-4 text-primary font-semibold">Bs. {plan.totalSaved.toFixed(2)}</td>
                          <td className="text-right py-3 px-4 text-primary font-semibold">
                            Bs. {(plan.totalSaved / plan.users).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
