import { Link } from 'react-router-dom'
import { ArrowRight, Building2, CheckCircle2, Network, PackageCheck, UserPlus } from 'lucide-react'
import './EnterpriseSuite.css'

const steps = [
  {
    title: 'Company Information',
    icon: Building2,
    fields: ['Company Name', 'Industry', 'Website', 'Tax ID', 'GST Number', 'Address', 'Timezone'],
  },
  {
    title: 'Business Structure',
    icon: Network,
    fields: ['Departments', 'Teams', 'Branches'],
  },
  {
    title: 'Invite Employees',
    icon: UserPlus,
    fields: ['Name', 'Email', 'Role'],
  },
  {
    title: 'Select Modules',
    icon: PackageCheck,
    fields: ['CRM', 'Sales', 'Support', 'Finance', 'HR', 'Inventory', 'Projects'],
  },
  {
    title: 'Complete Setup',
    icon: CheckCircle2,
    fields: ['Review company profile', 'Activate workspace', 'Enter CRM'],
  },
]

export default function OnboardingPage() {
  return (
    <div className="suite-auth-shell">
      <aside className="suite-auth-aside">
        <div className="suite-auth-brand">Krisantec CRM Setup</div>
        <div>
          <div className="suite-auth-title">Configure the business before your team lands in CRM.</div>
          <p className="suite-auth-copy">
            The onboarding wizard captures company, structure, employee, and module decisions in one guided flow.
          </p>
        </div>
        <Link className="btn-primary w-fit" to="/">
          Enter CRM
          <ArrowRight size={16} />
        </Link>
      </aside>
      <main className="suite-auth-main">
        <section className="suite-auth-card">
          <div className="suite-progress mb-6"><span style={{ width: '80%' }} /></div>
          <div className="suite-grid two">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <div className="suite-panel suite-panel-pad" key={step.title}>
                  <div className="flex items-center gap-3">
                    <div className="suite-icon"><Icon size={20} /></div>
                    <div>
                      <div className="suite-eyebrow">Step {index + 1}</div>
                      <div className="suite-name">{step.title}</div>
                    </div>
                  </div>
                  <div className="suite-form-grid">
                    {step.fields.map((field) => (
                      <div className="suite-field" key={field}>
                        <label>{field}</label>
                        {step.title === 'Select Modules' ? (
                          <div className="suite-module-toggle">
                            <span>{field}</span>
                            <input type="checkbox" defaultChecked={['CRM', 'Sales', 'Support', 'Finance'].includes(field)} />
                          </div>
                        ) : (
                          <input className="input" placeholder={field} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      </main>
    </div>
  )
}
