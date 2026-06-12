import { GitBranch, Mail, Play, Plus, Workflow, Zap } from 'lucide-react'
import PageHeader from '../components/common/PageHeader'
import './EnterpriseSuite.css'

const rules = [
  { trigger: 'Lead Created', condition: 'Source is Website and Budget > $10,000', action: 'Assign Sales Rep and create follow-up task', status: 'Active' },
  { trigger: 'Lead Status = Qualified', condition: 'Interest contains CRM', action: 'Create Opportunity Automatically', status: 'Active' },
  { trigger: 'Opportunity Won', condition: 'Deal value approved', action: 'Create Sales Order, Project, and Invoice', status: 'Active' },
  { trigger: 'Ticket Closed', condition: 'Priority was High or Critical', action: 'Send CSAT survey and notify Support Manager', status: 'Paused' },
  { trigger: 'Invoice Generated', condition: 'Amount due > $5,000', action: 'Send email, SMS reminder, and finance approval task', status: 'Active' },
]

const actions = ['Send Email', 'Create Task', 'Notify Manager', 'Update Status', 'Create Opportunity', 'Generate Invoice']

export default function AutomationEnginePage() {
  return (
    <div className="suite-page">
      <PageHeader
        eyebrow="Automation Engine"
        title="Trigger, condition, action workflows"
        subtitle="Automate CRM lifecycle events across leads, opportunities, invoices, tickets, projects, and approvals."
        actions={<button className="btn-primary" type="button"><Plus size={16} /> New Rule</button>}
      />

      <div className="suite-grid four">
        <div className="suite-panel suite-panel-pad suite-kpi"><div><div className="suite-kpi-label">Active rules</div><div className="suite-kpi-value">42</div><div className="suite-kpi-note">Cross-module workflows</div></div><div className="suite-icon"><Workflow size={20} /></div></div>
        <div className="suite-panel suite-panel-pad suite-kpi"><div><div className="suite-kpi-label">Runs today</div><div className="suite-kpi-value">1,284</div><div className="suite-kpi-note">99.7% successful</div></div><div className="suite-icon"><Play size={20} /></div></div>
        <div className="suite-panel suite-panel-pad suite-kpi"><div><div className="suite-kpi-label">Approvals</div><div className="suite-kpi-value">23</div><div className="suite-kpi-note">Waiting on managers</div></div><div className="suite-icon"><GitBranch size={20} /></div></div>
        <div className="suite-panel suite-panel-pad suite-kpi"><div><div className="suite-kpi-label">Notifications</div><div className="suite-kpi-value">8.9k</div><div className="suite-kpi-note">Email, SMS, push, WhatsApp</div></div><div className="suite-icon"><Mail size={20} /></div></div>
      </div>

      <section className="suite-section suite-panel">
        <div className="suite-table-wrap">
          <table className="suite-table">
            <thead><tr><th>Trigger</th><th>Condition</th><th>Action</th><th>Status</th></tr></thead>
            <tbody>
              {rules.map((rule) => (
                <tr key={`${rule.trigger}-${rule.action}`}>
                  <td><div className="suite-name">{rule.trigger}</div></td>
                  <td>{rule.condition}</td>
                  <td>{rule.action}</td>
                  <td><span className={`suite-pill ${rule.status === 'Active' ? 'green' : 'amber'}`}>{rule.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="suite-section">
        <h2 className="suite-section-title">Action library</h2>
        <div className="suite-grid three">
          {actions.map((action) => (
            <div className="suite-panel suite-panel-pad" key={action}>
              <div className="flex items-center gap-3">
                <div className="suite-icon"><Zap size={18} /></div>
                <div>
                  <div className="suite-name">{action}</div>
                  <div className="suite-muted">Available in workflow builder</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
