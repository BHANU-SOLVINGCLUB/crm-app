import { Building2, Save } from 'lucide-react'

export default function OrganizationSettings() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h3 className="text-lg font-semibold text-slate-800">Organization Settings</h3>
        <p className="text-sm text-slate-500 mt-1">Manage your company details and default preferences.</p>
      </div>

      <div className="flex items-center gap-6 pb-6 border-b border-line">
        <div className="h-16 w-16 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
          <Building2 className="h-8 w-8" />
        </div>
        <div>
          <button className="btn-ghost !text-[13px] mb-2">Upload company logo</button>
          <div className="text-[12px] text-slate-500">Square image recommended.</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div className="col-span-2">
          <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Company Name</label>
          <input type="text" className="input" defaultValue="Acme Corporation" />
        </div>
        <div className="col-span-2">
          <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Company Website</label>
          <input type="url" className="input" defaultValue="https://acme.corp" />
        </div>
        <div className="col-span-2">
          <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Business Address</label>
          <textarea className="input min-h-[80px]" defaultValue="123 Business Avenue, Suite 400\nSan Francisco, CA 94107\nUnited States" />
        </div>
        
        <div>
          <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Default Timezone</label>
          <select className="input">
            <option>Pacific Time (PT)</option>
            <option>Eastern Time (ET)</option>
            <option>Coordinated Universal Time (UTC)</option>
            <option>Indian Standard Time (IST)</option>
          </select>
        </div>
        <div>
          <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Default Currency</label>
          <select className="input">
            <option>USD ($)</option>
            <option>EUR (€)</option>
            <option>GBP (£)</option>
            <option>INR (₹)</option>
          </select>
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <button className="btn-primary">
          <Save className="h-4 w-4" /> Save Organization
        </button>
      </div>
    </div>
  )
}
