import React, { useState } from 'react';
import { 
  TrendingUp, 
  Briefcase, 
  MapPin, 
  Building, 
  DollarSign,
  Calendar,
  Search,
  Filter,
  ExternalLink,
  BookOpen,
  Award,
  Users
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const careerProgressData = [
  { year: 2018, salary: 65000, level: 'Junior' },
  { year: 2019, salary: 72000, level: 'Junior' },
  { year: 2020, salary: 82000, level: 'Mid-Level' },
  { year: 2021, salary: 95000, level: 'Mid-Level' },
  { year: 2022, salary: 110000, level: 'Senior' },
  { year: 2023, salary: 125000, level: 'Senior' },
  { year: 2024, salary: 140000, level: 'Lead' },
];

const skillsData = [
  { skill: 'React', proficiency: 90 },
  { skill: 'TypeScript', proficiency: 85 },
  { skill: 'Node.js', proficiency: 80 },
  { skill: 'Python', proficiency: 75 },
  { skill: 'AWS', proficiency: 70 },
  { skill: 'Docker', proficiency: 65 },
];

interface JobOpportunity {
  id: number;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  posted: string;
  description: string;
  requirements: string[];
  benefits: string[];
}

interface Resource {
  id: number;
  title: string;
  type: 'course' | 'article' | 'webinar' | 'certification';
  provider: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  rating: number;
}

export const Career: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'opportunities' | 'resources' | 'progress'>('overview');
  const [searchTerm, setSearchTerm] = useState('');

  const jobOpportunities: JobOpportunity[] = [
    {
      id: 1,
      title: 'Senior Product Manager',
      company: 'TechCorp Inc.',
      location: 'San Francisco, CA',
      salary: '$140,000 - $180,000',
      type: 'Full-time',
      posted: '2 days ago',
      description: 'Lead product strategy and development for our flagship SaaS platform.',
      requirements: ['5+ years PM experience', 'Technical background', 'Leadership skills'],
      benefits: ['Health insurance', '401k matching', 'Remote work', 'Equity']
    },
    {
      id: 2,
      title: 'Data Scientist',
      company: 'AI Innovations Lab',
      location: 'Remote',
      salary: '$120,000 - $160,000',
      type: 'Full-time',
      posted: '1 week ago',
      description: 'Build machine learning models and analyze large datasets to drive business insights.',
      requirements: ['PhD or Masters in Data Science', 'Python/R expertise', '3+ years ML experience'],
      benefits: ['Flexible schedule', 'Learning budget', 'Health insurance', 'Stock options']
    }
  ];

  const resources: Resource[] = [
    {
      id: 1,
      title: 'Advanced React Patterns',
      type: 'course',
      provider: 'Tech Academy',
      duration: '8 weeks',
      difficulty: 'Advanced',
      description: 'Master advanced React patterns including hooks, context, and performance optimization.',
      rating: 4.8
    },
    {
      id: 2,
      title: 'Leadership in Tech: A Practical Guide',
      type: 'webinar',
      provider: 'Leadership Institute',
      duration: '2 hours',
      difficulty: 'Intermediate',
      description: 'Learn essential leadership skills for managing technical teams effectively.',
      rating: 4.6
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'course': return BookOpen;
      case 'webinar': return Users;
      case 'certification': return Award;
      default: return BookOpen;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Career Development</h1>
        <p className="text-gray-600">Track your career progress and discover new opportunities.</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit mb-8">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'progress', label: 'Progress' },
          { id: 'opportunities', label: 'Opportunities' },
          { id: 'resources', label: 'Resources' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Current Salary</p>
                  <p className="text-2xl font-bold text-gray-900">$140K</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm font-medium text-green-600">+12%</span>
                <span className="text-sm text-gray-500 ml-1">from last year</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Years Experience</p>
                  <p className="text-2xl font-bold text-gray-900">6.5</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Job Matches</p>
                  <p className="text-2xl font-bold text-gray-900">24</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <Briefcase className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Skill Score</p>
                  <p className="text-2xl font-bold text-gray-900">87%</p>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Skills Overview */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Skills Assessment</h3>
            <div className="space-y-4">
              {skillsData.map((skill) => (
                <div key={skill.skill}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">{skill.skill}</span>
                    <span className="text-sm text-gray-600">{skill.proficiency}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${skill.proficiency}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Recommendations */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Career Recommendations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Skill Development</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Based on market trends, consider learning Kubernetes and microservices architecture.
                </p>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View Courses →
                </button>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Career Path</h4>
                <p className="text-sm text-gray-600 mb-3">
                  You're on track for a Senior Engineering Manager role within 2-3 years.
                </p>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  See Path →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Progress Tab */}
      {activeTab === 'progress' && (
        <div className="space-y-8">
          {/* Career Progress Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Salary Progression</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={careerProgressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Salary']} />
                <Line type="monotone" dataKey="salary" stroke="#2563EB" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Milestones */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Career Milestones</h3>
            <div className="space-y-6">
              {[
                { year: '2024', title: 'Promoted to Tech Lead', company: 'Current Company', status: 'completed' },
                { year: '2023', title: 'Led Major Product Launch', company: 'Previous Company', status: 'completed' },
                { year: '2022', title: 'Senior Developer', company: 'Previous Company', status: 'completed' },
                { year: '2025', title: 'Target: Engineering Manager', company: 'Future Goal', status: 'upcoming' },
              ].map((milestone, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className={`w-4 h-4 rounded-full mt-1 ${
                    milestone.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'
                  }`}></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">{milestone.title}</h4>
                      <span className="text-sm text-gray-500">{milestone.year}</span>
                    </div>
                    <p className="text-sm text-gray-600">{milestone.company}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Opportunities Tab */}
      {activeTab === 'opportunities' && (
        <div className="space-y-6">
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1 relative">
              <Search className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search job opportunities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option>All Jobs</option>
                <option>Remote Only</option>
                <option>Full-time</option>
                <option>Contract</option>
              </select>
            </div>
          </div>

          {/* Job Opportunities */}
          <div className="space-y-6">
            {jobOpportunities.map((job) => (
              <div key={job.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{job.title}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Building className="h-4 w-4 mr-1" />
                        {job.company}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {job.location}
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        {job.salary}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      {job.type}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">{job.posted}</p>
                  </div>
                </div>

                <p className="text-gray-700 mb-4">{job.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Requirements</h4>
                    <ul className="space-y-1">
                      {job.requirements.map((req, index) => (
                        <li key={index} className="text-sm text-gray-600">• {req}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Benefits</h4>
                    <div className="flex flex-wrap gap-1">
                      {job.benefits.map((benefit, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                          {benefit}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Apply Now
                  </button>
                  <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
                    View Details
                    <ExternalLink className="h-4 w-4 ml-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Resources Tab */}
      {activeTab === 'resources' && (
        <div className="space-y-6">
          {/* Search */}
          <div className="relative">
            <Search className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search learning resources..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Resources Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {resources.map((resource) => {
              const Icon = getTypeIcon(resource.type);
              return (
                <div key={resource.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <Icon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{resource.title}</h3>
                        <p className="text-sm text-gray-600">{resource.provider}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(resource.difficulty)}`}>
                      {resource.difficulty}
                    </span>
                  </div>

                  <p className="text-gray-700 mb-4">{resource.description}</p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>{resource.duration}</span>
                      <div className="flex items-center">
                        <Award className="h-4 w-4 mr-1" />
                        {resource.rating}
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 capitalize">{resource.type}</span>
                  </div>

                  <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Start Learning
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};