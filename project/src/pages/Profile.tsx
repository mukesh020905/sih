import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { 
  User as UserIcon, 
  Mail, 
  Link as LinkIcon, 
  Linkedin, 
  Github, 
  Twitter, 
  Briefcase, 
  BookOpen, 
  Code, 
  Award, 
  Heart, 
  Edit3, 
  Camera,
  Save,
  X,
  Loader
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Experience {
  title: string;
  company: string;
  location?: string;
  from: string;
  to?: string;
  current?: boolean;
  description?: string;
}

interface Education {
  degree: string;
  institution: string;
  fieldOfStudy?: string;
  from: string;
  to?: string;
  current?: boolean;
  description?: string;
}

interface Project {
  title: string;
  description: string;
  projectUrl?: string;
  githubUrl?: string;
}

interface ProfileData {
  name?: string;
  email?: string;
  headline?: string;
  bio?: string;
  website?: string;
  linkedin?: string;
  github?: string;
  twitter?: string;
  skills?: string; // Comma-separated string for editing
  experience?: string; // JSON string for editing
  education?: string; // JSON string for editing
  projects?: string; // JSON string for editing
  certifications?: string; // Comma-separated string for editing
  interests?: string; // Comma-separated string for editing
}

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  profilePicture?: string;
  date: string;
  headline?: string;
  bio?: string;
  website?: string;
  linkedin?: string;
  github?: string;
  twitter?: string;
  skills?: string[];
  experience?: Experience[];
  education?: Education[];
  projects?: Project[];
  certifications?: string[];
  interests?: string[];
}

export const Profile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const navigate = useNavigate();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProfileData>();

  const fetchUserProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const res = await fetch('http://localhost:5000/api/profile/me', {
        headers: {
          'x-auth-token': token,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setUserProfile(data);
        reset({
          name: data.name || '',
          email: data.email || '',
          headline: data.headline || '',
          bio: data.bio || '',
          website: data.website || '',
          linkedin: data.linkedin || '',
          github: data.github || '',
          twitter: data.twitter || '',
          skills: data.skills ? data.skills.join(', ') : '',
          experience: data.experience ? data.experience.map(exp => `${exp.title} at ${exp.company}`).join('\n') : '',
          education: data.education ? data.education.map(edu => `${edu.degree} in ${edu.fieldOfStudy}`).join('\n') : '',
          projects: data.projects ? data.projects.map(proj => proj.title).join('\n') : '',
          certifications: data.certifications ? data.certifications.join(', ') : '',
          interests: data.interests ? data.interests.join(', ') : '',
        });
      } else {
        setError(data.msg || 'Failed to fetch profile');
        if (res.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
    } catch (err) {
      console.error(err);
      setError('Server error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePictureFile(e.target.files[0]);
    }
  };

  const handleProfilePictureUpload = async () => {
    if (!profilePictureFile) return;

    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const formData = new FormData();
      formData.append('profilePicture', profilePictureFile);

      const res = await fetch('http://localhost:5000/api/profile/picture', {
        method: 'POST',
        headers: {
          'x-auth-token': token,
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        console.log('Profile picture uploaded', data);
        fetchUserProfile(); // Re-fetch profile to update picture
        setProfilePictureFile(null);
      } else {
        setError(data.msg || 'Failed to upload profile picture');
      }
    } catch (err) {
      console.error(err);
      setError('Server error');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: ProfileData) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const parsedData: any = { ...data };

      const res = await fetch('http://localhost:5000/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify(parsedData),
      });

      const responseData = await res.json();

      if (res.ok) {
        console.log('Profile updated:', responseData);
        setUserProfile(responseData);
        setIsEditing(false);
      } else {
        setError(responseData.msg || 'Failed to update profile');
      }
    } catch (err) {
      console.error(err);
      setError('Server error');
    } finally {
      setLoading(false);
    }
  };


  if (loading && !userProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="animate-spin h-10 w-10 text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        <p>No profile data available. Please log in.</p>
      </div>
    );
  }

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return null;
    }
    return date.toLocaleDateString();
  };

  const formatDateRange = (from: string, to: string | undefined, current: boolean | undefined) => {
    const fromDate = formatDate(from);
    const toDate = current ? 'Present' : formatDate(to);

    if (fromDate && toDate) {
      return `${fromDate} - ${toDate}`;
    }
    if (fromDate) {
      return fromDate;
    }
    if (toDate) {
      return toDate;
    }
    return '';
  };

  const profileImageUrl = userProfile.profilePicture 
    ? `http://localhost:5000${userProfile.profilePicture}` 
    : 'https://via.placeholder.com/150'; // Default placeholder

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="relative h-32 bg-gradient-to-r from-blue-500 to-blue-600">
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        </div>

        {/* Profile Content */}
        <div className="relative px-6 pb-6">
          {/* Profile Picture */}
          <div className="flex justify-between items-start -mt-16 mb-6">
            <div className="relative">
              <div className="w-32 h-32 bg-white rounded-full p-2 shadow-lg">
                <img 
                  src={profileImageUrl}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              {isEditing && (
                <label htmlFor="profilePictureInput" className="absolute bottom-2 right-2 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors cursor-pointer">
                  <Camera className="h-4 w-4" />
                  <input 
                    id="profilePictureInput"
                    type="file" 
                    accept="image/*" 
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              )}
              {profilePictureFile && isEditing && (
                <button
                  onClick={handleProfilePictureUpload}
                  className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-3 py-1 bg-green-500 text-white text-xs rounded-md hover:bg-green-600"
                >
                  Upload
                </button>
              )}
            </div>

            <div className="mt-16">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit3 className="h-4 w-4" />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSubmit(onSubmit)}
                    className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    <Save className="h-4 w-4" />
                    <span>Save</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      reset({
                        name: userProfile.name || '',
                        email: userProfile.email || '',
                        headline: userProfile.headline || '',
                        bio: userProfile.bio || '',
                        website: userProfile.website || '',
                        linkedin: userProfile.linkedin || '',
                        github: userProfile.github || '',
                        twitter: userProfile.twitter || '',
                        skills: userProfile.skills ? userProfile.skills.join(', ') : '',
                        experience: userProfile.experience ? userProfile.experience.map(exp => `${exp.title} at ${exp.company}`).join('\n') : '',
                        education: userProfile.education ? userProfile.education.map(edu => `${edu.degree} in ${edu.fieldOfStudy}`).join('\n') : '',
                        projects: userProfile.projects ? userProfile.projects.map(proj => proj.title).join('\n') : '',
                        certifications: userProfile.certifications ? userProfile.certifications.join(', ') : '',
                        interests: userProfile.interests ? userProfile.interests.join(', ') : '',
                      });
                      setProfilePictureFile(null);
                    }}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <X className="h-4 w-4" />
                    <span>Cancel</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Profile Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      {...register('name')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{userProfile.name}</p>
                  )}
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="h-4 w-4 inline mr-1" />
                    Email
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      {...register('email')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{userProfile.email}</p>
                  )}
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Professional Summary */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Professional Summary</h2>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Headline
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      {...register('headline')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Full-stack Developer | AI Enthusiast"
                    />
                  ) : (
                    <p className="text-gray-900">{userProfile.headline}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  {isEditing ? (
                    <textarea
                      {...register('bio')}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Tell us about yourself..."
                    />
                  ) : (
                    <p className="text-gray-700 whitespace-pre-wrap">{userProfile.bio}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Social Links</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <LinkIcon className="h-4 w-4 inline mr-1" />
                    Website
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      {...register('website')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Your personal website URL"
                    />
                  ) : (
                    userProfile.website ? <a href={userProfile.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{userProfile.website}</a> : <p className="text-gray-900">N/A</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Linkedin className="h-4 w-4 inline mr-1" />
                    LinkedIn
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      {...register('linkedin')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Your LinkedIn profile URL"
                    />
                  ) : (
                    userProfile.linkedin ? <a href={userProfile.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{userProfile.linkedin}</a> : <p className="text-gray-900">N/A</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Github className="h-4 w-4 inline mr-1" />
                    GitHub
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      {...register('github')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Your GitHub profile URL"
                    />
                  ) : (
                    userProfile.github ? <a href={userProfile.github} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{userProfile.github}</a> : <p className="text-gray-900">N/A</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Twitter className="h-4 w-4 inline mr-1" />
                    Twitter
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      {...register('twitter')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Your Twitter profile URL"
                    />
                  ) : (
                    userProfile.twitter ? <a href={userProfile.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{userProfile.twitter}</a> : <p className="text-gray-900">N/A</p>
                  )}
                </div>
              </div>
            </div>

            {/* Skills */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Skills</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Code className="h-4 w-4 inline mr-1" />
                  Skills (comma-separated)
                </label>
                {isEditing ? (
                  <textarea
                    {...register('skills')}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., React, Node.js, MongoDB, Python"
                  />
                ) : (
                  userProfile.skills && userProfile.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {userProfile.skills.map((skill, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-900">No skills added</p>
                  )
                )}
              </div>
            </div>

            {/* Experience */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Experience</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Briefcase className="h-4 w-4 inline mr-1" />
                  Experience
                </label>
                {isEditing ? (
                  <textarea
                    {...register('experience')}
                    rows={8}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                    placeholder="Enter your experience"
                  />
                ) : (
                  userProfile.experience && userProfile.experience.length > 0 ? (
                    <div className="space-y-4">
                      {userProfile.experience.map((exp, index) => (
                        <div key={index} className="border-l-4 border-blue-500 pl-4">
                          <h3 className="text-lg font-semibold text-gray-900">{exp.title} at {exp.company}</h3>
                          <p className="text-gray-700 text-sm">{exp.location} {formatDateRange(exp.from, exp.to, exp.current)}</p>
                          {exp.description && <p className="text-gray-600 mt-1">{exp.description}</p>}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-900">No experience added</p>
                  )
                )}
              </div>
            </div>

            {/* Education */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Education</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <BookOpen className="h-4 w-4 inline mr-1" />
                  Education
                </label>
                {isEditing ? (
                  <textarea
                    {...register('education')}
                    rows={8}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                    placeholder="Enter your education details"
                  />
                ) : (
                  userProfile.education && userProfile.education.length > 0 ? (
                    <div className="space-y-4">
                      {userProfile.education.map((edu, index) => (
                        <div key={index} className="border-l-4 border-green-500 pl-4">
                          <h3 className="text-lg font-semibold text-gray-900">{edu.degree} in {edu.fieldOfStudy}</h3>
                          <p className="text-gray-700 text-sm">{edu.institution} {formatDateRange(edu.from, edu.to, edu.current)}</p>
                          {edu.description && <p className="text-gray-600 mt-1">{edu.description}</p>}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-900">No education added</p>
                  )
                )}
              </div>
            </div>

            {/* Projects */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Projects</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Code className="h-4 w-4 inline mr-1" />
                  Projects
                </label>
                {isEditing ? (
                  <textarea
                    {...register('projects')}
                    rows={8}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                    placeholder="Enter your project details"
                  />
                ) : (
                  userProfile.projects && userProfile.projects.length > 0 ? (
                    <div className="space-y-4">
                      {userProfile.projects.map((proj, index) => (
                        <div key={index} className="border-l-4 border-purple-500 pl-4">
                          <h3 className="text-lg font-semibold text-gray-900">{proj.title}</h3>
                          <p className="text-gray-600 mt-1">{proj.description}</p>
                          <div className="flex space-x-2 mt-1">
                            {proj.projectUrl && <a href={proj.projectUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">Live Demo</a>}
                            {proj.githubUrl && <a href={proj.githubUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">GitHub</a>}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-900">No projects added</p>
                  )
                )}
              </div>
            </div>

            {/* Certifications */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Certifications</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Award className="h-4 w-4 inline mr-1" />
                  Certifications (comma-separated)
                </label>
                {isEditing ? (
                  <textarea
                    {...register('certifications')}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., AWS Certified Developer, Google Cloud Architect"
                  />
                ) : (
                  userProfile.certifications && userProfile.certifications.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {userProfile.certifications.map((cert, index) => (
                        <span key={index} className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
                          {cert}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-900">No certifications added</p>
                  )
                )}
              </div>
            </div>

            {/* Interests */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Interests</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Heart className="h-4 w-4 inline mr-1" />
                  Interests (comma-separated)
                </label>
                {isEditing ? (
                  <textarea
                    {...register('interests')}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Machine Learning, Open Source, Photography"
                  />
                ) : (
                  userProfile.interests && userProfile.interests.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {userProfile.interests.map((interest, index) => (
                        <span key={index} className="px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full">
                          {interest}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-900">No interests added</p>
                  )
                )}
              </div>
            </div>

            {/* Member Since (Static) */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Other Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Member Since
                  </label>
                  <p className="text-gray-900">{new Date(userProfile.date).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
