import React, { useState, useEffect } from 'react';
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
  Briefcase,
  X,
  Linkedin
} from 'lucide-react';

interface AlumniProfile {
  _id: string;
  name: string;
  headline: string;
  profilePicture: string;
  skills: string[];
  interests: string[];
  role: string;
  sentRequests: { user: { _id: string } }[];
  receivedRequests: { user: { _id: string } }[];
  connections: { user: { _id: string } }[];
  linkedin?: string;
  email?: string;
}

export const Networking: React.FC = () => {
  const [profiles, setProfiles] = useState<AlumniProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [currentUserProfile, setCurrentUserProfile] = useState<AlumniProfile | null>(null);
  const [suggestedProfiles, setSuggestedProfiles] = useState<AlumniProfile[]>([]);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        let url = 'http://localhost:5000/api/profile';
        if (selectedRole !== 'all') {
          url += `?role=${selectedRole}`;
        }
        const res = await fetch(url);
        const data = await res.json();
        console.log('Fetched profiles:', data);
        setProfiles(data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchCurrentUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const res = await fetch('http://localhost:5000/api/profile/me', {
            headers: {
              'x-auth-token': token,
            },
          });
          const data = await res.json();
          if (res.ok) {
            setCurrentUserProfile(data);
          } else {
            console.error('Failed to fetch current user profile:', data);
          }
        }
      } catch (err) {
        console.error('Error fetching current user profile:', err);
      }
    };

    fetchProfiles();
    fetchCurrentUserProfile();
  }, [selectedRole]);

  useEffect(() => {
    if (currentUserProfile && profiles.length > 0) {
      const calculateSimilarity = (userInterests: string[], otherInterests: string[]) => {
        const commonInterests = userInterests.filter(interest => otherInterests.includes(interest));
        return commonInterests.length;
      };

      const suggestions = profiles
        .filter(profile => profile._id !== currentUserProfile._id)
        .filter(profile => !currentUserProfile.connections.some(conn => conn.user._id === profile._id))
        .map(profile => ({
          ...profile,
          similarity: calculateSimilarity(currentUserProfile.interests, profile.interests),
        }))
        .filter(profile => profile.similarity > 0)
        .sort((a, b) => b.similarity - a.similarity);

      setSuggestedProfiles(suggestions);
      console.log('currentUserProfile:', currentUserProfile);
      console.log('profiles:', profiles);
      console.log('suggestions:', suggestions);
    }
  }, [currentUserProfile, profiles]);

  const filteredAlumni = profiles.filter(profile => {
    const roleMatch = selectedRole === 'all' || profile.role === selectedRole;
    const searchTermMatch = 
      profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (profile.headline && profile.headline.toLowerCase().includes(searchTerm.toLowerCase()));
    return roleMatch && searchTermMatch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Alumni Networking</h1>
        <p className="text-gray-600">Connect with fellow alumni and expand your professional network.</p>
      </div>

      {/* Search and Filter */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1 relative">
            <Search className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search alumni by name or headline..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setSelectedRole('all')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedRole === 'all' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedRole('Alumni')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedRole === 'Alumni' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Alumni
              </button>
              <button
                onClick={() => setSelectedRole('Student')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedRole === 'Student' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Student
              </button>
              <button
                onClick={() => setSelectedRole('Faculty')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedRole === 'Faculty' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Faculty
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* AI-Powered Suggestions */}
      {suggestedProfiles.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">For You</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {suggestedProfiles.map((profile) => (
              <div key={profile._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200">
                <div className="relative">
                  <img 
                    src={profile.profilePicture ? `http://localhost:5000${profile.profilePicture}` : 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400'} 
                    alt={profile.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    {profile.role}
                  </div>
                  <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    {profile.similarity} common interests
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{profile.name}</h3>
                      <p className="text-sm text-gray-600">{profile.headline}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Briefcase className="h-4 w-4 mr-2" />
                      {profile.skills.join(', ')}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Star className="h-4 w-4 mr-2" />
                      {profile.interests.join(', ')}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    {currentUserProfile && currentUserProfile._id !== profile._id && (
                      <>
                        {currentUserProfile.connections.some(conn => conn.user._id === profile._id) ? (
                          <>
                            <button className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg cursor-not-allowed flex items-center justify-center">
                              <Users className="h-4 w-4 mr-1" />
                              Connected
                            </button>
                            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                              <MessageCircle className="h-4 w-4" />
                            </button>
                          </>
                        ) : currentUserProfile.sentRequests.some(req => req.user._id === profile._id) ? (
                          <button className="flex-1 bg-yellow-500 text-white px-4 py-2 rounded-lg cursor-not-allowed flex items-center justify-center">
                            <UserPlus className="h-4 w-4 mr-1" />
                            Request Sent
                          </button>
                        ) : currentUserProfile.receivedRequests.some(req => req.user._id === profile._id) ? (
                          <>
                            <button onClick={() => handleAccept(profile._id)} className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center">
                              <UserPlus className="h-4 w-4 mr-1" />
                              Accept
                            </button>
                            <button onClick={() => handleReject(profile._id)} className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center">
                              <X className="h-4 w-4 mr-1" />
                              Reject
                            </button>
                          </>
                        ) : (
                          <button onClick={() => handleConnect(profile._id)} className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
                            <UserPlus className="h-4 w-4 mr-1" />
                            Connect
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Alumni Grid */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">All Alumni</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAlumni.map((profile) => (
            <div key={profile._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200">
              <div className="relative">
                <img 
                  src={profile.profilePicture ? `http://localhost:5000${profile.profilePicture}` : 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400'} 
                  alt={profile.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 right-3 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                  {profile.role}
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{profile.name}</h3>
                    <p className="text-sm text-gray-600">{profile.headline}</p>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Briefcase className="h-4 w-4 mr-2" />
                    {profile.skills.join(', ')}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Star className="h-4 w-4 mr-2" />
                    {profile.interests.join(', ')}
                  </div>
                </div>

                <div className="flex space-x-2">
                  {profile.linkedin && (
                    <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
                      <Linkedin className="h-4 w-4 mr-1" />
                      LinkedIn
                    </a>
                  )}
                  {profile.email && (
                    <a href={`mailto:${profile.email}`} className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      Mail
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};