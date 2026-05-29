import { Navigate, Route, Routes } from 'react-router-dom'
import SupportLayout from '../support/components/SupportLayout'
import SupportAnalyticsPage from '../support/pages/analytics/SupportAnalyticsPage'
import CustomerConversationsPage from '../support/pages/conversations/CustomerConversationsPage'
import SupportDashboardPage from '../support/pages/dashboard/SupportDashboardPage'
import EscalationsPage from '../support/pages/escalations/EscalationsPage'
import KnowledgeBasePage from '../support/pages/knowledge-base/KnowledgeBasePage'
import MyTicketsPage from '../support/pages/my-tickets/MyTicketsPage'
import SupportSettingsPage from '../support/pages/settings/SupportSettingsPage'
import SlaManagementPage from '../support/pages/sla/SlaManagementPage'
import AllTicketsPage from '../support/pages/tickets/AllTicketsPage'
import TicketDetailPage from '../support/pages/tickets/TicketDetailPage'
import UnassignedTicketsPage from '../support/pages/unassigned/UnassignedTicketsPage'

export default function SupportPage() {
  return (
    <Routes>
      <Route element={<SupportLayout />}>
        <Route index element={<SupportDashboardPage />} />
        <Route path="tickets" element={<AllTicketsPage />} />
        <Route path="tickets/:ticketId" element={<TicketDetailPage />} />
        <Route path="my-tickets" element={<MyTicketsPage />} />
        <Route path="unassigned" element={<UnassignedTicketsPage />} />
        <Route path="escalations" element={<EscalationsPage />} />
        <Route path="sla" element={<SlaManagementPage />} />
        <Route path="knowledge-base" element={<KnowledgeBasePage />} />
        <Route path="conversations" element={<CustomerConversationsPage />} />
        <Route path="analytics" element={<SupportAnalyticsPage />} />
        <Route path="settings" element={<SupportSettingsPage />} />
        <Route path="*" element={<Navigate to="/support" replace />} />
      </Route>
    </Routes>
  )
}
