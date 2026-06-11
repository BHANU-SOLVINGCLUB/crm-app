import type { ReactNode } from 'react'
import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  BarChart3,
  Building2,
  KeyRound,
  MailCheck,
  ShieldCheck,
  UsersRound,
} from 'lucide-react'
import { usePlatformStore, type PlatformModule } from '../store/usePlatformStore'
import '../platform/platform.css'

const moduleCards: Array<{ id: PlatformModule; label: string; description: string }> = [
  { id: 'crm', label: 'CRM', description: 'Lead, customer, and relationship intelligence.' },
  { id: 'sales', label: 'Sales', description: 'Pipeline, quoting, forecasting, and contracts.' },
  { id: 'support', label: 'Support', description: 'Tickets, SLA management, and knowledge base.' },
  { id: 'finance', label: 'Finance', description: 'Invoices, payments, collections, and reporting.' },
  { id: 'hr', label: 'HR', description: 'Employees, policies, attendance, and growth plans.' },
  { id: 'inventory', label: 'Inventory', description: 'Warehouses, stock, bundles, and reorder flows.' },
  { id: 'projects', label: 'Projects', description: 'Delivery, tasks, milestones, and timesheets.' },
]

const onboardingSteps = [
  { title: 'Company Information', hint: 'Identity and location', note: 'Set the legal, digital, and tax identity that anchors the workspace.' },
  { title: 'Business Structure', hint: 'Hierarchy design', note: 'Mirror the real operating structure across departments, teams, and branches.' },
  { title: 'Invite Employees', hint: 'Access rollout', note: 'Seed the workspace with role-based users who will own revenue and service workflows.' },
  { title: 'Select Modules', hint: 'Module activation', note: 'Turn on the business clouds required for the first production rollout.' },
  { title: 'Complete Setup', hint: 'Go-live readiness', note: 'Review the stack and launch the unified operating system.' },
]

function AuthFeatureList() {
  return (
    <div className="auth-feature-list">
      <div className="auth-feature-item">
        <div className="auth-feature-icon-box">
          <ShieldCheck className="h-6 w-6 text-white" />
        </div>
        <div className="auth-feature-text">
          <strong>Secure Login</strong>
          <p>Your data is protected with best-in-class security.</p>
        </div>
      </div>
      <div className="auth-feature-item">
        <div className="auth-feature-icon-box">
          <BarChart3 className="h-6 w-6 text-white" />
        </div>
        <div className="auth-feature-text">
          <strong>Real-time Insights</strong>
          <p>Get real-time analytics and make smarter decisions.</p>
        </div>
      </div>
      <div className="auth-feature-item">
        <div className="auth-feature-icon-box">
          <UsersRound className="h-6 w-6 text-white" />
        </div>
        <div className="auth-feature-text">
          <strong>Manage Everything</strong>
          <p>Leads, customers, tasks and more – all in one dashboard.</p>
        </div>
      </div>
    </div>
  )
}

function AuthLayout({
  title,
  subtitle,
  children,
  showSocial = false,
}: {
  title: string
  subtitle: string
  kicker: string
  children: ReactNode
  sideTitle: string
  sidePoints: string[]
  showSocial?: boolean
}) {
  return (
    <div className="auth-shell">
      <section className="auth-hero">
        <div className="auth-brand-row">
          <div className="auth-brand-mark">
            <BarChart3 className="h-6 w-6" />
          </div>
          <div>
            <div className="auth-brand-name">CRM</div>
            <div className="auth-brand-copy">Customer Relationship Management</div>
          </div>
        </div>
        
        <div className="auth-hero-content">
          <h1>
            Secure Access to <br />
            Your <span>Business Dashboard</span>
          </h1>
          <p>
            Manage your leads, customers, deals and <br />
            grow your business — all in one place.
          </p>
          
          <AuthFeatureList />
        </div>
        
        <div className="auth-hero-illustration">
          {/* We will leave this empty as requested to avoid file permission errors, but the CSS will accommodate an image here perfectly. */}
        </div>
      </section>

      <section className="auth-panel">
        <div className="auth-panel-card">
          <div className="auth-avatar-icon">
            <UsersRound className="h-8 w-8 text-white" />
          </div>
          <div className="auth-panel-head">
            <h2>{title}</h2>
            <p>{subtitle}</p>
          </div>
          {children}
          
          {showSocial && (
            <>
              <div className="auth-divider">
                <span>or continue with</span>
              </div>
              <div className="auth-social-buttons">
                <button type="button" className="btn-social">
                  <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-5 w-5" />
                  Google
                </button>
                <button type="button" className="btn-social">
                  <img src="https://www.svgrepo.com/show/475662/microsoft-color.svg" alt="Microsoft" className="h-5 w-5" />
                  Microsoft
                </button>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  )
}

export function SignupPage() {
  const navigate = useNavigate()
  const registerWithBackend = usePlatformStore((state) => state.registerWithBackend)
  const authLoading = usePlatformStore((state) => state.authLoading)
  const authError = usePlatformStore((state) => state.authError)
  const initialDraft = usePlatformStore((state) => state.signupDraft)
  const [draft, setDraft] = useState(initialDraft)
  const [submitError, setSubmitError] = useState<string | null>(null)

  return (
    <AuthLayout
      kicker="Phase 1"
      title="Create your CRM workspace"
      subtitle="Launch a production-ready customer lifecycle platform with identity, organization setup, and module control built in."
      sideTitle="Revenue, service, and finance on one operating system."
      sidePoints={[
        'Unified CRM, Sales, Support, and Finance operations.',
        'Secure signup with email verification and two-factor authentication.',
        'Guided admin setup for company profile, users, roles, and policies.',
      ]}
      showSocial={true}
    >
      <form
        className="auth-form-grid"
        onSubmit={async (event) => {
          event.preventDefault()
          setSubmitError(null)
          try {
            await registerWithBackend(draft)
            navigate('/')
          } catch {
            setSubmitError(authError ?? 'Could not create account. Is the backend running?')
          }
        }}
      >
        <label>
          <span>Full Name</span>
          <input className="input" value={draft.fullName} onChange={(event) => setDraft({ ...draft, fullName: event.target.value })} />
        </label>
        <label>
          <span>Company Name</span>
          <input className="input" value={draft.companyName} onChange={(event) => setDraft({ ...draft, companyName: event.target.value })} />
        </label>
        <label>
          <span>Email</span>
          <input className="input" type="email" value={draft.email} onChange={(event) => setDraft({ ...draft, email: event.target.value })} />
        </label>
        <label>
          <span>Mobile</span>
          <input className="input" value={draft.mobile} onChange={(event) => setDraft({ ...draft, mobile: event.target.value })} />
        </label>
        <label>
          <span>Password</span>
          <input className="input" type="password" value={draft.password} onChange={(event) => setDraft({ ...draft, password: event.target.value })} />
        </label>
        <label>
          <span>Country</span>
          <input className="input" value={draft.country} onChange={(event) => setDraft({ ...draft, country: event.target.value })} />
        </label>
        <label className="auth-span-full">
          <span>Business Type</span>
          <select 
            className="input" 
            value={draft.businessType} 
            onChange={(event) => setDraft({ ...draft, businessType: event.target.value })}
          >
            <option value="">Select Industry</option>
            <option value="Healthcare Services">Healthcare Services</option>
            <option value="Technology">Technology</option>
            <option value="E-commerce">E-commerce</option>
            <option value="Finance">Finance</option>
            <option value="Retail">Retail</option>
            <option value="Other">Other</option>
          </select>
        </label>
        {submitError && <p className="auth-span-full text-sm text-red-500">{submitError}</p>}
        <button className="btn-primary auth-submit auth-span-full" type="submit" disabled={authLoading}>
          {authLoading ? 'Creating account…' : 'Create account'}
        </button>
      </form>
      <div className="auth-footer-copy">
        Already have an account? <Link to="/auth/login">Login</Link>
      </div>
    </AuthLayout>
  )
}

export function LoginPage() {
  const navigate = useNavigate()
  const loginWithBackend = usePlatformStore((state) => state.loginWithBackend)
  const authLoading = usePlatformStore((state) => state.authLoading)
  const authError = usePlatformStore((state) => state.authError)
  const signupDraft = usePlatformStore((state) => state.signupDraft)
  const [email, setEmail] = useState(signupDraft.email)
  const [password, setPassword] = useState(signupDraft.password)
  const [submitError, setSubmitError] = useState<string | null>(null)

  return (
    <AuthLayout
      kicker="Access"
      title="Welcome back"
      subtitle="Sign in to manage leads, customers, tickets, invoices, and the rest of your operating workflow."
      sideTitle="Run the full customer lifecycle from one command center."
      sidePoints={[
        'Live visibility across pipeline, support, and billing.',
        'Shared customer timeline across teams.',
        'Role-based access and workflow-ready controls.',
      ]}
      showSocial={true}
    >
      <form
        className="auth-form-grid"
        onSubmit={async (event) => {
          event.preventDefault()
          setSubmitError(null)
          try {
            await loginWithBackend(email, password)
            navigate('/')
          } catch {
            setSubmitError(authError ?? 'Login failed. Start the backend at http://127.0.0.1:8000')
          }
        }}
      >
        <label className="auth-span-full">
          <span>Email</span>
          <input className="input" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
        </label>
        <label className="auth-span-full">
          <span>Password</span>
          <input className="input" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </label>
        <div className="auth-inline-row auth-span-full">
          <Link to="/auth/forgot-password">Forgot Password?</Link>
          <span>Test: admin@cityclinic.com / testpass123</span>
        </div>
        {submitError && <p className="auth-span-full text-sm text-red-500">{submitError}</p>}
        <button className="btn-primary auth-submit auth-span-full" type="submit" disabled={authLoading}>
          {authLoading ? 'Signing in…' : 'Continue'}
        </button>
      </form>
      <div className="auth-footer-copy">
        Need a workspace? <Link to="/auth/signup">Start with signup</Link>
      </div>
    </AuthLayout>
  )
}

export function ForgotPasswordPage() {
  const navigate = useNavigate()
  const email = usePlatformStore((state) => state.signupDraft.email)

  return (
    <AuthLayout
      kicker="Recovery"
      title="Reset your password"
      subtitle="We will send a secure reset link so you can regain access without losing your setup progress."
      sideTitle="Secure recovery without interrupting onboarding."
      sidePoints={[
        'Password reset flow aligned with email verification.',
        'Preserves organization setup state for faster recovery.',
        'Supports production-grade access patterns and 2FA.',
      ]}
    >
      <form
        className="auth-form-grid"
        onSubmit={(event) => {
          event.preventDefault()
          navigate('/auth/reset-password')
        }}
      >
        <label className="auth-span-full">
          <span>Account Email</span>
          <input className="input" type="email" defaultValue={email} />
        </label>
        <button className="btn-primary auth-submit auth-span-full" type="submit">Send reset link</button>
      </form>
      <div className="auth-footer-copy">
        <Link to="/auth/login">Back to login</Link>
      </div>
    </AuthLayout>
  )
}

export function ResetPasswordPage() {
  const navigate = useNavigate()

  return (
    <AuthLayout
      kicker="Recovery"
      title="Create a new password"
      subtitle="Set a fresh password, keep your workspace secure, and continue into multi-factor verification."
      sideTitle="Strong identity controls for your CRM stack."
      sidePoints={[
        'Password hygiene before onboarding begins.',
        'Smooth handoff into two-factor verification.',
        'Ready for enterprise access hardening later.',
      ]}
    >
      <form
        className="auth-form-grid"
        onSubmit={(event) => {
          event.preventDefault()
          navigate('/auth/login')
        }}
      >
        <label className="auth-span-full">
          <span>New Password</span>
          <input className="input" type="password" />
        </label>
        <label className="auth-span-full">
          <span>Confirm Password</span>
          <input className="input" type="password" />
        </label>
        <button className="btn-primary auth-submit auth-span-full" type="submit">Update password</button>
      </form>
    </AuthLayout>
  )
}

export function VerifyEmailPage() {
  const navigate = useNavigate()
  const email = usePlatformStore((state) => state.signupDraft.email)
  const verifyEmail = usePlatformStore((state) => state.verifyEmail)

  return (
    <AuthLayout
      kicker="Verification"
      title="Verify your email"
      subtitle={`We sent a verification link to ${email}. Confirm ownership before creating your organization.`}
      sideTitle="Identity proofing before system access."
      sidePoints={[
        'Protects data access before CRM setup starts.',
        'Required before employee invites and module activation.',
        'Works with password recovery and 2FA.',
      ]}
    >
      <div className="auth-status-card">
        <MailCheck className="h-6 w-6" />
        <div>
          <strong>Email verification pending</strong>
          <p>Click the button below to simulate a verified email and continue into multi-factor authentication.</p>
        </div>
      </div>
      <div className="auth-inline-actions">
        <button
          className="btn-primary"
          type="button"
          onClick={() => {
            verifyEmail()
            navigate('/auth/two-factor')
          }}
        >
          Verify email
        </button>
        <Link to="/auth/login" className="btn-ghost">Back to login</Link>
      </div>
    </AuthLayout>
  )
}

export function TwoFactorPage() {
  const navigate = useNavigate()
  const verifyTwoFactor = usePlatformStore((state) => state.verifyTwoFactor)
  const [code, setCode] = useState('')

  return (
    <AuthLayout
      kicker="2FA"
      title="Two-factor authentication"
      subtitle="Add a second layer of identity validation before entering the workspace and configuration flow."
      sideTitle="Admin-grade protection from the first login."
      sidePoints={[
        'Mandatory checkpoint before org onboarding.',
        'Ready to expand to authenticator apps or SMS.',
        'Supports secure access for multi-department teams.',
      ]}
    >
      <form
        className="auth-form-grid"
        onSubmit={(event) => {
          event.preventDefault()
          verifyTwoFactor()
          navigate('/onboarding')
        }}
      >
        <label className="auth-span-full">
          <span>Verification Code</span>
          <input className="input auth-code-input" value={code} onChange={(event) => setCode(event.target.value)} />
        </label>
        <div className="auth-status-card auth-span-full">
          <ShieldCheck className="h-6 w-6" />
          <div>
            <strong>Demo code prefilled</strong>
            <p>Production build can later replace this with TOTP, SMS OTP, or device challenge flows.</p>
          </div>
        </div>
        <div className="auth-span-full" style={{ display: 'flex' }}>
          <button className="btn-primary auth-submit" type="submit">Confirm</button>
        </div>
      </form>
    </AuthLayout>
  )
}

function normalizeCsv(value: string) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

export function OnboardingPage() {
  const navigate = useNavigate()
  const organization = usePlatformStore((state) => state.organization)
  const updateOrganization = usePlatformStore((state) => state.updateOrganization)
  const addEmployee = usePlatformStore((state) => state.addEmployee)
  const completeOnboarding = usePlatformStore((state) => state.completeOnboarding)
  const [step, setStep] = useState(1)
  const [employeeName, setEmployeeName] = useState('')
  const [employeeEmail, setEmployeeEmail] = useState('')
  const [employeeRole, setEmployeeRole] = useState('Sales Executive')
  const [employeeDepartment, setEmployeeDepartment] = useState('Sales')
  const [employeeTeam, setEmployeeTeam] = useState('Inside Sales')

  const completion = useMemo(() => `${Math.round((step / 5) * 100)}%`, [step])
  const currentStep = onboardingSteps[step - 1]

  return (
    <div className="onboarding-shell">
      <div className="onboarding-header">
        <button type="button" className="onboarding-back" onClick={() => navigate('/auth/login')}>
          <ArrowLeft className="h-4 w-4" />
          Exit Setup
        </button>
        <div>
          <div className="auth-panel-kicker">Organization Setup Wizard</div>
          <h1>Configure your CRM foundation</h1>
          <p>Five setup steps to configure company profile, teams, access, modules, and go-live readiness.</p>
        </div>
        <div className="onboarding-progress-box">
          <span>Completion</span>
          <strong>{completion}</strong>
        </div>
      </div>

      <div className="onboarding-layout">
        <aside className="onboarding-steps">
          {onboardingSteps.map((item, index) => (
            <button key={item.title} type="button" className={`onboarding-step ${step === index + 1 ? 'active' : ''}`} onClick={() => setStep(index + 1)}>
              <span>{index + 1}</span>
              <div>
                <strong>{item.title}</strong>
                <small>{item.hint}</small>
              </div>
            </button>
          ))}
          <div className="onboarding-side-summary">
            <div className="onboarding-side-kicker">Workspace Snapshot</div>
            <div className="onboarding-side-grid">
              <div>
                <span>Company</span>
                <strong>{organization.companyName}</strong>
              </div>
              <div>
                <span>Departments</span>
                <strong>{organization.departments.length}</strong>
              </div>
              <div>
                <span>Employees</span>
                <strong>{organization.invitedEmployees.length}</strong>
              </div>
              <div>
                <span>Modules</span>
                <strong>{organization.selectedModules.length}</strong>
              </div>
            </div>
          </div>
        </aside>

        <section className="onboarding-card">
          <div className="onboarding-card-top">
            <div className="onboarding-step-chip">Step {step} of 5</div>
            <div>
              <h2>{currentStep.title}</h2>
              <p>{currentStep.note}</p>
            </div>
          </div>
          {step === 1 && (
            <div className="onboarding-form-grid">
              <label><span>Company Name</span><input className="input" value={organization.companyName} onChange={(event) => updateOrganization({ companyName: event.target.value })} /></label>
              <label><span>Industry</span><input className="input" value={organization.industry} onChange={(event) => updateOrganization({ industry: event.target.value })} /></label>
              <label><span>Website</span><input className="input" value={organization.website} onChange={(event) => updateOrganization({ website: event.target.value })} /></label>
              <label><span>Tax ID</span><input className="input" value={organization.taxId} onChange={(event) => updateOrganization({ taxId: event.target.value })} /></label>
              <label><span>GST Number</span><input className="input" value={organization.gstNumber} onChange={(event) => updateOrganization({ gstNumber: event.target.value })} /></label>
              <label><span>Timezone</span><input className="input" value={organization.timezone} onChange={(event) => updateOrganization({ timezone: event.target.value })} /></label>
              <label className="auth-span-full"><span>Address</span><textarea className="input onboarding-textarea" value={organization.address} onChange={(event) => updateOrganization({ address: event.target.value })} /></label>
            </div>
          )}

          {step === 2 && (
            <div className="onboarding-form-grid">
              <label className="auth-span-full"><span>Departments</span><input className="input" value={organization.departments.join(', ')} onChange={(event) => updateOrganization({ departments: normalizeCsv(event.target.value) })} /></label>
              <label className="auth-span-full"><span>Teams</span><input className="input" value={organization.teams.join(', ')} onChange={(event) => updateOrganization({ teams: normalizeCsv(event.target.value) })} /></label>
              <label className="auth-span-full"><span>Branches</span><input className="input" value={organization.branches.join(', ')} onChange={(event) => updateOrganization({ branches: normalizeCsv(event.target.value) })} /></label>
            </div>
          )}

          {step === 3 && (
            <div className="onboarding-form-grid">
              <label><span>Name</span><input className="input" value={employeeName} onChange={(event) => setEmployeeName(event.target.value)} /></label>
              <label><span>Email</span><input className="input" type="email" value={employeeEmail} onChange={(event) => setEmployeeEmail(event.target.value)} /></label>
              <label><span>Role</span><input className="input" value={employeeRole} onChange={(event) => setEmployeeRole(event.target.value)} /></label>
              <label><span>Department</span><input className="input" value={employeeDepartment} onChange={(event) => setEmployeeDepartment(event.target.value)} /></label>
              <label><span>Team</span><input className="input" value={employeeTeam} onChange={(event) => setEmployeeTeam(event.target.value)} /></label>
              <div className="auth-inline-actions auth-span-full">
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => {
                    if (!employeeName || !employeeEmail) return
                    addEmployee({
                      name: employeeName,
                      email: employeeEmail,
                      role: employeeRole,
                      department: employeeDepartment,
                      team: employeeTeam,
                      status: 'Invited',
                    })
                    setEmployeeName('')
                    setEmployeeEmail('')
                    setEmployeeRole('Sales Executive')
                    setEmployeeDepartment('Sales')
                    setEmployeeTeam('Inside Sales')
                  }}
                >
                  Add employee
                </button>
              </div>
              <div className="employee-list auth-span-full">
                {organization.invitedEmployees.map((employee) => (
                  <div key={employee.id} className="employee-card">
                    <Building2 className="h-4 w-4" />
                    <div>
                      <strong>{employee.name}</strong>
                      <p>{employee.email} - {employee.role} - {employee.department} / {employee.team}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="onboarding-form-grid">
              <div className="module-grid auth-span-full">
                {moduleCards.map((module) => {
                  const active = organization.selectedModules.includes(module.id)
                  return (
                    <button
                      key={module.id}
                      type="button"
                      className={`module-card ${active ? 'active' : ''}`}
                      onClick={() =>
                        updateOrganization({
                          selectedModules: active
                            ? organization.selectedModules.filter((item) => item !== module.id)
                            : [...organization.selectedModules, module.id],
                        })
                      }
                    >
                      <strong>{module.label}</strong>
                      <p>{module.description}</p>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="onboarding-summary">
              <div className="auth-status-card">
                <KeyRound className="h-6 w-6" />
                <div>
                  <strong>Setup ready for launch</strong>
                  <p>Your organization identity, structure, team, and module stack are configured for first use.</p>
                </div>
              </div>
              <div className="summary-grid">
                <div><span>Organization</span><strong>{organization.companyName}</strong></div>
                <div><span>Industry</span><strong>{organization.industry}</strong></div>
                <div><span>Employees Invited</span><strong>{organization.invitedEmployees.length}</strong></div>
                <div><span>Modules Selected</span><strong>{organization.selectedModules.length}</strong></div>
              </div>
              <div className="module-pill-row">
                {organization.selectedModules.map((module) => (
                  <span key={module} className="chip">{module.toUpperCase()}</span>
                ))}
              </div>
            </div>
          )}

          <div className="onboarding-footer">
            <button type="button" className="btn-ghost" onClick={() => setStep((current) => Math.max(1, current - 1))} disabled={step === 1}>
              Previous
            </button>
            {step < 5 ? (
              <button type="button" className="btn-primary" onClick={() => setStep((current) => Math.min(5, current + 1))}>
                Next Step
              </button>
            ) : (
              <button
                type="button"
                className="btn-primary"
                onClick={() => {
                  completeOnboarding()
                  navigate('/')
                }}
              >
                Enter CRM
              </button>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
