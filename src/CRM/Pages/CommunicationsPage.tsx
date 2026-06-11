import { Mail, MessageCircle, PhoneCall, Send } from 'lucide-react'
import PageHeader from '../Components/PageHeader'
import './EnterpriseSuite.css'

const campaigns = [
  { channel: 'Email', name: 'Renewal nurture', audience: 'Customer accounts', sent: '12,430', tracked: '42% open' },
  { channel: 'SMS', name: 'Invoice reminder', audience: 'Pending payments', sent: '1,084', tracked: '19% paid' },
  { channel: 'WhatsApp', name: 'Demo follow-up', audience: 'Qualified leads', sent: '842', tracked: '31% replied' },
]

const callLogs = [
  { type: 'Incoming', contact: 'Apex Retail', owner: 'Maya Rao', outcome: 'Support ticket created' },
  { type: 'Outgoing', contact: 'BluePeak SaaS', owner: 'Arjun Mehta', outcome: 'Quote approval requested' },
  { type: 'Outgoing', contact: 'NovaCare Clinics', owner: 'Priya Nair', outcome: 'Meeting booked' },
]

export default function CommunicationsPage() {
  return (
    <div className="suite-page">
      <PageHeader
        eyebrow="Communication Center"
        title="Email, SMS, WhatsApp, chat, calls"
        subtitle="Coordinate customer conversations with templates, campaign tracking, notifications, broadcasts, chat, and call logs."
        actions={<button className="btn-primary" type="button"><Send size={16} /> Send Message</button>}
      />

      <div className="suite-grid four">
        <div className="suite-panel suite-panel-pad suite-kpi"><div><div className="suite-kpi-label">Emails sent</div><div className="suite-kpi-value">12.4k</div><div className="suite-kpi-note">Templates and tracking enabled</div></div><div className="suite-icon"><Mail size={20} /></div></div>
        <div className="suite-panel suite-panel-pad suite-kpi"><div><div className="suite-kpi-label">SMS campaigns</div><div className="suite-kpi-value">18</div><div className="suite-kpi-note">Payment and follow-up flows</div></div><div className="suite-icon"><MessageCircle size={20} /></div></div>
        <div className="suite-panel suite-panel-pad suite-kpi"><div><div className="suite-kpi-label">WhatsApp replies</div><div className="suite-kpi-value">31%</div><div className="suite-kpi-note">Qualified lead broadcast</div></div><div className="suite-icon"><MessageCircle size={20} /></div></div>
        <div className="suite-panel suite-panel-pad suite-kpi"><div><div className="suite-kpi-label">Call logs</div><div className="suite-kpi-value">326</div><div className="suite-kpi-note">Incoming and outgoing</div></div><div className="suite-icon"><PhoneCall size={20} /></div></div>
      </div>

      <section className="suite-section suite-grid two">
        <div className="suite-panel">
          <h2 className="suite-section-title suite-panel-pad">Campaigns</h2>
          <div className="suite-table-wrap">
            <table className="suite-table">
              <thead><tr><th>Channel</th><th>Name</th><th>Audience</th><th>Sent</th><th>Tracking</th></tr></thead>
              <tbody>{campaigns.map((campaign) => <tr key={campaign.name}><td>{campaign.channel}</td><td><div className="suite-name">{campaign.name}</div></td><td>{campaign.audience}</td><td>{campaign.sent}</td><td><span className="suite-pill green">{campaign.tracked}</span></td></tr>)}</tbody>
            </table>
          </div>
        </div>
        <div className="suite-panel">
          <h2 className="suite-section-title suite-panel-pad">Call logs</h2>
          <div className="suite-table-wrap">
            <table className="suite-table">
              <thead><tr><th>Type</th><th>Contact</th><th>Owner</th><th>Outcome</th></tr></thead>
              <tbody>{callLogs.map((call) => <tr key={`${call.contact}-${call.outcome}`}><td>{call.type}</td><td><div className="suite-name">{call.contact}</div></td><td>{call.owner}</td><td>{call.outcome}</td></tr>)}</tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  )
}
