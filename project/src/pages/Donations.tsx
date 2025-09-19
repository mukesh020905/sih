import React, { useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { 
  Heart, 
  TrendingUp, 
  Users, 
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

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const Donations: React.FC = () => {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('education');
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    goal: '',
    category: 'education',
    image: '',
    selectedFile: null as File | null,
  });
  const [projects, setProjects] = useState<any[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProject, setEditingProject] = useState<any | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const quickAmounts = [250, 500, 1000, 2500, 5000, 10000];

  const stats = [
    { name: 'Total Raised This Year', value: '₹2.4M', icon: '₹', change: '+23%' },
    { name: 'Active Donors', value: '1,847', icon: Users, change: '+12%' },
    { name: 'Projects Funded', value: '28', icon: Target, change: '+8%' },
    { name: 'Scholarships Awarded', value: '156', icon: Award, change: '+18%' },
  ];

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        setCurrentUserId(decodedToken.user.id);
        console.log('Decoded User ID:', decodedToken.user.id);
      } catch (error) {
        console.error('Error decoding token:', error);
        setCurrentUserId(null);
      }
    } else {
      console.log('No token found in localStorage.');
    }
  }, []);



  const handleProjectChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (e.target.name === 'imageFile') {
      setNewProject({ ...newProject, selectedFile: (e.target as HTMLInputElement).files ? (e.target as HTMLInputElement).files![0] : null });
    } else {
      setNewProject({ ...newProject, [e.target.name]: e.target.value });
    }
  };

  const handleCreateProject = async () => {
    if (!newProject.title || !newProject.description || !newProject.goal || !newProject.category) {
      alert('Please fill in all required project fields');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      let res;

      if (newProject.selectedFile) {
        const formData = new FormData();
        formData.append('title', newProject.title);
        formData.append('description', newProject.description);
        formData.append('goal', newProject.goal);
        formData.append('category', newProject.category);
        formData.append('image', newProject.selectedFile);

        res = await fetch('http://localhost:5000/api/projects', {
          method: 'POST',
          headers: {
            'x-auth-token': token || '',
          },
          body: formData,
        });
      } else {
        res = await fetch('http://localhost:5000/api/projects', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token || '',
          },
          body: JSON.stringify(newProject),
        });
      }
      
      const data = await res.json();
      if (res.ok) {
        alert('Project created successfully!');
        setNewProject({
          title: '',
          description: '',
          goal: '',
          category: 'education',
          image: '',
          selectedFile: null,
        });
        fetchProjects(); // Refresh the list of projects
      } else {
        alert(data.msg || 'Failed to create project');
      }
    } catch (err) {
      console.error(err);
      alert('Error creating project');
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!editingProject) return; // Add null check
    if (e.target.name === 'imageFile') {
      setEditingProject({ ...editingProject, selectedFile: (e.target as HTMLInputElement).files ? (e.target as HTMLInputElement).files![0] : null });
    } else {
      setEditingProject({ ...editingProject, [e.target.name]: e.target.value });
    }
  };

  const handleUpdateProject = async () => {
    if (!editingProject || !editingProject.title || !editingProject.description || !editingProject.goal || !editingProject.category) {
      alert('Please fill in all required project fields');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      let res;

      if (editingProject.selectedFile) {
        const formData = new FormData();
        formData.append('title', editingProject.title);
        formData.append('description', editingProject.description);
        formData.append('goal', editingProject.goal);
        formData.append('category', editingProject.category);
        formData.append('image', editingProject.selectedFile);

        res = await fetch(`http://localhost:5000/api/projects/${editingProject._id}`, {
          method: 'PUT',
          headers: {
            'x-auth-token': token || '',
          },
          body: formData,
        });
      } else {
        res = await fetch(`http://localhost:5000/api/projects/${editingProject._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token || '',
          },
          body: JSON.stringify(editingProject),
        });
      }
      
      const data = await res.json();
      if (res.ok) {
        alert('Project updated successfully!');
        setShowEditModal(false);
        setEditingProject(null);
        fetchProjects(); // Refresh the list of projects
      } else {
        alert(data.msg || 'Failed to update project');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating project');
    }
  };

  const handleEdit = (project: any) => {
    const validCategories = ['education', 'research', 'scholarships', 'sports', 'campus', 'other'];
    const category = project.category && validCategories.includes(project.category) ? project.category : 'other';
    setEditingProject({ ...project, category, selectedFile: null });
    setShowEditModal(true);
  };

  const handleDeleteProject = async (projectId: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:5000/api/projects/${projectId}`, {
          method: 'DELETE',
          headers: {
            'x-auth-token': token || '',
          },
        });

        if (res.ok) {
          alert('Project deleted successfully!');
          fetchProjects(); // Refresh the list of projects
        } else {
          const data = await res.json();
          alert(data.msg || 'Failed to delete project');
        }
      } catch (err) {
        console.error(err);
        alert('Error deleting project');
      }
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/projects');
      const data = await res.json();
      if (res.ok) {
        setProjects(data);
      } else {
        console.error(data.msg || 'Failed to fetch projects');
      }
    } catch (err) {
      console.error(err);
    }
  };

  React.useEffect(() => {
    fetchProjects();
  }, []);

  const displayRazorpay = async (projectId: string | null = null) => {
    const amount = selectedAmount || parseInt(customAmount, 10);
    if (!amount || amount <= 0) {
      alert('Please select or enter a valid amount');
      return;
    }

    try {
      const orderRes = await fetch('http://localhost:5000/api/payment/razorpay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok) {
        throw new Error(orderData.message || 'Failed to create order');
      }

      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Alumni Association',
        description: `Donation for ${selectedCategory}`,
        order_id: orderData.id,
        handler: async function (response: any) {
          try {
            const verificationRes = await fetch('http://localhost:5000/api/payment/verification', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verificationData = await verificationRes.json();
            if (verificationRes.ok && verificationData.success) {
              alert('Payment successful!');
              if (projectId) {
                const token = localStorage.getItem('token');
                await fetch(`http://localhost:5000/api/projects/${projectId}/donate`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token || '',
                  },
                  body: JSON.stringify({ amount }),
                });
                fetchProjects(); // Refresh projects after donation
              }
            } else {
              alert(verificationData.message || 'Payment verification failed');
            }
          } catch (err) {
            console.error(err);
            alert('Payment verification failed');
          }
        },
        prefill: {
          name: 'Your Name', // Prefill user details if available
          email: 'your.email@example.com',
          contact: '9999999999'
        },
        notes: {
          category: selectedCategory,
          projectId: projectId || undefined, // Pass projectId if available
        },
        theme: {
          color: '#2563EB'
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert('Payment failed');
    }
  };

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
                  {typeof Icon === 'string' ? <span className="text-2xl font-bold text-blue-600">{Icon}</span> : <Icon className="h-6 w-6 text-blue-600" />}
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
              <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Amount']} />
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
              <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Donations']} />
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
                    ₹{amount}
                  </button>
                ))}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Custom Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-400">₹</span>
                  <input
                    type="number"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setSelectedAmount(null);
                    }}
                    className="w-full pl-7 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                ₹{selectedAmount || customAmount || '0'}
              </span>
            </div>
            <button onClick={displayRazorpay} className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
              <CreditCard className="h-5 w-5 mr-2" />
              Proceed to Payment
            </button>
          </div>
        </div>
      </div>

      {/* Create New Project Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Target className="h-5 w-5 text-purple-500 mr-2" />
            Propose a New Project
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="projectTitle" className="block text-sm font-medium text-gray-700 mb-1">Project Title</label>
              <input
                type="text"
                id="projectTitle"
                name="title"
                value={newProject.title}
                onChange={handleProjectChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="e.g., Library Renovation"
              />
            </div>
            <div>
              <label htmlFor="projectGoal" className="block text-sm font-medium text-gray-700 mb-1">Funding Goal (₹)</label>
              <input
                type="number"
                id="projectGoal"
                name="goal"
                value={newProject.goal}
                onChange={handleProjectChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="e.g., 500000"
              />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="projectDescription" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              id="projectDescription"
              name="description"
              value={newProject.description}
              onChange={handleProjectChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Describe your project and its impact..."
            ></textarea>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="projectCategory" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                id="projectCategory"
                name="category"
                value={newProject.category}
                onChange={handleProjectChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="education">Education</option>
                <option value="research">Research</option>
                <option value="scholarships">Scholarships</option>
                <option value="sports">Sports</option>
                <option value="campus">Campus Development</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label htmlFor="projectImage" className="block text-sm font-medium text-gray-700 mb-1">Image URL (Optional)</label>
              <input
                type="text"
                id="projectImage"
                name="image"
                value={newProject.image}
                onChange={handleProjectChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 mb-2"
                placeholder="URL to a relevant image"
              />
              <label htmlFor="projectImageFile" className="block text-sm font-medium text-gray-700 mb-1">Or Upload Image (Optional)</label>
              <input
                type="file"
                id="projectImageFile"
                name="imageFile"
                onChange={handleProjectChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                accept="image/*"
              />
            </div>
          </div>
          <button
            onClick={handleCreateProject}
            className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center"
          >
            <Target className="h-5 w-5 mr-2" />
            Submit New Project
          </button>
        </div>
      </div>

      {/* Current Projects */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Current Projects</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
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
                {project.createdBy && (
                  <p className="text-sm text-gray-500 mb-2">by {project.createdBy.name}</p>
                )}
                <p className="text-sm text-gray-600 mb-4">{project.description}</p>
                
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Progress</span>
                    <span className="text-sm text-gray-600">
                      ₹{project.raised.toLocaleString()} of ₹{project.goal.toLocaleString()}
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

                <div className="flex items-center mt-4 space-x-2">
                  <button onClick={() => displayRazorpay(project._id)} className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Donate to This Project
                  </button>
                  {currentUserId && project.createdBy && currentUserId === project.createdBy._id && (
                    <>
                      <button 
                        onClick={() => handleEdit(project)}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteProject(project._id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Project Modal */}
      {showEditModal && editingProject && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
          <div className="bg-white p-8 rounded-xl shadow-lg max-w-2xl w-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Project</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="editTitle" className="block text-sm font-medium text-gray-700 mb-1">Project Title</label>
                <input
                  type="text"
                  id="editTitle"
                  name="title"
                  value={editingProject.title}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="editGoal" className="block text-sm font-medium text-gray-700 mb-1">Funding Goal (₹)</label>
                <input
                  type="number"
                  id="editGoal"
                  name="goal"
                  value={editingProject.goal}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="editDescription" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                id="editDescription"
                name="description"
                value={editingProject.description}
                onChange={handleEditChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="editCategory" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  id="editCategory"
                  name="category"
                  value={editingProject.category || ''}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="education">Education</option>
                  <option value="research">Research</option>
                  <option value="scholarships">Scholarships</option>
                  <option value="sports">Sports</option>
                  <option value="campus">Campus Development</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label htmlFor="editImage" className="block text-sm font-medium text-gray-700 mb-1">Image URL (Optional)</label>
                <input
                  type="text"
                  id="editImage"
                  name="image"
                  value={editingProject.image}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-2"
                  placeholder="URL to a relevant image"
                />
                <label htmlFor="editImageFile" className="block text-sm font-medium text-gray-700 mb-1">Or Upload Image (Optional)</label>
                <input
                  type="file"
                  id="editImageFile"
                  name="imageFile"
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  accept="image/*"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateProject}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
