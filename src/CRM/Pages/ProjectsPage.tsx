import { CalendarDays, Clock3, Flag, ListChecks } from 'lucide-react'
import PageHeader from '../Components/PageHeader'
import './EnterpriseSuite.css'

const projects = [
  { name: 'ERP rollout for Apex Retail', customer: 'Apex Retail', budget: '$84,000', deadline: 'Jun 28, 2026', progress: 68, milestone: 'UAT' },
  { name: 'CRM migration for NovaCare', customer: 'NovaCare Clinics', budget: '$42,500', deadline: 'Jul 12, 2026', progress: 44, milestone: 'Data import' },
  { name: 'Support portal launch', customer: 'BluePeak SaaS', budget: '$28,000', deadline: 'Jun 18, 2026', progress: 82, milestone: 'Training' },
]

const tasks = {
  'To Do': ['Prepare go-live checklist', 'Confirm branch contacts', 'Approve tax template'],
  'In Progress': ['Map legacy customer fields', 'Configure SLA queues', 'Build invoice workflow'],
  Done: ['Create project from sales order', 'Assign project manager', 'Import kickoff notes'],
}

export default function ProjectsPage() {
  return (
    <div className="suite-page">
      <PageHeader
        eyebrow="Project Management"
        title="Delivery workspace"
        subtitle="Turn customer purchases into projects, milestones, tasks, deadlines, budgets, and employee timesheets."
        actions={<button className="btn-primary" type="button"><ListChecks size={16} /> New Project</button>}
      />

      <div className="suite-grid four">
        <div className="suite-panel suite-panel-pad suite-kpi"><div><div className="suite-kpi-label">Active projects</div><div className="suite-kpi-value">32</div><div className="suite-kpi-note">Customer purchase to delivery</div></div><div className="suite-icon"><Flag size={20} /></div></div>
        <div className="suite-panel suite-panel-pad suite-kpi"><div><div className="suite-kpi-label">Tasks due</div><div className="suite-kpi-value">118</div><div className="suite-kpi-note">Across implementation teams</div></div><div className="suite-icon"><ListChecks size={20} /></div></div>
        <div className="suite-panel suite-panel-pad suite-kpi"><div><div className="suite-kpi-label">Timesheets</div><div className="suite-kpi-value">1,284h</div><div className="suite-kpi-note">Tracked this month</div></div><div className="suite-icon"><Clock3 size={20} /></div></div>
        <div className="suite-panel suite-panel-pad suite-kpi"><div><div className="suite-kpi-label">At risk deadlines</div><div className="suite-kpi-value">4</div><div className="suite-kpi-note">Need manager attention</div></div><div className="suite-icon"><CalendarDays size={20} /></div></div>
      </div>

      <section className="suite-section suite-panel">
        <div className="suite-table-wrap">
          <table className="suite-table">
            <thead><tr><th>Project</th><th>Customer</th><th>Budget</th><th>Deadline</th><th>Milestone</th><th>Progress</th></tr></thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.name}>
                  <td><div className="suite-name">{project.name}</div><div className="suite-muted">Tasks, assignees, due dates, and milestones attached</div></td>
                  <td>{project.customer}</td><td>{project.budget}</td><td>{project.deadline}</td><td>{project.milestone}</td>
                  <td><div className="suite-progress"><span style={{ width: `${project.progress}%` }} /></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="suite-section">
        <h2 className="suite-section-title">Task board</h2>
        <div className="suite-kanban">
          {Object.entries(tasks).map(([status, items]) => (
            <div className="suite-column" key={status}>
              <div className="suite-column-head"><span>{status}</span><span className="suite-pill">{items.length}</span></div>
              {items.map((task) => (
                <div className="suite-task" key={task}>
                  <div className="suite-task-title">{task}</div>
                  <div className="suite-task-meta"><span className="suite-pill">Assignee</span><span className="suite-pill amber">Due date</span></div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
