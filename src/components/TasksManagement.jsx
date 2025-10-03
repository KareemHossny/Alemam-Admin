import React, { useState, useEffect } from 'react';
import { FiEye, FiCalendar, FiFilter, FiUsers, FiBriefcase } from 'react-icons/fi';
import { adminAPI } from '../utils/api';

const TasksManagement = () => {
  const [tasks, setTasks] = useState({
    daily: [],
    monthly: []
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('daily');
  const [filter, setFilter] = useState('all'); // all, pending, done, failed
  const [selectedProject, setSelectedProject] = useState('all');
  const [dateFilter, setDateFilter] = useState({
    daily: '',
    monthly: ''
  });

  useEffect(() => {
    fetchAllTasks();
  }, []);

  const fetchAllTasks = async () => {
    try {
      setLoading(true);
      const [dailyResponse, monthlyResponse] = await Promise.all([
        adminAPI.getAllDailyTasks(),
        adminAPI.getAllMonthlyTasks()
      ]);

      setTasks({
        daily: dailyResponse.data,
        monthly: monthlyResponse.data
      });
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      pending: 'bg-orange-100 text-orange-700',
      done: 'bg-green-100 text-green-700',
      failed: 'bg-rose-100 text-rose-700'
    };

    const statusText = {
      pending: 'Pending',
      done: 'Approved',
      failed: 'Rejected'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[status]}`}>
        {statusText[status]}
      </span>
    );
  };

  const getRoleBadge = (role) => {
    const roleStyles = {
      engineer: 'bg-blue-100 text-blue-700',
      supervisor: 'bg-purple-100 text-purple-700'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${roleStyles[role]}`}>
        {role}
      </span>
    );
  };

  const handleDateFilterChange = (value) => {
    setDateFilter(prev => ({
      ...prev,
      [activeTab]: value
    }));
  };

  const filteredTasks = tasks[activeTab].filter(task => {
    const statusMatch = filter === 'all' || task.status === filter;
    const projectMatch = selectedProject === 'all' || task.project?._id === selectedProject;
    
    // Date filter logic
    let dateMatch = true;
    const currentDateFilter = dateFilter[activeTab];
    
    if (currentDateFilter) {
      if (activeTab === 'daily') {
        // For daily tasks, compare by date only (ignore time)
        const taskDate = new Date(task.createdAt).toISOString().split('T')[0];
        dateMatch = taskDate === currentDateFilter;
      } else {
        // For monthly tasks, compare by month only
        const taskMonth = new Date(task.date).toISOString().substring(0, 7);
        dateMatch = taskMonth === currentDateFilter;
      }
    }
    
    return statusMatch && projectMatch && dateMatch;
  });

  const uniqueProjects = [...new Set(tasks.daily.concat(tasks.monthly)
    .map(task => task.project?._id)
    .filter(Boolean))];

  // Get date range for statistics
  const getDateRangeStats = () => {
    const currentDateFilter = dateFilter[activeTab];
    if (!currentDateFilter) {
      return `All ${activeTab === 'daily' ? 'Days' : 'Months'}`;
    }

    if (activeTab === 'daily') {
      return new Date(currentDateFilter).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } else {
      const [year, month] = currentDateFilter.split('-');
      return new Date(year, month - 1).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long'
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading all tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Tasks Management</h1>
          <p className="text-gray-600">View and monitor all tasks across all projects</p>
        </div>
        <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center text-white shadow-lg">
          <FiEye className="w-6 h-6" />
        </div>
      </div>

      {/* Filters and Tabs */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-gray-200/50 p-6 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Tabs */}
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab('daily')}
              className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                activeTab === 'daily'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <FiCalendar className="w-4 h-4 inline mr-2" />
              Daily Tasks ({tasks.daily.length})
            </button>
            <button
              onClick={() => setActiveTab('monthly')}
              className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                activeTab === 'monthly'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <FiCalendar className="w-4 h-4 inline mr-2" />
              Monthly Tasks ({tasks.monthly.length})
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Date Filter */}
            <div className="relative group">
              <input
                type={activeTab === 'daily' ? 'date' : 'month'}
                value={dateFilter[activeTab]}
                onChange={(e) => handleDateFilterChange(e.target.value)}
                className="px-4 py-3 pl-10 border-2 border-gray-200 rounded-2xl bg-white text-gray-800 focus:border-blue-500 focus:ring-0 w-full"
                placeholder={activeTab === 'daily' ? 'Select date' : 'Select month'}
              />
              <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>

            {/* Status Filter */}
            <div className="relative group">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-3 pl-10 border-2 border-gray-200 rounded-2xl bg-white text-gray-800 focus:border-blue-500 focus:ring-0 appearance-none"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="done">Approved</option>
                <option value="failed">Rejected</option>
              </select>
              <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>

            {/* Project Filter */}
            <div className="relative group">
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="px-4 py-3 pl-10 border-2 border-gray-200 rounded-2xl bg-white text-gray-800 focus:border-blue-500 focus:ring-0 appearance-none"
              >
                <option value="all">All Projects</option>
                {uniqueProjects.map(projectId => {
                  const project = tasks.daily.find(t => t.project?._id === projectId)?.project || 
                                tasks.monthly.find(t => t.project?._id === projectId)?.project;
                  return (
                    <option key={projectId} value={projectId}>
                      {project?.name}
                    </option>
                  );
                })}
              </select>
              <FiBriefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>

            {/* Clear Filters Button */}
            {(dateFilter[activeTab] || filter !== 'all' || selectedProject !== 'all') && (
              <button
                onClick={() => {
                  setDateFilter({ daily: '', monthly: '' });
                  setFilter('all');
                  setSelectedProject('all');
                }}
                className="px-4 py-3 border-2 border-gray-200 text-gray-700 rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 font-semibold"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Active Filters Display */}
        {(dateFilter[activeTab] || filter !== 'all' || selectedProject !== 'all') && (
          <div className="mt-4 p-4 bg-blue-50 rounded-2xl border border-blue-200">
            <h4 className="text-sm font-semibold text-blue-800 mb-2">Active Filters:</h4>
            <div className="flex flex-wrap gap-2">
              {dateFilter[activeTab] && (
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  📅 {getDateRangeStats()}
                </span>
              )}
              {filter !== 'all' && (
                <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                  Status: {filter === 'pending' ? 'Pending' : filter === 'done' ? 'Approved' : 'Rejected'}
                </span>
              )}
              {selectedProject !== 'all' && (
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  Project: {tasks.daily.find(t => t.project?._id === selectedProject)?.project?.name || 
                           tasks.monthly.find(t => t.project?._id === selectedProject)?.project?.name}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Tasks Summary */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-gray-200/50 p-6 text-center">
          <div className="text-2xl font-bold text-gray-800 mb-2">
            {filteredTasks.length}
          </div>
          <p className="text-gray-600 font-semibold">Filtered Tasks</p>
          <p className="text-sm text-gray-500 mt-1">{getDateRangeStats()}</p>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-gray-200/50 p-6 text-center">
          <div className="text-2xl font-bold text-gray-800 mb-2">
            {filteredTasks.filter(t => t.status === 'pending').length}
          </div>
          <p className="text-gray-600 font-semibold">Pending Review</p>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-gray-200/50 p-6 text-center">
          <div className="text-2xl font-bold text-gray-800 mb-2">
            {filteredTasks.filter(t => t.status === 'done').length}
          </div>
          <p className="text-gray-600 font-semibold">Approved</p>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-gray-200/50 p-6 text-center">
          <div className="text-2xl font-bold text-gray-800 mb-2">
            {filteredTasks.filter(t => t.status === 'failed').length}
          </div>
          <p className="text-gray-600 font-semibold">Rejected</p>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-gray-200/50 p-12 text-center">
            <FiEye className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Tasks Found</h3>
            <p className="text-gray-500">
              No {activeTab} tasks found with the current filters.
            </p>
            {(dateFilter[activeTab] || filter !== 'all' || selectedProject !== 'all') && (
              <button
                onClick={() => {
                  setDateFilter({ daily: '', monthly: '' });
                  setFilter('all');
                  setSelectedProject('all');
                }}
                className="mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl transition-colors font-semibold"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task._id}
              className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-gray-200/50 p-6 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        {task.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center space-x-2">
                          <FiBriefcase className="w-4 h-4" />
                          <span className="font-medium">{task.project?.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <FiUsers className="w-4 h-4" />
                          <span>{task.createdBy?.name}</span>
                          {getRoleBadge(task.createdBy?.role)}
                        </div>
                        <div className="flex items-center space-x-2">
                          <FiCalendar className="w-4 h-4" />
                          <span>
                            {activeTab === 'daily' 
                              ? new Date(task.createdAt).toLocaleDateString('en-US', {
                                  weekday: 'short',
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })
                              : new Date(task.date).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long'
                                })
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(task.status)}
                    </div>
                  </div>

                  {task.note && (
                    <div className="mb-4 p-3 sm:p-4 bg-gray-50 rounded-xl text-xs sm:text-sm break-words">
                      <h4 className="text-xs sm:text-sm font-semibold text-gray-700 mb-1">Engineer Note:</h4>
                      <p className="text-gray-600">{task.note}</p>
                    </div>
                  )}

                  {task.supervisorNote && (
                    <div className="p-3 sm:p-4 bg-blue-50 rounded-xl border border-blue-200 text-xs sm:text-sm break-words">
                      <h4 className="text-xs sm:text-sm font-semibold text-blue-800 mb-1">
                        Supervisor Feedback:
                        {task.reviewedBy && ` (by ${task.reviewedBy?.name})`}
                      </h4>
                      <p className="text-blue-700">{task.supervisorNote}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TasksManagement;