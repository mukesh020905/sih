import React from 'react';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Award, 
  MessageCircle,
  ArrowUpRight,
  Star
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const engagementData = [
  { month: 'Jan', value: 65 },
  { month: 'Feb', value: 72 },
  { month: 'Mar', value: 68 },
  { month: 'Apr', value: 84 },
  { month: 'May', value: 91 },
  { month: 'Jun', value: 87 },
];

const donationData = [
  { category: 'Education', value: 45000 },
  { category: 'Research', value: 32000 },
  { category: 'Sports', value: 18000 },
  { category: 'Arts', value: 12000 },
];

const COLORS = ['#2563EB', '#059669', '#EA580C', '#7C3AED'];

export const Dashboard: React.FC = () => {
  const stats = [
    {
      name: 'Total Alumni',
      value: '12,847',
      change: '+12%',
      changeType: 'positive',
      icon: Users,
    },
    {
      name: 'Active Members',
      value: '8,932',
      change: '+8%',
      changeType: 'positive',
      icon: TrendingUp,
    },
    {
      name: 'Total Donations',
      value: '$2.4M',
      change: '+23%',
      changeType: 'positive',
      icon: DollarSign,
    },
    {
      name: 'Events This Month',
      value: '24',
      change: '+4',
      changeType: 'positive',
      icon: Calendar,
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'networking',
      message: 'Sarah Johnson connected with 3 new alumni in Tech sector',
      time: '2 hours ago',
      icon: Users,
    },
    {
      id: 2,
      type: 'donation',
      message: 'Michael Chen made a $5,000 donation to Engineering Fund',
      time: '5 hours ago',
      icon: DollarSign,
    },
    {
      id: 3,
      type: 'event',
      message: 'Tech Meetup 2025 has 127 RSVPs',
      time: '1 day ago',
      icon: Calendar,
    },
    {
      id: 4,
      type: 'mentoring',
      message: 'Emma Davis started mentoring 2 new students',
      time: '2 days ago',
      icon: Award,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, Mukesh!</h1>
        <p className="text-gray-600">Here's what's happening in your alumni network today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <Icon className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className={`text-sm font-medium ${stat.changeType === 'positive' ? 'text-emerald-600' : 'text-red-600'}`}>
                  {stat.change}
                </span>
                <span className="text-sm text-gray-500 ml-1">from last month</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Engagement Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Alumni Engagement</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={engagementData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="value" stroke="#2563EB" fill="#3B82F6" fillOpacity={0.1} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Donation Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Donation Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={donationData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {donationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Amount']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activities & AI Suggestions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activities */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
          </div>
          <div className="p-6 space-y-4">
            {recentActivities.map((activity) => {
              const Icon = activity.icon;
              return (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <Icon className="h-4 w-4 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Suggestions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Star className="h-5 w-5 text-yellow-500 mr-2" />
              AI Suggestions
            </h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
              <h4 className="font-medium text-blue-900 mb-2">Networking Opportunity</h4>
              <p className="text-sm text-blue-800 mb-3">
                Based on your profile, you might want to connect with 3 alumni in Data Science who recently joined tech companies.
              </p>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
                View Suggestions <ArrowUpRight className="h-4 w-4 ml-1" />
              </button>
            </div>

            <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-100">
              <h4 className="font-medium text-emerald-900 mb-2">Career Development</h4>
              <p className="text-sm text-emerald-800 mb-3">
                Consider attending the "AI in Healthcare" webinar next week - it matches your interests perfectly.
              </p>
              <button className="text-emerald-600 hover:text-emerald-700 text-sm font-medium flex items-center">
                Register Now <ArrowUpRight className="h-4 w-4 ml-1" />
              </button>
            </div>

            <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
              <h4 className="font-medium text-orange-900 mb-2">Mentoring Match</h4>
              <p className="text-sm text-orange-800 mb-3">
                2 students with similar career goals would benefit from your expertise in product management.
              </p>
              <button className="text-orange-600 hover:text-orange-700 text-sm font-medium flex items-center">
                View Matches <ArrowUpRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};