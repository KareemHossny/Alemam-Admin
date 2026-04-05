import React, { useEffect, useState } from 'react';
import { FiEye, FiCalendar, FiFilter, FiUsers, FiBriefcase, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { adminAPI } from '../utils/api';

const DEFAULT_LIMIT = 20;

const createEmptyTaskView = () => ({
  data: [],
  pagination: {
    total: 0,
    page: 1,
    pages: 0,
    limit: DEFAULT_LIMIT,
  },
  summary: {
    statusCounts: {
      pending: 0,
      done: 0,
      failed: 0,
    },
  },
});

const getMonthRange = (monthValue) => {
  if (!monthValue) {
    return {};
  }

  const [year, month] = monthValue.split('-').map(Number);
  const dateFrom = `${monthValue}-01`;
  const dateTo = new Date(Date.UTC(year, month, 0)).toISOString().split('T')[0];

  return {
    dateFrom,
    dateTo,
  };
};

const buildTaskFilters = ({ activeTab, filter, selectedProject, dateFilter, pageByTab }) => {
  const filters = {
    page: pageByTab[activeTab],
    limit: DEFAULT_LIMIT,
  };

  if (filter !== 'all') {
    filters.status = filter;
  }

  if (selectedProject !== 'all') {
    filters.projectId = selectedProject;
  }

  const activeDateFilter = dateFilter[activeTab];
  if (activeDateFilter) {
    if (activeTab === 'daily') {
      filters.date = activeDateFilter;
    } else {
      Object.assign(filters, getMonthRange(activeDateFilter));
    }
  }

  return filters;
};

const formatStoredDateForDisplay = (task, taskType) => {
  if (taskType === 'daily') {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: 'UTC',
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(task.date));
  }

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(task.date));
};

const TasksManagement = () => {
  const [projects, setProjects] = useState([]);
  const [taskViews, setTaskViews] = useState({
    daily: createEmptyTaskView(),
    monthly: createEmptyTaskView(),
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('daily');
  const [filter, setFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState('all');
  const [dateFilter, setDateFilter] = useState({
    daily: '',
    monthly: '',
  });
  const [pageByTab, setPageByTab] = useState({
    daily: 1,
    monthly: 1,
  });

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await adminAPI.getProjects();
        setProjects(response.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const filters = buildTaskFilters({
          activeTab,
          filter,
          selectedProject,
          dateFilter,
          pageByTab,
        });
        const response =
          activeTab === 'daily'
            ? await adminAPI.getAllDailyTasks(filters)
            : await adminAPI.getAllMonthlyTasks(filters);

        setTaskViews((previous) => ({
          ...previous,
          [activeTab]: response.data,
        }));
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setTaskViews((previous) => ({
          ...previous,
          [activeTab]: createEmptyTaskView(),
        }));
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [activeTab, filter, selectedProject, dateFilter, pageByTab]);

  const currentView = taskViews[activeTab] || createEmptyTaskView();
  const currentTasks = currentView.data || [];
  const currentPagination = currentView.pagination || createEmptyTaskView().pagination;
  const currentSummary = currentView.summary?.statusCounts || createEmptyTaskView().summary.statusCounts;

  const getStatusBadge = (status) => {
    const statusStyles = {
      pending: 'bg-orange-100 text-orange-700',
      done: 'bg-green-100 text-green-700',
      failed: 'bg-rose-100 text-rose-700',
    };

    const statusText = {
      pending: 'Pending',
      done: 'Approved',
      failed: 'Rejected',
    };

    return (
      <span className={`px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-semibold ${statusStyles[status]}`}>
        {statusText[status]}
      </span>
    );
  };

  const getRoleBadge = (role) => {
    const roleStyles = {
      engineer: 'bg-blue-100 text-blue-700',
      supervisor: 'bg-purple-100 text-purple-700',
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${roleStyles[role] || 'bg-gray-100 text-gray-700'}`}>
        {role || 'unknown'}
      </span>
    );
  };

  const handleDateFilterChange = (value) => {
    setDateFilter((previous) => ({
      ...previous,
      [activeTab]: value,
    }));
    setPageByTab((previous) => ({
      ...previous,
      [activeTab]: 1,
    }));
  };

  const handleStatusChange = (value) => {
    setFilter(value);
    setPageByTab((previous) => ({
      ...previous,
      [activeTab]: 1,
    }));
  };

  const handleProjectChange = (value) => {
    setSelectedProject(value);
    setPageByTab((previous) => ({
      ...previous,
      [activeTab]: 1,
    }));
  };

  const clearFilters = () => {
    setDateFilter({ daily: '', monthly: '' });
    setFilter('all');
    setSelectedProject('all');
    setPageByTab({ daily: 1, monthly: 1 });
  };

  const getDateRangeStats = () => {
    const activeDateFilter = dateFilter[activeTab];

    if (!activeDateFilter) {
      return activeTab === 'daily' ? 'All Days' : 'All Months';
    }

    if (activeTab === 'daily') {
      return new Date(`${activeDateFilter}T00:00:00`).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    }

    const [year, month] = activeDateFilter.split('-');
    return new Date(Number(year), Number(month) - 1, 1).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    });
  };

  const selectedProjectName =
    selectedProject === 'all'
      ? ''
      : projects.find((project) => project._id === selectedProject)?.name || 'Selected project';

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8 sm:py-12">
        <div className="flex flex-col items-center space-y-3 sm:space-y-4">
          <div className="w-8 h-8 sm:w-12 sm:h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 text-sm sm:text-base">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Tasks Management</h1>
          <p className="text-gray-600 text-sm sm:text-base">View and monitor all tasks across all projects</p>
        </div>
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl sm:rounded-2xl flex items-center justify-center text-white shadow-lg flex-shrink-0 self-end sm:self-auto">
          <FiEye className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-lg border border-gray-200/50 p-4 sm:p-6 mb-6 sm:mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
            <button
              onClick={() => setActiveTab('daily')}
              className={`px-4 py-3 sm:px-6 sm:py-3 rounded-xl sm:rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center ${
                activeTab === 'daily'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <FiCalendar className="w-4 h-4 mr-2" />
              Daily Tasks ({taskViews.daily.pagination.total})
            </button>
            <button
              onClick={() => setActiveTab('monthly')}
              className={`px-4 py-3 sm:px-6 sm:py-3 rounded-xl sm:rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center ${
                activeTab === 'monthly'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <FiCalendar className="w-4 h-4 mr-2" />
              Monthly Tasks ({taskViews.monthly.pagination.total})
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="relative group flex-1">
              <input
                type={activeTab === 'daily' ? 'date' : 'month'}
                value={dateFilter[activeTab]}
                onChange={(event) => handleDateFilterChange(event.target.value)}
                className="w-full px-4 py-3 pl-10 border-2 border-gray-200 rounded-xl sm:rounded-2xl bg-white text-gray-800 focus:border-blue-500 focus:ring-0 text-sm sm:text-base"
              />
              <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
            </div>

            <div className="relative group flex-1">
              <select
                value={filter}
                onChange={(event) => handleStatusChange(event.target.value)}
                className="w-full px-4 py-3 pl-10 border-2 border-gray-200 rounded-xl sm:rounded-2xl bg-white text-gray-800 focus:border-blue-500 focus:ring-0 appearance-none text-sm sm:text-base"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="done">Approved</option>
                <option value="failed">Rejected</option>
              </select>
              <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
            </div>

            <div className="relative group flex-1">
              <select
                value={selectedProject}
                onChange={(event) => handleProjectChange(event.target.value)}
                className="w-full px-4 py-3 pl-10 border-2 border-gray-200 rounded-xl sm:rounded-2xl bg-white text-gray-800 focus:border-blue-500 focus:ring-0 appearance-none text-sm sm:text-base"
              >
                <option value="all">All Projects</option>
                {projects.map((project) => (
                  <option key={project._id} value={project._id}>
                    {project.name}
                  </option>
                ))}
              </select>
              <FiBriefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
            </div>

            {(dateFilter[activeTab] || filter !== 'all' || selectedProject !== 'all') && (
              <button
                onClick={clearFilters}
                className="px-4 py-3 border-2 border-gray-200 text-gray-700 rounded-xl sm:rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 font-semibold text-sm sm:text-base"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {(dateFilter[activeTab] || filter !== 'all' || selectedProject !== 'all') && (
          <div className="mt-4 p-3 sm:p-4 bg-blue-50 rounded-xl sm:rounded-2xl border border-blue-200">
            <h4 className="text-sm font-semibold text-blue-800 mb-2">Active Filters:</h4>
            <div className="flex flex-wrap gap-2">
              {dateFilter[activeTab] && (
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs sm:text-sm font-medium">
                  Date: {getDateRangeStats()}
                </span>
              )}
              {filter !== 'all' && (
                <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs sm:text-sm font-medium">
                  Status: {filter === 'pending' ? 'Pending' : filter === 'done' ? 'Approved' : 'Rejected'}
                </span>
              )}
              {selectedProject !== 'all' && (
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs sm:text-sm font-medium">
                  Project: {selectedProjectName}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="mb-6 sm:mb-8 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg border border-gray-200/50 p-3 sm:p-4 lg:p-6 text-center">
          <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-1 sm:mb-2">
            {currentPagination.total}
          </div>
          <p className="text-gray-600 font-semibold text-xs sm:text-sm">Filtered Tasks</p>
          <p className="text-xs text-gray-500 mt-1">{getDateRangeStats()}</p>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg border border-gray-200/50 p-3 sm:p-4 lg:p-6 text-center">
          <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-1 sm:mb-2">
            {currentSummary.pending}
          </div>
          <p className="text-gray-600 font-semibold text-xs sm:text-sm">Pending Review</p>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg border border-gray-200/50 p-3 sm:p-4 lg:p-6 text-center">
          <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-1 sm:mb-2">
            {currentSummary.done}
          </div>
          <p className="text-gray-600 font-semibold text-xs sm:text-sm">Approved</p>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg border border-gray-200/50 p-3 sm:p-4 lg:p-6 text-center">
          <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-1 sm:mb-2">
            {currentSummary.failed}
          </div>
          <p className="text-gray-600 font-semibold text-xs sm:text-sm">Rejected</p>
        </div>
      </div>

      <div className="space-y-4">
        {currentTasks.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-lg border border-gray-200/50 p-6 sm:p-8 lg:p-12 text-center">
            <FiEye className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">No Tasks Found</h3>
            <p className="text-gray-500 text-sm sm:text-base">
              No {activeTab} tasks found with the current filters.
            </p>
          </div>
        ) : (
          currentTasks.map((task) => (
            <div
              key={task._id}
              className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-lg border border-gray-200/50 p-4 sm:p-6 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 sm:mb-4 gap-3">
                    <div className="flex-1">
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                        {task.title}
                      </h3>
                      <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-2 sm:gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center space-x-2">
                          <FiBriefcase className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="font-medium text-xs sm:text-sm">{task.project?.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <FiUsers className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="text-xs sm:text-sm">{task.createdBy?.name}</span>
                          {getRoleBadge(task.createdBy?.role)}
                        </div>
                        <div className="flex items-center space-x-2">
                          <FiCalendar className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="text-xs sm:text-sm">
                            {formatStoredDateForDisplay(task, activeTab)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 self-start">
                      {getStatusBadge(task.status)}
                    </div>
                  </div>

                  {task.note && (
                    <div className="mb-3 sm:mb-4 p-3 bg-gray-50 rounded-xl text-xs sm:text-sm break-words">
                      <h4 className="text-xs sm:text-sm font-semibold text-gray-700 mb-1">Engineer Note:</h4>
                      <p className="text-gray-600">{task.note}</p>
                    </div>
                  )}

                  {task.supervisorNote && (
                    <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs sm:text-sm break-words">
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

      {currentPagination.pages > 1 && (
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-4">
          <div className="text-sm text-gray-600">
            Page {currentPagination.page} of {currentPagination.pages}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPageByTab((previous) => ({
                ...previous,
                [activeTab]: Math.max(1, previous[activeTab] - 1),
              }))}
              disabled={currentPagination.page <= 1}
              className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <FiChevronLeft className="w-4 h-4" />
              Previous
            </button>
            <button
              onClick={() => setPageByTab((previous) => ({
                ...previous,
                [activeTab]: Math.min(currentPagination.pages, previous[activeTab] + 1),
              }))}
              disabled={currentPagination.page >= currentPagination.pages}
              className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              Next
              <FiChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TasksManagement;
