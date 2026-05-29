import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Sidebar from './CRM/Components/Sidebar'
import Topbar from './CRM/Components/Topbar'
import GlobalToast from './CRM/Components/GlobalToast'
import Dashboard from './CRM/Pages/Dashboard'
import Marketing from './CRM/Pages/Marketing'
import LeadCapture from './CRM/Pages/LeadCapture'
import LeadDetailPage from './CRM/Pages/LeadDetailPage'
import DealDetailPage from './CRM/Pages/DealDetailPage'
import SalesPipeline from './CRM/Pages/SalesPipeline'
import CustomersPage from './CRM/Pages/CustomersPage'
import SettingsPage from './CRM/Pages/SettingsPage'
import FinanceLayout from './CRM/finance/components/FinanceLayout'
import RevenueAnalyticsPage from './CRM/finance/pages/analytics/RevenueAnalyticsPage'
import CollectionsPage from './CRM/finance/pages/collections/CollectionsPage'
import FinanceDashboardPage from './CRM/finance/pages/dashboard/FinanceDashboardPage'
import ExpensesPage from './CRM/finance/pages/expenses/ExpensesPage'
import InvoiceDetailPage from './CRM/finance/pages/invoices/InvoiceDetailPage'
import InvoicesPage from './CRM/finance/pages/invoices/InvoicesPage'
import PaymentsPage from './CRM/finance/pages/payments/PaymentsPage'
import ReportsPage from './CRM/finance/pages/reports/ReportsPage'
import FinanceSettingsPage from './CRM/finance/pages/settings/FinanceSettingsPage'
import SupportLayout from './CRM/support/components/SupportLayout'
import SupportAnalyticsPage from './CRM/support/pages/analytics/SupportAnalyticsPage'
import CustomerConversationsPage from './CRM/support/pages/conversations/CustomerConversationsPage'
import SupportDashboardPage from './CRM/support/pages/dashboard/SupportDashboardPage'
import EscalationsPage from './CRM/support/pages/escalations/EscalationsPage'
import KnowledgeBasePage from './CRM/support/pages/knowledge-base/KnowledgeBasePage'
import MyTicketsPage from './CRM/support/pages/my-tickets/MyTicketsPage'
import AgentManagementPage from './CRM/support/pages/settings/AgentManagementPage'
import AutomationRulesPage from './CRM/support/pages/settings/AutomationRulesPage'
import GeneralSettingsPage from './CRM/support/pages/settings/GeneralSettingsPage'
import NotificationsSettingsPage from './CRM/support/pages/settings/NotificationsSettingsPage'
import RolesPermissionsPage from './CRM/support/pages/settings/RolesPermissionsPage'
import SlaSettingsPage from './CRM/support/pages/settings/SlaSettingsPage'
import SupportSettingsPage from './CRM/support/pages/settings/SupportSettingsPage'
import SupportSettingsOverviewPage from './CRM/support/pages/settings/SupportSettingsOverviewPage'
import TeamsSettingsPage from './CRM/support/pages/settings/TeamsSettingsPage'
import SlaManagementPage from './CRM/support/pages/sla/SlaManagementPage'
import AllTicketsPage from './CRM/support/pages/tickets/AllTicketsPage'
import TicketDetailPage from './CRM/support/pages/tickets/TicketDetailPage'
import UnassignedTicketsPage from './CRM/support/pages/unassigned/UnassignedTicketsPage'
import './App.css'

export default function App() {
  return (
    <BrowserRouter>
      <div className="crm-app-shell">
        <Sidebar />
        <div className="crm-main-shell">
          <Topbar />
          <main className="crm-page-shell">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/marketing" element={<Marketing />} />
              <Route path="/leads" element={<LeadCapture />} />
              <Route path="/leads/:leadId" element={<LeadDetailPage />} />
              <Route path="/sales" element={<SalesPipeline />} />
              <Route path="/sales/:dealId" element={<DealDetailPage />} />
              <Route path="/customers" element={<CustomersPage />} />
              <Route path="/finance" element={<FinanceLayout />}>
                <Route index element={<FinanceDashboardPage />} />
                <Route path="invoices" element={<InvoicesPage />} />
                <Route path="invoices/:invoiceId" element={<InvoiceDetailPage />} />
                <Route path="payments" element={<PaymentsPage />} />
                <Route path="expenses" element={<ExpensesPage />} />
                <Route path="collections" element={<CollectionsPage />} />
                <Route path="analytics" element={<RevenueAnalyticsPage />} />
                <Route path="reports" element={<ReportsPage />} />
                <Route path="settings" element={<FinanceSettingsPage />} />
              </Route>
              <Route path="/support" element={<SupportLayout />}>
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
                <Route path="settings" element={<SupportSettingsPage />}>
                  <Route index element={<SupportSettingsOverviewPage />} />
                  <Route path="general" element={<GeneralSettingsPage />} />
                  <Route path="teams" element={<TeamsSettingsPage />} />
                  <Route path="agents" element={<AgentManagementPage />} />
                  <Route path="roles" element={<RolesPermissionsPage />} />
                  <Route path="notifications" element={<NotificationsSettingsPage />} />
                  <Route path="sla-settings" element={<SlaSettingsPage />} />
                  <Route path="automation" element={<AutomationRulesPage />} />
                </Route>
              </Route>
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<Dashboard />} />
            </Routes>
          </main>
        </div>
        <GlobalToast />
      </div>
    </BrowserRouter>
  )
}
