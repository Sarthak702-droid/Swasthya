'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  Clock,
  CircleDashed,
  Layers,
  Users,
  ShieldCheck,
  FileCode2,
  GitPullRequest,
  Search,
  ExternalLink,
  ChevronRight,
  ArrowRight,
  Check,
  Building2,
  Filter,
  Sparkles,
  Server,
  Database,
  Terminal,
  Activity,
  MapPin,
  MessageSquare,
  BarChart3,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { EPICS_DATA, TEAM_ROSTER, EpicTask, EpicItem } from '../data/epics-data';
import { TaskDetailModal } from '../components/TaskDetailModal';

export { EPICS_DATA, TEAM_ROSTER };
export type { EpicTask, EpicItem };

export function EpicsBoardPage() {
  const [viewMode, setViewMode] = useState<'by-epic' | 'by-member' | 'matrix'>('by-epic');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'COMPLETE' | 'IN_PROGRESS' | 'BACKLOG'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEpicId, setSelectedEpicId] = useState<string | null>(null);
  const [inspectingTask, setInspectingTask] = useState<(EpicTask & { epicCode?: string; epicTitle?: string }) | null>(null);

  // Flatten all tasks
  const allTasks = useMemo(() => {
    return EPICS_DATA.flatMap((epic) =>
      epic.tasks.map((task) => ({
        ...task,
        epicCode: epic.code,
        epicTitle: epic.title,
        epicBadgeBg: epic.badgeBg
      }))
    );
  }, []);

  // Filtered tasks
  const filteredTasks = useMemo(() => {
    return allTasks.filter((t) => {
      // Status filter
      if (statusFilter !== 'ALL' && t.status !== statusFilter) {
        return false;
      }
      // Epic filter
      if (selectedEpicId && !t.epicCode.toLowerCase().includes(selectedEpicId.toLowerCase())) {
        return false;
      }
      // Search filter
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        return (
          t.code.toLowerCase().includes(q) ||
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.assignee.toLowerCase().includes(q) ||
          t.epicTitle.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          t.files.some((f) => f.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [allTasks, statusFilter, selectedEpicId, searchQuery]);

  // Overall Statistics
  const totalTasks = allTasks.length;
  const completedTasks = allTasks.filter((t) => t.status === 'COMPLETE').length;
  const inProgressTasks = allTasks.filter((t) => t.status === 'IN_PROGRESS').length;
  const backlogTasks = allTasks.filter((t) => t.status === 'BACKLOG').length;
  const completedEpics = EPICS_DATA.filter((e) => e.status === 'COMPLETE').length;
  const completionPercentage = Math.round((completedTasks / totalTasks) * 100);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Top Banner / Hero */}
      <section className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white pt-10 pb-12 px-6 shadow-inner">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-semibold mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>BRICS Smart Health PRD Specification • 10 Epics Architecture</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                ArogyaGrid PRD 10-Epics Architecture Board
              </h1>
              <p className="text-slate-300 text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
                Complete engineering breakdown of all <strong className="text-white font-bold">10 PRD Epics</strong> and{' '}
                <strong className="text-white font-bold">{totalTasks} Itemized Tasks</strong> distributed across our 4 team members:
                <strong className="text-white font-semibold"> Sarthak</strong> (Lead),
                <strong className="text-white font-semibold"> Vaishnavi</strong> (District),
                <strong className="text-white font-semibold"> Riya</strong> (Facility), and
                <strong className="text-white font-semibold"> Shneanjali</strong> (Logistics).
              </p>
            </div>

            {/* Quick Action Button to Work Queue */}
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/work"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm shadow-md transition-all hover:scale-105"
              >
                <span>Operational Work Queue</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href="https://github.com/Sarthak702-droid/Swasthya/pull/1"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-sm transition"
              >
                <GitPullRequest className="w-4 h-4 text-emerald-400" />
                <span>GitHub PR #1</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>
            </div>
          </div>

          {/* Metric Badges Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-4 border-t border-slate-700/60">
            <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3.5">
              <span className="text-xs text-slate-400 block font-medium">Total PRD Epics</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-white">{EPICS_DATA.length}</span>
                <span className="text-[11px] text-teal-300 font-semibold">Full PRD Scope</span>
              </div>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3.5">
              <span className="text-xs text-slate-400 block font-medium">Completed Epics</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-emerald-400">{completedEpics} / {EPICS_DATA.length}</span>
                <span className="text-[11px] text-emerald-300 font-semibold">Verified Live</span>
              </div>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3.5">
              <span className="text-xs text-slate-400 block font-medium">Active / Roadmap</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-amber-400">{EPICS_DATA.length - completedEpics}</span>
                <span className="text-[11px] text-amber-300 font-semibold">In Progress</span>
              </div>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3.5">
              <span className="text-xs text-slate-400 block font-medium">Itemized Tasks</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-white">{totalTasks}</span>
                <span className="text-[11px] text-slate-300 font-semibold">{completedTasks} Done</span>
              </div>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3.5">
              <span className="text-xs text-slate-400 block font-medium">Go Unit Tests</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-emerald-400">19 / 19</span>
                <span className="text-[11px] text-emerald-300 font-semibold">100% Passing</span>
              </div>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3.5">
              <span className="text-xs text-slate-400 block font-medium">Core Schemas</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-cyan-300">6</span>
                <span className="text-[11px] text-cyan-200 font-semibold">iam/core/inv/cap/work</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Navigation / Filter Controls */}
        <section className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* View Mode Switcher */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold">
              <button
                onClick={() => setViewMode('by-epic')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all ${
                  viewMode === 'by-epic'
                    ? 'bg-white text-slate-950 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Layers className="w-4 h-4 text-teal-600" />
                <span>Group by Epic ({EPICS_DATA.length})</span>
              </button>

              <button
                onClick={() => setViewMode('by-member')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all ${
                  viewMode === 'by-member'
                    ? 'bg-white text-slate-950 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Users className="w-4 h-4 text-indigo-600" />
                <span>Group by Member ({TEAM_ROSTER.length})</span>
              </button>

              <button
                onClick={() => setViewMode('matrix')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all ${
                  viewMode === 'matrix'
                    ? 'bg-white text-slate-950 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Filter className="w-4 h-4 text-amber-600" />
                <span>All Tasks Matrix ({filteredTasks.length})</span>
              </button>
            </div>

            {/* Status Filter Buttons */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status:</span>
              <button
                onClick={() => setStatusFilter('ALL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                  statusFilter === 'ALL'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200'
                }`}
              >
                All ({totalTasks})
              </button>

              <button
                onClick={() => setStatusFilter('COMPLETE')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border flex items-center gap-1.5 ${
                  statusFilter === 'COMPLETE'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border-emerald-200'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                <span>Complete ({completedTasks})</span>
              </button>

              <button
                onClick={() => setStatusFilter('IN_PROGRESS')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border flex items-center gap-1.5 ${
                  statusFilter === 'IN_PROGRESS'
                    ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                    : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border-amber-200'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Active ({inProgressTasks})</span>
              </button>
            </div>
          </div>

          {/* Search bar & quick filters */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search across all 10 Epics by keyword (e.g. Inventory, Safe Surplus, Forecast, Bed, Chat, Sarthak, TASK-04-02)..."
              className="pl-10 h-10 bg-slate-50 border-slate-200 text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-700 bg-slate-200 px-2 py-0.5 rounded"
              >
                Clear
              </button>
            )}
          </div>
        </section>

        {/* =================================================================== */}
        {/* VIEW MODE 1: GROUP BY EPIC (ALL 10 EPICS) */}
        {/* =================================================================== */}
        {viewMode === 'by-epic' && (
          <div className="space-y-8">
            {EPICS_DATA.map((epic) => {
              const epicMatchingTasks = epic.tasks.filter((t) => {
                if (statusFilter !== 'ALL' && t.status !== statusFilter) return false;
                if (searchQuery.trim() !== '') {
                  const q = searchQuery.toLowerCase();
                  return (
                    t.code.toLowerCase().includes(q) ||
                    t.title.toLowerCase().includes(q) ||
                    t.description.toLowerCase().includes(q) ||
                    t.assignee.toLowerCase().includes(q) ||
                    t.category.toLowerCase().includes(q) ||
                    epic.code.toLowerCase().includes(q) ||
                    epic.title.toLowerCase().includes(q) ||
                    t.files.some((f) => f.toLowerCase().includes(q))
                  );
                }
                return true;
              });

              const isComplete = epic.status === 'COMPLETE';
              const progressRatio = Math.round(
                (epic.tasks.filter((t) => t.status === 'COMPLETE').length / epic.tasks.length) * 100
              );

              return (
                <div
                  key={epic.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all hover:border-slate-300"
                >
                  {/* Epic Header Card */}
                  <div className="p-6 border-b border-slate-100 bg-gradient-to-b from-slate-50/50 to-white">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span className="px-2.5 py-1 rounded-md bg-slate-900 text-white font-mono text-xs font-bold tracking-wider">
                            {epic.code}
                          </span>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-extrabold border flex items-center gap-1.5 ${
                              isComplete
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                : 'bg-amber-100 text-amber-800 border-amber-300'
                            }`}
                          >
                            {isComplete ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Clock className="w-3.5 h-3.5 text-amber-600" />
                            )}
                            <span>{epic.status}</span>
                          </span>
                          <span className="text-xs text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 font-semibold">
                            {epic.prdSection}
                          </span>
                          <span className="text-xs text-slate-500 font-medium">
                            {epic.tasks.length} itemized tasks
                          </span>
                        </div>

                        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                          {epic.title}
                        </h2>

                        <p className="text-sm text-slate-600 max-w-4xl leading-relaxed">
                          {epic.description}
                        </p>
                      </div>

                      {/* Owner Profile Badge */}
                      <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-xs shrink-0">
                        <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-xl">
                          {epic.owner === 'Sarthak' ? '👑' : epic.owner === 'Vaishnavi' ? '📋' : epic.owner === 'Riya' ? '🏥' : '🚚'}
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Lead Owner</span>
                          <span className="font-bold text-slate-900 text-sm block">
                            {epic.owner}
                          </span>
                          <span className="text-[11px] text-slate-500 block">
                            {epic.ownerRole}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-4">
                      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                        <div
                          className={`h-2.5 rounded-full transition-all duration-500 ${
                            isComplete ? 'bg-emerald-500' : 'bg-amber-500'
                          }`}
                          style={{ width: `${progressRatio}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-bold text-slate-700 whitespace-nowrap">
                        {progressRatio}% ({epic.tasks.filter((t) => t.status === 'COMPLETE').length}/{epic.tasks.length} Tasks)
                      </span>
                    </div>
                  </div>

                  {/* Task List Under This Epic */}
                  <div className="p-6 divide-y divide-slate-100">
                    {epicMatchingTasks.length === 0 ? (
                      <div className="py-8 text-center text-slate-400 text-sm">
                        No tasks match current filter.
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {epicMatchingTasks.map((task) => (
                          <div
                            key={task.id}
                            onClick={() => setInspectingTask({ ...task, epicCode: epic.code, epicTitle: epic.title })}
                            className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/40 hover:bg-white hover:border-teal-400 hover:shadow-md transition-all space-y-3 cursor-pointer group"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-800">
                                  {task.code}
                                </span>
                                <h3 className="font-bold text-sm sm:text-base text-slate-900">
                                  {task.title}
                                </h3>
                                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                                  {task.category}
                                </span>
                              </div>

                              {/* Task Status Badge */}
                              <div className="flex items-center gap-2">
                                <span
                                  className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 border ${
                                    task.status === 'COMPLETE'
                                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                      : task.status === 'IN_PROGRESS'
                                      ? 'bg-amber-100 text-amber-800 border-amber-300'
                                      : 'bg-slate-100 text-slate-700 border-slate-300'
                                  }`}
                                >
                                  {task.status === 'COMPLETE' ? (
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                  ) : (
                                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                                  )}
                                  <span>{task.status}</span>
                                </span>
                              </div>
                            </div>

                            {/* Task Description */}
                            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                              {task.description}
                            </p>

                            {/* Code Artifacts & Verification */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2 border-t border-slate-200/60 text-xs">
                              <div className="flex items-start gap-1.5">
                                <FileCode2 className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                                <div className="space-y-0.5">
                                  <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
                                    Deliverable Code Files:
                                  </span>
                                  <div className="flex flex-wrap gap-1">
                                    {task.files.map((file, idx) => (
                                      <code
                                        key={idx}
                                        className="text-[11px] font-mono bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-800"
                                      >
                                        {file}
                                      </code>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-start gap-1.5">
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                                <div className="space-y-0.5">
                                  <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
                                    Verification & Quality Gate:
                                  </span>
                                  <span className="text-slate-700 font-medium text-xs">
                                    {task.verification}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="pt-1 text-[11px] font-bold text-teal-700 group-hover:text-teal-900 flex items-center justify-between">
                              <span>Inspect Complete Task Depth, Equations & Verification</span>
                              <span className="text-xs font-bold">→</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* =================================================================== */}
        {/* VIEW MODE 2: GROUP BY TEAM MEMBER (4 MEMBERS) */}
        {/* =================================================================== */}
        {viewMode === 'by-member' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {TEAM_ROSTER.map((member) => {
              const memberTasks = allTasks.filter((t) => t.assignee === member.name);
              const completedCount = memberTasks.filter((t) => t.status === 'COMPLETE').length;
              const ratio = memberTasks.length > 0 ? Math.round((completedCount / memberTasks.length) * 100) : 0;

              return (
                <div
                  key={member.name}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    {/* Header */}
                    <div className="p-6 border-b border-slate-100 bg-gradient-to-b from-slate-50/70 to-white">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-2xl shadow-sm">
                            {member.avatar}
                          </div>
                          <div>
                            <h2 className="text-xl font-bold text-slate-900">{member.name}</h2>
                            <p className="text-xs font-semibold text-slate-500">{member.role}</p>
                            <span className="text-[11px] text-teal-700 font-medium block mt-0.5">
                              {member.systemRole}
                            </span>
                          </div>
                        </div>

                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          {completedCount}/{memberTasks.length} Tasks Done
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 mt-4 leading-relaxed">
                        {member.summary}
                      </p>

                      {/* Assigned Epics */}
                      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-1.5 items-center">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
                          Assigned Epics ({member.epics.length}):
                        </span>
                        {member.epics.map((code) => (
                          <span
                            key={code}
                            className="text-xs font-bold px-2 py-0.5 rounded bg-slate-900 text-white font-mono"
                          >
                            {code}
                          </span>
                        ))}
                      </div>

                      {/* Progress */}
                      <div className="mt-4">
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-emerald-500 h-2 rounded-full"
                            style={{ width: `${ratio}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-[11px] font-semibold text-slate-500 mt-1.5">
                          <span>Progress: {ratio}%</span>
                          <span className="text-emerald-600">✓ In Active Build</span>
                        </div>
                      </div>
                    </div>

                    {/* Task Checklist for this member */}
                    <div className="p-6 space-y-3">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Itemized Tasks Assigned ({memberTasks.length}):
                      </h3>

                      <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                        {memberTasks.map((t) => (
                          <div
                            key={t.id}
                            onClick={() => setInspectingTask({ ...t, epicCode: t.epicCode, epicTitle: t.epicTitle })}
                            className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-teal-400 hover:shadow-sm transition cursor-pointer flex items-start justify-between gap-3 text-xs group"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-1.5">
                                <span className="font-mono font-bold text-slate-700">{t.code}</span>
                                <span className="text-slate-300">•</span>
                                <span className="font-semibold text-slate-900">{t.title}</span>
                              </div>
                              <p className="text-slate-500 line-clamp-2 text-[11px]">
                                {t.description}
                              </p>
                            </div>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded shrink-0 ${
                                t.status === 'COMPLETE'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {t.status === 'COMPLETE' ? '✓ Done' : '⚡ Active'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
                    <span className="text-xs text-slate-500">
                      Ownership verified in repository branch <code className="font-mono font-semibold">feature/arogyagrid-epic-work-item-system</code>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* =================================================================== */}
        {/* VIEW MODE 3: ALL TASKS MATRIX (10 EPICS AUDIT) */}
        {/* =================================================================== */}
        {viewMode === 'matrix' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Full 10-Epics Tasks Audit Matrix ({filteredTasks.length} Tasks)
                </h2>
                <p className="text-xs text-slate-500">
                  Complete list of all deliverables, files, verification tests, and team assignments across all 10 PRD Epics.
                </p>
              </div>

              <span className="text-xs font-bold px-2.5 py-1 rounded bg-teal-100 text-teal-800 border border-teal-300">
                100% PRD Coverage Matrix
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                    <th className="py-3 px-4">Task Code</th>
                    <th className="py-3 px-4">Epic</th>
                    <th className="py-3 px-4">Title & Details</th>
                    <th className="py-3 px-4">Owner</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Deliverable File</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredTasks.map((t) => (
                    <tr key={t.id} onClick={() => setInspectingTask({ ...t, epicCode: t.epicCode, epicTitle: t.epicTitle })} className="hover:bg-teal-50/60 transition cursor-pointer">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                        {t.code}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-800 border">
                          {t.epicCode}
                        </span>
                      </td>
                      <td className="py-3 px-4 max-w-sm">
                        <div className="font-bold text-slate-900">{t.title}</div>
                        <p className="text-slate-500 text-[11px] line-clamp-2 mt-0.5">
                          {t.description}
                        </p>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-semibold text-slate-900">{t.assignee}</div>
                        <div className="text-[10px] text-slate-400">{t.assigneeRole}</div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium text-[11px]">
                          {t.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded-full font-bold text-[11px] flex items-center gap-1 w-fit ${
                            t.status === 'COMPLETE'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {t.status === 'COMPLETE' ? <Check className="w-3 h-3 text-emerald-600" /> : <Clock className="w-3 h-3 text-amber-600" />}
                          <span>{t.status}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 max-w-xs truncate font-mono text-[11px] text-slate-600">
                        {t.files[0]}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Bottom Banner: Transition to Work Queue */}
        <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-2xl p-6 border border-teal-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <h3 className="font-bold text-teal-950 text-base">
              Ready to see the operational work items running live?
            </h3>
            <p className="text-xs text-teal-800">
              The operational work queue demonstrates this architecture running against real-world Odisha PHC emergency alerts.
            </p>
          </div>

          <Link
            href="/work"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-sm transition shrink-0"
          >
            <span>Open Operational Work Queue</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {/* In-Depth Task Details Modal */}
        <TaskDetailModal
          task={inspectingTask}
          isOpen={!!inspectingTask}
          onClose={() => setInspectingTask(null)}
        />
      </main>
    </div>
  );
}
