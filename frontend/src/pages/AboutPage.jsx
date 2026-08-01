import React from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  BrainCircuit,
  Cpu,
  Database,
  Code2,
  GitBranch,
  Globe,
  Users,
  CalendarDays,
  ShieldCheck,
  Rocket,
  Layers,
  Monitor,
  BadgeCheck
} from 'lucide-react';

const techGroups = [
  {
    title: 'Frontend',
    items: ['React', 'Vite', 'HTML', 'CSS', 'JavaScript'],
    icon: Monitor,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    title: 'Backend',
    items: ['FastAPI', 'Python', 'SQLite'],
    icon: Layers,
    color: 'from-indigo-500 to-violet-500'
  },
  {
    title: 'Machine Learning',
    items: ['Scikit-learn', 'TF-IDF', 'NLP', 'Joblib'],
    icon: BrainCircuit,
    color: 'from-purple-500 to-fuchsia-500'
  },
  {
    title: 'Tools',
    items: ['Git', 'GitHub', 'VS Code'],
    icon: Code2,
    color: 'from-emerald-500 to-teal-500'
  }
];

const members = [
  {
    name: 'Priyanka Priyadarsini Sethi',
    role: 'Frontend Developer',
    responsibilities: ['Designed Home Page', 'Designed Login & Registration', 'Developed News Input Page', 'Designed Prediction Result Page', 'Implemented Responsive UI', 'Worked with HTML CSS Bootstrap React'],
    github: 'https://github.com/priyankapriyadarsini2004',
    linkedin: 'https://www.linkedin.com/in/priyanka-pr-sethi/'
  },
  {
    name: 'Rutuparna Pattnaik',
    role: 'Backend Developer',
    responsibilities: ['FastAPI Backend', 'User Authentication', 'Frontend Backend Integration', 'History Management', 'API Development'],
    github: 'https://github.com/Rutuparna61',
    linkedin: 'https://www.linkedin.com/in/rutuparna-pattanaik-607556294/'
  },
  {
    name: 'Dibya Prakash Nayak',
    role: 'AI / Machine Learning Engineer',
    responsibilities: ['Dataset Collection', 'Data Cleaning', 'TF-IDF Feature Engineering', 'Machine Learning Model Training', 'Fake News Prediction Model'],
    github: 'https://github.com/Dibya777',
    linkedin: 'https://www.linkedin.com/in/dibya-prakash-nayak/'
  },
  {
    name: 'Ashutosh Pradhan',
    role: 'Database, Testing & Documentation',
    responsibilities: ['Database Management', 'Testing', 'GitHub Repository', 'Documentation', 'Project Deployment'],
    github: 'https://github.com/Ashu8297',
    linkedin: 'https://www.linkedin.com/in/ashutosh-pradhan-75bb613b2/'
  }
];

const highlights = [
  'AI Based Fake News Detection',
  'Machine Learning',
  'Natural Language Processing',
  'FastAPI Backend',
  'React Frontend',
  'SQLite Database',
  'Prediction History',
  'User Authentication',
  'Modern Dashboard',
  'Responsive Design'
];

function SocialLink({ href, label, icon: Icon }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold text-slate-100 transition hover:bg-white/20"
    >
      <Icon className="h-4 w-4" />
      {label}
    </a>
  );
}

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8 py-4">
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative overflow-hidden rounded-[2rem] border border-white/20 bg-slate-900/70 p-8 shadow-2xl shadow-blue-950/30 backdrop-blur-xl"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.28),_transparent_40%),radial-gradient(circle_at_bottom_right,_rgba(147,51,234,0.24),_transparent_45%)]" />
        <div className="relative z-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-blue-300">
              <Sparkles className="h-4 w-4" />
              TruthLens AI
            </div>
            <div className="space-y-3">
              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                AI Powered Fake News Detection Platform
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-300">
                TruthLens AI is an Artificial Intelligence based Fake News Detection Platform developed to identify whether a news article is Real or Fake using Machine Learning and Natural Language Processing techniques.
              </p>
            </div>
            <p className="text-sm leading-7 text-slate-400">
              The project was developed during the Microsoft Nirmaan 3-Month Internship Program conducted at Gandhi Institute of Technology and Management (GITAM), Bhubaneswar.
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-6 shadow-lg backdrop-blur">
            <div className="flex items-center gap-3 text-blue-200">
              <CalendarDays className="h-5 w-5" />
              <span className="text-sm font-semibold uppercase tracking-[0.2em]">Internship Timeline</span>
            </div>
            <div className="mt-4 space-y-4">
              <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Start Date</p>
                <p className="mt-1 text-lg font-semibold text-white">25 March 2026</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-400">End Date</p>
                <p className="mt-1 text-lg font-semibold text-white">3 Aug 2026</p>
              </div>
              <div className="rounded-2xl border border-cyan-400/20 bg-cyan-500/10 p-4">
                <p className="text-xs uppercase tracking-[0.25em] text-cyan-300">Mentorship</p>
                <p className="mt-1 text-sm font-semibold text-cyan-100">Guided by Mihir Sir and developed collaboratively by THE CODER.</p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <section className="grid gap-6 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08, duration: 0.4 }} className="rounded-[1.5rem] border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-gradient-to-tr from-blue-500 to-cyan-500 p-2 text-white">
              <Cpu className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Technology Stack</h2>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {techGroups.map((group) => {
              const Icon = group.icon;
              return (
                <div key={group.title} className="rounded-2xl border border-slate-200/70 bg-white/70 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
                  <div className={`mb-3 inline-flex rounded-xl bg-gradient-to-r ${group.color} p-2 text-white`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{group.title}</h3>
                  <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                    {group.items.map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <BadgeCheck className="h-4 w-4 text-emerald-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14, duration: 0.4 }} className="rounded-[1.5rem] border border-white/20 bg-gradient-to-br from-indigo-600/80 to-blue-600/70 p-6 text-white shadow-xl backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-white/15 p-2">
              <Rocket className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-bold">Project Highlights</h2>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            {highlights.map((point) => (
              <span key={point} className="rounded-full border border-white/20 bg-white/10 px-3 py-2 text-sm font-medium backdrop-blur">
                {point}
              </span>
            ))}
          </div>
        </motion.div>
      </section>

      <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.4 }} className="rounded-[1.5rem] border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur-xl">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-2xl bg-gradient-to-tr from-purple-500 to-pink-500 p-2 text-white">
            <Users className="h-5 w-5" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Team Members</h2>
        </div>
        <div className="grid gap-5 lg:grid-cols-2">
          {members.map((member) => (
            <div key={member.name} className="rounded-[1.35rem] border border-slate-200/70 bg-slate-950/70 p-5 text-slate-100 shadow-lg transition hover:-translate-y-1 hover:shadow-2xl dark:border-slate-800">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-xl font-bold text-white">
                  {member.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}
                </div>
                <div>
                  <h3 className="text-lg font-bold">{member.name}</h3>
                  <p className="text-sm font-semibold text-cyan-300">{member.role}</p>
                </div>
              </div>
              <ul className="mt-4 space-y-2 text-sm text-slate-300">
                {member.responsibilities.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-blue-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex flex-wrap gap-2">
                <SocialLink href={member.github} label="GitHub" icon={GitBranch} />
                <SocialLink href={member.linkedin} label="LinkedIn" icon={Globe} />
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.26, duration: 0.4 }} className="rounded-[1.5rem] border border-amber-300/20 bg-gradient-to-br from-amber-500/10 to-orange-500/10 p-6 shadow-xl backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-amber-500/20 p-2 text-amber-600 dark:text-amber-300">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Special Thanks</h2>
        </div>
        <p className="mt-4 text-base leading-8 text-slate-700 dark:text-slate-300">
          This project was successfully completed under the guidance of Mihir Sir during the Microsoft Nirmaan Internship Program at Gandhi Institute of Technology and Management (GITAM), Bhubaneswar. We sincerely thank him for his continuous support, technical guidance, motivation and mentorship throughout the project.
        </p>
      </motion.section>

      <motion.footer initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32, duration: 0.4 }} className="rounded-[1.5rem] border border-white/20 bg-slate-950/80 p-8 text-center text-slate-300 shadow-xl">
        <h3 className="text-xl font-bold text-white">THE CODER</h3>
        <p className="mt-2 text-sm">Developed during Microsoft Nirmaan Internship</p>
        <p className="mt-1 text-sm">Gandhi Institute of Technology and Management (GITAM), Bhubaneswar</p>
        <p className="mt-4 text-xs uppercase tracking-[0.3em] text-slate-400">2026</p>
      </motion.footer>
    </div>
  );
}
