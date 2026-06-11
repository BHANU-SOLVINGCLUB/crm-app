import { useEffect, useMemo, useRef, useState } from 'react'
import { Building2, Check, Globe, MapPin, Save, Upload } from 'lucide-react'
import { usePlatformStore } from '../../store/usePlatformStore'
import { pushAppToast } from '../../store/uiStore'

type Draft = {
  companyName: string
  industry: string
  website: string
  taxId: string
  gstNumber: string
  address: string
  timezone: string
  departments: string
  teams: string
  branches: string
}

const TIMEZONE_OPTIONS = [
  'Asia/Kolkata',
  'Asia/Dubai',
  'Europe/London',
  'Europe/Berlin',
  'America/New_York',
  'America/Chicago',
  'America/Los_Angeles',
  'UTC',
]

function normalizeCsv(value: string) {
  return value
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)
}

export default function OrganizationSettings() {
  const organization = usePlatformStore((state) => state.organization)
  const updateOrganization = usePlatformStore((state) => state.updateOrganization)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [draft, setDraft] = useState<Draft>({
    companyName: organization.companyName,
    industry: organization.industry,
    website: organization.website,
    taxId: organization.taxId,
    gstNumber: organization.gstNumber,
    address: organization.address,
    timezone: organization.timezone,
    departments: organization.departments.join(', '),
    teams: organization.teams.join(', '),
    branches: organization.branches.join(', '),
  })

  useEffect(() => {
    setDraft({
      companyName: organization.companyName,
      industry: organization.industry,
      website: organization.website,
      taxId: organization.taxId,
      gstNumber: organization.gstNumber,
      address: organization.address,
      timezone: organization.timezone,
      departments: organization.departments.join(', '),
      teams: organization.teams.join(', '),
      branches: organization.branches.join(', '),
    })
  }, [organization])

  const selectedModules = useMemo(() => organization.selectedModules.map((module) => module.toUpperCase()), [organization.selectedModules])

  const saveOrganization = () => {
    updateOrganization({
      companyName: draft.companyName.trim() || organization.companyName,
      industry: draft.industry.trim() || organization.industry,
      website: draft.website.trim(),
      taxId: draft.taxId.trim(),
      gstNumber: draft.gstNumber.trim(),
      address: draft.address.trim(),
      timezone: draft.timezone,
      departments: normalizeCsv(draft.departments),
      teams: normalizeCsv(draft.teams),
      branches: normalizeCsv(draft.branches),
    })
    pushAppToast('Company settings saved.', 'success')
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Company settings</div>
          <h3 className="mt-2 text-lg font-semibold text-slate-900">Workspace profile</h3>
          <p className="mt-1 text-sm text-slate-500">Keep the CRM aligned with the company identity, compliance details, and office footprint.</p>
        </div>
        <div className="rounded-xl border border-line bg-slate-50 px-4 py-3">
          <div className="flex items-center gap-2 text-[12px] font-semibold text-slate-700">
            <Check className="h-4 w-4 text-emerald-600" />
            Active modules
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {selectedModules.map((module) => (
              <span key={module} className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-600 border border-line">
                {module}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-5 rounded-xl border border-line bg-slate-50/80 p-5">
        <div className="h-16 w-16 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-400 shrink-0">
          <Building2 className="h-8 w-8" />
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold text-slate-900">{organization.companyName}</div>
          <div className="mt-1 text-[13px] text-slate-500">{organization.industry} workspace - {organization.timezone}</div>
        </div>
        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => {
              const fileName = event.target.files?.[0]?.name
              if (fileName) pushAppToast(`Company logo selected: ${fileName}`, 'success')
            }}
          />
          <button className="btn-ghost !text-[13px]" onClick={() => fileInputRef.current?.click()}>
            <Upload className="h-4 w-4" />
            Upload logo
          </button>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <label className="grid gap-1.5">
          <span className="text-[12px] font-semibold uppercase tracking-wider text-slate-500">Company name</span>
          <input className="input" value={draft.companyName} onChange={(event) => setDraft({ ...draft, companyName: event.target.value })} />
        </label>
        <label className="grid gap-1.5">
          <span className="text-[12px] font-semibold uppercase tracking-wider text-slate-500">Industry</span>
          <input className="input" value={draft.industry} onChange={(event) => setDraft({ ...draft, industry: event.target.value })} />
        </label>
        <label className="grid gap-1.5 md:col-span-2">
          <span className="text-[12px] font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <Globe className="h-3.5 w-3.5" />
            Website
          </span>
          <input className="input" value={draft.website} onChange={(event) => setDraft({ ...draft, website: event.target.value })} />
        </label>
        <label className="grid gap-1.5">
          <span className="text-[12px] font-semibold uppercase tracking-wider text-slate-500">Tax ID</span>
          <input className="input" value={draft.taxId} onChange={(event) => setDraft({ ...draft, taxId: event.target.value })} />
        </label>
        <label className="grid gap-1.5">
          <span className="text-[12px] font-semibold uppercase tracking-wider text-slate-500">GST number</span>
          <input className="input" value={draft.gstNumber} onChange={(event) => setDraft({ ...draft, gstNumber: event.target.value })} />
        </label>
        <label className="grid gap-1.5 md:col-span-2">
          <span className="text-[12px] font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5" />
            Address
          </span>
          <textarea className="input min-h-[110px]" value={draft.address} onChange={(event) => setDraft({ ...draft, address: event.target.value })} />
        </label>
        <label className="grid gap-1.5">
          <span className="text-[12px] font-semibold uppercase tracking-wider text-slate-500">Timezone</span>
          <select className="input" value={draft.timezone} onChange={(event) => setDraft({ ...draft, timezone: event.target.value })}>
            {TIMEZONE_OPTIONS.map((timezone) => (
              <option key={timezone}>{timezone}</option>
            ))}
          </select>
        </label>
        <label className="grid gap-1.5">
          <span className="text-[12px] font-semibold uppercase tracking-wider text-slate-500">Departments</span>
          <input className="input" value={draft.departments} onChange={(event) => setDraft({ ...draft, departments: event.target.value })} />
        </label>
        <label className="grid gap-1.5">
          <span className="text-[12px] font-semibold uppercase tracking-wider text-slate-500">Teams</span>
          <input className="input" value={draft.teams} onChange={(event) => setDraft({ ...draft, teams: event.target.value })} />
        </label>
        <label className="grid gap-1.5">
          <span className="text-[12px] font-semibold uppercase tracking-wider text-slate-500">Branches</span>
          <input className="input" value={draft.branches} onChange={(event) => setDraft({ ...draft, branches: event.target.value })} />
        </label>
      </div>

      <div className="flex justify-end border-t border-line pt-4">
        <button className="btn-primary" onClick={saveOrganization}>
          <Save className="h-4 w-4" />
          Save company settings
        </button>
      </div>
    </div>
  )
}
