import React from 'react';
import { Link } from 'react-router-dom';
import {
  FiActivity,
  FiArrowRight,
  FiBarChart2,
  FiCheckCircle,
  FiClipboard,
  FiClock,
  FiCommand,
  FiLayers,
  FiShield,
  FiTool,
  FiUserCheck,
  FiUsers,
} from 'react-icons/fi';
import { useAuth } from '../../../core/auth/useAuth';

const metrics = [
  { value: '3x faster', label: 'review cycles across distributed field teams' },
  { value: 'Live visibility', label: 'from task creation to supervisor approval' },
  { value: 'One workflow', label: 'for admins, engineers, and supervisors' },
];

const problems = [
  {
    title: 'Projects disappear into chat threads',
    description:
      'Daily updates, monthly deliverables, and supervisor notes live in separate places, so no one trusts the latest status.',
  },
  {
    title: 'Managers react too late',
    description:
      'By the time blockers surface, schedules have already slipped and accountability is blurry.',
  },
  {
    title: 'Teams work without a shared operating rhythm',
    description:
      'Admins, engineers, and supervisors each see a different version of progress, which creates friction instead of momentum.',
  },
];

const features = [
  {
    icon: FiLayers,
    title: 'Project command center',
    description:
      'Organize projects, assignments, scope, and delivery status from one structured workspace built for field operations.',
  },
  {
    icon: FiClipboard,
    title: 'Daily and monthly execution tracking',
    description:
      'Capture recurring work with a workflow that keeps logs consistent, searchable, and easy to review.',
  },
  {
    icon: FiUserCheck,
    title: 'Supervisor review pipeline',
    description:
      'Approve, reject, and annotate work with clear review states that keep engineers aligned and accountable.',
  },
  {
    icon: FiBarChart2,
    title: 'Role-aware reporting',
    description:
      'Surface the metrics each role actually needs instead of dumping the same dashboard on everyone.',
  },
  {
    icon: FiShield,
    title: 'Controlled access by role',
    description:
      'Keep each user inside the part of the product that matches their responsibility and authority.',
  },
  {
    icon: FiActivity,
    title: 'Operational clarity at a glance',
    description:
      'Turn task volume, review backlog, and project coverage into signals leaders can act on immediately.',
  },
];

const roles = [
  {
    title: 'Admin',
    accent: 'from-sky-500 via-cyan-400 to-emerald-300',
    icon: FiCommand,
    summary: 'Own the system, structure the work, and keep every project staffed and visible.',
    benefits: [
      'Create users, projects, and assignments without spreadsheet drift',
      'See organization-wide execution without chasing updates manually',
      'Keep delivery standards consistent across every team',
    ],
  },
  {
    title: 'Engineer',
    accent: 'from-amber-400 via-orange-400 to-rose-400',
    icon: FiTool,
    summary: 'Log work fast, stay focused, and make progress visible without administrative overhead.',
    benefits: [
      'Submit daily and monthly task updates in a clean workflow',
      'Track approval status without asking for follow-ups',
      'Work inside a clear project context with less reporting friction',
    ],
  },
  {
    title: 'Supervisor',
    accent: 'from-emerald-400 via-lime-400 to-cyan-300',
    icon: FiUsers,
    summary: 'Review output, unblock teams earlier, and maintain delivery quality with less guesswork.',
    benefits: [
      'Review pending work with project-level context already attached',
      'Leave structured feedback that engineers can act on immediately',
      'Monitor execution quality across every assigned project',
    ],
  },
];

const LandingShell = ({ children }) => (
  <div
    id="top"
    className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.16),transparent_24%),radial-gradient(circle_at_85%_12%,rgba(251,191,36,0.14),transparent_18%),linear-gradient(180deg,#08111f_0%,#0b1324_38%,#f6f7fb_38%,#f6f7fb_100%)] text-slate-900"
  >
    {children}
  </div>
);

const SectionHeading = ({ eyebrow, title, description, align = 'center' }) => (
  <div className={`max-w-3xl ${align === 'center' ? 'mx-auto text-center' : 'text-left'}`}>
    <p className="text-xs font-semibold uppercase tracking-[0.32em] text-cyan-600">{eyebrow}</p>
    <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">{title}</h2>
    <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">{description}</p>
  </div>
);

const LandingPage = () => {
  const { isAuthenticated, homePath } = useAuth();
  const primaryTarget = isAuthenticated ? homePath : '/login';
  const primaryLabel = isAuthenticated ? 'Open Workspace' : 'Request Demo Access';

  return (
    <LandingShell>
      <header className="relative overflow-hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15 backdrop-blur">
              <img src="/alemam-favicon.webp" alt="Alemam" className="h-8 w-8 rounded-xl object-cover" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200/80">Alemam</p>
              <p className="text-sm font-medium text-slate-200">Field Operations Platform</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-300 md:flex">
            <a href="#problem" className="transition hover:text-white">Why it matters</a>
            <a href="#features" className="transition hover:text-white">Capabilities</a>
            <a href="#roles" className="transition hover:text-white">For each role</a>
          </nav>

          <Link
            to={primaryTarget}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/15"
          >
            {primaryLabel}
            <FiArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mx-auto grid max-w-7xl gap-14 px-4 pb-24 pt-10 sm:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:px-8 lg:pb-28 lg:pt-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-300/10 px-4 py-2 text-sm font-medium text-cyan-100 backdrop-blur">
              <FiCheckCircle className="h-4 w-4" />
              Built for field delivery teams that need structure, speed, and accountability
            </div>

            <h1 className="mt-8 text-5xl font-black leading-[0.96] tracking-tight text-white sm:text-6xl lg:text-7xl">
              Run field operations with the clarity of a premium command center.
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-300 sm:text-xl">
              Alemam gives admins, engineers, and supervisors one shared system for project control, task execution,
              and review-driven delivery.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                to={primaryTarget}
                className="inline-flex items-center justify-center gap-3 rounded-2xl bg-white px-6 py-4 text-sm font-bold text-slate-950 transition hover:translate-y-[-1px] hover:bg-cyan-50"
              >
                {primaryLabel}
                <FiArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center justify-center gap-3 rounded-2xl border border-white/15 bg-white/5 px-6 py-4 text-sm font-bold text-white backdrop-blur transition hover:bg-white/10"
              >
                Explore product workflow
              </a>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              {metrics.map((item) => (
                <div key={item.label} className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                  <p className="text-2xl font-black text-white">{item.value}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-x-10 top-8 h-40 rounded-full bg-cyan-400/20 blur-3xl" aria-hidden="true" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/70 p-5 shadow-[0_40px_120px_rgba(8,15,35,0.55)] backdrop-blur-xl sm:p-6">
              <div className="rounded-[1.6rem] border border-white/10 bg-slate-950/80 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200/70">Live Overview</p>
                    <h3 className="mt-2 text-2xl font-black text-white">Operations cockpit</h3>
                  </div>
                  <div className="rounded-2xl bg-emerald-400/15 px-3 py-2 text-xs font-semibold text-emerald-200">
                    Review flow active
                  </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <StatCard label="Active projects" value="24" tone="cyan" />
                  <StatCard label="Pending reviews" value="68" tone="amber" />
                  <StatCard label="On-time completion" value="92%" tone="emerald" />
                  <StatCard label="Assigned engineers" value="41" tone="violet" />
                </div>

                <div className="mt-6 rounded-[1.4rem] border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-white">Project pulse</p>
                      <p className="mt-1 text-sm text-slate-400">See what needs action before it slows delivery.</p>
                    </div>
                    <FiClock className="h-5 w-5 text-cyan-200" />
                  </div>

                  <div className="mt-5 space-y-3">
                    <PulseRow
                      title="Airport utility upgrade"
                      meta="7 engineers - 2 supervisors"
                      status="9 tasks awaiting review"
                      barClassName="from-cyan-400 to-blue-400"
                    />
                    <PulseRow
                      title="North sector maintenance program"
                      meta="Monthly cycle in progress"
                      status="Supervisor feedback sent today"
                      barClassName="from-amber-400 to-orange-400"
                    />
                    <PulseRow
                      title="Power distribution rollout"
                      meta="Admin staffing aligned"
                      status="Healthy execution pace"
                      barClassName="from-emerald-400 to-lime-400"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main>
        <section id="problem" className="px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="The cost of messy operations"
              title="Field teams do not fail because they work slowly. They fail because the workflow is fragmented."
              description="When project assignments, task logs, and supervisor reviews live in disconnected tools, execution becomes reactive. Alemam brings those layers together in a system teams can actually operate from."
            />

            <div className="mt-14 grid gap-6 lg:grid-cols-3">
              {problems.map((item) => (
                <div key={item.title} className="rounded-[1.8rem] border border-slate-200 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
                  <div className="h-12 w-12 rounded-2xl bg-slate-950 text-white flex items-center justify-center">
                    <FiActivity className="h-5 w-5" />
                  </div>
                  <h3 className="mt-6 text-2xl font-black text-slate-950">{item.title}</h3>
                  <p className="mt-3 text-base leading-7 text-slate-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="Core capabilities"
              title="Everything needed to manage projects, execution, and reviews in one premium workflow."
              description="Designed for operational teams that need more than a task list. Alemam aligns structure, accountability, and speed across the whole delivery chain."
            />

            <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {features.map((feature) => {
                const Icon = feature.icon;

                return (
                  <article
                    key={feature.title}
                    className="group rounded-[1.8rem] border border-slate-200 bg-white p-7 shadow-[0_18px_50px_rgba(15,23,42,0.05)] transition hover:-translate-y-1 hover:shadow-[0_30px_70px_rgba(15,23,42,0.08)]"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-white transition group-hover:bg-cyan-600">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-6 text-2xl font-black text-slate-950">{feature.title}</h3>
                    <p className="mt-3 text-base leading-7 text-slate-600">{feature.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section id="roles" className="px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="Role-based value"
              title="One platform, three focused experiences."
              description="Each role sees the tools, metrics, and actions that matter to their responsibility, so the product feels disciplined instead of crowded."
            />

            <div className="mt-14 grid gap-6 lg:grid-cols-3">
              {roles.map((role) => {
                const Icon = role.icon;

                return (
                  <section
                    key={role.title}
                    className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.06)]"
                  >
                    <div className={`h-2 bg-gradient-to-r ${role.accent}`} />
                    <div className="p-8">
                      <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-white">
                          <Icon className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-400">Role</p>
                          <h3 className="text-3xl font-black text-slate-950">{role.title}</h3>
                        </div>
                      </div>

                      <p className="mt-6 text-base leading-7 text-slate-600">{role.summary}</p>

                      <ul className="mt-8 space-y-4">
                        {role.benefits.map((benefit) => (
                          <li key={benefit} className="flex items-start gap-3">
                            <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                              <FiCheckCircle className="h-4 w-4" />
                            </div>
                            <span className="text-sm leading-6 text-slate-700">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </section>
                );
              })}
            </div>
          </div>
        </section>

        <section className="px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="overflow-hidden rounded-[2.25rem] bg-slate-950 p-8 shadow-[0_40px_140px_rgba(15,23,42,0.32)] sm:p-10 lg:p-14">
              <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.32em] text-cyan-200/80">Demo ready</p>
                  <h2 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
                    Show clients a system that feels operationally serious from the first click.
                  </h2>
                  <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
                    Launch a polished workspace experience for admins, engineers, and supervisors with one clear
                    product story and a workflow that looks built for real teams, not for a portfolio screenshot.
                  </p>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row lg:flex-col">
                  <Link
                    to={primaryTarget}
                    className="inline-flex items-center justify-center gap-3 rounded-2xl bg-white px-6 py-4 text-sm font-bold text-slate-950 transition hover:bg-cyan-50"
                  >
                    {primaryLabel}
                    <FiArrowRight className="h-4 w-4" />
                  </Link>
                  <a
                    href="#top"
                    className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-6 py-4 text-sm font-bold text-white transition hover:bg-white/10"
                  >
                    Back to top
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white/70 px-4 py-10 backdrop-blur-sm sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-lg font-black text-slate-950">Alemam</p>
            <p className="mt-1 text-sm text-slate-500">Field operations management for project-driven engineering teams.</p>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-sm font-medium text-slate-600">
            <a href="#problem" className="transition hover:text-slate-950">Problem</a>
            <a href="#features" className="transition hover:text-slate-950">Features</a>
            <a href="#roles" className="transition hover:text-slate-950">Roles</a>
            <Link to={primaryTarget} className="transition hover:text-slate-950">{primaryLabel}</Link>
          </div>
        </div>
      </footer>
    </LandingShell>
  );
};

const StatCard = ({ label, value, tone }) => {
  const toneClasses = {
    cyan: 'from-cyan-400/30 to-blue-400/10 text-cyan-100',
    amber: 'from-amber-400/30 to-orange-400/10 text-amber-100',
    emerald: 'from-emerald-400/30 to-lime-400/10 text-emerald-100',
    violet: 'from-violet-400/30 to-fuchsia-400/10 text-violet-100',
  };

  return (
    <div className={`rounded-[1.35rem] border border-white/10 bg-gradient-to-br ${toneClasses[tone]} p-4`}>
      <p className="text-xs font-semibold uppercase tracking-[0.26em] text-white/55">{label}</p>
      <p className="mt-3 text-3xl font-black text-white">{value}</p>
    </div>
  );
};

const PulseRow = ({ title, meta, status, barClassName }) => (
  <div className="rounded-[1.2rem] border border-white/10 bg-slate-900/80 p-4">
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-semibold text-white">{title}</p>
        <p className="mt-1 text-sm text-slate-400">{meta}</p>
      </div>
      <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-slate-300">{status}</span>
    </div>
    <div className="mt-4 h-2 rounded-full bg-white/5">
      <div className={`h-full rounded-full bg-gradient-to-r ${barClassName}`} />
    </div>
  </div>
);

export default LandingPage;
