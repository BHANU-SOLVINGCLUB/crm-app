import { Download, FileSpreadsheet } from 'lucide-react'
import { reports } from '../../services/mockFinanceData'
import FinanceStatusBadge from '../../components/FinanceStatusBadge'
import { formatFinanceDate } from '../../utils/formatters'
import { pushAppToast } from '../../../../store/uiStore'

export default function ReportsPage() {
  return (
    <div className="space-y-6 fade-up">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {reports.map((report) => (
          <section key={report.id} className="card p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="icon-tile bg-theme-surface text-theme-primary">
                <FileSpreadsheet className="h-5 w-5" />
              </div>
              <FinanceStatusBadge status={report.format} />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-theme-primary">{report.name}</h3>
            <p className="mt-1 text-sm text-theme-secondary">{report.category}</p>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-theme-secondary">Last run</span>
                <span className="font-medium text-theme-primary">{formatFinanceDate(report.lastRun)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-theme-secondary">Schedule</span>
                <span className="font-medium text-theme-primary">{report.schedule}</span>
              </div>
            </div>
            <div className="mt-5 flex gap-2">
              <button className="btn-ghost flex-1" onClick={() => pushAppToast(`${report.name} scheduled run updated.`, 'success')}>Schedule</button>
              <button className="btn-primary flex-1" onClick={() => pushAppToast(`${report.name} export started.`, 'success')}>
                <Download className="h-4 w-4" /> Download
              </button>
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
