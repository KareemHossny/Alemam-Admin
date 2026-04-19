import React, { useState } from 'react';
import { FiUserPlus, FiUser, FiMail, FiLock } from 'react-icons/fi';
import { adminAPI } from '../../../utils/api';
import PageHeader from '../../../../../shared/components/PageHeader';
import StatusBanner from '../../../../../shared/components/StatusBanner';
import SurfaceCard from '../../../../../shared/components/SurfaceCard';

const AddUserPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'engineer'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await adminAPI.createUser(formData);
      setMessage('User created successfully!');
      setFormData({ name: '', email: '', password: '', role: 'engineer' });
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setMessage('');
      }, 3000);
    } catch (error) {
      setMessage(error.message || 'Error creating user. Please try again.');
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

  const isSuccessMessage = message.includes('successfully');

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
      <PageHeader
        title="Add New User"
        description="Create a new user account"
        icon={FiUserPlus}
        backTo="/admin"
      />

      <SurfaceCard>
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <StatusBanner message={message} variant={isSuccessMessage ? 'success' : 'error'} />

          {/* Name Field */}
          <div className="space-y-2 sm:space-y-3">
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700">
              Full Name *
            </label>
            <div className="relative group">
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter full name"
                className="w-full px-4 py-3 sm:py-4 pl-10 sm:pl-12 border-2 border-gray-200 rounded-xl sm:rounded-2xl transition-all duration-300 bg-white text-gray-800 placeholder-gray-400 group-hover:border-blue-300 shadow-sm focus:border-blue-500 focus:ring-0 focus:outline-none focus:shadow-lg focus:shadow-blue-500/20 text-sm sm:text-base"
              />
              <div className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 transition-transform duration-300 group-hover:scale-110">
                <FiUser className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
              </div>
            </div>
          </div>

          {/* Email Field */}
          <div className="space-y-2 sm:space-y-3">
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
              Email Address *
            </label>
            <div className="relative group">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="user@example.com"
                className="w-full px-4 py-3 sm:py-4 pl-10 sm:pl-12 border-2 border-gray-200 rounded-xl sm:rounded-2xl transition-all duration-300 bg-white text-gray-800 placeholder-gray-400 group-hover:border-blue-300 shadow-sm focus:border-blue-500 focus:ring-0 focus:outline-none focus:shadow-lg focus:shadow-blue-500/20 text-sm sm:text-base"
              />
              <div className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 transition-transform duration-300 group-hover:scale-110">
                <FiMail className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
              </div>
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2 sm:space-y-3">
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
              Password *
            </label>
            <div className="relative group">
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter password"
                className="w-full px-4 py-3 sm:py-4 pl-10 sm:pl-12 border-2 border-gray-200 rounded-xl sm:rounded-2xl transition-all duration-300 bg-white text-gray-800 placeholder-gray-400 group-hover:border-blue-300 shadow-sm focus:border-blue-500 focus:ring-0 focus:outline-none focus:shadow-lg focus:shadow-blue-500/20 text-sm sm:text-base"
              />
              <div className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 transition-transform duration-300 group-hover:scale-110">
                <FiLock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
              </div>
            </div>
          </div>

          {/* Role Field */}
          <div className="space-y-2 sm:space-y-3">
            <label htmlFor="role" className="block text-sm font-semibold text-gray-700">
              Role *
            </label>
            <div className="relative group">
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 sm:py-4 pl-10 sm:pl-12 border-2 border-gray-200 rounded-xl sm:rounded-2xl transition-all duration-300 bg-white text-gray-800 group-hover:border-blue-300 shadow-sm focus:border-blue-500 focus:ring-0 focus:outline-none focus:shadow-lg focus:shadow-blue-500/20 appearance-none text-sm sm:text-base"
              >
                <option value="engineer">Engineer</option>
                <option value="supervisor">Supervisor</option>
              </select>
              <div className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 transition-transform duration-300 group-hover:scale-110">
                <FiUser className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
              </div>
              <div className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
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
                  <span>Creating User...</span>
                </>
              ) : (
                <>
                  <FiUserPlus className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:scale-110 transition-transform" />
                  <span>Create User</span>
                </>
              )}
            </button>
            
            <button
              type="button"
              onClick={() => setFormData({ name: '', email: '', password: '', role: 'engineer' })}
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

export default AddUserPage;
