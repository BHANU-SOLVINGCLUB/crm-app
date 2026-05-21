import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Sidebar from './CRM/Components/Sidebar'
import Topbar from './CRM/Components/Topbar'
import Dashboard from './CRM/Pages/Dashboard'
import Marketing from './CRM/Pages/Marketing'
import LeadCapture from './CRM/Pages/LeadCapture'
import SalesPipeline from './CRM/Pages/SalesPipeline'
import CustomersPage from './CRM/Pages/CustomersPage'
import FinancePage from './CRM/Pages/FinancePage'
import SupportPage from './CRM/Pages/SupportPage'
import SettingsPage from './CRM/Pages/SettingsPage'
import AnalyticsPage from './CRM/Pages/AnalyticsPage'
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
              <Route path="/sales" element={<SalesPipeline />} />
              <Route path="/customers" element={<CustomersPage />} />
              <Route path="/finance" element={<FinancePage />} />
              <Route path="/support" element={<SupportPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<Dashboard />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  )
}
