import type { ReactNode } from 'react'
import Sidebar from '../../components/common/Sidebar'
import Topbar from '../../components/common/Topbar'
import GlobalToast from '../../components/common/GlobalToast'
import '../../App.css'

export default function PlatformShell({ children }: { children: ReactNode }) {
  return (
    <div className="crm-app-shell">
      <Sidebar />
      <div className="crm-main-shell">
        <Topbar />
        <main className="crm-page-shell">{children}</main>
      </div>
      <GlobalToast />
    </div>
  )
}
