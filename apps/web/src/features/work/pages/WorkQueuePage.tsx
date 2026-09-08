'use client';

import { useState, useMemo } from 'react';
import { WorkQueueTabs } from '../components/WorkQueueTabs';
import { WorkQueueTable, getWorkItemEpic } from '../components/WorkQueueTable';
import { WorkItemPanel } from '../components/WorkItemPanel';
import { TaskDetailModal } from '../components/TaskDetailModal';
import { useWorkQueue } from '../hooks/useWorkQueue';
import type { QueueView } from '../types/work.types';
import { EPICS_DATA, EpicItem, EpicTask } from '../data/epics-data';
import Link from 'next/link';
import {
  ArrowRight,
  Layers,
  ExternalLink,
  CheckCircle2,
  Clock,
  CircleDashed,
  Sparkles,
  ChevronDown,
  ChevronUp,
  X,
  FileCode2,
  ShieldCheck,
  Filter,
  Terminal
} from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const TEAM_MEMBERS = [
  { name: 'All Members', icon: '👥' },
  { name: 'Sarthak', role: 'Team Leader (National Admin)', icon: '👑' },
  { name: 'Vaishnavi', role: 'District Officer', icon: '📋' },
  { name: 'Riya', role: 'Facility Manager', icon: '🏥' },
  { name: 'Shneanjali', role: 'Logistics Officer', icon: '🚚' },
  { name: 'Unassigned', role: 'Waiting Queue', icon: '⏳' }
];

export function WorkQueuePage() {
  const [activeView, setActiveView] = useState<QueueView>('my');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  
  // Custom Filters
  const [selectedMember, setSelectedMember] = useState<string>('All Members');
  const [selectedEpic, setSelectedEpic] = useState<string>('All Epics');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Epic Deep-Dive & Task Modal States
  const [activeEpicCode, setActiveEpicCode] = useState<string | null>('EPIC-05');
  const [inspectingTask, setInspectingTask] = useState<(EpicTask & { epicCode?: string; epicTitle?: string }) | null>(null);

  const { data, isLoading, error } = useWorkQueue(activeView);

  // Active Epic Object
  const activeEpic = useMemo(() => {
    if (!activeEpicCode) return null;
    return EPICS_DATA.find((e) => e.code.toLowerCase() === activeEpicCode.toLowerCase()) || null;
  }, [activeEpicCode]);

  // Client-side filtering across Member, Epic, and Search
  const filteredItems = useMemo(() => {
    let items = data?.data ?? [];

    // Filter by Member
    if (selectedMember !== 'All Members') {
      if (selectedMember === 'Unassigned') {
        items = items.filter(item => !item.assignedUserId);
      } else {
        items = items.filter(item => item.assignedUserName?.toLowerCase().includes(selectedMember.toLowerCase()));
      }
    }

    // Filter by Epic
    if (selectedEpic !== 'All Epics') {
      items = items.filter(item => {
        const itemEpic = getWorkItemEpic(item.type);
        return itemEpic.name.toLowerCase().includes(selectedEpic.toLowerCase()) ||
               itemEpic.member.toLowerCase().includes(selectedEpic.toLowerCase());
      });
    }

    // Filter by Search Query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      items = items.filter(item =>
        item.title.toLowerCase().includes(q) ||
        item.type.toLowerCase().includes(q) ||
        (item.facilityName && item.facilityName.toLowerCase().includes(q)) ||
        (item.description && item.description.toLowerCase().includes(q))
      );
    }

    return items;
  }, [data?.data, selectedMember, selectedEpic, searchQuery]);

  const hasActiveFilters = selectedMember !== 'All Members' || selectedEpic !== 'All Epics' || searchQuery.trim() !== '';

  const clearFilters = () => {
    setSelectedMember('All Members');
    setSelectedEpic('All Epics');
    setSearchQuery('');
  };

  const handleEpicCardClick = (epicCode: string) => {
    if (activeEpicCode === epicCode) {
      setActiveEpicCode(null);
    } else {
      setActiveEpicCode(epicCode);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* Top Header */}
      <header className="border-b bg-white px-8 py-5 shadow-xs sticky top-0 z-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-teal-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                A
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">ArogyaGrid Operations Grid</h1>
            </div>
            <p className="text-sm text-slate-500 mt-0.5">
              Enterprise Work Item & Epic Management System • Odisha Health Resource Grid
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-100 rounded-full px-3 py-1.5 text-xs text-slate-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Cluster: 4 Facilities Active
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* PROMINENT ROADMAP BANNER */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border border-slate-800">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-300 shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-white">
                  ArogyaGrid PRD Engineering Roadmap & Task Architecture
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40">
                  10 PRD Epics (2 Complete, 8 Active/Roadmap)
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Click on any of the 10 Epics below to inspect its itemized engineering tasks. Click any task to view its complete depth, mathematical equations, and source code files.
              </p>
            </div>
          </div>

          <Link
            href="/epics"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold transition shadow shrink-0 hover:scale-105"
          >
            <span>Full 10 Epics Board</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* ============================================================ */}
        {/* 10 PRD EPICS INTERACTIVE CARDS GRID */}
        {/* ============================================================ */}
        <section className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-600" />
                <span>10 PRD Epics & Supply Chain Architecture</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Click any Epic card below to view all its itemized sub-tasks.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                2 Complete • 8 Active/Roadmap
              </span>
              <Link
                href="/epics"
                className="text-xs font-bold text-teal-700 hover:text-teal-800 bg-teal-50 hover:bg-teal-100 px-2.5 py-1 rounded border border-teal-200 transition flex items-center gap-1"
              >
                <span>Full Board →</span>
              </Link>
            </div>
          </div>

          {/* 10 Epics Grid (5 columns on desktop) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {EPICS_DATA.map((epic) => {
              const isActive = activeEpicCode?.toLowerCase() === epic.code.toLowerCase();
              const isComplete = epic.status === 'COMPLETE';
              const completedCount = epic.tasks.filter((t) => t.status === 'COMPLETE').length;

              return (
                <div
                  key={epic.id}
                  onClick={() => handleEpicCardClick(epic.code)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${
                    isActive
                      ? 'ring-2 ring-teal-500 shadow-md bg-teal-50/70 border-teal-300 scale-[1.02]'
                      : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  {/* Top Row: Code & Status */}
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <span className="text-[11px] font-mono font-bold tracking-wider text-slate-800 bg-white/80 px-1.5 py-0.5 rounded border border-slate-200">
                      {epic.code}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                        isComplete
                          ? 'bg-emerald-600 text-white'
                          : 'bg-amber-500 text-white'
                      }`}
                    >
                      {isComplete ? '✓ DONE' : '⚡ ACTIVE'}
                    </span>
                  </div>

                  {/* Epic Title */}
                  <h3 className="font-bold text-xs text-slate-900 line-clamp-1 leading-tight" title={epic.title}>
                    {epic.title}
                  </h3>

                  {/* Owner & Task Counter */}
                  <div className="mt-2.5 flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-slate-700 flex items-center gap-1 truncate">
                      <span>{epic.owner === 'Sarthak' ? '👑' : epic.owner === 'Vaishnavi' ? '📋' : epic.owner === 'Riya' ? '🏥' : '🚚'}</span>
                      <span className="truncate">{epic.owner}</span>
                    </span>
                    <span className="text-slate-500 font-medium shrink-0">
                      {completedCount}/{epic.tasks.length} tasks
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2 overflow-hidden">
                    <div
                      className={`h-1.5 rounded-full ${
                        isComplete ? 'bg-emerald-500 w-full' : completedCount > 0 ? 'bg-teal-500 w-1/3' : 'bg-amber-500 w-1/4'
                      }`}
                    ></div>
                  </div>

                  {/* Active Indicator Strip */}
                  {isActive && (
                    <div className="mt-2 pt-1.5 border-t border-teal-200/80 flex items-center justify-between text-[10px] text-teal-800 font-bold">
                      <span>Viewing Tasks</span>
                      <ChevronDown className="w-3 h-3 text-teal-600 animate-bounce" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* ============================================================ */}
          {/* EXPANDED EPIC TASKS EXPLORER (SHOWN WHEN EPIC IS CLICKED) */}
          {/* ============================================================ */}
          {activeEpic ? (
            <div className="mt-6 p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-slate-50 to-teal-50/20 border-2 border-teal-500/40 shadow-md space-y-5 animate-in fade-in-50 duration-200">
              {/* Active Epic Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-md bg-slate-900 text-white font-mono text-xs font-bold">
                      {activeEpic.code}
                    </span>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 border border-teal-300">
                      {activeEpic.prdSection}
                    </span>
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                        activeEpic.status === 'COMPLETE'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : 'bg-amber-100 text-amber-800 border-amber-300'
                      }`}
                    >
                      {activeEpic.status === 'COMPLETE' ? '✓ Epic Verified Complete' : '⚡ Active Implementation'}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      {activeEpic.tasks.length} itemized tasks defined
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                    {activeEpic.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 max-w-4xl leading-relaxed">
                    {activeEpic.description}
                  </p>
                </div>

                {/* Right controls: Lead Owner & Close */}
                <div className="flex items-center gap-2.5 shrink-0">
                  <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs text-xs">
                    <span className="text-base">
                      {activeEpic.owner === 'Sarthak' ? '👑' : activeEpic.owner === 'Vaishnavi' ? '📋' : activeEpic.owner === 'Riya' ? '🏥' : '🚚'}
                    </span>
                    <div>
                      <span className="font-bold text-slate-900 block">{activeEpic.owner}</span>
                      <span className="text-[10px] text-slate-500 block">{activeEpic.ownerRole}</span>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveEpicCode(null)}
                    className="h-9 px-2.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-xl"
                    title="Minimize Epic Tasks"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Tasks List Header */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-teal-600" />
                  <span>Itemized Engineering Tasks under {activeEpic.code} (Click any task for in-depth specs)</span>
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedEpic(selectedEpic === activeEpic.code ? 'All Epics' : activeEpic.code)}
                  className="text-xs h-7 border-teal-300 text-teal-800 bg-teal-50 hover:bg-teal-100"
                >
                  <Filter className="w-3 h-3 mr-1" />
                  {selectedEpic === activeEpic.code ? 'Clear Queue Filter' : `Filter Tickets by ${activeEpic.code}`}
                </Button>
              </div>

              {/* Tasks Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {activeEpic.tasks.map((task) => {
                  const isTaskDone = task.status === 'COMPLETE';
                  const isTaskActive = task.status === 'IN_PROGRESS';

                  return (
                    <div
                      key={task.id}
                      onClick={() =>
                        setInspectingTask({
                          ...task,
                          epicCode: activeEpic.code,
                          epicTitle: activeEpic.title
                        })
                      }
                      className="group bg-white rounded-xl p-4 border border-slate-200 shadow-xs hover:shadow-md hover:border-teal-400 transition-all cursor-pointer flex flex-col justify-between space-y-3 relative"
                    >
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-1.5">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800 group-hover:bg-teal-50 group-hover:text-teal-900 transition">
                          {task.code}
                        </span>

                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border ${
                            isTaskDone
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : isTaskActive
                              ? 'bg-amber-100 text-amber-800 border-amber-300'
                              : 'bg-slate-100 text-slate-700 border-slate-300'
                          }`}
                        >
                          {isTaskDone ? (
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Clock className="w-3 h-3 text-amber-600" />
                          )}
                          <span>{task.status}</span>
                        </span>
                      </div>

                      {/* Task Title */}
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 group-hover:text-teal-700 transition leading-snug">
                          {task.title}
                        </h4>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                          {task.description}
                        </p>
                      </div>

                      {/* Meta: Category & Assignee */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                        <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          {task.category}
                        </span>
                        <span className="font-semibold text-slate-800">
                          👤 {task.assignee}
                        </span>
                      </div>

                      {/* Explicit Action Callout */}
                      <div className="pt-1 text-[11px] font-bold text-teal-700 group-hover:text-teal-900 flex items-center justify-between">
                        <span>Inspect Full Task Depth</span>
                        <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded-xl bg-slate-50 border border-dashed border-slate-300 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>Click on any of the 10 Epic cards above to expand its itemized tasks, architectural logic, and code files.</span>
            </div>
          )}
        </section>

        {/* ============================================================ */}
        {/* INTERACTIVE FILTER BAR (MEMBER & EPIC FILTERING) */}
        {/* ============================================================ */}
        <section className="bg-white rounded-xl p-4 border shadow-sm space-y-3.5">
          {/* Filter Row 1: Member Selection */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 mr-1 uppercase tracking-wider">
              Member Filter:
            </span>
            {TEAM_MEMBERS.map((m) => {
              const active = selectedMember === m.name;
              return (
                <button
                  key={m.name}
                  onClick={() => setSelectedMember(m.name)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    active
                      ? 'bg-slate-900 text-white shadow-xs font-semibold'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <span>{m.icon}</span>
                  <span>{m.name}</span>
                </button>
              );
            })}
          </div>

          {/* Filter Row 2: Search Input & Epic Filter */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full sm:flex-1">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search work items, medicines, facilities..."
                className="text-xs h-9 bg-slate-50"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-slate-500 shrink-0">Filter by Epic:</span>
              <select
                value={selectedEpic}
                onChange={(e) => setSelectedEpic(e.target.value)}
                className="text-xs h-9 px-3 rounded-md border border-input bg-slate-50 text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-teal-500"
              >
                <option value="All Epics">All 10 Epics</option>
                {EPICS_DATA.map((epic) => (
                  <option key={epic.id} value={epic.code}>
                    {epic.code}: {epic.title} ({epic.owner})
                  </option>
                ))}
              </select>

              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-xs h-9 text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2.5 shrink-0"
                >
                  Clear Filters ✕
                </Button>
              )}
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* OPERATIONAL QUEUE TABS & TABLE */}
        {/* ============================================================ */}
        <div className="space-y-4">
          <WorkQueueTabs activeView={activeView} onViewChange={setActiveView} />

          {/* Filter count summary tag */}
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>
              Showing <strong>{filteredItems.length}</strong> work items (filtered from total {data?.data?.length ?? 0})
            </span>
            {selectedEpic !== 'All Epics' && (
              <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-medium">
                Epic: {selectedEpic}
              </span>
            )}
          </div>

          <WorkQueueTable
            items={filteredItems}
            isLoading={isLoading}
            onSelectItem={(id) => setSelectedItemId(id)}
          />
        </div>

        {/* Slide-over Inspection Panel for Operational Work Item */}
        <WorkItemPanel
          itemId={selectedItemId}
          isOpen={!!selectedItemId}
          onClose={() => setSelectedItemId(null)}
        />

        {/* In-Depth Task Details Modal for 10 PRD Epics */}
        <TaskDetailModal
          task={inspectingTask}
          isOpen={!!inspectingTask}
          onClose={() => setInspectingTask(null)}
        />
      </main>
    </div>
  );
}
