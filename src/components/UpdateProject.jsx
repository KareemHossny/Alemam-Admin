import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiBriefcase, FiSave, FiArrowLeft, FiUsers, FiUserCheck } from 'react-icons/fi';
import { adminAPI } from '../utils/api';

const UpdateProject = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    scopeOfWork: '',
    engineers: [],
    supervisors: []
  });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchProjectData();
    fetchUsers();
  }, [projectId]);

  const fetchProjectData = async () => {
    try {
      const response = await adminAPI.getProjects();
      const project = response.data.find(p => p._id === projectId);
      
      if (project) {
        setFormData({
          name: project.name || '',
          scopeOfWork: project.scopeOfWork || '',
          engineers: project.engineers?.map(e => e._id) || [],
          supervisors: project.supervisors?.map(s => s._id) || []
        });
      } else {
        setMessage('Project not found');
      }
    } catch (error) {
      console.error('Error fetching project:', error);
      setMessage('Error loading project data');
    } finally {
      setFetchLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await adminAPI.getUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await adminAPI.updateProject(projectId, formData);
      setMessage('Project updated successfully!');
      
      setTimeout(() => {
        navigate('/dashboard/projects');
      }, 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error updating project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (message) setMessage('');
  };

  const handleMultiSelect = (e, field) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setFormData({
      ...formData,
      [field]: selectedOptions
    });
    if (message) setMessage('');
  };

  const engineers = users.filter(user => user.role === 'engineer');
  const supervisors = users.filter(user => user.role === 'supervisor');

  if (fetchLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading project data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/dashboard/projects')}
            className="p-3 hover:bg-gray-100 rounded-2xl transition-colors"
          >
            <FiArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Update Project</h1>
            <p className="text-gray-600">Edit project details and assignments</p>
          </div>
        </div>
        <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-green-700 rounded-2xl flex items-center justify-center text-white shadow-lg">
          <FiBriefcase className="w-6 h-6" />
        </div>
      </div>

      {/* Form Card */}
      <div 
        className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-gray-200/50 p-8"
        style={{
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)'
        }}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Success/Error Message */}
          {message && (
            <div className={`p-4 rounded-2xl border ${
              message.includes('successfully') 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                : 'bg-rose-50 text-rose-700 border-rose-200'
            }`}>
              <div className="flex items-center space-x-3">
                {message.includes('successfully') ? (
                  <FiSave className="w-5 h-5 text-emerald-600" />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-rose-600 flex items-center justify-center">
                    <span className="text-white text-xs">!</span>
                  </div>
                )}
                <div>
                  <span className="font-semibold block">
                    {message.includes('successfully') ? 'Success' : 'Error'}
                  </span>
                  <p className="text-sm mt-1">{message}</p>
                </div>
              </div>
            </div>
          )}

          {/* Project Name */}
          <div className="space-y-3">
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700">
              Project Name *
            </label>
            <div className="relative group">
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter project name"
                className="w-full px-4 py-4 pl-12 border-2 border-gray-200 rounded-2xl transition-all duration-300 bg-white text-gray-800 placeholder-gray-400 group-hover:border-blue-300 shadow-sm focus:border-blue-500 focus:ring-0 focus:outline-none focus:shadow-lg focus:shadow-blue-500/20"
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 transition-transform duration-300 group-hover:scale-110">
                <FiBriefcase className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
              </div>
            </div>
          </div>

          {/* Scope of Work */}
          <div className="space-y-3">
            <label htmlFor="scopeOfWork" className="block text-sm font-semibold text-gray-700">
              Scope of Work *
            </label>
            <div className="relative group">
              <textarea
                id="scopeOfWork"
                name="scopeOfWork"
                value={formData.scopeOfWork}
                onChange={handleChange}
                required
                rows="4"
                placeholder="Describe the scope of work for this project..."
                className="w-full px-4 py-4 pl-12 border-2 border-gray-200 rounded-2xl transition-all duration-300 bg-white text-gray-800 placeholder-gray-400 group-hover:border-blue-300 shadow-sm focus:border-blue-500 focus:ring-0 focus:outline-none focus:shadow-lg focus:shadow-blue-500/20 resize-none"
              />
              <div className="absolute left-4 top-4 transition-transform duration-300 group-hover:scale-110">
                <FiUsers className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
              </div>
            </div>
          </div>

          {/* Engineers Selection */}
          <div className="space-y-3">
            <label htmlFor="engineers" className="block text-sm font-semibold text-gray-700">
              Assign Engineers
            </label>
            <div className="relative group">
              <select
                id="engineers"
                name="engineers"
                multiple
                value={formData.engineers}
                onChange={(e) => handleMultiSelect(e, 'engineers')}
                className="w-full px-4 py-4 pl-12 border-2 border-gray-200 rounded-2xl transition-all duration-300 bg-white text-gray-800 group-hover:border-blue-300 shadow-sm focus:border-blue-500 focus:ring-0 focus:outline-none focus:shadow-lg focus:shadow-blue-500/20 appearance-none min-h-[120px]"
              >
                <option value="" disabled>Select engineers...</option>
                {engineers.map(engineer => (
                  <option key={engineer._id} value={engineer._id}>
                    {engineer.name} ({engineer.email})
                  </option>
                ))}
              </select>
              <div className="absolute left-4 top-4 transition-transform duration-300 group-hover:scale-110">
                <FiUsers className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
              </div>
              <div className="absolute right-4 top-4 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            <p className="text-sm text-gray-500">
              Hold Ctrl/Cmd to select multiple engineers. Currently selected: {formData.engineers.length}
            </p>
          </div>

          {/* Supervisors Selection */}
          <div className="space-y-3">
            <label htmlFor="supervisors" className="block text-sm font-semibold text-gray-700">
              Assign Supervisors
            </label>
            <div className="relative group">
              <select
                id="supervisors"
                name="supervisors"
                multiple
                value={formData.supervisors}
                onChange={(e) => handleMultiSelect(e, 'supervisors')}
                className="w-full px-4 py-4 pl-12 border-2 border-gray-200 rounded-2xl transition-all duration-300 bg-white text-gray-800 group-hover:border-blue-300 shadow-sm focus:border-blue-500 focus:ring-0 focus:outline-none focus:shadow-lg focus:shadow-blue-500/20 appearance-none min-h-[120px]"
              >
                <option value="" disabled>Select supervisors...</option>
                {supervisors.map(supervisor => (
                  <option key={supervisor._id} value={supervisor._id}>
                    {supervisor.name} ({supervisor.email})
                  </option>
                ))}
              </select>
              <div className="absolute left-4 top-4 transition-transform duration-300 group-hover:scale-110">
                <FiUserCheck className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
              </div>
              <div className="absolute right-4 top-4 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            <p className="text-sm text-gray-500">
              Hold Ctrl/Cmd to select multiple supervisors. Currently selected: {formData.supervisors.length}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex space-x-4 pt-6">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-4 rounded-2xl shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 text-base tracking-wide focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed group transform hover:scale-[1.02] active:scale-[0.98]"
              style={{
                boxShadow: "0 8px 25px -5px rgba(16, 185, 129, 0.4), 0 4px 6px -2px rgba(16, 185, 129, 0.1)",
              }}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Updating Project...</span>
                </>
              ) : (
                <>
                  <FiSave className="w-5 h-5 transform group-hover:scale-110 transition-transform" />
                  <span>Update Project</span>
                </>
              )}
            </button>
            
            <button
              type="button"
              onClick={() => navigate('/dashboard/projects')}
              className="px-8 py-4 border-2 border-gray-200 text-gray-700 rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProject;