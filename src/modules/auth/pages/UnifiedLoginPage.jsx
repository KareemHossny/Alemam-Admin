import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FiArrowRight, FiCheckCircle, FiShield, FiTool, FiUserCheck } from 'react-icons/fi';
import { useAuth } from '../../../core/auth/useAuth';
import { ROLE_ORDER, getRoleConfig, getRoleHomePath } from '../../../core/constants/roles';

const ROLE_ICONS = {
  admin: FiShield,
  engineer: FiTool,
  supervisor: FiUserCheck,
};

const UnifiedLoginPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState('admin');
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState('');

  const nextPath = searchParams.get('next');
  const selectedRoleConfig = useMemo(() => getRoleConfig(selectedRole), [selectedRole]);
  const visibleError = localError;

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    setLocalError('');
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setCredentials((previousCredentials) => ({
      ...previousCredentials,
      [name]: value.trim(),
    }));

    if (localError) {
      setLocalError('');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!credentials.email || !credentials.password) {
      setLocalError('Email and password are both required.');
      return;
    }

    setSubmitting(true);
    setLocalError('');

    try {
      const session = await login(selectedRole, credentials);
      const roleHomePath = getRoleHomePath(session.role);
      const redirectTarget = nextPath && nextPath.startsWith(roleHomePath) ? nextPath : roleHomePath;
      navigate(redirectTarget, { replace: true });
    } catch (error) {
      setLocalError(error.response?.data?.message || error.message || 'Login failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-7xl items-center">
      <div className="grid w-full gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/80 shadow-2xl backdrop-blur">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-40"
            style={{ backgroundImage: `url('${selectedRoleConfig.image}')` }}
            aria-hidden="true"
          />
          <div className={`absolute inset-0 bg-gradient-to-br ${selectedRoleConfig.accentClassName} opacity-85`} />
          <div className="relative flex h-full flex-col justify-between gap-8 p-8 text-white sm:p-10 lg:p-12">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20">
                <img src="/OIP (4).webp" alt="Platform logo" className="h-10 w-10 rounded-xl object-cover" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/70">Alemam Platform</p>
                <h1 className="text-lg font-bold">Unified Operations Portal</h1>
              </div>
            </div>

            <div className="max-w-2xl">
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-white/70">{selectedRoleConfig.label}</p>
              <h2 className="text-4xl font-black leading-tight sm:text-5xl">{selectedRoleConfig.headline}</h2>
              <p className="mt-4 max-w-xl text-base leading-7 text-white/85 sm:text-lg">
                {selectedRoleConfig.description}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {ROLE_ORDER.map((role) => {
                const roleConfig = getRoleConfig(role);
                const RoleIcon = ROLE_ICONS[role];
                const isActive = role === selectedRole;

                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => handleRoleChange(role)}
                    className={`rounded-2xl border px-4 py-4 text-left transition-all ${
                      isActive
                        ? 'border-white/60 bg-white/15 shadow-lg shadow-slate-950/20'
                        : 'border-white/10 bg-white/5 hover:border-white/35 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <RoleIcon className="h-5 w-5" />
                      {isActive ? <FiCheckCircle className="h-5 w-5" /> : null}
                    </div>
                    <p className="mt-4 text-lg font-bold">{roleConfig.label}</p>
                    <p className="mt-1 text-sm text-white/75">{roleConfig.routeBase}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white/95 p-8 shadow-2xl backdrop-blur sm:p-10">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">Role-Based Access</p>
            <h3 className="mt-3 text-3xl font-black text-slate-900">Sign in to your workspace</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              One application, one authentication model, and role-locked navigation for every team member.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {visibleError ? (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                {visibleError}
              </div>
            ) : null}

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={credentials.email}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
                placeholder={`${selectedRole}@alemam.com`}
                autoComplete="username"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-semibold text-slate-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={credentials.password}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
                placeholder="Enter your password"
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-3 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? 'Authenticating...' : `Continue as ${selectedRoleConfig.label}`}
              <FiArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="mt-8 grid gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-semibold text-slate-900">Production-grade access model</p>
            <p className="text-sm leading-6 text-slate-600">
              The portal resolves the current role from secure cookies, blocks unauthorized routes, and exposes only the UI for the signed-in role.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default UnifiedLoginPage;
