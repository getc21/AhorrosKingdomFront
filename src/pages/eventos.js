import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Plus, Edit2, Trash2, ArrowLeft, Check } from 'lucide-react';
import api from '@/lib/api';
import { useToast } from '@/contexts/ToastContext';

export default function EventsPage() {
  const router = useRouter();
  const toast = useToast();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    goal: 500,
    emoji: '🎯',
    isPrimary: false,
  });

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const user = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    const parsedUser = user ? JSON.parse(user) : null;

    if (!token || parsedUser?.role !== 'ADMIN') {
      router.push('/dashboard');
      return;
    }

    fetchEvents();
  }, [router]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await api.get('/events');
      setEvents(response.data.data);
    } catch (err) {
      console.error('Error fetching events:', err);
      toast.showError('Error al cargar eventos');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : (name === 'goal' ? parseFloat(value) : value),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.goal) {
      toast.showError('Por favor completa los campos requeridos');
      return;
    }

    try {
      if (editingId) {
        await api.put(`/events/${editingId}`, formData);
        toast.showSuccess('Evento actualizado correctamente');
      } else {
        await api.post('/events', formData);
        toast.showSuccess('Evento creado correctamente');
      }

      resetForm();
      fetchEvents();
    } catch (err) {
      console.error('Error:', err);
      toast.showError(err.response?.data?.message || 'Error al guardar evento');
    }
  };

  const handleEdit = (event) => {
    setFormData({
      name: event.name,
      description: event.description || '',
      goal: event.goal,
      emoji: event.emoji || '🎯',
      isPrimary: event.isPrimary || false,
    });
    setEditingId(event._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este evento?')) {
      return;
    }

    try {
      await api.delete(`/events/${id}`);
      toast.showSuccess('Evento eliminado correctamente');
      fetchEvents();
    } catch (err) {
      console.error('Error:', err);
      toast.showError(err.response?.data?.message || 'Error al eliminar evento');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      goal: 500,
      emoji: '🎯',
      isPrimary: false,
    });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-main flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-secondary">Cargando eventos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-main py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-primary hover:text-primary hover:bg-primary/10 px-3 py-2 rounded-lg transition-all duration-200 mb-8 font-semibold"
        >
          <ArrowLeft size={20} />
          <span>Volver</span>
        </button>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-primary mb-2">🎪 Gestión de Eventos</h1>
            <p className="text-text-secondary">Administra los eventos de ahorro del sistema</p>
          </div>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-btn hover:shadow-lg hover:shadow-primary/50 text-white rounded-lg transition font-semibold"
            >
              <Plus size={20} />
              Nuevo Evento
            </button>
          )}
        </div>

        {/* Form */}
        {showForm && (
          <div className="card bg-gradient-to-br from-primary/15 to-accent/10 dark:from-primary/25 dark:to-accent/15 border border-primary/30 mb-8">
            <h2 className="text-2xl font-bold text-primary mb-6">
              {editingId ? 'Editar Evento' : 'Crear Nuevo Evento'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-primary mb-2">
                    Nombre del Evento *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Ej: Campamento Kingdom 2026"
                    className="w-full px-3 py-2 bg-bg-card border border-primary/20 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-primary mb-2">
                    Meta (Bs.) *
                  </label>
                  <input
                    type="number"
                    name="goal"
                    value={formData.goal}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full px-3 py-2 bg-bg-card border border-primary/20 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-primary mb-2">
                    Emoji
                  </label>
                  <input
                    type="text"
                    name="emoji"
                    value={formData.emoji}
                    onChange={handleInputChange}
                    maxLength="2"
                    className="w-full px-3 py-2 bg-bg-card border border-primary/20 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isPrimary"
                      checked={formData.isPrimary}
                      onChange={handleInputChange}
                      className="w-5 h-5 accent-primary"
                    />
                    <span className="text-sm font-semibold text-primary">Evento Principal</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-primary mb-2">
                  Descripción
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe el evento..."
                  rows="3"
                  className="w-full px-3 py-2 bg-bg-card border border-primary/20 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-btn hover:shadow-lg hover:shadow-primary/50 text-white rounded-lg transition font-semibold"
                >
                  {editingId ? 'Actualizar Evento' : 'Crear Evento'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition font-semibold border border-primary/30"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Events List */}
        <div className="space-y-4">
          {events.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-text-secondary text-lg">No hay eventos creados aún</p>
              <p className="text-text-secondary text-sm mt-2">Crea el primer evento para comenzar</p>
            </div>
          ) : (
            events.map((event) => (
              <div
                key={event._id}
                className="card bg-gradient-to-r from-primary/10 to-secondary/5 dark:from-primary/20 dark:to-secondary/10 border border-primary/30 hover:border-primary/50 transition"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="text-3xl">{event.emoji}</div>
                      <div>
                        <h3 className="text-xl font-bold text-primary">{event.name}</h3>
                        {event.isPrimary && (
                          <span className="inline-block mt-1 px-2 py-1 bg-gradient-btn text-white text-xs rounded-full font-semibold flex items-center gap-1">
                            <Check size={14} /> Evento Principal
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-text-secondary text-sm mb-2">{event.description}</p>
                    <p className="text-sm font-semibold text-secondary">Meta: Bs. {event.goal.toFixed(2)}</p>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(event)}
                      className="p-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition"
                      title="Editar evento"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(event._id)}
                      className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition"
                      title="Eliminar evento"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
