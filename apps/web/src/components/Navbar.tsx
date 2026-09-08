'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Layers, ClipboardList, Home, ExternalLink } from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();

  const navItems = [
    {
      label: 'Team Epics & Tasks',
      href: '/epics',
      icon: Layers,
      badge: '6 Epics (5 Done, 1 Active)',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    },
    {
      label: 'Operational Work Queue',
      href: '/work',
      icon: ClipboardList,
      badge: '12 Live Tickets',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
    },
    {
      label: 'Overview',
      href: '/',
      icon: Home,
    },
  ];

  return (
    <header className="border-b bg-white px-4 md:px-8 py-3 shadow-xs sticky top-0 z-30">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white font-bold text-lg shadow-sm group-hover:scale-105 transition">
              A
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-slate-900">ArogyaGrid</span>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200">
                  Odisha Health
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Health Resource Operations & Team Epic Board
              </p>
            </div>
          </Link>

          {/* Live Indicator on Mobile */}
          <div className="flex md:hidden items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-2.5 py-1 text-[11px] font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Online</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 md:pb-0">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all shrink-0 ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-teal-300' : 'text-slate-500'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`hidden sm:inline-block text-[10px] font-bold px-1.5 py-0.2 rounded border ${
                      isActive ? 'bg-slate-800 text-teal-300 border-slate-700' : item.badgeColor
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Info: Status & GitHub PR */}
        <div className="hidden lg:flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full px-3 py-1.5 text-xs text-slate-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Go Chi :8085</span>
            <span className="text-slate-300">•</span>
            <span>PG 16</span>
          </div>

          <a
            href="https://github.com/Sarthak702-droid/Swasthya/pull/1"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition border border-slate-200"
          >
            <span>GitHub PR #1</span>
            <ExternalLink className="w-3 h-3 text-slate-500" />
          </a>
        </div>
      </div>
    </header>
  );
}
