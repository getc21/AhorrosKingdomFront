import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import api from '@/lib/api';
import EventSelector from '@/components/EventSelector';
import { ArrowLeft, Plus, MessageCircle, Download } from 'lucide-react';

export default function DepositosPage() {
  const router = useRouter();
  const [deposits, setDeposits] = useState([]);
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [userRegisteredEvents, setUserRegisteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ userId: '', amount: '', eventId: '' });
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
      const [depositsRes, usersRes, eventsRes] = await Promise.all([
        api.get('/deposits'),
        api.get('/users'),
        api.get('/events'),
      ]);
      setDeposits(depositsRes.data.data || []);
      setUsers(usersRes.data.data || []);
      setEvents(eventsRes.data.data || []);
      
      // Set default event to primary
      const primaryEvent = (eventsRes.data.data || []).find((e) => e.isPrimary);
      if (primaryEvent && !formData.eventId) {
        setFormData((prev) => ({ ...prev, eventId: primaryEvent._id }));
      }
      
      setError('');
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Error al cargar depósitos');
    } finally {
      setLoading(false);
    }
  };

  const handleUserChange = async (userId) => {
    setFormData({ ...formData, userId, eventId: '' });
    setUserRegisteredEvents([]);
    
    if (!userId) return;

    try {
      const response = await api.get(`/users/${userId}/events`);
      const registeredEvents = response.data.data || [];
      setUserRegisteredEvents(registeredEvents);
      
      // Auto-select the first registered event if available
      if (registeredEvents.length > 0) {
        setFormData((prev) => ({ ...prev, eventId: registeredEvents[0]._id }));
      }
    } catch (err) {
      console.error('Error fetching user events:', err);
      setUserRegisteredEvents([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.userId || !formData.amount || !formData.eventId) {
      setError('Completa todos los campos');
      return;
    }

    try {
      setSubmitting(true);
      const response = await api.post('/deposits', {
        userId: formData.userId,
        amount: parseFloat(formData.amount),
        eventId: formData.eventId,
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
      
      setFormData({ userId: '', amount: '', eventId: events.find((e) => e.isPrimary)?._id || '' });
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
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-btn text-white rounded-lg hover:shadow-lg hover:shadow-lime-400/50 transition-all duration-300"
          >
            <Plus size={20} />
            <span>Nuevo Depósito</span>
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 text-red-300 rounded">
            {error}
          </div>
        )}

        {/* Modal Dialog */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-bg-card border border-lime-400/30 rounded-lg shadow-xl shadow-lime-400/10 max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-primary">Crear Nuevo Depósito</h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-text-secondary hover:text-primary transition-colors"
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
                    onChange={(e) => handleUserChange(e.target.value)}
                    required
                    className="w-full px-4 py-2 bg-bg-main border border-cyan-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-text-primary"
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
                    Evento
                  </label>
                  {formData.userId && userRegisteredEvents.length === 0 ? (
                    <div className="w-full px-4 py-2 bg-bg-main border border-red-500/30 rounded-lg text-red-400 text-sm">
                      Este usuario no está registrado en ningún evento
                    </div>
                  ) : (
                    <select
                      value={formData.eventId}
                      onChange={(e) => setFormData({ ...formData, eventId: e.target.value })}
                      required
                      className="w-full px-4 py-2 bg-bg-main border border-lime-400/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-text-primary"
                    >
                      <option value="">Selecciona un evento</option>
                      {userRegisteredEvents.map((event) => (
                        <option key={event._id} value={event._id}>
                          {event.emoji} {event.name}
                        </option>
                      ))}
                    </select>
                  )}
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
                    className="w-full px-4 py-2 bg-bg-main border border-lime-400/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-text-primary placeholder-text-disabled"
                  />
                  <p className="text-xs text-text-secondary mt-1">Mínimo: Bs. 5</p>
                </div>

                <div className="flex space-x-2 pt-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 px-4 py-2 bg-gradient-btn text-white rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 disabled:opacity-50 font-medium transition-all duration-300"
                  >
                    {submitting ? 'Registrando...' : 'Registrar'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 px-4 py-2 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/10 font-medium transition-colors"
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
                  <tr className="border-b border-cyan-500/30 bg-cyan-500/5">
                    <th className="text-left py-3 px-4 font-semibold text-primary">Fecha</th>
                    <th className="text-left py-3 px-4 font-semibold text-primary">Usuario</th>
                    <th className="text-left py-3 px-4 font-semibold text-primary">Evento</th>
                    <th className="text-right py-3 px-4 font-semibold text-primary">Monto (Bs.)</th>
                    <th className="text-center py-3 px-4 font-semibold text-primary">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {deposits.map((deposit) => {
                    const depositEvent = events.find(e => e._id === deposit.eventId);
                    return (
                      <tr key={deposit._id} className="border-b border-cyan-500/20 hover:bg-cyan-500/10 transition-colors duration-200">
                        <td className="py-4 px-4 text-sm text-text-secondary">
                          {new Date(deposit.createdAt).toLocaleDateString('es-BO')}
                        </td>
                        <td className="py-4 px-4 font-medium text-text-primary">
                          {typeof deposit.userId === 'object' ? deposit.userId?.name : (users.find(u => u._id === deposit.userId)?.name || 'Usuario')}
                        </td>
                        <td className="py-4 px-4 text-text-primary">
                          {depositEvent ? (
                            <span className="inline-flex items-center gap-2 bg-accent/20 text-accent px-3 py-1 rounded-full text-sm border border-accent/30">
                              <span>{depositEvent.emoji}</span>
                              <span>{depositEvent.name}</span>
                            </span>
                          ) : (
                            <span className="text-text-secondary text-sm">Evento desconocido</span>
                          )}
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
                            className="inline-flex items-center px-3 py-1 text-sm bg-primary/20 text-primary rounded hover:bg-primary/30 transition-colors border border-primary/30"
                            title="Descargar PDF"
                          >
                            <Download size={14} />
                          </button>
                          {deposit.whatsappLink && (
                            <button
                              onClick={() => window.open(deposit.whatsappLink, '_blank')}
                              className="inline-flex items-center px-3 py-1 text-sm bg-secondary/20 text-secondary rounded hover:bg-secondary/30 transition-colors border border-secondary/30"
                              title="Enviar por WhatsApp"
                            >
                              <MessageCircle size={14} />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
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
