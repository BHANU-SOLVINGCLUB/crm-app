import { Navigate, Route, Routes } from 'react-router-dom'
import FinanceLayout from '../CRM/finance/components/FinanceLayout'
import RevenueAnalyticsPage from '../CRM/finance/pages/analytics/RevenueAnalyticsPage'
import CollectionsPage from '../CRM/finance/pages/collections/CollectionsPage'
import FinanceDashboardPage from '../CRM/finance/pages/dashboard/FinanceDashboardPage'
import ExpensesPage from '../CRM/finance/pages/expenses/ExpensesPage'
import InvoiceDetailPage from '../CRM/finance/pages/invoices/InvoiceDetailPage'
import InvoicesPage from '../CRM/finance/pages/invoices/InvoicesPage'
import PaymentsPage from '../CRM/finance/pages/payments/PaymentsPage'
import ReportsPage from '../CRM/finance/pages/reports/ReportsPage'
import FinanceSettingsPage from '../CRM/finance/pages/settings/FinanceSettingsPage'

export default function FinancePage() {
  return (
    <Routes>
      <Route element={<FinanceLayout />}>
        <Route index element={<FinanceDashboardPage />} />
        <Route path="invoices" element={<InvoicesPage />} />
        <Route path="invoices/:invoiceId" element={<InvoiceDetailPage />} />
        <Route path="payments" element={<PaymentsPage />} />
        <Route path="expenses" element={<ExpensesPage />} />
        <Route path="collections" element={<CollectionsPage />} />
        <Route path="analytics" element={<RevenueAnalyticsPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="settings" element={<FinanceSettingsPage />} />
        <Route path="*" element={<Navigate to="/finance" replace />} />
      </Route>
    </Routes>
  )
}
