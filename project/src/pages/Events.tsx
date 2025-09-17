import React, { useState } from 'react';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Search,
  Filter,
  Plus,
  ExternalLink
} from 'lucide-react';

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  maxAttendees: number;
  category: string;
  image: string;
  isVirtual: boolean;
  rsvpStatus?: 'attending' | 'not-attending' | 'maybe';
}

export const Events: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'upcoming' | 'past'>('upcoming');

  const upcomingEvents: Event[] = [
    {
      id: 1,
      title: 'Tech Innovation Summit 2025',
      description: 'Join fellow alumni for discussions on the latest tech trends, AI developments, and startup opportunities.',
      date: '2025-02-15',
      time: '09:00 AM',
      location: 'San Francisco Convention Center',
      attendees: 127,
      maxAttendees: 200,
      category: 'Professional',
      image: 'https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg?auto=compress&cs=tinysrgb&w=800',
      isVirtual: false,
      rsvpStatus: 'attending'
    },
    {
      id: 2,
      title: 'Alumni Networking Happy Hour',
      description: 'Casual networking event with drinks and appetizers. Perfect for making new connections.',
      date: '2025-02-08',
      time: '06:00 PM',
      location: 'The Rooftop Bar, Downtown',
      attendees: 67,
      maxAttendees: 100,
      category: 'Social',
      image: 'https://images.pexels.com/photos/1267338/pexels-photo-1267338.jpeg?auto=compress&cs=tinysrgb&w=800',
      isVirtual: false,
      rsvpStatus: 'maybe'
    },
    {
      id: 3,
      title: 'Virtual Career Development Workshop',
      description: 'Learn about career advancement strategies, resume optimization, and interview techniques.',
      date: '2025-02-12',
      time: '02:00 PM',
      location: 'Virtual Event',
      attendees: 234,
      maxAttendees: 500,
      category: 'Professional',
      image: 'https://images.pexels.com/photos/3182834/pexels-photo-3182834.jpeg?auto=compress&cs=tinysrgb&w=800',
      isVirtual: true
    },
    {
      id: 4,
      title: 'Alumni Basketball Game',
      description: 'Annual alumni basketball game followed by pizza and catch-up sessions.',
      date: '2025-02-20',
      time: '03:00 PM',
      location: 'University Sports Complex',
      attendees: 45,
      maxAttendees: 80,
      category: 'Sports',
      image: 'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=800',
      isVirtual: false
    }
  ];

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

  const filteredEvents = upcomingEvents.filter(event => 
    (selectedCategory === 'all' || event.category.toLowerCase() === selectedCategory.toLowerCase()) &&
    (event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
     event.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Alumni Events</h1>
            <p className="text-gray-600">Discover and join upcoming alumni events and activities.</p>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
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
          <div key={event.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200">
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
                  {event.attendees}/{event.maxAttendees} attending
                </div>
              </div>

              {/* Progress bar for attendees */}
              <div className="mb-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${(event.attendees / event.maxAttendees) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex space-x-3">
                <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  {event.rsvpStatus ? 'Update RSVP' : 'RSVP'}
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
                  Details
                  <ExternalLink className="h-4 w-4 ml-1" />
                </button>
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