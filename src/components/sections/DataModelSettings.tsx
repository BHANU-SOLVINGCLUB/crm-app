import { useMemo, useState } from 'react'
import { Columns3, LayoutGrid, Plus, Save, Settings2 } from 'lucide-react'
import { pushAppToast } from '../../store/uiStore'

type ModuleConfig = {
  id: string
  name: string
  owner: string
  records: number
  fields: Array<{ name: string; type: string; required: boolean; visible: boolean }>
  stages?: string[]
}

const INITIAL_MODULES: ModuleConfig[] = [
  {
    id: 'leads',
    name: 'Leads',
    owner: 'Sales Ops',
    records: 428,
    fields: [
      { name: 'Company', type: 'Text', required: true, visible: true },
      { name: 'Lead Source', type: 'Picklist', required: true, visible: true },
      { name: 'Assigned Staff', type: 'User lookup', required: false, visible: true },
      { name: 'Treatment Interest', type: 'Picklist', required: false, visible: true },
    ],
  },
  {
    id: 'deals',
    name: 'Sales Pipeline',
    owner: 'Sales Ops',
    records: 92,
    fields: [
      { name: 'Deal Amount', type: 'Currency', required: true, visible: true },
      { name: 'Close Date', type: 'Date', required: true, visible: true },
      { name: 'Probability', type: 'Percent', required: false, visible: true },
    ],
    stages: ['Qualification', 'Consultation', 'Proposal', 'Negotiation', 'Won'],
  },
  {
    id: 'customers',
    name: 'Customers',
    owner: 'Customer Success',
    records: 311,
    fields: [
      { name: 'Primary Contact', type: 'Lookup', required: true, visible: true },
      { name: 'Lifecycle Stage', type: 'Picklist', required: true, visible: true },
      { name: 'Health Score', type: 'Number', required: false, visible: true },
    ],
  },
  {
    id: 'tickets',
    name: 'Support Tickets',
    owner: 'Support Ops',
    records: 74,
    fields: [
      { name: 'Priority', type: 'Picklist', required: true, visible: true },
      { name: 'SLA Due', type: 'Date time', required: true, visible: true },
      { name: 'Related Customer', type: 'Lookup', required: true, visible: true },
    ],
  },
  {
    id: 'invoices',
    name: 'Finance Invoices',
    owner: 'Finance',
    records: 156,
    fields: [
      { name: 'Invoice Amount', type: 'Currency', required: true, visible: true },
      { name: 'Payment Status', type: 'Picklist', required: true, visible: true },
      { name: 'Due Date', type: 'Date', required: true, visible: true },
    ],
  },
]

const FIELD_TYPES = ['Text', 'Picklist', 'User lookup', 'Date', 'Date time', 'Currency', 'Number', 'Percent', 'Lookup']

export default function DataModelSettings() {
  const [modules, setModules] = useState<ModuleConfig[]>(INITIAL_MODULES)
  const [activeModuleId, setActiveModuleId] = useState(INITIAL_MODULES[0].id)
  const [draftField, setDraftField] = useState({ name: '', type: FIELD_TYPES[0], required: false })
  const activeModule = modules.find((module) => module.id === activeModuleId) ?? modules[0]

  const stats = useMemo(
    () => ({
      modules: modules.length,
      fields: modules.reduce((sum, module) => sum + module.fields.length, 0),
      records: modules.reduce((sum, module) => sum + module.records, 0),
    }),
    [modules]
  )

  const addField = () => {
    if (!draftField.name.trim()) {
      pushAppToast('Field name is required.', 'info')
      return
    }

    setModules((current) =>
      current.map((module) =>
        module.id === activeModule.id
          ? {
              ...module,
              fields: [
                ...module.fields,
                { name: draftField.name.trim(), type: draftField.type, required: draftField.required, visible: true },
              ],
            }
          : module
      )
    )
    setDraftField({ name: '', type: FIELD_TYPES[0], required: false })
    pushAppToast(`${draftField.name} added to ${activeModule.name}.`, 'success')
  }

  const updateField = (fieldName: string, patch: Partial<ModuleConfig['fields'][number]>) => {
    setModules((current) =>
      current.map((module) =>
        module.id === activeModule.id
          ? {
              ...module,
              fields: module.fields.map((field) => (field.name === fieldName ? { ...field, ...patch } : field)),
            }
          : module
      )
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Customization</div>
          <h3 className="mt-2 text-lg font-semibold text-slate-900">Modules and fields</h3>
          <p className="mt-1 text-sm text-slate-500">Customize CRM objects, field behavior, layouts, and sales stages from one admin surface.</p>
        </div>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="rounded-xl border border-line bg-slate-50 px-4 py-3">
            <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Modules</div>
            <div className="mt-1 text-2xl font-bold text-slate-900">{stats.modules}</div>
          </div>
          <div className="rounded-xl border border-line bg-slate-50 px-4 py-3">
            <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Fields</div>
            <div className="mt-1 text-2xl font-bold text-slate-900">{stats.fields}</div>
          </div>
          <div className="rounded-xl border border-line bg-slate-50 px-4 py-3">
            <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Records</div>
            <div className="mt-1 text-2xl font-bold text-slate-900">{stats.records}</div>
          </div>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[260px_1fr]">
        <div className="rounded-xl border border-line bg-white p-3">
          <div className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Object manager</div>
          <div className="space-y-1">
            {modules.map((module) => (
              <button
                key={module.id}
                className={`w-full rounded-lg border px-3 py-3 text-left transition-colors ${activeModule.id === module.id ? 'border-brand-blue/30 bg-brand-blue/10' : 'border-transparent hover:border-line hover:bg-slate-50'}`}
                onClick={() => setActiveModuleId(module.id)}
              >
                <div className="flex items-center gap-2 text-[13px] font-semibold text-slate-800">
                  <LayoutGrid className="h-4 w-4 text-slate-500" />
                  {module.name}
                </div>
                <div className="mt-1 text-[12px] text-slate-500">{module.records} records - {module.fields.length} fields</div>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-xl border border-line bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h4 className="text-[15px] font-semibold text-slate-900">{activeModule.name}</h4>
                <p className="mt-1 text-[13px] text-slate-500">Owned by {activeModule.owner}. Configure fields, required rules, and list visibility.</p>
              </div>
              <button className="btn-ghost !text-[13px]" onClick={() => pushAppToast(`${activeModule.name} page layout opened.`, 'success')}>
                <Settings2 className="h-4 w-4" />
                Layout
              </button>
            </div>

            <div className="mt-5 overflow-hidden rounded-xl border border-line">
              <table className="w-full text-left text-[13px]">
                <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Field</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Required</th>
                    <th className="px-4 py-3">Visible</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {activeModule.fields.map((field) => (
                    <tr key={field.name}>
                      <td className="px-4 py-3 font-semibold text-slate-800">{field.name}</td>
                      <td className="px-4 py-3 text-slate-600">{field.type}</td>
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={field.required}
                          onChange={(event) => updateField(field.name, { required: event.target.checked })}
                          className="h-4 w-4 rounded border-slate-300 text-brand-blue focus:ring-brand-blue"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={field.visible}
                          onChange={(event) => updateField(field.name, { visible: event.target.checked })}
                          className="h-4 w-4 rounded border-slate-300 text-brand-blue focus:ring-brand-blue"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {activeModule.stages && (
            <div className="rounded-xl border border-line bg-white p-5">
              <div className="flex items-center gap-2 text-[13px] font-semibold text-slate-700">
                <Columns3 className="h-4 w-4 text-brand-blue" />
                Pipeline stages
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {activeModule.stages.map((stage) => (
                  <span key={stage} className="rounded-full border border-line bg-slate-50 px-3 py-1.5 text-[12px] font-semibold text-slate-700">{stage}</span>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-xl border border-line bg-white p-5">
            <div className="flex flex-wrap items-end gap-3">
              <label className="grid flex-1 min-w-48 gap-1.5">
                <span className="text-[12px] font-semibold uppercase tracking-wider text-slate-500">New field</span>
                <input className="input" value={draftField.name} onChange={(event) => setDraftField({ ...draftField, name: event.target.value })} placeholder="Referral Doctor" />
              </label>
              <label className="grid min-w-44 gap-1.5">
                <span className="text-[12px] font-semibold uppercase tracking-wider text-slate-500">Type</span>
                <select className="input" value={draftField.type} onChange={(event) => setDraftField({ ...draftField, type: event.target.value })}>
                  {FIELD_TYPES.map((type) => (
                    <option key={type}>{type}</option>
                  ))}
                </select>
              </label>
              <label className="flex items-center gap-2 pb-2 text-[13px] font-semibold text-slate-700">
                <input type="checkbox" checked={draftField.required} onChange={(event) => setDraftField({ ...draftField, required: event.target.checked })} className="h-4 w-4 rounded border-slate-300 text-brand-blue focus:ring-brand-blue" />
                Required
              </label>
              <button className="btn-primary" onClick={addField}>
                <Plus className="h-4 w-4" />
                Add field
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end border-t border-line pt-4">
        <button className="btn-primary" onClick={() => pushAppToast('Module customization saved.', 'success')}>
          <Save className="h-4 w-4" />
          Save customization
        </button>
      </div>
    </div>
  )
}
