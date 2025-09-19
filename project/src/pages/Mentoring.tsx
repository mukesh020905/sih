import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Users, 
  Star, 
  Clock, 
  MessageCircle, 
  Plus,
  Search,
  Filter,
  User,
  Calendar,
  Award,
  Loader
} from 'lucide-react';

interface MentorProfile {
  _id: string;
  name: string;
  headline: string;
  profilePicture: string;
  skills: string[];
  interests: string[];
}

export const Mentoring: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'matches' | 'active' | 'history'>('matches');
  const [searchTerm, setSearchTerm] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [mentors, setMentors] = useState<MentorProfile[]>([]);

  const isEnrolled = userProfile?.isEnrolledInMentorship;

  useEffect(() => {
    const fetchUserProfile = async () => {
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
            setUserProfile(data);
            console.log('User Profile fetched:', data);
          } else {
            console.error('Failed to fetch user profile:', data);
          }
        } else {
          console.log('No token found, user not authenticated.');
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
      }
    };

    const fetchMentors = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/profile?mentorship=true');
        const data = await res.json();
        setMentors(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUserProfile();
    fetchMentors();
  }, []);

  const handleToggleEnrollment = async () => {
    setIsJoining(true);
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const res = await fetch('http://localhost:5000/api/profile/mentorship', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setUserProfile(data);
        } else {
          console.error('Failed to update enrollment status:', data);
        }
      }
    } catch (err) {
      console.error('Error updating enrollment status:', err);
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Mentoring Program</h1>
            <p className="text-gray-600">Connect with mentors and mentees to grow your career and give back to the community.</p>
          </div>
          <button
            onClick={handleToggleEnrollment}
            disabled={isJoining}
            className={`bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center ${isJoining ? 'opacity-50 cursor-not-allowed' : ''}`}>
            {isJoining ? (
              <Loader className="animate-spin h-4 w-4 mr-2" />
            ) : (
              <Plus className="h-4 w-4 mr-2" />
            )}
            {isEnrolled ? 'Unenroll' : 'Join Program'}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Mentors</p>
              <p className="text-2xl font-bold text-gray-900">{mentors.length}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Seeking Mentors</p>
              <p className="text-2xl font-bold text-gray-900">892</p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-lg">
              <Heart className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Sessions This Month</p>
              <p className="text-2xl font-bold text-gray-900">3,421</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Success Rate</p>
              <p className="text-2xl font-bold text-gray-900">94%</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <Award className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit mb-8">
        <button
          onClick={() => setActiveTab('matches')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'matches' 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Mentors
        </button>
        <button
          onClick={() => setActiveTab('active')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'active' 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Active Mentorships
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'history' 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          History
        </button>
      </div>

      {/* Search and Filter */}
      {activeTab === 'matches' && (
        <div className="mb-6">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1 relative">
              <Search className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search mentors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option>All Mentors</option>
                <option>Skills</option>
                <option>Interests</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Content based on active tab */}
      {activeTab === 'matches' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mentors.map((mentor) => (
            <div key={mentor._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200">
              <div className="relative">
                <img 
                  src={mentor.profilePicture ? `http://localhost:5000${mentor.profilePicture}` : 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400'} 
                  alt={mentor.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-600 text-white">
                    Mentor
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-900 mb-1">{mentor.name}</h3>
                  <p className="text-sm text-gray-600">{mentor.headline}</p>
                </div>

                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {mentor.skills.map((skill, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {mentor.interests.map((interest, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
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
      )}

      {activeTab === 'active' && (
        <div className="text-center py-12">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No active mentorships yet</h3>
          <p className="text-gray-600">Your active mentorships will appear here.</p>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="text-center py-12">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No mentorship history yet</h3>
          <p className="text-gray-600">Complete mentorships will appear here.</p>
        </div>
      )}
    </div>
  );
};