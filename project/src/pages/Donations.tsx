import React, { useState } from 'react';
import { 
  DollarSign, 
  Heart, 
  TrendingUp, 
  Users, 
  Calendar,
  CreditCard,
  Building,
  GraduationCap,
  Award,
  Target
} from 'lucide-react';
import { PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const donationData = [
  { category: 'Education', value: 65000, color: '#2563EB' },
  { category: 'Research', value: 42000, color: '#059669' },
  { category: 'Sports', value: 28000, color: '#EA580C' },
  { category: 'Arts', value: 18000, color: '#7C3AED' },
  { category: 'Scholarships', value: 35000, color: '#DC2626' },
];

const monthlyData = [
  { month: 'Jan', amount: 15000 },
  { month: 'Feb', amount: 18000 },
  { month: 'Mar', amount: 22000 },
  { month: 'Apr', amount: 19000 },
  { month: 'May', amount: 25000 },
  { month: 'Jun', amount: 28000 },
];

export const Donations: React.FC = () => {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('education');

  const quickAmounts = [25, 50, 100, 250, 500, 1000];

  const stats = [
    { name: 'Total Raised This Year', value: '$2.4M', icon: DollarSign, change: '+23%' },
    { name: 'Active Donors', value: '1,847', icon: Users, change: '+12%' },
    { name: 'Projects Funded', value: '28', icon: Target, change: '+8%' },
    { name: 'Scholarships Awarded', value: '156', icon: Award, change: '+18%' },
  ];

  const projects = [
    {
      id: 1,
      title: 'Computer Science Lab Upgrade',
      description: 'Modernizing our CS lab with latest equipment and software to enhance student learning experience.',
      raised: 85000,
      goal: 120000,
      donors: 234,
      category: 'Education',
      image: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: 2,
      title: 'Student Emergency Fund',
      description: 'Supporting students facing unexpected financial hardships to continue their education.',
      raised: 42000,
      goal: 75000,
      donors: 186,
      category: 'Scholarships',
      image: 'https://images.pexels.com/photos/1181533/pexels-photo-1181533.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: 3,
      title: 'Green Campus Initiative',
      description: 'Making our campus more sustainable through solar panels, recycling programs, and green spaces.',
      raised: 38000,
      goal: 100000,
      donors: 142,
      category: 'Campus',
      image: 'https://images.pexels.com/photos/3825464/pexels-photo-3825464.jpeg?auto=compress&cs=tinysrgb&w=800'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Alumni Donations</h1>
        <p className="text-gray-600">Support your alma mater and make a lasting impact on future generations.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <Icon className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm font-medium text-emerald-600">{stat.change}</span>
                <span className="text-sm text-gray-500 ml-1">from last year</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
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
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {donationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Amount']} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Trends */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Donation Trends</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Donations']} />
              <Area type="monotone" dataKey="amount" stroke="#2563EB" fill="#3B82F6" fillOpacity={0.1} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Donation Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Heart className="h-5 w-5 text-red-500 mr-2" />
            Make a Donation
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Amount Selection */}
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Choose Amount</h4>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {quickAmounts.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => {
                      setSelectedAmount(amount);
                      setCustomAmount('');
                    }}
                    className={`p-3 text-center rounded-lg border-2 transition-colors ${
                      selectedAmount === amount
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    ${amount}
                  </button>
                ))}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Custom Amount
                </label>
                <div className="relative">
                  <DollarSign className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="number"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setSelectedAmount(null);
                    }}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter amount"
                  />
                </div>
              </div>
            </div>

            {/* Category Selection */}
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Select Category</h4>
              <div className="space-y-2">
                {[
                  { id: 'education', name: 'General Education Fund', icon: GraduationCap },
                  { id: 'research', name: 'Research & Innovation', icon: TrendingUp },
                  { id: 'scholarships', name: 'Student Scholarships', icon: Award },
                  { id: 'sports', name: 'Athletics Program', icon: Users },
                  { id: 'campus', name: 'Campus Development', icon: Building },
                ].map((category) => {
                  const Icon = category.icon;
                  return (
                    <label
                      key={category.id}
                      className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                        selectedCategory === category.id
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="category"
                        value={category.id}
                        checked={selectedCategory === category.id}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="sr-only"
                      />
                      <Icon className="h-5 w-5 mr-3 text-gray-600" />
                      <span className="font-medium">{category.name}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-medium">Total Donation:</span>
              <span className="text-2xl font-bold text-green-600">
                ${selectedAmount || customAmount || '0'}
              </span>
            </div>
            <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
              <CreditCard className="h-5 w-5 mr-2" />
              Proceed to Payment
            </button>
          </div>
        </div>
      </div>

      {/* Current Projects */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Current Projects</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <img 
                src={project.image} 
                alt={project.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="mb-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {project.category}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{project.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{project.description}</p>
                
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Progress</span>
                    <span className="text-sm text-gray-600">
                      ${project.raised.toLocaleString()} of ${project.goal.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${(project.raised / project.goal) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{project.donors} donors</p>
                </div>

                <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Donate to This Project
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};