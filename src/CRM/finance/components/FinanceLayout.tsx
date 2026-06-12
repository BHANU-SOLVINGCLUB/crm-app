import { Outlet } from 'react-router-dom'
import PageHeader from '../../../components/common/PageHeader'
import FinanceBreadcrumbs from './FinanceBreadcrumbs'
import FinanceNav from './FinanceNav'
import FinanceToolbar from './FinanceToolbar'

export default function FinanceLayout() {
  return (
    <div className="py-6 lg:py-8">
      <div className="px-5 lg:px-8">
        <FinanceBreadcrumbs />
        <div className="mt-4">
          <PageHeader
            eyebrow="Revenue Operations"
            title="Finance Command Center"
            subtitle="Enterprise controls for invoicing, collections, payments, spend, reporting, and configuration."
            actions={<FinanceToolbar />}
          />
        </div>
      </div>
      <FinanceNav />
      <div className="px-5 pt-6 lg:px-8">
        <Outlet />
      </div>
    </div>
  )
}
