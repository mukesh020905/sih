import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, MapPin, Clock, Users } from 'lucide-react';

interface Attendee {
  _id: string;
  name: string;
  profilePicture?: string;
}

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  attendees: Attendee[];
  maxAttendees: number;
  category: string;
  image: string;
  isVirtual: boolean;
}

export const EventDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/events/${id}`);
        const data = await res.json();
        setEvent(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!event) {
    return <div>Event not found</div>;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <img src={event.image} alt={event.title} className="w-full h-64 object-cover" />
        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{event.title}</h1>
          <div className="flex items-center text-sm text-gray-600 mb-4">
            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">{event.category}</span>
            {event.isVirtual && <span className="ml-2 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">Virtual</span>}
          </div>
          <p className="text-gray-700 mb-6">{event.description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="flex items-center text-gray-600">
              <Calendar className="h-5 w-5 mr-3 text-blue-500" />
              <span>{formatDate(event.date)}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Clock className="h-5 w-5 mr-3 text-blue-500" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <MapPin className="h-5 w-5 mr-3 text-blue-500" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Users className="h-5 w-5 mr-3 text-blue-500" />
              <span>{event.attendees.length} / {event.maxAttendees} attending</span>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Attendees ({event.attendees.length})</h2>
            <div className="flex flex-wrap gap-4">
              {event.attendees.map(attendee => (
                <div key={attendee._id} className="flex items-center space-x-2">
                  <img 
                    src={attendee.profilePicture ? `http://localhost:5000${attendee.profilePicture}` : 'https://via.placeholder.com/40'} 
                    alt={attendee.name} 
                    className="w-10 h-10 rounded-full object-cover" 
                  />
                  <span className="text-gray-800 font-medium">{attendee.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};