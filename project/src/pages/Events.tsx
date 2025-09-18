import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Search,
  Filter,
  Plus,
  ExternalLink,
  Edit,
  Trash
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { CreateEventModal } from '../components/events/CreateEventModal';
import { EditEventModal } from '../components/events/EditEventModal';

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  attendees: any[];
  maxAttendees: number;
  category: string;
  image: string;
  isVirtual: boolean;
  createdBy: string;
  rsvpStatus?: 'attending' | 'not-attending' | 'maybe';
}

export const Events: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'upcoming' | 'past'>('upcoming');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const getUserId = () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.user.id;
      } catch (error) {
        return null;
      }
    }
    return null;
  };

  const userId = getUserId();

  const fetchEvents = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/events');
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleEventCreate = async (data: any) => {
    console.log('Creating event with data:', data);
    try {
      const token = localStorage.getItem('token');
      console.log('Using token:', token);
      const res = await fetch('http://localhost:5000/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token || '',
        },
        body: JSON.stringify(data),
      });
      console.log('Create event response:', res);
      if (res.ok) {
        fetchEvents();
        setIsCreateModalOpen(false);
      }
    } catch (err) {
      console.error('Error creating event:', err);
    }
  };

  const handleEventUpdate = async (data: any) => {
    if (!selectedEvent) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/events/${selectedEvent._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token || '',
        },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        fetchEvents();
        setIsEditModalOpen(false);
        setSelectedEvent(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEventDelete = async (eventId: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:5000/api/events/${eventId}`, {
          method: 'DELETE',
          headers: {
            'x-auth-token': token || '',
          },
        });
        if (res.ok) {
          fetchEvents();
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleRsvp = async (eventId: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/events/${eventId}/rsvp`, {
        method: 'POST',
        headers: {
          'x-auth-token': token || '',
        },
      });
      if (res.ok) {
        fetchEvents();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const upcomingEvents: Event[] = events.filter(event => new Date(event.date) >= new Date());
  const pastEvents: Event[] = events.filter(event => new Date(event.date) < new Date());

  const displayedEvents = viewMode === 'upcoming' ? upcomingEvents : pastEvents;

  const categories = ['All', 'Professional', 'Social', 'Sports', 'Academic'];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getRsvpColor = (status?: string) => {
    switch (status) {
      case 'attending': return 'bg-green-100 text-green-800';
      case 'maybe': return 'bg-yellow-100 text-yellow-800';
      case 'not-attending': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredEvents = displayedEvents.filter(event =>
    (selectedCategory === 'all' || event.category.toLowerCase() === selectedCategory.toLowerCase()) &&
    (event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
     event.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  console.log('Filtered events:', filteredEvents);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <CreateEventModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onEventCreate={handleEventCreate}
      />
      {selectedEvent && (
        <EditEventModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedEvent(null);
          }}
          onEventUpdate={handleEventUpdate}
          event={selectedEvent}
        />
      )}

      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Alumni Events</h1>
            <p className="text-gray-600">Discover and join upcoming alumni events and activities.</p>
          </div>
          <button onClick={() => setIsCreateModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Create Event
          </button>
        </div>
      </div>
      {/* Controls */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4 mb-6">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {categories.map(category => (
                <option key={category} value={category.toLowerCase()}>
                  {category} Events
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
          <button
            onClick={() => setViewMode('upcoming')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'upcoming' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Upcoming Events
          </button>
          <button
            onClick={() => setViewMode('past')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'past' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Past Events
          </button>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {filteredEvents.map((event) => (
          <div key={event._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200">
            <div className="relative">
              <img 
                src={event.image} 
                alt={event.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {event.category}
                </span>
              </div>
              {event.isVirtual && (
                <div className="absolute top-4 right-4">
                  <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Virtual
                  </span>
                </div>
              )}
              {event.rsvpStatus && (
                <div className="absolute bottom-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getRsvpColor(event.rsvpStatus)}`}>
                    {event.rsvpStatus.replace('-', ' ')}
                  </span>
                </div>
              )}
            </div>

            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{event.title}</h3>
              <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>

              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  {formatDate(event.date)}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-2" />
                  {event.time}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  {event.location}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="h-4 w-4 mr-2" />
                  {event.attendees.length}/{event.maxAttendees} attending
                </div>
              </div>

              {/* Progress bar for attendees */}
              <div className="mb-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${(event.attendees.length / event.maxAttendees) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex space-x-3">
                <button onClick={() => handleRsvp(event._id)} className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  {event.rsvpStatus ? 'Update RSVP' : 'RSVP'}
                </button>
                <Link to={`/events/${event._id}`} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
                  Details
                  <ExternalLink className="h-4 w-4 ml-1" />
                </Link>
                {userId === event.createdBy && (
                  <>
                    <button onClick={() => {
                      setSelectedEvent(event);
                      setIsEditModalOpen(true);
                    }} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </button>
                    <button onClick={() => handleEventDelete(event._id)} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
                      <Trash className="h-4 w-4 mr-1" />
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  );
};