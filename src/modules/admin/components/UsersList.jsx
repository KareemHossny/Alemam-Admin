import React, { useState, useEffect } from 'react';
import { FiUsers, FiUser, FiUserCheck, FiTrash2, FiSearch, FiMail } from 'react-icons/fi';
import { adminAPI } from '../utils/api';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await adminAPI.getUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setMessage('Error loading users');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete user "${userName}"?`)) {
      return;
    }

    try {
      await adminAPI.deleteUser(userId);
      setMessage('User deleted successfully');
      fetchUsers(); // Refresh the list
      
      setTimeout(() => {
        setMessage('');
      }, 3000);
    } catch (error) {
      setMessage('Error deleting user');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role) => {
    const roleStyles = {
      engineer: 'bg-blue-100 text-blue-700',
      supervisor: 'bg-purple-100 text-purple-700'
    };
    
    return (
      <span className={`px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-semibold ${roleStyles[role]}`}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    );
  };

  const getRoleIcon = (role) => {
    return role === 'engineer' ? <FiUser className="w-3 h-3 sm:w-4 sm:h-4" /> : <FiUserCheck className="w-3 h-3 sm:w-4 sm:h-4" />;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8 sm:py-12">
        <div className="flex flex-col items-center space-y-3 sm:space-y-4">
          <div className="w-8 h-8 sm:w-12 sm:h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 text-sm sm:text-base">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Users Management</h1>
          <p className="text-gray-600 text-sm sm:text-base">View and manage all system users</p>
        </div>
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl sm:rounded-2xl flex items-center justify-center text-white shadow-lg flex-shrink-0 self-end sm:self-auto">
          <FiUsers className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
      </div>

      {/* Filters and Stats */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-lg border border-gray-200/50 p-4 sm:p-6 mb-6 sm:mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 flex-1">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 pl-10 sm:pl-12 border-2 border-gray-200 rounded-xl sm:rounded-2xl transition-all duration-300 bg-white text-gray-800 placeholder-gray-400 group-hover:border-blue-300 shadow-sm focus:border-blue-500 focus:ring-0 focus:outline-none focus:shadow-lg focus:shadow-blue-500/20 text-sm sm:text-base"
                />
                <div className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 transition-transform duration-300 group-hover:scale-110">
                  <FiSearch className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                </div>
              </div>
            </div>

            {/* Role Filter */}
            <div className="flex-1 max-w-xs">
              <div className="relative group">
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="w-full px-4 py-3 pl-10 sm:pl-12 border-2 border-gray-200 rounded-xl sm:rounded-2xl transition-all duration-300 bg-white text-gray-800 group-hover:border-blue-300 shadow-sm focus:border-blue-500 focus:ring-0 focus:outline-none focus:shadow-lg focus:shadow-blue-500/20 appearance-none text-sm sm:text-base"
                >
                  <option value="all">All Roles</option>
                  <option value="engineer">Engineers</option>
                  <option value="supervisor">Supervisors</option>
                </select>
                <div className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 transition-transform duration-300 group-hover:scale-110">
                  <FiUsers className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                </div>
                <div className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              Showing <span className="font-semibold">{filteredUsers.length}</span> of <span className="font-semibold">{users.length}</span> users
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
              <FiUsers className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
            ) : (
              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-rose-600 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs">!</span>
              </div>
            )}
            <span className="font-semibold text-sm sm:text-base">{message}</span>
          </div>
        </div>
      )}

      {/* Users Table */}
      {filteredUsers.length === 0 ? (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-lg border border-gray-200/50 p-6 sm:p-8 lg:p-12 text-center">
          <FiUsers className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
          <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">No users found</h3>
          <p className="text-gray-500 text-sm sm:text-base">
            {searchTerm || roleFilter !== 'all' ? 'Try adjusting your search filters' : 'Get started by creating your first user'}
          </p>
        </div>
      ) : (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-lg border border-gray-200/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200/60">
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/60">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50/50 transition-colors duration-200">
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <div className="flex items-center space-x-3 sm:space-x-4">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center text-white font-semibold text-xs sm:text-sm">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800 text-sm sm:text-base">{user.name}</div>
                          <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-gray-500">
                            <FiMail className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>{user.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <div className="flex items-center space-x-2">
                        {getRoleIcon(user.role)}
                        {getRoleBadge(user.role)}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <button
                        onClick={() => handleDelete(user._id, user.name)}
                        className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 text-rose-700 hover:bg-rose-50 rounded-xl transition-colors duration-200"
                      >
                        <FiTrash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="text-xs sm:text-sm font-medium">Delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersList;