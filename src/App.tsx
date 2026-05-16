import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Sidebar from './components/layout/Sidebar'
import Topbar from './components/layout/Topbar'
import Dashboard from './pages/Dashboard'
import Marketing from './pages/Marketing'
import LeadCapture from './pages/LeadCapture'
import SalesPipeline from './pages/SalesPipeline'
import CustomersPage from './pages/customers/CustomersPage'
import FinancePage from './pages/finance/FinancePage'

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 min-w-0 flex flex-col">
          <Topbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/marketing" element={<Marketing />} />
              <Route path="/leads" element={<LeadCapture />} />
              <Route path="/sales" element={<SalesPipeline />} />
              <Route path="/customers" element={<CustomersPage />} />
              <Route path="/finance" element={<FinancePage />} />
              <Route path="*" element={<Dashboard />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  )
}
