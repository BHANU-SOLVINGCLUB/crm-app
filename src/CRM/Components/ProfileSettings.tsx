import { Camera, Save } from 'lucide-react'

export default function ProfileSettings() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h3 className="text-lg font-semibold text-slate-800">Profile Information</h3>
        <p className="text-sm text-slate-500 mt-1">Update your personal details and public profile.</p>
      </div>

      <div className="flex items-center gap-6 pb-6 border-b border-line">
        <div className="relative">
          <div className="h-24 w-24 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white text-3xl font-bold shadow-md">
            JD
          </div>
          <button className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-600 hover:text-brand-blue hover:border-brand-blue transition-colors">
            <Camera className="h-4 w-4" />
          </button>
        </div>
        <div>
          <button className="btn-ghost !text-[13px] mb-2">Upload new picture</button>
          <div className="text-[12px] text-slate-500">JPG, GIF or PNG. Max size of 800K.</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div>
          <label className="block text-[13px] font-medium text-slate-700 mb-1.5">First Name</label>
          <input type="text" className="input" defaultValue="John" />
        </div>
        <div>
          <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Last Name</label>
          <input type="text" className="input" defaultValue="Doe" />
        </div>
        <div className="col-span-2">
          <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Email Address</label>
          <input type="email" className="input" defaultValue="john.doe@example.com" />
        </div>
        <div>
          <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Phone Number</label>
          <input type="tel" className="input" defaultValue="+1 (555) 000-0000" />
        </div>
        <div>
          <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Role</label>
          <input type="text" className="input bg-slate-50 text-slate-500 cursor-not-allowed" defaultValue="Administrator" disabled />
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <button className="btn-primary">
          <Save className="h-4 w-4" /> Save Changes
        </button>
      </div>
    </div>
  )
}

