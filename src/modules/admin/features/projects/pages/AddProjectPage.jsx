import React, { useState, useEffect } from 'react';
import { FiBriefcase, FiPlus, FiUsers } from 'react-icons/fi';
import { adminAPI } from '../../../utils/api';
import PageHeader from '../../../../../shared/components/PageHeader';
import SearchableMultiSelect from '../../../../../shared/components/SearchableMultiSelect';
import StatusBanner from '../../../../../shared/components/StatusBanner';
import SurfaceCard from '../../../../../shared/components/SurfaceCard';

const AddProjectPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    scopeOfWork: '',
    engineers: [],
    supervisors: []
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const loadedUsers = await adminAPI.getUsers();
      setUsers(loadedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await adminAPI.createProject(formData);
      setMessage('Project created successfully!');
      setFormData({ name: '', scopeOfWork: '', engineers: [], supervisors: [] });
      
      setTimeout(() => {
        setMessage('');
      }, 3000);
    } catch (error) {
      setMessage(error.message || 'Error creating project. Please try again.');
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

  const handleSelectionChange = (field, values) => {
    setFormData({
      ...formData,
      [field]: values
    });
    if (message) setMessage('');
  };

  const engineers = users.filter(user => user.role === 'engineer');
  const supervisors = users.filter(user => user.role === 'supervisor');
  const engineerOptions = engineers.map((engineer) => ({
    value: engineer._id,
    label: engineer.name,
    description: engineer.email
  }));
  const supervisorOptions = supervisors.map((supervisor) => ({
    value: supervisor._id,
    label: supervisor.name,
    description: supervisor.email
  }));
  const isSuccessMessage = message.includes('successfully');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <PageHeader
        title="Create New Project"
        description="Add a new project to the system"
        icon={FiBriefcase}
        backTo="/admin"
      />

      <SurfaceCard>
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <StatusBanner message={message} variant={isSuccessMessage ? 'success' : 'error'} />

          {/* Project Name */}
          <div className="space-y-2 sm:space-y-3">
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
                className="w-full px-4 py-3 sm:py-4 pl-10 sm:pl-12 border-2 border-gray-200 rounded-xl sm:rounded-2xl transition-all duration-300 bg-white text-gray-800 placeholder-gray-400 group-hover:border-blue-300 shadow-sm focus:border-blue-500 focus:ring-0 focus:outline-none focus:shadow-lg focus:shadow-blue-500/20 text-sm sm:text-base"
              />
              <div className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 transition-transform duration-300 group-hover:scale-110">
                <FiBriefcase className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
              </div>
            </div>
          </div>

          {/* Scope of Work */}
          <div className="space-y-2 sm:space-y-3">
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
                className="w-full px-4 py-3 sm:py-4 pl-10 sm:pl-12 border-2 border-gray-200 rounded-xl sm:rounded-2xl transition-all duration-300 bg-white text-gray-800 placeholder-gray-400 group-hover:border-blue-300 shadow-sm focus:border-blue-500 focus:ring-0 focus:outline-none focus:shadow-lg focus:shadow-blue-500/20 resize-none text-sm sm:text-base"
              />
              <div className="absolute left-3 sm:left-4 top-3 sm:top-4 transition-transform duration-300 group-hover:scale-110">
                <FiUsers className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
              </div>
            </div>
          </div>

          {/* Engineers Selection */}
          <div className="space-y-2 sm:space-y-3">
            <label htmlFor="engineers" className="block text-sm font-semibold text-gray-700">
              Assign Engineers
            </label>
            <SearchableMultiSelect
              id="engineers"
              options={engineerOptions}
              value={formData.engineers}
              onChange={(values) => handleSelectionChange('engineers', values)}
              placeholder="Search engineers by name or email..."
              emptyLabel="No engineers match your search."
              selectedLabel="engineers selected"
            />
            <p className="text-xs sm:text-sm text-gray-500">
              Tap to select multiple engineers. Selected: {formData.engineers.length}
            </p>
          </div>

          {/* Supervisors Selection */}
          <div className="space-y-2 sm:space-y-3">
            <label htmlFor="supervisors" className="block text-sm font-semibold text-gray-700">
              Assign Supervisors
            </label>
            <SearchableMultiSelect
              id="supervisors"
              options={supervisorOptions}
              value={formData.supervisors}
              onChange={(values) => handleSelectionChange('supervisors', values)}
              placeholder="Search supervisors by name or email..."
              emptyLabel="No supervisors match your search."
              selectedLabel="supervisors selected"
            />
            <p className="text-xs sm:text-sm text-gray-500">
              Tap to select multiple supervisors. Selected: {formData.supervisors.length}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4 sm:pt-6">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 sm:py-4 rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base tracking-wide focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed group transform hover:scale-[1.02] active:scale-[0.98]"
              style={{
                boxShadow: "0 8px 25px -5px rgba(59, 130, 246, 0.4), 0 4px 6px -2px rgba(59, 130, 246, 0.1)",
              }}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating Project...</span>
                </>
              ) : (
                <>
                  <FiPlus className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:scale-110 transition-transform" />
                  <span>Create Project</span>
                </>
              )}
            </button>
            
            <button
              type="button"
              onClick={() => setFormData({ name: '', scopeOfWork: '', engineers: [], supervisors: [] })}
              className="px-6 sm:px-8 py-3 sm:py-4 border-2 border-gray-200 text-gray-700 rounded-xl sm:rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 font-semibold text-sm sm:text-base"
            >
              Clear
            </button>
          </div>
        </form>
      </SurfaceCard>
    </div>
  );
};

export default AddProjectPage;
