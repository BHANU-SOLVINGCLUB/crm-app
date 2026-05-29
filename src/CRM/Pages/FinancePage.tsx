import { Navigate, Route, Routes } from 'react-router-dom'
import FinanceLayout from '../finance/components/FinanceLayout'
import RevenueAnalyticsPage from '../finance/pages/analytics/RevenueAnalyticsPage'
import CollectionsPage from '../finance/pages/collections/CollectionsPage'
import FinanceDashboardPage from '../finance/pages/dashboard/FinanceDashboardPage'
import ExpensesPage from '../finance/pages/expenses/ExpensesPage'
import InvoiceDetailPage from '../finance/pages/invoices/InvoiceDetailPage'
import InvoicesPage from '../finance/pages/invoices/InvoicesPage'
import PaymentsPage from '../finance/pages/payments/PaymentsPage'
import ReportsPage from '../finance/pages/reports/ReportsPage'
import FinanceSettingsPage from '../finance/pages/settings/FinanceSettingsPage'

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
