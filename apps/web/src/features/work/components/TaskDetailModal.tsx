'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  CheckCircle2,
  Clock,
  CircleDashed,
  FileCode2,
  ShieldCheck,
  ExternalLink,
  Layers,
  Terminal,
  User,
  Sparkles,
  GitPullRequest,
  Copy,
  Check
} from 'lucide-react';
import { EpicTask } from '../data/epics-data';

interface Props {
  task: (EpicTask & { epicCode?: string; epicTitle?: string }) | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TaskDetailModal({ task, isOpen, onClose }: Props) {
  const [copied, setCopied] = React.useState(false);

  if (!task) return null;

  const isComplete = task.status === 'COMPLETE';
  const isInProgress = task.status === 'IN_PROGRESS';

  const copyRef = () => {
    navigator.clipboard.writeText(`${task.code}: ${task.title}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0 rounded-2xl border-slate-200 shadow-2xl bg-white">
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white p-6 sm:p-7 relative overflow-hidden">
          <div className="flex items-center gap-2.5 flex-wrap mb-3">
            {task.epicCode && (
              <span className="px-2.5 py-1 rounded-md bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-bold font-mono">
                {task.epicCode}
              </span>
            )}
            <span className="px-2.5 py-1 rounded-md bg-white/10 text-slate-200 border border-white/15 text-xs font-semibold">
              {task.prdSection || 'PRD Core Scope'}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${
                isComplete
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  : isInProgress
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  : 'bg-slate-500/20 text-slate-300 border-slate-500/30'
              }`}
            >
              {isComplete ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              ) : isInProgress ? (
                <Clock className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <CircleDashed className="w-3.5 h-3.5 text-slate-400" />
              )}
              <span>{task.status}</span>
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {task.category}
            </span>
          </div>

          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="font-mono text-xs text-teal-400 font-bold uppercase tracking-wider block mb-1">
                Task Code: {task.code}
              </span>
              <DialogTitle className="text-xl sm:text-2xl font-black tracking-tight text-white leading-snug">
                {task.title}
              </DialogTitle>
              {task.epicTitle && (
                <DialogDescription className="text-xs sm:text-sm text-slate-300 mt-1 font-medium">
                  Part of Epic: <span className="text-white font-semibold">{task.epicTitle}</span>
                </DialogDescription>
              )}
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7 space-y-6">
          {/* Assignee & Ownership Card */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-2xl shadow-xs shrink-0">
                {task.assignee === 'Sarthak'
                  ? '👑'
                  : task.assignee === 'Vaishnavi'
                  ? '📋'
                  : task.assignee === 'Riya'
                  ? '🏥'
                  : '🚚'}
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                  Assigned Team Engineer
                </span>
                <span className="text-base font-bold text-slate-900 block">
                  {task.assignee}
                </span>
                <span className="text-xs text-slate-500 block">
                  {task.assigneeRole}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={copyRef}
                className="text-xs h-8 border-slate-200 text-slate-700 hover:bg-slate-100 flex items-center gap-1.5"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Reference'}</span>
              </Button>
            </div>
          </div>

          {/* Core Description */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>Core Task Specification & Scope</span>
            </h4>
            <div className="bg-white p-4 rounded-xl border border-slate-200 text-sm text-slate-700 leading-relaxed font-normal shadow-xs">
              {task.description}
            </div>
          </div>

          {/* Implementation Details / Math / Technical Logic */}
          {task.implementationDetails && task.implementationDetails.length > 0 && (
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-indigo-600" />
                <span>Technical Implementation & Architectural Logic</span>
              </h4>
              <div className="bg-slate-900 text-slate-200 p-4 rounded-xl text-xs space-y-2 font-mono shadow-inner border border-slate-800">
                {task.implementationDetails.map((detail, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-teal-400 font-bold shrink-0">➜</span>
                    <span className="leading-relaxed text-slate-300">{detail}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Deliverable Code Files */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <FileCode2 className="w-3.5 h-3.5 text-blue-600" />
              <span>Deliverable Source Code & Migration Files</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {task.files.map((file, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2.5 p-2.5 rounded-lg bg-slate-50 border border-slate-200/90 text-xs font-mono text-slate-800 hover:bg-slate-100 transition group"
                >
                  <span className="w-6 h-6 rounded bg-slate-200 text-slate-700 flex items-center justify-center text-[10px] font-bold shrink-0">
                    {file.endsWith('.go')
                      ? 'Go'
                      : file.endsWith('.sql')
                      ? 'SQL'
                      : file.endsWith('.tsx') || file.endsWith('.ts')
                      ? 'TS'
                      : 'CFG'}
                  </span>
                  <span className="truncate flex-1 font-medium" title={file}>
                    {file}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Verification & Quality Checklist */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Verification & Quality Assurance Standard</span>
            </h4>
            <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2.5 leading-relaxed">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-emerald-950 mb-0.5">Automated & Operational Verification Criteria:</span>
                <span>{task.verification}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/60 rounded-b-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
          <a
            href="https://github.com/Sarthak702-droid/Swasthya/pull/1"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-slate-950 transition"
          >
            <GitPullRequest className="w-4 h-4 text-teal-600" />
            <span>Tracked in Pull Request #1</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>

          <Button
            onClick={onClose}
            className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-5 py-2 rounded-xl"
          >
            Close Details
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
