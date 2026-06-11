import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  fetchMe,
  getStoredUser,
  loginApi,
  logoutApi,
  registerApi,
} from '../api/auth'
import type { AuthUser } from '../api/types'

export type PlatformModule = 'crm' | 'sales' | 'support' | 'finance' | 'hr' | 'inventory' | 'projects'

export type EmployeeRecord = {
  id: string
  name: string
  email: string
  role: string
  status: 'Active' | 'Invited' | 'Inactive'
  department: string
  team: string
}

export type OrganizationProfile = {
  companyName: string
  industry: string
  website: string
  taxId: string
  gstNumber: string
  address: string
  timezone: string
  departments: string[]
  teams: string[]
  branches: string[]
  invitedEmployees: EmployeeRecord[]
  selectedModules: PlatformModule[]
}

type SignupDraft = {
  fullName: string
  companyName: string
  email: string
  mobile: string
  password: string
  country: string
  businessType: string
}

type PlatformState = {
  isAuthenticated: boolean
  emailVerified: boolean
  twoFactorVerified: boolean
  onboardingComplete: boolean
  authUser: AuthUser | null
  authLoading: boolean
  authError: string | null
  signupDraft: SignupDraft
  organization: OrganizationProfile
  login: (email: string) => void
  loginWithBackend: (email: string, password: string) => Promise<void>
  registerWithBackend: (draft: SignupDraft) => Promise<void>
  hydrateSession: () => Promise<void>
  signup: (draft: SignupDraft) => void
  verifyEmail: () => void
  verifyTwoFactor: () => void
  updateOrganization: (patch: Partial<OrganizationProfile>) => void
  addEmployee: (employee: Omit<EmployeeRecord, 'id'>) => void
  updateEmployee: (employeeId: string, patch: Partial<EmployeeRecord>) => void
  removeEmployee: (employeeId: string) => void
  completeOnboarding: () => void
  logout: () => void
}

const defaultModules: PlatformModule[] = ['crm', 'sales', 'support', 'finance']

const defaultOrganization: OrganizationProfile = {
  companyName: 'Krisantec Health',
  industry: 'Healthcare',
  website: 'https://krisantec.example',
  taxId: 'TAX-93824',
  gstNumber: '29ABCDE1234F1Z5',
  address: 'Bengaluru, Karnataka, India',
  timezone: 'Asia/Kolkata',
  departments: ['Sales', 'Support', 'Finance'],
  teams: ['Inside Sales', 'Customer Success', 'Billing Ops'],
  branches: ['HQ - Bengaluru'],
  invitedEmployees: [
    { id: 'emp-1', name: 'Nisha Verma', email: 'nisha@krisantec.example', role: 'Sales Manager', status: 'Active', department: 'Sales', team: 'Inside Sales' },
    { id: 'emp-2', name: 'Rohan Shah', email: 'rohan@krisantec.example', role: 'Support Agent', status: 'Active', department: 'Support', team: 'Customer Success' },
  ],
  selectedModules: defaultModules,
}

const defaultSignupDraft: SignupDraft = {
  fullName: 'Bhavik Kumar',
  companyName: 'Krisantec Health',
  email: 'admin@cityclinic.com',
  mobile: '+91 98765 43210',
  password: 'testpass123',
  country: 'India',
  businessType: 'Healthcare Services',
}

function applyAuthUser(user: AuthUser) {
  return {
    authUser: user,
    isAuthenticated: true,
    emailVerified: true,
    twoFactorVerified: true,
    onboardingComplete: true,
    authError: null,
    organization: {
      ...defaultOrganization,
      companyName: user.organization.name,
    },
    signupDraft: {
      ...defaultSignupDraft,
      email: user.email,
      fullName: user.username,
    },
  }
}

export const usePlatformStore = create<PlatformState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      emailVerified: false,
      twoFactorVerified: false,
      onboardingComplete: false,
      authUser: getStoredUser(),
      authLoading: false,
      authError: null,
      signupDraft: defaultSignupDraft,
      organization: defaultOrganization,

      login: (email) =>
        set((state) => ({
          isAuthenticated: true,
          signupDraft: { ...state.signupDraft, email },
        })),

      loginWithBackend: async (email, password) => {
        set({ authLoading: true, authError: null })
        try {
          const user = await loginApi(email, password)
          set({ ...applyAuthUser(user), authLoading: false })
        } catch (err) {
          const message =
            typeof err === 'object' && err !== null && 'detail' in err
              ? String((err as { detail: string }).detail)
              : 'Login failed. Check email and password.'
          set({ authLoading: false, authError: message })
          throw err
        }
      },

      registerWithBackend: async (draft) => {
        set({ authLoading: true, authError: null })
        try {
          const user = await registerApi({
            email: draft.email,
            username: draft.fullName || draft.email.split('@')[0],
            password: draft.password,
            role: 'admin',
          })
          set({
            ...applyAuthUser(user),
            signupDraft: draft,
            organization: {
              ...defaultOrganization,
              companyName: draft.companyName || user.organization.name,
              industry: draft.businessType,
            },
            authLoading: false,
          })
        } catch (err) {
          const message =
            typeof err === 'object' && err !== null && 'detail' in err
              ? String((err as { detail: string }).detail)
              : 'Registration failed.'
          set({ authLoading: false, authError: message })
          throw err
        }
      },

      hydrateSession: async () => {
        const cached = getStoredUser()
        if (!cached) return
        set({ authLoading: true })
        try {
          const user = await fetchMe()
          set({ ...applyAuthUser(user), authLoading: false })
        } catch {
          logoutApi()
          set({
            authUser: null,
            isAuthenticated: false,
            authLoading: false,
          })
        }
      },

      signup: (draft) =>
        set((state) => ({
          signupDraft: draft,
          organization: {
            ...state.organization,
            companyName: draft.companyName,
            industry: draft.businessType,
          },
          isAuthenticated: false,
          emailVerified: false,
          twoFactorVerified: false,
          onboardingComplete: false,
        })),

      verifyEmail: () => set({ emailVerified: true }),
      verifyTwoFactor: () => set({ isAuthenticated: true, twoFactorVerified: true }),

      updateOrganization: (patch) =>
        set((state) => ({
          organization: {
            ...state.organization,
            ...patch,
          },
        })),

      addEmployee: (employee) =>
        set((state) => ({
          organization: {
            ...state.organization,
            invitedEmployees: [
              ...state.organization.invitedEmployees,
              { ...employee, id: `emp-${Date.now()}` },
            ],
          },
        })),

      updateEmployee: (employeeId, patch) =>
        set((state) => ({
          organization: {
            ...state.organization,
            invitedEmployees: state.organization.invitedEmployees.map((employee) =>
              employee.id === employeeId ? { ...employee, ...patch } : employee
            ),
          },
        })),

      removeEmployee: (employeeId) =>
        set((state) => ({
          organization: {
            ...state.organization,
            invitedEmployees: state.organization.invitedEmployees.filter((employee) => employee.id !== employeeId),
          },
        })),

      completeOnboarding: () => set({ onboardingComplete: true }),

      logout: () => {
        logoutApi()
        set({
          isAuthenticated: false,
          emailVerified: false,
          twoFactorVerified: false,
          onboardingComplete: false,
          authUser: null,
          authError: null,
        })
      },
    }),
    {
      name: 'krisantec-platform',
      partialize: (state) => ({
        signupDraft: state.signupDraft,
        organization: state.organization,
      }),
      version: 3,
    }
  )
)
