'use client';

import { useState, useMemo } from 'react';
import { WorkQueueTabs } from '../components/WorkQueueTabs';
import { WorkQueueTable, getWorkItemEpic } from '../components/WorkQueueTable';
import { WorkItemPanel } from '../components/WorkItemPanel';
import { useWorkQueue } from '../hooks/useWorkQueue';
import type { QueueView } from '../types/work.types';
import Link from 'next/link';
import { ArrowRight, Layers, ExternalLink } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Defined Epics with assignees and live completion status
const PROJECT_EPICS = [
  {
    id: 'epic-1',
    code: 'EPIC-01',
    title: 'Foundation, Auth & Config',
    owner: 'Sarthak',
    role: 'Team Leader',
    status: 'COMPLETE',
    color: 'border-rose-200 bg-rose-50/60 hover:bg-rose-50 text-rose-900',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
    tasks: '5/5 tasks',
    description: 'PostgreSQL schema, JWT auth middleware, idempotency engine, Chi setup'
  },
  {
    id: 'epic-2',
    code: 'EPIC-02',
    title: 'Work Item Core Backend',
    owner: 'Vaishnavi',
    role: 'District Officer',
    status: 'COMPLETE',
    color: 'border-amber-200 bg-amber-50/60 hover:bg-amber-50 text-amber-900',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    tasks: '6/6 tasks',
    description: 'Models, domain state machine, repository pattern, Chi handler, tests'
  },
  {
    id: 'epic-3',
    code: 'EPIC-03',
    title: 'Transitions, Queues & Timeline',
    owner: 'Riya',
    role: 'Facility Manager',
    status: 'COMPLETE',
    color: 'border-blue-200 bg-blue-50/60 hover:bg-blue-50 text-blue-900',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
    tasks: '7/7 tasks',
    description: 'Assign/Accept/Complete/Return/Handoff, SLA policy, timeline synthesis'
  },
  {
    id: 'epic-4',
    code: 'EPIC-04',
    title: 'Frontend Work Queue System',
    owner: 'Shneanjali',
    role: 'Facility Manager',
    status: 'COMPLETE',
    color: 'border-purple-200 bg-purple-50/60 hover:bg-purple-50 text-purple-900',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
    tasks: '6/6 tasks',
    description: 'Next.js App Router, side panel, operational dialogs, TanStack Query'
  },
  {
    id: 'epic-5',
    code: 'EPIC-05',
    title: 'System Integration & Seed Data',
    owner: 'Sarthak',
    role: 'Team Leader',
    status: 'COMPLETE',
    color: 'border-emerald-200 bg-emerald-50/60 hover:bg-emerald-50 text-emerald-900',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    tasks: '5/5 tasks',
    description: 'Work generator, deduplication check, Odisha PHC seed dataset, audit trails'
  }
];

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

  const { data, isLoading, error } = useWorkQueue(activeView);

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

      <main className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* PROMINENT ROADMAP BANNER */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border border-slate-800">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-300 shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-white">
                  Looking for the Team Epics & Task Architecture Breakdown?
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  5/5 Epics Done (42 Tasks)
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Inspect every single task delivered by <strong className="text-white">Sarthak</strong>, <strong className="text-white">Vaishnavi</strong>, <strong className="text-white">Riya</strong>, and <strong className="text-white">Shneanjali</strong>.
              </p>
            </div>
          </div>

          <Link
            href="/epics"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold transition shadow shrink-0 hover:scale-105"
          >
            <span>Open Team Epics Board</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* ============================================================ */}
        {/* TEAM EPICS STATUS TRACKER */}
        {/* ============================================================ */}
        <section className="bg-white rounded-xl p-5 border shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3.5">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                Team Epics & Task Distribution
              </h2>
              <p className="text-xs text-slate-400">
                Managed by Team Leader <span className="font-semibold text-slate-700">Sarthak</span> across 4 officers
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                All 5 Epics Complete (100%)
              </span>
              <Link
                href="/epics"
                className="text-xs font-bold text-teal-700 hover:text-teal-800 bg-teal-50 hover:bg-teal-100 px-2.5 py-1 rounded border border-teal-200 transition flex items-center gap-1"
              >
                <span>Full Epic Breakdown →</span>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {PROJECT_EPICS.map((epic) => {
              const isSelected = selectedEpic.includes(epic.code) || (selectedEpic === epic.title);
              
              return (
                <div
                  key={epic.id}
                  onClick={() => setSelectedEpic(isSelected ? 'All Epics' : epic.code)}
                  className={`p-3.5 rounded-lg border transition-all cursor-pointer ${
                    isSelected ? 'ring-2 ring-teal-500 shadow-md bg-teal-50/50' : epic.color
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold tracking-wider uppercase opacity-75">{epic.code}</span>
                    <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded-full bg-emerald-600 text-white">
                      ✓ {epic.status}
                    </span>
                  </div>

                  <h3 className="font-semibold text-xs mt-1.5 line-clamp-1">{epic.title}</h3>

                  <div className="mt-2.5 flex items-center justify-between text-[11px]">
                    <span className="font-medium text-slate-700">👤 {epic.owner}</span>
                    <span className="text-slate-500">{epic.tasks}</span>
                  </div>

                  {/* 100% Complete Progress Bar */}
                  <div className="w-full bg-slate-200/80 rounded-full h-1.5 mt-2 overflow-hidden">
                    <div className="bg-emerald-500 h-1.5 rounded-full w-full"></div>
                  </div>
                </div>
              );
            })}
          </div>
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
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 border ${
                    active
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  <span>{m.icon}</span>
                  <span>{m.name}</span>
                </button>
              );
            })}
          </div>

          {/* Filter Row 2: Search & Epic Dropdown */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 border-t border-slate-100">
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <Input
                placeholder="Search work items, medicines, facilities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 text-xs pl-8 bg-slate-50/50"
              />
              <span className="absolute left-2.5 top-2.5 text-xs text-slate-400">🔍</span>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2 text-xs text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Epic Filter Selector */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-slate-500 whitespace-nowrap">Filter by Epic:</span>
              <select
                value={selectedEpic}
                onChange={(e) => setSelectedEpic(e.target.value)}
                className="h-9 text-xs rounded-md border border-slate-200 bg-slate-50 px-3 py-1 text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-400"
              >
                <option value="All Epics">All Epics (Entire System)</option>
                <option value="EPIC-01">EPIC-01: Foundation & Auth (Sarthak)</option>
                <option value="EPIC-02">EPIC-02: Work Item Core Backend (Vaishnavi)</option>
                <option value="EPIC-03">EPIC-03: Transitions & Queues (Riya)</option>
                <option value="EPIC-04">EPIC-04: Frontend Work System (Shneanjali)</option>
                <option value="EPIC-05">EPIC-05: System Integration & Seed (Sarthak)</option>
                <option value="Shortage">Shortage Resolution Epic</option>
                <option value="Transfer">Transfer & Redistribution Epic</option>
              </select>
            </div>

            {/* Clear All Filters Button */}
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="h-8 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 ml-auto border-red-200"
              >
                Clear Filters ✕
              </Button>
            )}
          </div>
        </section>

        {/* ============================================================ */}
        {/* QUEUE TABS (MY WORK, URGENT, OVERDUE, WAITING, COMPLETED) */}
        {/* ============================================================ */}
        <WorkQueueTabs 
          activeView={activeView} 
          onViewChange={setActiveView}
          counts={data?.counts}
        />

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            Error loading operational queue. Please verify backend connection on port 8085.
          </div>
        )}

        {/* Filter Summary Pill */}
        <div className="flex items-center justify-between text-xs text-slate-500 px-1">
          <div>
            Showing <span className="font-semibold text-slate-800">{filteredItems.length}</span> work items
            {hasActiveFilters && (
              <span> (filtered from total {data?.data?.length ?? 0})</span>
            )}
          </div>
          {hasActiveFilters && (
            <div className="flex items-center gap-1.5">
              {selectedMember !== 'All Members' && (
                <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700">Member: {selectedMember}</span>
              )}
              {selectedEpic !== 'All Epics' && (
                <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700">Epic: {selectedEpic}</span>
              )}
            </div>
          )}
        </div>

        {/* ============================================================ */}
        {/* WORK QUEUE TABLE WITH DETAILED COLUMNS */}
        {/* ============================================================ */}
        <WorkQueueTable 
          items={filteredItems}
          isLoading={isLoading}
          onSelectItem={setSelectedItemId}
        />
      </main>

      {/* Side Panel for Selected Work Item */}
      <WorkItemPanel 
        itemId={selectedItemId}
        isOpen={!!selectedItemId}
        onClose={() => setSelectedItemId(null)}
      />
    </div>
  );
}