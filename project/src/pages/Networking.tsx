import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  MapPin, 
  Building, 
  Calendar,
  MessageCircle,
  UserPlus,
  Star,
  Briefcase
} from 'lucide-react';

interface AlumniProfile {
  id: number;
  name: string;
  position: string;
  company: string;
  location: string;
  graduationYear: string;
  major: string;
  image: string;
  commonConnections: number;
  matchScore: number;
  industries: string[];
}

export const Networking: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const aiSuggestions: AlumniProfile[] = [
    {
      id: 1,
      name: 'Sarah Johnson',
      position: 'Data Scientist',
      company: 'Google',
      location: 'Mountain View, CA',
      graduationYear: '2019',
      major: 'Computer Science',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
      commonConnections: 12,
      matchScore: 95,
      industries: ['Technology', 'AI/ML']
    },
    {
      id: 2,
      name: 'Michael Chen',
      position: 'Product Manager',
      company: 'Microsoft',
      location: 'Seattle, WA',
      graduationYear: '2017',
      major: 'Business Administration',
      image: 'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=400',
      commonConnections: 8,
      matchScore: 92,
      industries: ['Technology', 'Product']
    },
    {
      id: 3,
      name: 'Emily Davis',
      position: 'UX Designer',
      company: 'Apple',
      location: 'Cupertino, CA',
      graduationYear: '2020',
      major: 'Design',
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
      commonConnections: 15,
      matchScore: 88,
      industries: ['Technology', 'Design']
    }
  ];

  const allAlumni: AlumniProfile[] = [
    ...aiSuggestions,
    {
      id: 4,
      name: 'David Wilson',
      position: 'Investment Banker',
      company: 'Goldman Sachs',
      location: 'New York, NY',
      graduationYear: '2016',
      major: 'Finance',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
      commonConnections: 6,
      matchScore: 75,
      industries: ['Finance', 'Banking']
    },
    {
      id: 5,
      name: 'Lisa Rodriguez',
      position: 'Marketing Director',
      company: 'Netflix',
      location: 'Los Gatos, CA',
      graduationYear: '2018',
      major: 'Marketing',
      image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400',
      commonConnections: 9,
      matchScore: 82,
      industries: ['Entertainment', 'Marketing']
    },
  ];

  const filteredAlumni = allAlumni.filter(alumni => 
    alumni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    alumni.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    alumni.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Alumni Networking</h1>
        <p className="text-gray-600">Connect with fellow alumni and expand your professional network.</p>
      </div>

      {/* AI Suggestions Section */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Star className="h-6 w-6 text-yellow-500 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">AI-Powered Suggestions</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {aiSuggestions.map((alumni) => (
            <div key={alumni.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200">
              <div className="relative">
                <img 
                  src={alumni.image} 
                  alt={alumni.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                  {alumni.matchScore}% Match
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{alumni.name}</h3>
                    <p className="text-sm text-gray-600">{alumni.position}</p>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Building className="h-4 w-4 mr-2" />
                    {alumni.company}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    {alumni.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    Class of {alumni.graduationYear}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-2" />
                    {alumni.commonConnections} mutual connections
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {alumni.industries.map((industry, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {industry}
                    </span>
                  ))}
                </div>

                <div className="flex space-x-2">
                  <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
                    <UserPlus className="h-4 w-4 mr-1" />
                    Connect
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    <MessageCircle className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Search and Filter */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1 relative">
            <Search className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search alumni by name, company, or position..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Alumni</option>
              <option value="recent">Recent Graduates</option>
              <option value="location">Same Location</option>
              <option value="industry">Same Industry</option>
            </select>
          </div>
        </div>
      </div>

      {/* All Alumni Grid */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">All Alumni</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAlumni.map((alumni) => (
            <div key={alumni.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200">
              <div className="relative">
                <img 
                  src={alumni.image} 
                  alt={alumni.name}
                  className="w-full h-48 object-cover"
                />
                {alumni.matchScore > 85 && (
                  <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    {alumni.matchScore}% Match
                  </div>
                )}
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{alumni.name}</h3>
                    <p className="text-sm text-gray-600">{alumni.position}</p>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Building className="h-4 w-4 mr-2" />
                    {alumni.company}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    {alumni.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    Class of {alumni.graduationYear}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-2" />
                    {alumni.commonConnections} mutual connections
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {alumni.industries.map((industry, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {industry}
                    </span>
                  ))}
                </div>

                <div className="flex space-x-2">
                  <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
                    <UserPlus className="h-4 w-4 mr-1" />
                    Connect
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    <MessageCircle className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};