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

interface MentorshipMatch {
  id: number;
  name: string;
  role: 'mentor' | 'mentee';
  position: string;
  company: string;
  interests: string[];
  experience: string;
  image: string;
  matchScore: number;
  availability: string;
  sessions?: number;
  rating?: number;
}

export const Mentoring: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'matches' | 'active' | 'history'>('matches');
  const [searchTerm, setSearchTerm] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);

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

    fetchUserProfile();
  }, []);

  const handleToggleEnrollment = async () => {
    setIsJoining(true);
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const res = await fetch('http://localhost:5000/api/profile/mentorship', {
          method: 'PUT',
          headers: {
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

  const mentorshipMatches: MentorshipMatch[] = [
    {
      id: 1,
      name: 'Dr. Sarah Martinez',
      role: 'mentor',
      position: 'VP of Engineering',
      company: 'Tesla',
      interests: ['Leadership', 'Career Development', 'Tech Strategy'],
      experience: '15+ years in tech leadership',
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
      matchScore: 96,
      availability: 'Weekends',
      sessions: 45,
      rating: 4.9
    },
    {
      id: 2,
      name: 'Alex Kumar',
      role: 'mentee',
      position: 'Computer Science Student',
      company: 'University',
      interests: ['Software Engineering', 'Internships', 'Career Guidance'],
      experience: 'Final year student seeking guidance',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
      matchScore: 92,
      availability: 'Evenings',
    },
    {
      id: 3,
      name: 'Jennifer Wu',
      role: 'mentor',
      position: 'Product Manager',
      company: 'Spotify',
      interests: ['Product Strategy', 'User Research', 'Career Transition'],
      experience: '10+ years in product management',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
      matchScore: 89,
      availability: 'Flexible',
      sessions: 32,
      rating: 4.8
    }
  ];

  const activeMentorships = [
    {
      id: 1,
      name: 'Emma Thompson',
      role: 'mentee' as const,
      position: 'Junior Developer',
      company: 'StartupXYZ',
      startDate: '2024-12-01',
      nextSession: '2025-01-15',
      progress: 75,
      image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400',
    }
  ];

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
              <p className="text-2xl font-bold text-gray-900">1,247</p>
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
          AI Matches
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
                placeholder="Search mentors or mentees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option>All Matches</option>
                <option>Mentors Only</option>
                <option>Mentees Only</option>
                <option>High Match Score</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Content based on active tab */}
      {activeTab === 'matches' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isEnrolled && userProfile && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="relative">
                <img 
                  src={userProfile.profilePicture ? `http://localhost:5000${userProfile.profilePicture}` : 'https://via.placeholder.com/150'} 
                  alt={userProfile.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-600 text-white">
                    You
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-900 mb-1">{userProfile.name}</h3>
                  <p className="text-sm text-gray-600">{userProfile.headline}</p>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-700 mb-2">{userProfile.bio}</p>
                </div>

                {userProfile.skills && userProfile.skills.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {userProfile.skills.map((skill: string, index: number) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          {mentorshipMatches.map((match) => (
            <div key={match.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200">
              <div className="relative">
                <img 
                  src={match.image} 
                  alt={match.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                  {match.matchScore}% Match
                </div>
                <div className="absolute top-3 left-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    match.role === 'mentor' ? 'bg-blue-600 text-white' : 'bg-purple-600 text-white'
                  }`}>
                    {match.role === 'mentor' ? 'Mentor' : 'Mentee'}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-900 mb-1">{match.name}</h3>
                  <p className="text-sm text-gray-600">{match.position}</p>
                  <p className="text-sm text-gray-600">{match.company}</p>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-700 mb-2">{match.experience}</p>
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <Clock className="h-4 w-4 mr-1" />
                    Available: {match.availability}
                  </div>
                  {match.rating && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Star className="h-4 w-4 mr-1 text-yellow-500 fill-current" />
                      {match.rating} ({match.sessions} sessions)
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {match.interests.map((interest, index) => (
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
        <div className="space-y-6">
          {activeMentorships.map((mentorship) => (
            <div key={mentorship.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <img 
                    src={mentorship.image} 
                    alt={mentorship.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{mentorship.name}</h3>
                    <p className="text-sm text-gray-600">{mentorship.position}</p>
                    <p className="text-sm text-gray-600">{mentorship.company}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Started: {new Date(mentorship.startDate).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-600">Next Session: {new Date(mentorship.nextSession).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Progress</span>
                  <span className="text-sm text-gray-600">{mentorship.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${mentorship.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex space-x-3">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Schedule Session
                </button>
                <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                  View Details
                </button>
                <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <MessageCircle className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
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