import Link from 'next/link';
import { Layers, ClipboardList, ArrowRight, CheckCircle2, GitPullRequest, ExternalLink, ShieldCheck, Activity, Users, Database, Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white pt-16 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Odisha Health Resource Grid • Production Delivery Complete</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white">
            ArogyaGrid Operations Grid
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Enterprise Work Item & Epic Management System engineered across 5 core Epics and 42 itemized deliverables for public healthcare resource coordination.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/epics"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-base shadow-lg transition-all hover:scale-105"
            >
              <Layers className="w-5 h-5" />
              <span>Explore Team Epics & Tasks</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/work"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold text-base transition-all"
            >
              <ClipboardList className="w-5 h-5 text-teal-300" />
              <span>Launch Work Queue (12 Tickets)</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Dual Cards */}
      <div className="max-w-5xl mx-auto px-6 -mt-10 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Team Epics & Task Architecture */}
          <div className="bg-white rounded-2xl p-7 border border-slate-200 shadow-md flex flex-col justify-between hover:shadow-lg transition">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
                  <Layers className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  6 Epics (5 Complete, 1 Active)
                </span>
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Team Epics & Task Architecture
                </h2>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                  Full visibility into the entire project engineering lifecycle. View each member&apos;s contributions, itemized subtasks with live status badges, deliverable code files, and unit test verifications.
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
                <div className="flex items-center justify-between">
                  <span>👑 Sarthak (Lead)</span>
                  <span className="font-semibold text-slate-900">Epic 1 & 5 (15 Tasks)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>📋 Vaishnavi (District)</span>
                  <span className="font-semibold text-slate-900">Epic 2 (8 Tasks)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>🏥 Riya (Facility)</span>
                  <span className="font-semibold text-slate-900">Epic 3 (9 Tasks)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>🚚 Shneanjali (Logistics)</span>
                  <span className="font-semibold text-slate-900">Epic 4 (10 Tasks)</span>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <Link
                href="/epics"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold transition"
              >
                <span>View Complete Epics Board</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 2: Operational Work Queue */}
          <div className="bg-white rounded-2xl p-7 border border-slate-200 shadow-md flex flex-col justify-between hover:shadow-lg transition">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
                  <ClipboardList className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">
                  12 Active Tickets Live
                </span>
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Operational Work Queue
                </h2>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                  Interactive real-time work queue managing emergency stockouts, cold-chain breaches, and inter-facility transfers across Odisha health centers with live state transitions.
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
                <div className="flex items-center justify-between">
                  <span>Emergency Blood Shortage</span>
                  <span className="font-semibold text-red-600">Capital Hospital (Urgent)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Oxytocin Cold-Chain Breach</span>
                  <span className="font-semibold text-amber-600">Pipili PHC (High)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Maternal Emergency Transfer</span>
                  <span className="font-semibold text-teal-600">Jatni CHC ➔ DHH</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Rabies Vaccine Stockout</span>
                  <span className="font-semibold text-slate-700">Khurda DHH</span>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <Link
                href="/work"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold transition"
              >
                <span>Launch Operational Work Queue</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* System Architecture Badges */}
        <section className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-teal-600 shrink-0" />
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  Full Stack Health Grid Engine
                </h3>
                <p className="text-xs text-slate-500">
                  PostgreSQL 16 multi-schema + Go 1.22 Chi API (:8085) + Next.js 14 Web UI (:3000)
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-700 border">
                19 Unit Tests (100% Pass)
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-700 border">
                Idempotency Engine Active
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-700 border">
                4 Tier RBAC
              </span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}