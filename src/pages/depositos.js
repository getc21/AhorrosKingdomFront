import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import api from '@/lib/api';
import { ArrowLeft, Plus, MessageCircle, Download } from 'lucide-react';

export default function DepositosPage() {
  const router = useRouter();
  const [deposits, setDeposits] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ userId: '', amount: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchData();
  }, [router]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [depositsRes, usersRes] = await Promise.all([
        api.get('/deposits'),
        api.get('/users'),
      ]);
      setDeposits(depositsRes.data.data || []);
      setUsers(usersRes.data.data || []);
      setError('');
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Error al cargar depósitos');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.userId || !formData.amount) {
      setError('Completa todos los campos');
      return;
    }

    try {
      setSubmitting(true);
      const response = await api.post('/deposits', {
        userId: formData.userId,
        amount: parseFloat(formData.amount),
      });
      
      // Si la respuesta contiene whatsappLink, mostrar mensaje con botón
      if (response.data.data.whatsappLink) {
        const whatsappLink = response.data.data.whatsappLink;
        setTimeout(() => {
          if (confirm('¿Deseas enviar el recibo por WhatsApp?')) {
            window.open(whatsappLink, '_blank');
          }
        }, 500);
      }
      
      setFormData({ userId: '', amount: '' });
      setShowForm(false);
      await fetchData();
    } catch (err) {
      setError('Error al crear depósito');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-main flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-secondary">Cargando depósitos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-main py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Botón atrás versión desktop */}
        <button
          onClick={() => router.push('/dashboard')}
          className="hidden md:flex items-center space-x-2 text-primary hover:text-blue-800 mb-8"
          title="Volver al Dashboard"
        >
          <ArrowLeft size={20} />
          <span>Volver al Dashboard</span>
        </button>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            {/* Botón atrás versión mobile (a la izquierda) */}
            <button
              onClick={() => router.push('/dashboard')}
              className="md:hidden text-primary hover:text-blue-800 flex-shrink-0"
              title="Volver al Dashboard"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-2xl sm:text-4xl font-bold text-primary">📊 Gestionar Depósitos</h1>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center space-x-2 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-green-700"
          >
            <Plus size={20} />
            <span>Nuevo Depósito</span>
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Modal Dialog */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-primary">Crear Nuevo Depósito</h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">
                    Usuario
                  </label>
                  <select
                    value={formData.userId}
                    onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Selecciona un usuario</option>
                    {users.map((user) => (
                      <option key={user._id} value={user._id}>
                        {user.name} ({user.phone})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">
                    Monto (Bs.)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="5"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="0.00"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <p className="text-xs text-text-secondary mt-1">Mínimo: Bs. 5</p>
                </div>

                <div className="flex space-x-2 pt-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium"
                  >
                    {submitting ? 'Registrando...' : 'Registrar'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Tabla de depósitos */}
        {deposits.length > 0 ? (
          <div className="card">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-text-secondary">Fecha</th>
                    <th className="text-left py-3 px-4 font-semibold text-text-secondary">Usuario</th>
                    <th className="text-right py-3 px-4 font-semibold text-text-secondary">Monto (Bs.)</th>
                    <th className="text-center py-3 px-4 font-semibold text-text-secondary">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {deposits.map((deposit) => (
                    <tr key={deposit._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4 text-sm text-text-secondary">
                        {new Date(deposit.createdAt).toLocaleDateString('es-BO')}
                      </td>
                      <td className="py-4 px-4 font-medium text-text-primary">
                        {typeof deposit.userId === 'object' ? deposit.userId?.name : (users.find(u => u._id === deposit.userId)?.name || 'Usuario')}
                      </td>
                      <td className="py-4 px-4 text-right font-semibold text-secondary">
                        Bs. {deposit.amount.toFixed(2)}
                      </td>
                      <td className="py-4 px-4 text-center space-x-2">
                        <button
                          onClick={() => {
                            const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
                            const link = document.createElement('a');
                            link.href = `${backendUrl}/api/deposits/${deposit._id}/receipt`;
                            link.download = `recibo_deposito_${deposit._id}.pdf`;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                          }}
                          className="inline-flex items-center px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                          title="Descargar PDF"
                        >
                          <Download size={14} />
                        </button>
                        {deposit.whatsappLink && (
                          <button
                            onClick={() => window.open(deposit.whatsappLink, '_blank')}
                            className="inline-flex items-center px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200"
                            title="Enviar por WhatsApp"
                          >
                            <MessageCircle size={14} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="card text-center py-12">
            <p className="text-text-secondary text-lg">No hay depósitos registrados</p>
          </div>
        )}
      </div>
    </div>
  );
}
