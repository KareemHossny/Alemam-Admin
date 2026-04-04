import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiBriefcase, FiSave, FiArrowLeft, FiUsers, FiUserCheck } from 'react-icons/fi';
import { adminAPI, extractProjectPayload } from '../utils/api';

const EMPTY_FORM_DATA = {
  name: '',
  scopeOfWork: '',
  engineers: [],
  supervisors: []
};

const normalizeIdArray = (values = []) => (
  [...new Set(
    values
      .map((value) => (value === undefined || value === null ? '' : String(value).trim()))
      .filter(Boolean)
  )].sort()
);

const arraysEqual = (left = [], right = []) => (
  left.length === right.length && left.every((value, index) => value === right[index])
);

const buildFormDataFromProject = (project) => ({
  name: typeof project?.name === 'string' ? project.name.trim() : '',
  scopeOfWork: typeof project?.scopeOfWork === 'string' ? project.scopeOfWork.trim() : '',
  engineers: normalizeIdArray((project?.engineers || []).map((engineer) => engineer?._id || engineer)),
  supervisors: normalizeIdArray((project?.supervisors || []).map((supervisor) => supervisor?._id || supervisor))
});

const UpdateProject = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [formData, setFormData] = useState(EMPTY_FORM_DATA);
  const [initialFormData, setInitialFormData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        if (!projectId) {
          setMessage('Project ID is missing');
          setInitialFormData(null);
          setFetchLoading(false);
          return;
        }

        const response = await adminAPI.getProjectById(projectId);
        const project = extractProjectPayload(response.data);

        if (!project?._id) {
          setMessage('Project data is unavailable. No changes were loaded.');
          setInitialFormData(null);
          setFormData(EMPTY_FORM_DATA);
          return;
        }

        const normalizedProject = buildFormDataFromProject(project);

        if (!normalizedProject.name.trim() || !normalizedProject.scopeOfWork.trim()) {
          setMessage('Project data is incomplete. Update is disabled to avoid accidental overwrite.');
          setInitialFormData(null);
          setFormData(EMPTY_FORM_DATA);
          return;
        }

        setFormData(normalizedProject);
        setInitialFormData(normalizedProject);
      } catch (error) {
        console.error('Error fetching project:', error);
        setMessage('Error loading project data');
        setInitialFormData(null);
        setFormData(EMPTY_FORM_DATA);
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

    fetchProjectData();
    fetchUsers();
  }, [projectId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!projectId) {
      setMessage('Project ID is missing');
      return;
    }

    if (!initialFormData) {
      setMessage('Project data is unavailable. Refresh before editing.');
      return;
    }

    const normalizedCurrent = {
      name: formData.name.trim(),
      scopeOfWork: formData.scopeOfWork.trim(),
      engineers: normalizeIdArray(formData.engineers),
      supervisors: normalizeIdArray(formData.supervisors)
    };

    if (!normalizedCurrent.name || !normalizedCurrent.scopeOfWork) {
      setMessage('Project name and scope of work are required.');
      return;
    }

    const payload = {};

    if (normalizedCurrent.name !== initialFormData.name) {
      payload.name = normalizedCurrent.name;
    }

    if (normalizedCurrent.scopeOfWork !== initialFormData.scopeOfWork) {
      payload.scopeOfWork = normalizedCurrent.scopeOfWork;
    }

    if (!arraysEqual(normalizedCurrent.engineers, initialFormData.engineers)) {
      payload.engineers = normalizedCurrent.engineers;
    }

    if (!arraysEqual(normalizedCurrent.supervisors, initialFormData.supervisors)) {
      payload.supervisors = normalizedCurrent.supervisors;
    }

    if (Object.keys(payload).length === 0) {
      setMessage('No changes detected.');
      return;
    }

    setLoading(true);

    try {
      await adminAPI.updateProject(projectId, payload);
      setFormData(normalizedCurrent);
      setInitialFormData(normalizedCurrent);
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
    const selectedOptions = normalizeIdArray(Array.from(e.target.selectedOptions, option => option.value));
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
      <div className="flex justify-center items-center py-8 sm:py-12">
        <div className="flex flex-col items-center space-y-3 sm:space-y-4">
          <div className="w-8 h-8 sm:w-12 sm:h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 text-sm sm:text-base">Loading project data...</p>
        </div>
      </div>
    );
  }

  if (!initialFormData) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-lg border border-gray-200/50 p-6 sm:p-8">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Update Project</h1>
              <p className="text-gray-600 text-sm sm:text-base">Project data could not be loaded safely.</p>
            </div>
            <button
              onClick={() => navigate('/dashboard/projects')}
              className="px-4 py-3 border-2 border-gray-200 text-gray-700 rounded-xl sm:rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 font-semibold text-sm sm:text-base"
            >
              Back to Projects
            </button>
          </div>
          <div className="p-4 rounded-xl border bg-rose-50 text-rose-700 border-rose-200 text-sm sm:text-base">
            {message || 'Project data is missing or invalid. Update is blocked to prevent accidental overwrite.'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <button
            onClick={() => navigate('/dashboard/projects')}
            className="p-2 sm:p-3 hover:bg-gray-100 rounded-xl sm:rounded-2xl transition-colors flex-shrink-0"
          >
            <FiArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Update Project</h1>
            <p className="text-gray-600 text-sm sm:text-base">Edit project details and assignments</p>
          </div>
        </div>
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-green-600 to-green-700 rounded-xl sm:rounded-2xl flex items-center justify-center text-white shadow-lg flex-shrink-0 self-end sm:self-auto">
          <FiBriefcase className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
      </div>

      {/* Form Card */}
      <div 
        className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-lg border border-gray-200/50 p-4 sm:p-6 lg:p-8"
        style={{
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)'
        }}
      >
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Success/Error Message */}
          {message && (
            <div className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl border ${
              message.includes('successfully') 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                : 'bg-rose-50 text-rose-700 border-rose-200'
            }`}>
              <div className="flex items-center space-x-2 sm:space-x-3">
                {message.includes('successfully') ? (
                  <FiSave className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                ) : (
                  <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-rose-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs">!</span>
                  </div>
                )}
                <div className="flex-1">
                  <span className="font-semibold block text-sm sm:text-base">
                    {message.includes('successfully') ? 'Success' : 'Error'}
                  </span>
                  <p className="text-xs sm:text-sm mt-1">{message}</p>
                </div>
              </div>
            </div>
          )}

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
            <div className="relative group">
              <select
                id="engineers"
                name="engineers"
                multiple
                value={formData.engineers}
                onChange={(e) => handleMultiSelect(e, 'engineers')}
                className="w-full px-4 py-3 sm:py-4 pl-10 sm:pl-12 border-2 border-gray-200 rounded-xl sm:rounded-2xl transition-all duration-300 bg-white text-gray-800 group-hover:border-blue-300 shadow-sm focus:border-blue-500 focus:ring-0 focus:outline-none focus:shadow-lg focus:shadow-blue-500/20 appearance-none min-h-[100px] sm:min-h-[120px] text-sm sm:text-base"
              >
                <option value="" disabled>Select engineers...</option>
                {engineers.map(engineer => (
                  <option key={engineer._id} value={engineer._id}>
                    {engineer.name} ({engineer.email})
                  </option>
                ))}
              </select>
              <div className="absolute left-3 sm:left-4 top-3 sm:top-4 transition-transform duration-300 group-hover:scale-110">
                <FiUsers className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
              </div>
              <div className="absolute right-3 sm:right-4 top-3 sm:top-4 pointer-events-none">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-gray-500">
              Hold Ctrl/Cmd to select multiple engineers. Currently selected: {formData.engineers.length}
            </p>
          </div>

          {/* Supervisors Selection */}
          <div className="space-y-2 sm:space-y-3">
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
                className="w-full px-4 py-3 sm:py-4 pl-10 sm:pl-12 border-2 border-gray-200 rounded-xl sm:rounded-2xl transition-all duration-300 bg-white text-gray-800 group-hover:border-blue-300 shadow-sm focus:border-blue-500 focus:ring-0 focus:outline-none focus:shadow-lg focus:shadow-blue-500/20 appearance-none min-h-[100px] sm:min-h-[120px] text-sm sm:text-base"
              >
                <option value="" disabled>Select supervisors...</option>
                {supervisors.map(supervisor => (
                  <option key={supervisor._id} value={supervisor._id}>
                    {supervisor.name} ({supervisor.email})
                  </option>
                ))}
              </select>
              <div className="absolute left-3 sm:left-4 top-3 sm:top-4 transition-transform duration-300 group-hover:scale-110">
                <FiUserCheck className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
              </div>
              <div className="absolute right-3 sm:right-4 top-3 sm:top-4 pointer-events-none">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-gray-500">
              Hold Ctrl/Cmd to select multiple supervisors. Currently selected: {formData.supervisors.length}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4 sm:pt-6">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-3 sm:py-4 rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base tracking-wide focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed group transform hover:scale-[1.02] active:scale-[0.98]"
              style={{
                boxShadow: "0 8px 25px -5px rgba(16, 185, 129, 0.4), 0 4px 6px -2px rgba(16, 185, 129, 0.1)",
              }}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Updating Project...</span>
                </>
              ) : (
                <>
                  <FiSave className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:scale-110 transition-transform" />
                  <span>Update Project</span>
                </>
              )}
            </button>
            
            <button
              type="button"
              onClick={() => navigate('/dashboard/projects')}
              className="px-6 sm:px-8 py-3 sm:py-4 border-2 border-gray-200 text-gray-700 rounded-xl sm:rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 font-semibold text-sm sm:text-base"
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
