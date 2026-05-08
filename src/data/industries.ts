import type { LucideIcon } from 'lucide-react'
import {
  Stethoscope,
  Building2,
  ShoppingCart,
  Cpu,
  GraduationCap,
  Factory,
  Hotel,
  Briefcase,
} from 'lucide-react'

export type IndustryKey =
  | 'healthcare'
  | 'realestate'
  | 'ecommerce'
  | 'saas'
  | 'education'
  | 'manufacturing'
  | 'hospitality'
  | 'agency'

export interface Industry {
  key: IndustryKey
  name: string
  tagline: string
  icon: LucideIcon
  accent: string
  emoji: string
}

export const industries: Industry[] = [
  {
    key: 'healthcare',
    name: 'Healthcare',
    tagline: 'Clinics, hospitals & wellness',
    icon: Stethoscope,
    accent: '#10b981',
    emoji: '🏥',
  },
  {
    key: 'realestate',
    name: 'Real Estate',
    tagline: 'Builders, brokers & projects',
    icon: Building2,
    accent: '#f59e0b',
    emoji: '🏠',
  },
  {
    key: 'ecommerce',
    name: 'E-commerce',
    tagline: 'D2C brands & online stores',
    icon: ShoppingCart,
    accent: '#ec4899',
    emoji: '📦',
  },
  {
    key: 'saas',
    name: 'SaaS',
    tagline: 'Software & subscription',
    icon: Cpu,
    accent: '#3b82f6',
    emoji: '💻',
  },
  {
    key: 'education',
    name: 'Education',
    tagline: 'Schools, EdTech & coaching',
    icon: GraduationCap,
    accent: '#8b5cf6',
    emoji: '🎓',
  },
  {
    key: 'manufacturing',
    name: 'Manufacturing',
    tagline: 'Industrial & B2B suppliers',
    icon: Factory,
    accent: '#06b6d4',
    emoji: '🏭',
  },
  {
    key: 'hospitality',
    name: 'Hospitality',
    tagline: 'Hotels, resorts & F&B',
    icon: Hotel,
    accent: '#f43f5e',
    emoji: '🏨',
  },
  {
    key: 'agency',
    name: 'Agency / Services',
    tagline: 'Consulting & freelance',
    icon: Briefcase,
    accent: '#14b8a6',
    emoji: '💼',
  },
]

export function getIndustry(key: IndustryKey): Industry {
  return industries.find((i) => i.key === key) ?? industries[0]
}
