import { useMemo, useState } from 'react'
import { DatabaseBackup, Download, FileCheck2, Save, Upload } from 'lucide-react'
import { pushAppToast } from '../../store/uiStore'

const INITIAL_JOBS = [
  { id: 'import-1', type: 'Import', name: 'Healthcare leads import', records: 245, status: 'Completed', owner: 'Sales Ops' },
  { id: 'dedupe-1', type: 'Deduplication', name: 'Customer email match', records: 18, status: 'Needs review', owner: 'Operations' },
  { id: 'export-1', type: 'Export', name: 'Finance invoice archive', records: 156, status: 'Scheduled', owner: 'Finance' },
  { id: 'backup-1', type: 'Backup', name: 'Daily workspace backup', records: 1061, status: 'Completed', owner: 'System' },
]

const RETENTION_OPTIONS = ['30 days', '90 days', '180 days', '1 year', 'Never auto-delete']

export default function DataAdministrationSettings() {
  const [jobs, setJobs] = useState(INITIAL_JOBS)
  const [retention, setRetention] = useState('180 days')

  const stats = useMemo(
    () => ({
      records: jobs.reduce((sum, job) => sum + job.records, 0),
      review: jobs.filter((job) => job.status === 'Needs review').length,
      scheduled: jobs.filter((job) => job.status === 'Scheduled').length,
    }),
    [jobs]
  )

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Data administration</div>
          <h3 className="mt-2 text-lg font-semibold text-slate-900">Import, cleanup, and governance</h3>
          <p className="mt-1 text-sm text-slate-500">Manage CRM data movement, duplicate review, export schedules, retention, and backup policy.</p>
        </div>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="rounded-xl border border-line bg-slate-50 px-4 py-3">
            <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Records</div>
            <div className="mt-1 text-2xl font-bold text-slate-900">{stats.records}</div>
          </div>
          <div className="rounded-xl border border-line bg-slate-50 px-4 py-3">
            <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Review</div>
            <div className="mt-1 text-2xl font-bold text-slate-900">{stats.review}</div>
          </div>
          <div className="rounded-xl border border-line bg-slate-50 px-4 py-3">
            <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Scheduled</div>
            <div className="mt-1 text-2xl font-bold text-slate-900">{stats.scheduled}</div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <button className="rounded-xl border border-line bg-white p-4 text-left hover:bg-slate-50" onClick={() => pushAppToast('Import wizard opened.', 'success')}>
          <Upload className="h-5 w-5 text-brand-blue" />
          <div className="mt-3 text-[13px] font-semibold text-slate-900">Import data</div>
          <div className="mt-1 text-[12px] text-slate-500">CSV, spreadsheet, or mapped CRM records.</div>
        </button>
        <button className="rounded-xl border border-line bg-white p-4 text-left hover:bg-slate-50" onClick={() => pushAppToast('Export schedule opened.', 'success')}>
          <Download className="h-5 w-5 text-brand-blue" />
          <div className="mt-3 text-[13px] font-semibold text-slate-900">Export data</div>
          <div className="mt-1 text-[12px] text-slate-500">Create module exports and archives.</div>
        </button>
        <button className="rounded-xl border border-line bg-white p-4 text-left hover:bg-slate-50" onClick={() => pushAppToast('Duplicate review opened.', 'success')}>
          <FileCheck2 className="h-5 w-5 text-brand-blue" />
          <div className="mt-3 text-[13px] font-semibold text-slate-900">Deduplicate</div>
          <div className="mt-1 text-[12px] text-slate-500">Review exact and fuzzy record matches.</div>
        </button>
        <button className="rounded-xl border border-line bg-white p-4 text-left hover:bg-slate-50" onClick={() => pushAppToast('Backup settings opened.', 'success')}>
          <DatabaseBackup className="h-5 w-5 text-brand-blue" />
          <div className="mt-3 text-[13px] font-semibold text-slate-900">Backups</div>
          <div className="mt-1 text-[12px] text-slate-500">Manage recurring workspace snapshots.</div>
        </button>
      </div>

      <div className="rounded-xl border border-line bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h4 className="text-[15px] font-semibold text-slate-900">Data jobs</h4>
            <p className="mt-1 text-[13px] text-slate-500">Recent and scheduled data operations across the CRM.</p>
          </div>
          <label className="flex items-center gap-2 text-[13px] font-semibold text-slate-700">
            Retention
            <select className="input !py-2 !text-[13px]" value={retention} onChange={(event) => setRetention(event.target.value)}>
              {RETENTION_OPTIONS.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-4 overflow-hidden rounded-xl border border-line">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3">Job</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Records</th>
                <th className="px-4 py-3">Owner</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {jobs.map((job) => (
                <tr key={job.id}>
                  <td className="px-4 py-3 font-semibold text-slate-800">{job.name}</td>
                  <td className="px-4 py-3 text-slate-600">{job.type}</td>
                  <td className="px-4 py-3 text-slate-600">{job.records}</td>
                  <td className="px-4 py-3 text-slate-600">{job.owner}</td>
                  <td className="px-4 py-3">
                    <button
                      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider ${job.status === 'Needs review' ? 'bg-amber-100 text-amber-700' : job.status === 'Scheduled' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}
                      onClick={() => {
                        if (job.status === 'Needs review') {
                          setJobs((current) => current.map((item) => (item.id === job.id ? { ...item, status: 'Completed' } : item)))
                          pushAppToast(`${job.name} marked completed.`, 'success')
                        }
                      }}
                    >
                      {job.status}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-end border-t border-line pt-4">
        <button className="btn-primary" onClick={() => pushAppToast('Data administration settings saved.', 'success')}>
          <Save className="h-4 w-4" />
          Save data policy
        </button>
      </div>
    </div>
  )
}
