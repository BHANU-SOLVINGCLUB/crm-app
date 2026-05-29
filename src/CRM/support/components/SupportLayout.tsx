import { Outlet } from 'react-router-dom'
import PageHeader from '../../Components/PageHeader'
import SupportBreadcrumbs from './SupportBreadcrumbs'
import SupportNav from './SupportNav'
import SupportToolbar from './SupportToolbar'

export default function SupportLayout() {
  return (
    <div className="py-6 lg:py-8">
      <div className="px-5 lg:px-8">
        <SupportBreadcrumbs />
        <div className="mt-4">
          <PageHeader
            eyebrow="Service Operations"
            title="Support Command Center"
            subtitle="Run enterprise support with ticketing, escalations, customer conversations, SLA tracking, and a self-serve knowledge base."
            actions={<SupportToolbar />}
          />
        </div>
      </div>
      <SupportNav />
      <div className="px-5 pt-6 lg:px-8">
        <Outlet />
      </div>
    </div>
  )
}
