import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../../utils/api';
import { ADMIN_NAV_ITEMS } from '../../../constants/navigation';
import QuickActionsPanel from '../components/QuickActionsPanel';
import RecentActivityPanel from '../components/RecentActivityPanel';
import StatsOverview from '../components/StatsOverview';
import ErrorState from '../../../../../shared/components/ErrorState';
import getErrorMessage from '../../../../../shared/utils/getErrorMessage';

const EMPTY_STATS = {
  totalUsers: 0,
  totalProjects: 0,
  totalEngineers: 0,
  totalSupervisors: 0,
};

const AdminHomePage = () => {
  const [stats, setStats] = useState(EMPTY_STATS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError('');

      const [users, projects] = await Promise.all([
        adminAPI.getUsers(),
        adminAPI.getProjects(),
      ]);

      setStats({
        totalUsers: users.length,
        totalProjects: projects.length,
        totalEngineers: users.filter((user) => user.role === 'engineer').length,
        totalSupervisors: users.filter((user) => user.role === 'supervisor').length,
      });
    } catch (apiError) {
      setError(getErrorMessage(apiError, 'Unable to load the admin dashboard right now.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="space-y-6 sm:space-y-8 lg:space-y-12">
      {error ? (
        <ErrorState
          title="Dashboard data is unavailable"
          message={error}
          onRetry={fetchStats}
          retryLabel="Reload dashboard"
        />
      ) : (
        <StatsOverview stats={stats} loading={loading} />
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
        <QuickActionsPanel items={ADMIN_NAV_ITEMS.slice(0, 4)} />
        <RecentActivityPanel />
      </div>
    </div>
  );
};

export default AdminHomePage;
