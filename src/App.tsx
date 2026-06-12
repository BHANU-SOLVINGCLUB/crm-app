import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom'
import Sidebar from './components/common/Sidebar'
import Topbar from './components/common/Topbar'
import GlobalToast from './components/common/GlobalToast'
import Dashboard from './pages/Dashboard'
import Marketing from './pages/Marketing'
import LeadCapture from './pages/LeadCapture'
import LeadDetailPage from './pages/LeadDetailPage'
import DealDetailPage from './pages/DealDetailPage'
import SalesPipeline from './pages/SalesPipeline'
import CustomersPage from './pages/CustomersPage'
import SettingsPage from './pages/SettingsPage'
import ProductCatalogLayout from './CRM/product-catalog/components/ProductCatalogLayout'
import OrdersPage from './CRM/orders/OrdersPage'
import ProductListPage from './CRM/product-catalog/pages/ProductListPage'
import AddProductPage from './CRM/product-catalog/pages/AddProductPage'
import ProductDetailsPage from './CRM/product-catalog/pages/ProductDetailsPage'
import CategoriesPage from './CRM/product-catalog/pages/CategoriesPage'
import BrandsPage from './CRM/product-catalog/pages/BrandsPage'
import VariantsPage from './CRM/product-catalog/pages/VariantsPage'
import InventoryReportsPage from './CRM/product-catalog/pages/InventoryReportsPage'
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
import { usePlatformStore } from './store/usePlatformStore'
import {
  ForgotPasswordPage,
  LoginPage,
  OnboardingPage,
  ResetPasswordPage,
  SignupPage,
  TwoFactorPage,
  VerifyEmailPage,
} from './pages/AuthPages'
import './App.css'

function PublicAuthRoute({ children }: { children: ReactNode }) {
  const isAuthenticated = usePlatformStore((state) => state.isAuthenticated)
  const onboardingComplete = usePlatformStore((state) => state.onboardingComplete)

  if (isAuthenticated && onboardingComplete) {
    return <Navigate to="/" replace />
  }

  if (isAuthenticated && !onboardingComplete) {
    return <Navigate to="/onboarding" replace />
  }

  return children
}

function OnboardingRoute() {
  const isAuthenticated = usePlatformStore((state) => state.isAuthenticated)
  const onboardingComplete = usePlatformStore((state) => state.onboardingComplete)

  if (!isAuthenticated) {
    return <Navigate to="/auth/signup" replace />
  }

  if (onboardingComplete) {
    return <Navigate to="/" replace />
  }

  return <OnboardingPage />
}

function AppShell() {
  const isAuthenticated = usePlatformStore((state) => state.isAuthenticated)
  const onboardingComplete = usePlatformStore((state) => state.onboardingComplete)

  if (!isAuthenticated) {
    return <Navigate to="/auth/signup" replace />
  }

  if (!onboardingComplete) {
    return <Navigate to="/onboarding" replace />
  }

  return (
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
            <Route path="/products" element={<ProductCatalogLayout />}>
              <Route index element={<ProductListPage />} />
              <Route path="new" element={<AddProductPage />} />
              <Route path=":productId" element={<ProductDetailsPage />} />
              <Route path="categories" element={<CategoriesPage />} />
              <Route path="brands" element={<BrandsPage />} />
              <Route path="variants" element={<VariantsPage />} />
              <Route path="reports" element={<InventoryReportsPage />} />
            </Route>
            <Route path="/orders" element={<OrdersPage />} />
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
  )
}

function SessionBootstrap({ children }: { children: ReactNode }) {
  const hydrateSession = usePlatformStore((state) => state.hydrateSession)
  const authLoading = usePlatformStore((state) => state.authLoading)

  useEffect(() => {
    void hydrateSession()
  }, [hydrateSession])

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-theme-secondary">
        Connecting to backend…
      </div>
    )
  }

  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <SessionBootstrap>
      <Routes>
        <Route path="/auth/signup" element={<PublicAuthRoute><SignupPage /></PublicAuthRoute>} />
        <Route path="/auth/login" element={<PublicAuthRoute><LoginPage /></PublicAuthRoute>} />
        <Route path="/auth/forgot-password" element={<PublicAuthRoute><ForgotPasswordPage /></PublicAuthRoute>} />
        <Route path="/auth/verify-email" element={<PublicAuthRoute><VerifyEmailPage /></PublicAuthRoute>} />
        <Route path="/auth/reset-password" element={<PublicAuthRoute><ResetPasswordPage /></PublicAuthRoute>} />
        <Route path="/auth/two-factor" element={<PublicAuthRoute><TwoFactorPage /></PublicAuthRoute>} />
        <Route path="/onboarding" element={<OnboardingRoute />} />
        <Route path="*" element={<AppShell />} />
      </Routes>
      </SessionBootstrap>
    </BrowserRouter>
  )
}
