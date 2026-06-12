import { Link } from 'react-router-dom'
import { Building2, CheckCircle2, Lock, Mail, ShieldCheck, UserPlus } from 'lucide-react'
import './EnterpriseSuite.css'

type AuthMode = 'signup' | 'login' | 'forgot' | 'verify' | 'reset' | 'two-factor'

const modeCopy: Record<AuthMode, { title: string; subtitle: string; action: string; icon: typeof UserPlus }> = {
  signup: {
    title: 'Create your CRM workspace',
    subtitle: 'Start with your user account, verify email, create an organization, and enter the CRM.',
    action: 'Create account',
    icon: UserPlus,
  },
  login: {
    title: 'Welcome back',
    subtitle: 'Sign in to your sales, support, finance, and reporting command center.',
    action: 'Login',
    icon: Lock,
  },
  forgot: {
    title: 'Recover your account',
    subtitle: 'Enter your email and we will send a secure password reset link.',
    action: 'Send reset link',
    icon: Mail,
  },
  verify: {
    title: 'Verify your email',
    subtitle: 'Enter the verification code sent to your inbox to activate your organization.',
    action: 'Verify email',
    icon: CheckCircle2,
  },
  reset: {
    title: 'Reset password',
    subtitle: 'Choose a strong password before returning to your CRM workspace.',
    action: 'Reset password',
    icon: ShieldCheck,
  },
  'two-factor': {
    title: 'Two factor authentication',
    subtitle: 'Use your authenticator or SMS code to complete secure login.',
    action: 'Continue securely',
    icon: ShieldCheck,
  },
}

const commonFields = ['Full Name', 'Company Name', 'Email', 'Mobile', 'Password', 'Country', 'Business Type']

export default function AuthPage({ mode }: { mode: AuthMode }) {
  const copy = modeCopy[mode]
  const Icon = copy.icon
  const fields =
    mode === 'signup'
      ? commonFields
      : mode === 'login'
        ? ['Email', 'Password']
        : mode === 'reset'
          ? ['New Password', 'Confirm Password']
          : mode === 'two-factor' || mode === 'verify'
            ? ['Security Code']
            : ['Email']

  return (
    <div className="suite-auth-shell">
      <aside className="suite-auth-aside">
        <div className="suite-auth-brand">Krisantec CRM</div>
        <div>
          <div className="suite-auth-title">One operating system for the entire customer lifecycle.</div>
          <p className="suite-auth-copy">
            Signup, sales, support, finance, projects, automation, and executive reporting in a single SaaS workspace.
          </p>
        </div>
        <div className="suite-grid three">
          {['Sales Cloud', 'Support Desk', 'Finance Ops'].map((item) => (
            <span className="suite-pill" key={item}>{item}</span>
          ))}
        </div>
      </aside>
      <main className="suite-auth-main">
        <section className="suite-auth-card">
          <div className="suite-icon">
            <Icon size={22} />
          </div>
          <h1 className="mt-4 text-[28px] font-black tracking-tight text-slate-950">{copy.title}</h1>
          <p className="mt-2 text-sm text-theme-secondary">{copy.subtitle}</p>

          <div className="suite-form-grid">
            {fields.map((field) => (
              <div className="suite-field" key={field}>
                <label>{field}</label>
                <input className="input" type={field.toLowerCase().includes('password') ? 'password' : 'text'} placeholder={field} />
              </div>
            ))}
          </div>

          <button className="btn-primary mt-5 w-full justify-center" type="button">
            {copy.action}
          </button>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm">
            <Link className="font-bold text-brand-blue" to="/auth/login">Login</Link>
            <Link className="font-bold text-brand-blue" to="/auth/forgot-password">Forgot password</Link>
            <Link className="font-bold text-brand-blue" to="/onboarding">Organization setup</Link>
          </div>

          <div className="mt-5 flex items-center gap-2 rounded-lg bg-theme-surface p-3 text-xs text-theme-secondary">
            <Building2 size={16} />
            <span>Email verification creates the organization shell before CRM access.</span>
          </div>
        </section>
      </main>
    </div>
  )
}
