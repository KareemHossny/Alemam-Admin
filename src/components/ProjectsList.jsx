import React, { useState, useEffect } from 'react';
import { FiBriefcase, FiUsers, FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi';
import { adminAPI } from '../utils/api';
import {useNavigate} from 'react-router-dom'

const ProjectsList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await adminAPI.getProjects();
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setMessage('Error loading projects');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (projectId, projectName) => {
    if (!window.confirm(`Are you sure you want to delete "${projectName}"?`)) {
      return;
    }

    try {
      await adminAPI.deleteProject(projectId);
      setMessage('Project deleted successfully');
      fetchProjects(); // Refresh the list
      
      setTimeout(() => {
        setMessage('');
      }, 3000);
    } catch (error) {
      setMessage('Error deleting project');
    }
  };

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.scopeOfWork.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8 sm:py-12">
        <div className="flex flex-col items-center space-y-3 sm:space-y-4">
          <div className="w-8 h-8 sm:w-12 sm:h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 text-sm sm:text-base">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Projects Management</h1>
          <p className="text-gray-600 text-sm sm:text-base">View and manage all projects</p>
        </div>
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl sm:rounded-2xl flex items-center justify-center text-white shadow-lg flex-shrink-0 self-end sm:self-auto">
          <FiBriefcase className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
      </div>

      {/* Search and Stats */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-lg border border-gray-200/50 p-4 sm:p-6 mb-6 sm:mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1 max-w-md">
            <div className="relative group">
              <input
                type="text"
                placeholder="Search projects by name or scope..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-10 sm:pl-12 border-2 border-gray-200 rounded-xl sm:rounded-2xl transition-all duration-300 bg-white text-gray-800 placeholder-gray-400 group-hover:border-blue-300 shadow-sm focus:border-blue-500 focus:ring-0 focus:outline-none focus:shadow-lg focus:shadow-blue-500/20 text-sm sm:text-base"
              />
              <div className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 transition-transform duration-300 group-hover:scale-110">
                <FiSearch className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              Showing <span className="font-semibold">{filteredProjects.length}</span> of <span className="font-semibold">{projects.length}</span> projects
            </div>
          </div>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl border mb-4 sm:mb-6 ${
          message.includes('successfully') 
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
            : 'bg-rose-50 text-rose-700 border-rose-200'
        }`}>
          <div className="flex items-center space-x-2 sm:space-x-3">
            {message.includes('successfully') ? (
              <FiBriefcase className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
            ) : (
              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-rose-600 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs">!</span>
              </div>
            )}
            <span className="font-semibold text-sm sm:text-base">{message}</span>
          </div>
        </div>
      )}

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-lg border border-gray-200/50 p-8 sm:p-12 text-center">
          <FiBriefcase className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
          <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">No projects found</h3>
          <p className="text-gray-500 text-sm sm:text-base">
            {searchTerm ? 'Try adjusting your search terms' : 'Get started by creating your first project'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project._id}
              className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-lg border border-gray-200/50 p-4 sm:p-6 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
            >
              {/* Project Header */}
              <div className="flex items-start justify-between mb-3 sm:mb-4">
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                    {project.name}
                  </h3>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-sm text-gray-600 space-y-1 sm:space-y-0">
                    <div className="flex items-center space-x-1">
                      <FiUsers className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>{project.engineers?.length || 0} engineers</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FiUsers className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>{project.supervisors?.length || 0} supervisors</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Scope of Work */}
              <div className="mb-3 sm:mb-4">
                <p className="text-gray-600 text-xs sm:text-sm line-clamp-3">
                  {project.scopeOfWork}
                </p>
              </div>

              {/* Assigned Users */}
              <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                {/* Engineers */}
                {project.engineers?.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 sm:mb-2">
                      Engineers
                    </h4>
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      {project.engineers.slice(0, 3).map(engineer => (
                        <span
                          key={engineer._id}
                          className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-lg font-medium"
                        >
                          {engineer.name}
                        </span>
                      ))}
                      {project.engineers.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg font-medium">
                          +{project.engineers.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Supervisors */}
                {project.supervisors?.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 sm:mb-2">
                      Supervisors
                    </h4>
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      {project.supervisors.slice(0, 3).map(supervisor => (
                        <span
                          key={supervisor._id}
                          className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-lg font-medium"
                        >
                          {supervisor.name}
                        </span>
                      ))}
                      {project.supervisors.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg font-medium">
                          +{project.supervisors.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-gray-200/60">
                <button
                  onClick={() => handleDelete(project._id, project.name)}
                  className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 text-rose-700 hover:bg-rose-50 rounded-xl transition-colors duration-200"
                >
                  <FiTrash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="text-xs sm:text-sm font-medium">Delete</span>
                </button>
                
                <button
                  onClick={() => navigate(`/dashboard/update-project/${project._id}`)} 
                  className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 text-blue-700 hover:bg-blue-50 rounded-xl transition-colors duration-200">
                  <FiEdit2 className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="text-xs sm:text-sm font-medium">Edit</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsList;