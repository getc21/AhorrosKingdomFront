import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import api from '@/lib/api';

export default function EventSelector({ selectedEventId, onEventChange }) {
  const [events, setEvents] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userRegisteredEvents, setUserRegisteredEvents] = useState([]);

  useEffect(() => {
    fetchUserAndEvents();
  }, []);

  const fetchUserAndEvents = async () => {
    try {
      setLoading(true);
      // Get user's registered events
      const userResponse = await api.get('/users/me');
      const registeredEvents = userResponse.data.data.registeredEvents || [];
      setUserRegisteredEvents(registeredEvents);
      
      // Set first event as default if no event selected
      if (registeredEvents.length > 0 && !selectedEventId) {
        onEventChange(registeredEvents[0]._id);
      }
    } catch (err) {
      console.error('Error fetching user events:', err);
      setUserRegisteredEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const selected = userRegisteredEvents.find((e) => e._id === selectedEventId) || userRegisteredEvents[0];

  if (loading) {
    return (
      <div className="w-full px-3 py-2 bg-bg-card border border-primary/20 rounded-lg flex items-center justify-between">
        <div className="text-text-secondary text-sm">Cargando eventos...</div>
      </div>
    );
  }

  if (!selected || userRegisteredEvents.length === 0) {
    return (
      <div className="w-full px-3 py-2 bg-bg-card border border-primary/20 rounded-lg flex items-center justify-between">
        <div className="text-text-secondary text-sm">No tienes eventos registrados</div>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 bg-bg-card border border-primary/20 rounded-lg flex items-center justify-between hover:border-primary/40 transition text-text-primary font-semibold group"
      >
        <span className="flex items-center gap-2">
          {selected && <span className="text-lg">{selected.emoji}</span>}
          <span className="truncate">{selected?.name || 'Seleccionar evento'}</span>
        </span>
        <ChevronDown
          size={20}
          className={`text-primary transition-transform duration-200 ${
            isOpen ? 'transform rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-20 cursor-default"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 right-0 mt-2 bg-bg-card border border-primary/30 rounded-lg shadow-lg z-30 overflow-hidden">
            {userRegisteredEvents.map((event) => (
              <button
                key={event._id}
                onClick={() => {
                  onEventChange(event._id);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-3 text-left flex items-center gap-3 transition ${
                  event._id === selectedEventId
                    ? 'bg-primary/20 border-l-4 border-primary'
                    : 'hover:bg-primary/10'
                } ${event._id !== selectedEventId ? 'border-l-4 border-transparent' : ''}`}
              >
                <span className="text-2xl">{event.emoji}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-text-primary">{event.name}</span>
                    {event.isPrimary && (
                      <span className="px-2 py-0.5 bg-primary/20 text-primary text-xs rounded-full font-semibold">
                        Principal
                      </span>
                    )}
                  </div>
                  {event.description && (
                    <p className="text-text-secondary text-xs mt-0.5">{event.description}</p>
                  )}
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
