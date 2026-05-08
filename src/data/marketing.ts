import type { IndustryKey } from './industries'

export interface PlatformStat {
  name: string
  spend: number
  leads: number
  conversions: number
  cpl: number
  ctr: number
  color: string
  icon: string
}

export interface Creative {
  id: string
  title: string
  type: 'Image' | 'Video' | 'Carousel' | 'Reel' | 'Story' | 'Banner' | 'PDF' | 'Email'
  platform: string
  status: 'Live' | 'Paused' | 'Draft' | 'Review'
  impressions: number
  clicks: number
  ctr: number
  thumbnail: string
}

export interface Campaign {
  id: string
  name: string
  channel: string
  objective: 'Awareness' | 'Lead Gen' | 'Conversion' | 'Retention' | 'Engagement'
  status: 'Running' | 'Scheduled' | 'Paused' | 'Completed'
  budget: number
  spent: number
  reach: number
  leads: number
  conversions: number
  startDate: string
  endDate: string
}

export interface MarketingStats {
  totalSpend: number
  totalLeads: number
  totalConversions: number
  avgCpl: number
  roi: number
  spendDelta: number
  leadsDelta: number
  conversionsDelta: number
  cplDelta: number
  funnel: { stage: string; value: number }[]
  trend: { day: string; leads: number; spend: number; conversions: number }[]
}

export interface MarketingData {
  stats: MarketingStats
  platforms: PlatformStat[]
  creatives: Creative[]
  campaigns: Campaign[]
}

const baseTrend = (mult = 1) => [
  { day: 'Mon', leads: 42 * mult, spend: 8400 * mult, conversions: 6 * mult },
  { day: 'Tue', leads: 58 * mult, spend: 9100 * mult, conversions: 9 * mult },
  { day: 'Wed', leads: 51 * mult, spend: 8700 * mult, conversions: 8 * mult },
  { day: 'Thu', leads: 73 * mult, spend: 12000 * mult, conversions: 14 * mult },
  { day: 'Fri', leads: 88 * mult, spend: 13200 * mult, conversions: 19 * mult },
  { day: 'Sat', leads: 96 * mult, spend: 14100 * mult, conversions: 22 * mult },
  { day: 'Sun', leads: 67 * mult, spend: 9800 * mult, conversions: 11 * mult },
]

export const marketingByIndustry: Record<IndustryKey, MarketingData> = {
  healthcare: {
    stats: {
      totalSpend: 218400,
      totalLeads: 1248,
      totalConversions: 312,
      avgCpl: 175,
      roi: 4.2,
      spendDelta: 12.4,
      leadsDelta: 18.6,
      conversionsDelta: 9.2,
      cplDelta: -6.8,
      funnel: [
        { stage: 'Impressions', value: 482000 },
        { stage: 'Clicks', value: 24100 },
        { stage: 'Leads', value: 1248 },
        { stage: 'Appointments', value: 612 },
        { stage: 'Patients', value: 312 },
      ],
      trend: baseTrend(1),
    },
    platforms: [
      { name: 'WhatsApp Business', spend: 42000, leads: 392, conversions: 118, cpl: 107, ctr: 6.4, color: '#25D366', icon: '💬' },
      { name: 'Google Ads', spend: 78000, leads: 304, conversions: 96, cpl: 256, ctr: 4.1, color: '#4285F4', icon: '🔍' },
      { name: 'Meta (FB + IG)', spend: 56000, leads: 286, conversions: 58, cpl: 195, ctr: 2.8, color: '#1877F2', icon: '📘' },
      { name: 'JustDial / Practo', spend: 22400, leads: 178, conversions: 32, cpl: 125, ctr: 5.2, color: '#FF6B35', icon: '📞' },
      { name: 'YouTube', spend: 20000, leads: 88, conversions: 8, cpl: 227, ctr: 1.9, color: '#FF0000', icon: '▶️' },
    ],
    creatives: [
      { id: 'C-101', title: 'Free Health Checkup Banner', type: 'Image', platform: 'Meta', status: 'Live', impressions: 184000, clicks: 9200, ctr: 5.0, thumbnail: '🩺' },
      { id: 'C-102', title: 'Dr. Mehta — Cardiologist Intro', type: 'Video', platform: 'YouTube', status: 'Live', impressions: 96000, clicks: 4100, ctr: 4.3, thumbnail: '👨‍⚕️' },
      { id: 'C-103', title: 'Diabetes Care Carousel', type: 'Carousel', platform: 'Instagram', status: 'Live', impressions: 142000, clicks: 6800, ctr: 4.8, thumbnail: '🩸' },
      { id: 'C-104', title: 'Festive Dental Offer', type: 'Story', platform: 'Instagram', status: 'Paused', impressions: 58000, clicks: 1900, ctr: 3.3, thumbnail: '🦷' },
      { id: 'C-105', title: 'Annual Master Health Plan PDF', type: 'PDF', platform: 'WhatsApp', status: 'Live', impressions: 28000, clicks: 4400, ctr: 15.7, thumbnail: '📄' },
      { id: 'C-106', title: 'Patient Testimonial Reel', type: 'Reel', platform: 'Instagram', status: 'Review', impressions: 0, clicks: 0, ctr: 0, thumbnail: '⭐' },
    ],
    campaigns: [
      { id: 'CMP-2401', name: 'Annual Health Checkup Drive', channel: 'WhatsApp + Email', objective: 'Lead Gen', status: 'Running', budget: 80000, spent: 52400, reach: 142000, leads: 412, conversions: 118, startDate: '2026-04-01', endDate: '2026-05-31' },
      { id: 'CMP-2402', name: 'Diabetes Awareness Month', channel: 'Meta Ads', objective: 'Awareness', status: 'Running', budget: 60000, spent: 38000, reach: 286000, leads: 198, conversions: 42, startDate: '2026-04-15', endDate: '2026-05-15' },
      { id: 'CMP-2403', name: 'Free Dental Consultation', channel: 'Google + Meta', objective: 'Lead Gen', status: 'Running', budget: 45000, spent: 41200, reach: 98000, leads: 264, conversions: 88, startDate: '2026-04-10', endDate: '2026-05-10' },
      { id: 'CMP-2404', name: 'Senior Citizen Wellness', channel: 'JustDial + WhatsApp', objective: 'Conversion', status: 'Scheduled', budget: 30000, spent: 0, reach: 0, leads: 0, conversions: 0, startDate: '2026-05-15', endDate: '2026-06-30' },
      { id: 'CMP-2405', name: 'Vaccination Reminder Flow', channel: 'WhatsApp', objective: 'Retention', status: 'Running', budget: 12000, spent: 8400, reach: 22000, leads: 188, conversions: 64, startDate: '2026-03-20', endDate: '2026-12-31' },
    ],
  },

  realestate: {
    stats: {
      totalSpend: 642000,
      totalLeads: 894,
      totalConversions: 42,
      avgCpl: 718,
      roi: 6.8,
      spendDelta: 22.1,
      leadsDelta: 14.3,
      conversionsDelta: 16.7,
      cplDelta: -9.4,
      funnel: [
        { stage: 'Impressions', value: 1240000 },
        { stage: 'Clicks', value: 38400 },
        { stage: 'Leads', value: 894 },
        { stage: 'Site Visits', value: 246 },
        { stage: 'Bookings', value: 42 },
      ],
      trend: baseTrend(1.4),
    },
    platforms: [
      { name: '99acres', spend: 142000, leads: 218, conversions: 14, cpl: 651, ctr: 3.1, color: '#7C3AED', icon: '🏢' },
      { name: 'MagicBricks', spend: 118000, leads: 184, conversions: 9, cpl: 641, ctr: 2.9, color: '#DC2626', icon: '🏗️' },
      { name: 'Google Ads', spend: 168000, leads: 198, conversions: 11, cpl: 848, ctr: 3.6, color: '#4285F4', icon: '🔍' },
      { name: 'Meta (FB + IG)', spend: 142000, leads: 224, conversions: 6, cpl: 634, ctr: 2.4, color: '#1877F2', icon: '📘' },
      { name: 'YouTube Pre-Roll', spend: 72000, leads: 70, conversions: 2, cpl: 1028, ctr: 1.8, color: '#FF0000', icon: '▶️' },
    ],
    creatives: [
      { id: 'C-201', title: '3BHK Luxury Tower Walkthrough', type: 'Video', platform: 'YouTube', status: 'Live', impressions: 412000, clicks: 8200, ctr: 2.0, thumbnail: '🏙️' },
      { id: 'C-202', title: 'Diwali Booking Bonanza', type: 'Image', platform: 'Meta', status: 'Live', impressions: 286000, clicks: 11400, ctr: 4.0, thumbnail: '🎆' },
      { id: 'C-203', title: 'Site Visit Carousel — Premium Project', type: 'Carousel', platform: 'Instagram', status: 'Live', impressions: 198000, clicks: 7800, ctr: 3.9, thumbnail: '🏘️' },
      { id: 'C-204', title: 'RERA Approved Plots Brochure', type: 'PDF', platform: 'WhatsApp', status: 'Live', impressions: 18000, clicks: 4600, ctr: 25.5, thumbnail: '📄' },
      { id: 'C-205', title: 'Drone Reel — Lake View Villas', type: 'Reel', platform: 'Instagram', status: 'Live', impressions: 324000, clicks: 12800, ctr: 3.9, thumbnail: '🚁' },
      { id: 'C-206', title: 'Festive Pricing Email', type: 'Email', platform: 'Email', status: 'Draft', impressions: 0, clicks: 0, ctr: 0, thumbnail: '✉️' },
    ],
    campaigns: [
      { id: 'CMP-3401', name: 'Diwali Property Launch', channel: 'Meta + Google', objective: 'Lead Gen', status: 'Running', budget: 280000, spent: 198000, reach: 482000, leads: 312, conversions: 18, startDate: '2026-04-20', endDate: '2026-06-20' },
      { id: 'CMP-3402', name: 'Premium Apartments Tour Drive', channel: '99acres + WhatsApp', objective: 'Conversion', status: 'Running', budget: 180000, spent: 142000, reach: 188000, leads: 218, conversions: 14, startDate: '2026-04-01', endDate: '2026-05-30' },
      { id: 'CMP-3403', name: 'NRI Investor Outreach', channel: 'LinkedIn + Email', objective: 'Lead Gen', status: 'Running', budget: 120000, spent: 86000, reach: 64000, leads: 122, conversions: 6, startDate: '2026-03-15', endDate: '2026-06-15' },
      { id: 'CMP-3404', name: 'RERA Approved Plots', channel: 'MagicBricks', objective: 'Lead Gen', status: 'Running', budget: 100000, spent: 78000, reach: 142000, leads: 184, conversions: 9, startDate: '2026-04-05', endDate: '2026-05-30' },
      { id: 'CMP-3405', name: 'Channel Partner Activation', channel: 'WhatsApp', objective: 'Engagement', status: 'Scheduled', budget: 50000, spent: 0, reach: 0, leads: 0, conversions: 0, startDate: '2026-05-20', endDate: '2026-07-20' },
    ],
  },

  ecommerce: {
    stats: {
      totalSpend: 384000,
      totalLeads: 4860,
      totalConversions: 1245,
      avgCpl: 79,
      roi: 3.4,
      spendDelta: 28.4,
      leadsDelta: 32.1,
      conversionsDelta: 24.8,
      cplDelta: -11.2,
      funnel: [
        { stage: 'Impressions', value: 2840000 },
        { stage: 'Clicks', value: 124000 },
        { stage: 'Leads', value: 4860 },
        { stage: 'Add to Cart', value: 2180 },
        { stage: 'Orders', value: 1245 },
      ],
      trend: baseTrend(2.2),
    },
    platforms: [
      { name: 'Meta Ads', spend: 142000, leads: 1980, conversions: 542, cpl: 72, ctr: 4.8, color: '#1877F2', icon: '📘' },
      { name: 'Google Shopping', spend: 98000, leads: 1240, conversions: 386, cpl: 79, ctr: 5.2, color: '#34A853', icon: '🛍️' },
      { name: 'Email Marketing', spend: 18000, leads: 612, conversions: 198, cpl: 29, ctr: 12.4, color: '#F59E0B', icon: '✉️' },
      { name: 'Influencer / UGC', spend: 64000, leads: 624, conversions: 84, cpl: 103, ctr: 3.6, color: '#EC4899', icon: '🌟' },
      { name: 'WhatsApp Broadcast', spend: 12000, leads: 284, conversions: 28, cpl: 42, ctr: 18.2, color: '#25D366', icon: '💬' },
      { name: 'SMS', spend: 8000, leads: 120, conversions: 7, cpl: 67, ctr: 8.4, color: '#06B6D4', icon: '📱' },
    ],
    creatives: [
      { id: 'C-301', title: 'Black Friday — 70% Off', type: 'Image', platform: 'Meta', status: 'Live', impressions: 824000, clicks: 38400, ctr: 4.7, thumbnail: '🔥' },
      { id: 'C-302', title: 'Cart Abandonment Email Series', type: 'Email', platform: 'Email', status: 'Live', impressions: 124000, clicks: 18400, ctr: 14.8, thumbnail: '🛒' },
      { id: 'C-303', title: 'Product Showcase Reel', type: 'Reel', platform: 'Instagram', status: 'Live', impressions: 642000, clicks: 24800, ctr: 3.9, thumbnail: '📦' },
      { id: 'C-304', title: 'Best Sellers Carousel', type: 'Carousel', platform: 'Meta', status: 'Live', impressions: 412000, clicks: 19200, ctr: 4.7, thumbnail: '🏆' },
      { id: 'C-305', title: 'Festive Sale Banner', type: 'Banner', platform: 'Google Display', status: 'Live', impressions: 1240000, clicks: 41200, ctr: 3.3, thumbnail: '🎁' },
      { id: 'C-306', title: 'Influencer Unboxing Video', type: 'Video', platform: 'Instagram', status: 'Review', impressions: 0, clicks: 0, ctr: 0, thumbnail: '📹' },
    ],
    campaigns: [
      { id: 'CMP-4401', name: 'Black Friday Mega Sale', channel: 'Meta + Google', objective: 'Conversion', status: 'Running', budget: 180000, spent: 142000, reach: 1280000, leads: 2120, conversions: 642, startDate: '2026-04-25', endDate: '2026-05-15' },
      { id: 'CMP-4402', name: 'Cart Abandonment Recovery', channel: 'Email + WhatsApp', objective: 'Retention', status: 'Running', budget: 24000, spent: 18000, reach: 84000, leads: 612, conversions: 198, startDate: '2026-01-01', endDate: '2026-12-31' },
      { id: 'CMP-4403', name: 'New Collection Launch', channel: 'Influencer + Meta', objective: 'Awareness', status: 'Running', budget: 96000, spent: 72000, reach: 642000, leads: 980, conversions: 184, startDate: '2026-04-10', endDate: '2026-05-25' },
      { id: 'CMP-4404', name: 'Win-Back Lapsed Buyers', channel: 'Email + SMS', objective: 'Retention', status: 'Running', budget: 18000, spent: 12000, reach: 38000, leads: 412, conversions: 148, startDate: '2026-03-01', endDate: '2026-06-30' },
      { id: 'CMP-4405', name: 'Festive Bumper Sale', channel: 'Multi-channel', objective: 'Conversion', status: 'Scheduled', budget: 240000, spent: 0, reach: 0, leads: 0, conversions: 0, startDate: '2026-05-20', endDate: '2026-06-05' },
    ],
  },

  saas: {
    stats: {
      totalSpend: 482000,
      totalLeads: 1820,
      totalConversions: 248,
      avgCpl: 265,
      roi: 5.6,
      spendDelta: 16.8,
      leadsDelta: 21.4,
      conversionsDelta: 28.3,
      cplDelta: -8.1,
      funnel: [
        { stage: 'Impressions', value: 1840000 },
        { stage: 'Clicks', value: 62400 },
        { stage: 'Trial Signups', value: 1820 },
        { stage: 'Activated', value: 842 },
        { stage: 'Paid Customers', value: 248 },
      ],
      trend: baseTrend(1.8),
    },
    platforms: [
      { name: 'LinkedIn Ads', spend: 184000, leads: 612, conversions: 98, cpl: 301, ctr: 0.8, color: '#0A66C2', icon: '🔗' },
      { name: 'Google Search', spend: 142000, leads: 542, conversions: 88, cpl: 262, ctr: 5.4, color: '#4285F4', icon: '🔍' },
      { name: 'Product Hunt', spend: 12000, leads: 198, conversions: 24, cpl: 61, ctr: 8.2, color: '#DA552F', icon: '🚀' },
      { name: 'G2 / Capterra', spend: 64000, leads: 286, conversions: 22, cpl: 224, ctr: 4.6, color: '#FF492C', icon: '⭐' },
      { name: 'Email + Webinars', spend: 48000, leads: 142, conversions: 14, cpl: 338, ctr: 12.8, color: '#F59E0B', icon: '✉️' },
      { name: 'Twitter / X', spend: 32000, leads: 40, conversions: 2, cpl: 800, ctr: 1.2, color: '#000000', icon: '𝕏' },
    ],
    creatives: [
      { id: 'C-501', title: 'Free 14-Day Trial — Hero Banner', type: 'Banner', platform: 'Google Display', status: 'Live', impressions: 482000, clicks: 14200, ctr: 2.9, thumbnail: '✨' },
      { id: 'C-502', title: 'Product Demo Webinar', type: 'Video', platform: 'LinkedIn', status: 'Live', impressions: 184000, clicks: 4200, ctr: 2.3, thumbnail: '🎥' },
      { id: 'C-503', title: 'Feature Tour Carousel', type: 'Carousel', platform: 'LinkedIn', status: 'Live', impressions: 142000, clicks: 3800, ctr: 2.7, thumbnail: '⚙️' },
      { id: 'C-504', title: 'Customer Case Study PDF', type: 'PDF', platform: 'Email', status: 'Live', impressions: 24000, clicks: 4200, ctr: 17.5, thumbnail: '📊' },
      { id: 'C-505', title: 'Integration Showcase Reel', type: 'Reel', platform: 'Twitter', status: 'Paused', impressions: 86000, clicks: 1100, ctr: 1.3, thumbnail: '🔌' },
      { id: 'C-506', title: 'Annual Plan Discount Email', type: 'Email', platform: 'Email', status: 'Draft', impressions: 0, clicks: 0, ctr: 0, thumbnail: '💰' },
    ],
    campaigns: [
      { id: 'CMP-5401', name: 'Free Trial Drive Q2', channel: 'LinkedIn + Google', objective: 'Lead Gen', status: 'Running', budget: 220000, spent: 168000, reach: 824000, leads: 942, conversions: 142, startDate: '2026-04-01', endDate: '2026-06-30' },
      { id: 'CMP-5402', name: 'Product Demo Webinar Series', channel: 'Email + LinkedIn', objective: 'Lead Gen', status: 'Running', budget: 80000, spent: 56000, reach: 142000, leads: 412, conversions: 64, startDate: '2026-04-15', endDate: '2026-06-15' },
      { id: 'CMP-5403', name: 'Annual Plan Upgrade', channel: 'In-app + Email', objective: 'Conversion', status: 'Running', budget: 24000, spent: 18000, reach: 18000, leads: 142, conversions: 38, startDate: '2026-03-01', endDate: '2026-12-31' },
      { id: 'CMP-5404', name: 'Churn Prevention Flow', channel: 'Email + In-app', objective: 'Retention', status: 'Running', budget: 18000, spent: 14000, reach: 12000, leads: 184, conversions: 4, startDate: '2026-01-01', endDate: '2026-12-31' },
      { id: 'CMP-5405', name: 'Product Hunt Launch', channel: 'Product Hunt', objective: 'Awareness', status: 'Completed', budget: 12000, spent: 12000, reach: 84000, leads: 198, conversions: 24, startDate: '2026-03-15', endDate: '2026-03-22' },
    ],
  },

  education: {
    stats: {
      totalSpend: 168000,
      totalLeads: 2840,
      totalConversions: 412,
      avgCpl: 59,
      roi: 4.8,
      spendDelta: 14.2,
      leadsDelta: 26.4,
      conversionsDelta: 18.6,
      cplDelta: -7.2,
      funnel: [
        { stage: 'Impressions', value: 1240000 },
        { stage: 'Clicks', value: 84000 },
        { stage: 'Inquiries', value: 2840 },
        { stage: 'Counselling Done', value: 1240 },
        { stage: 'Admissions', value: 412 },
      ],
      trend: baseTrend(1.6),
    },
    platforms: [
      { name: 'Meta (FB + IG)', spend: 64000, leads: 1240, conversions: 184, cpl: 52, ctr: 5.4, color: '#1877F2', icon: '📘' },
      { name: 'Google Ads', spend: 42000, leads: 612, conversions: 96, cpl: 69, ctr: 4.8, color: '#4285F4', icon: '🔍' },
      { name: 'YouTube', spend: 28000, leads: 412, conversions: 58, cpl: 68, ctr: 3.2, color: '#FF0000', icon: '▶️' },
      { name: 'JustDial', spend: 12000, leads: 286, conversions: 42, cpl: 42, ctr: 6.8, color: '#FF6B35', icon: '📞' },
      { name: 'WhatsApp Drip', spend: 14000, leads: 218, conversions: 24, cpl: 64, ctr: 14.2, color: '#25D366', icon: '💬' },
      { name: 'School Partnerships', spend: 8000, leads: 72, conversions: 8, cpl: 111, ctr: 0, color: '#8B5CF6', icon: '🤝' },
    ],
    creatives: [
      { id: 'C-601', title: 'Admissions Open 2026 — Hero', type: 'Image', platform: 'Meta', status: 'Live', impressions: 412000, clicks: 18400, ctr: 4.5, thumbnail: '🎓' },
      { id: 'C-602', title: 'Topper Testimonial Video', type: 'Video', platform: 'YouTube', status: 'Live', impressions: 286000, clicks: 9400, ctr: 3.3, thumbnail: '🏅' },
      { id: 'C-603', title: 'Scholarship Test Carousel', type: 'Carousel', platform: 'Instagram', status: 'Live', impressions: 184000, clicks: 8600, ctr: 4.7, thumbnail: '📝' },
      { id: 'C-604', title: 'Career Counselling Webinar', type: 'Reel', platform: 'Instagram', status: 'Live', impressions: 142000, clicks: 6200, ctr: 4.4, thumbnail: '🎯' },
      { id: 'C-605', title: 'Course Brochure PDF', type: 'PDF', platform: 'WhatsApp', status: 'Live', impressions: 18000, clicks: 4400, ctr: 24.4, thumbnail: '📚' },
      { id: 'C-606', title: 'Parent Engagement Email', type: 'Email', platform: 'Email', status: 'Draft', impressions: 0, clicks: 0, ctr: 0, thumbnail: '👨‍👩‍👧' },
    ],
    campaigns: [
      { id: 'CMP-6401', name: 'Admissions Open 2026', channel: 'Meta + Google', objective: 'Lead Gen', status: 'Running', budget: 80000, spent: 56000, reach: 642000, leads: 1240, conversions: 184, startDate: '2026-03-15', endDate: '2026-06-30' },
      { id: 'CMP-6402', name: 'Scholarship Test Drive', channel: 'Meta + WhatsApp', objective: 'Lead Gen', status: 'Running', budget: 32000, spent: 24000, reach: 142000, leads: 612, conversions: 96, startDate: '2026-04-01', endDate: '2026-05-15' },
      { id: 'CMP-6403', name: 'Career Counselling Webinar', channel: 'YouTube + Email', objective: 'Engagement', status: 'Running', budget: 18000, spent: 14000, reach: 84000, leads: 412, conversions: 58, startDate: '2026-04-10', endDate: '2026-05-30' },
      { id: 'CMP-6404', name: 'Batch Reminder Drip', channel: 'WhatsApp', objective: 'Retention', status: 'Running', budget: 8000, spent: 5000, reach: 12000, leads: 286, conversions: 42, startDate: '2026-01-01', endDate: '2026-12-31' },
      { id: 'CMP-6405', name: 'Summer School Outreach', channel: 'Meta + JustDial', objective: 'Conversion', status: 'Scheduled', budget: 30000, spent: 0, reach: 0, leads: 0, conversions: 0, startDate: '2026-05-15', endDate: '2026-06-30' },
    ],
  },

  manufacturing: {
    stats: {
      totalSpend: 286000,
      totalLeads: 642,
      totalConversions: 84,
      avgCpl: 446,
      roi: 7.2,
      spendDelta: 8.4,
      leadsDelta: 11.6,
      conversionsDelta: 14.2,
      cplDelta: -4.8,
      funnel: [
        { stage: 'Impressions', value: 642000 },
        { stage: 'Clicks', value: 18400 },
        { stage: 'Inquiries', value: 642 },
        { stage: 'Quotations', value: 218 },
        { stage: 'Orders', value: 84 },
      ],
      trend: baseTrend(0.8),
    },
    platforms: [
      { name: 'IndiaMART', spend: 84000, leads: 218, conversions: 32, cpl: 385, ctr: 4.2, color: '#F47216', icon: '🇮🇳' },
      { name: 'TradeIndia', spend: 42000, leads: 124, conversions: 14, cpl: 339, ctr: 3.8, color: '#1E40AF', icon: '🌐' },
      { name: 'LinkedIn Ads', spend: 78000, leads: 142, conversions: 22, cpl: 549, ctr: 1.2, color: '#0A66C2', icon: '🔗' },
      { name: 'Google Ads', spend: 48000, leads: 96, conversions: 12, cpl: 500, ctr: 3.4, color: '#4285F4', icon: '🔍' },
      { name: 'Trade Shows / Expos', spend: 24000, leads: 48, conversions: 4, cpl: 500, ctr: 0, color: '#8B5CF6', icon: '🏛️' },
      { name: 'Email Outreach', spend: 10000, leads: 14, conversions: 0, cpl: 714, ctr: 8.4, color: '#F59E0B', icon: '✉️' },
    ],
    creatives: [
      { id: 'C-701', title: 'Industrial Catalogue 2026', type: 'PDF', platform: 'Email', status: 'Live', impressions: 28000, clicks: 6400, ctr: 22.8, thumbnail: '📒' },
      { id: 'C-702', title: 'Factory Walkthrough Video', type: 'Video', platform: 'LinkedIn', status: 'Live', impressions: 84000, clicks: 1800, ctr: 2.1, thumbnail: '🏭' },
      { id: 'C-703', title: 'Bulk Pricing Banner', type: 'Banner', platform: 'IndiaMART', status: 'Live', impressions: 142000, clicks: 6200, ctr: 4.4, thumbnail: '📦' },
      { id: 'C-704', title: 'Product Spec Carousel', type: 'Carousel', platform: 'LinkedIn', status: 'Live', impressions: 64000, clicks: 1400, ctr: 2.2, thumbnail: '📐' },
      { id: 'C-705', title: 'MSME Discount Email', type: 'Email', platform: 'Email', status: 'Live', impressions: 12000, clicks: 1900, ctr: 15.8, thumbnail: '💰' },
      { id: 'C-706', title: 'Trade Expo Invite', type: 'Image', platform: 'WhatsApp', status: 'Draft', impressions: 0, clicks: 0, ctr: 0, thumbnail: '🎫' },
    ],
    campaigns: [
      { id: 'CMP-7401', name: 'Industrial Expo Outreach', channel: 'LinkedIn + Email', objective: 'Lead Gen', status: 'Running', budget: 120000, spent: 78000, reach: 142000, leads: 218, conversions: 32, startDate: '2026-04-01', endDate: '2026-06-30' },
      { id: 'CMP-7402', name: 'Bulk Order Festival Pricing', channel: 'IndiaMART + Email', objective: 'Conversion', status: 'Running', budget: 80000, spent: 62000, reach: 84000, leads: 142, conversions: 24, startDate: '2026-04-15', endDate: '2026-05-30' },
      { id: 'CMP-7403', name: 'MSME Activation Drive', channel: 'Google + LinkedIn', objective: 'Lead Gen', status: 'Running', budget: 60000, spent: 48000, reach: 64000, leads: 124, conversions: 14, startDate: '2026-03-15', endDate: '2026-05-15' },
      { id: 'CMP-7404', name: 'Supplier Partnership Outreach', channel: 'TradeIndia', objective: 'Lead Gen', status: 'Running', budget: 40000, spent: 32000, reach: 38000, leads: 96, conversions: 8, startDate: '2026-04-01', endDate: '2026-05-30' },
      { id: 'CMP-7405', name: 'Trade Show India 2026', channel: 'Offline + Digital', objective: 'Awareness', status: 'Scheduled', budget: 50000, spent: 0, reach: 0, leads: 0, conversions: 0, startDate: '2026-05-25', endDate: '2026-05-28' },
    ],
  },

  hospitality: {
    stats: {
      totalSpend: 142000,
      totalLeads: 1820,
      totalConversions: 612,
      avgCpl: 78,
      roi: 5.4,
      spendDelta: 18.4,
      leadsDelta: 22.6,
      conversionsDelta: 19.2,
      cplDelta: -8.4,
      funnel: [
        { stage: 'Impressions', value: 842000 },
        { stage: 'Clicks', value: 38400 },
        { stage: 'Inquiries', value: 1820 },
        { stage: 'Bookings Pending', value: 942 },
        { stage: 'Confirmed Bookings', value: 612 },
      ],
      trend: baseTrend(1.2),
    },
    platforms: [
      { name: 'MakeMyTrip / Booking', spend: 48000, leads: 612, conversions: 218, cpl: 78, ctr: 4.8, color: '#003580', icon: '🛏️' },
      { name: 'Meta (FB + IG)', spend: 42000, leads: 542, conversions: 184, cpl: 77, ctr: 4.2, color: '#1877F2', icon: '📘' },
      { name: 'Google Ads', spend: 32000, leads: 412, conversions: 142, cpl: 78, ctr: 5.4, color: '#4285F4', icon: '🔍' },
      { name: 'WhatsApp Booking', spend: 8000, leads: 184, conversions: 48, cpl: 43, ctr: 18.6, color: '#25D366', icon: '💬' },
      { name: 'TripAdvisor', spend: 12000, leads: 70, conversions: 20, cpl: 171, ctr: 2.8, color: '#34E0A1', icon: '🌍' },
    ],
    creatives: [
      { id: 'C-801', title: 'Weekend Getaway Reel', type: 'Reel', platform: 'Instagram', status: 'Live', impressions: 384000, clicks: 14200, ctr: 3.7, thumbnail: '🌴' },
      { id: 'C-802', title: 'Suite Showcase Carousel', type: 'Carousel', platform: 'Meta', status: 'Live', impressions: 198000, clicks: 8400, ctr: 4.2, thumbnail: '🛌' },
      { id: 'C-803', title: 'Dining Experience Video', type: 'Video', platform: 'YouTube', status: 'Live', impressions: 84000, clicks: 2400, ctr: 2.9, thumbnail: '🍽️' },
      { id: 'C-804', title: 'Festive Stay Email', type: 'Email', platform: 'Email', status: 'Live', impressions: 24000, clicks: 3600, ctr: 15.0, thumbnail: '🎉' },
      { id: 'C-805', title: 'Property Tour PDF', type: 'PDF', platform: 'WhatsApp', status: 'Live', impressions: 8000, clicks: 1800, ctr: 22.5, thumbnail: '📄' },
    ],
    campaigns: [
      { id: 'CMP-8401', name: 'Summer Stay Campaign', channel: 'Meta + Google', objective: 'Conversion', status: 'Running', budget: 80000, spent: 56000, reach: 482000, leads: 942, conversions: 312, startDate: '2026-04-01', endDate: '2026-06-30' },
      { id: 'CMP-8402', name: 'Weekend Getaway Push', channel: 'Instagram', objective: 'Awareness', status: 'Running', budget: 24000, spent: 18000, reach: 286000, leads: 412, conversions: 142, startDate: '2026-04-15', endDate: '2026-06-15' },
      { id: 'CMP-8403', name: 'Honeymoon Suite Special', channel: 'Meta + Email', objective: 'Lead Gen', status: 'Running', budget: 18000, spent: 12000, reach: 84000, leads: 184, conversions: 64, startDate: '2026-03-01', endDate: '2026-05-30' },
      { id: 'CMP-8404', name: 'Repeat Guest Reward', channel: 'WhatsApp + Email', objective: 'Retention', status: 'Running', budget: 6000, spent: 4500, reach: 18000, leads: 282, conversions: 94, startDate: '2026-01-01', endDate: '2026-12-31' },
      { id: 'CMP-8405', name: 'Festive Season Push', channel: 'Multi-channel', objective: 'Conversion', status: 'Scheduled', budget: 60000, spent: 0, reach: 0, leads: 0, conversions: 0, startDate: '2026-05-20', endDate: '2026-07-30' },
    ],
  },

  agency: {
    stats: {
      totalSpend: 86000,
      totalLeads: 384,
      totalConversions: 64,
      avgCpl: 224,
      roi: 6.4,
      spendDelta: 10.4,
      leadsDelta: 16.2,
      conversionsDelta: 12.8,
      cplDelta: -5.4,
      funnel: [
        { stage: 'Impressions', value: 482000 },
        { stage: 'Clicks', value: 14200 },
        { stage: 'Inquiries', value: 384 },
        { stage: 'Discovery Calls', value: 142 },
        { stage: 'Clients Won', value: 64 },
      ],
      trend: baseTrend(0.6),
    },
    platforms: [
      { name: 'LinkedIn Ads', spend: 38000, leads: 142, conversions: 28, cpl: 268, ctr: 1.4, color: '#0A66C2', icon: '🔗' },
      { name: 'Google Ads', spend: 24000, leads: 96, conversions: 18, cpl: 250, ctr: 4.8, color: '#4285F4', icon: '🔍' },
      { name: 'Referrals', spend: 0, leads: 64, conversions: 12, cpl: 0, ctr: 0, color: '#10B981', icon: '🤝' },
      { name: 'Email Outreach', spend: 12000, leads: 48, conversions: 4, cpl: 250, ctr: 9.4, color: '#F59E0B', icon: '✉️' },
      { name: 'Twitter / X', spend: 12000, leads: 34, conversions: 2, cpl: 353, ctr: 1.8, color: '#000000', icon: '𝕏' },
    ],
    creatives: [
      { id: 'C-901', title: 'Case Study — 3x Growth', type: 'PDF', platform: 'Email', status: 'Live', impressions: 14000, clicks: 3200, ctr: 22.9, thumbnail: '📈' },
      { id: 'C-902', title: 'Service Pitch Deck', type: 'PDF', platform: 'LinkedIn', status: 'Live', impressions: 18000, clicks: 2400, ctr: 13.3, thumbnail: '📊' },
      { id: 'C-903', title: 'Client Testimonial Reel', type: 'Reel', platform: 'Instagram', status: 'Live', impressions: 86000, clicks: 2800, ctr: 3.3, thumbnail: '🎬' },
      { id: 'C-904', title: 'Free Audit Lead Magnet', type: 'Image', platform: 'LinkedIn', status: 'Live', impressions: 42000, clicks: 1800, ctr: 4.3, thumbnail: '🔎' },
      { id: 'C-905', title: 'Founder Insights Email', type: 'Email', platform: 'Email', status: 'Draft', impressions: 0, clicks: 0, ctr: 0, thumbnail: '✍️' },
    ],
    campaigns: [
      { id: 'CMP-9401', name: 'Free Audit Lead Magnet', channel: 'LinkedIn + Email', objective: 'Lead Gen', status: 'Running', budget: 32000, spent: 24000, reach: 142000, leads: 142, conversions: 28, startDate: '2026-04-01', endDate: '2026-06-30' },
      { id: 'CMP-9402', name: 'Case Study Drip', channel: 'Email', objective: 'Engagement', status: 'Running', budget: 6000, spent: 4200, reach: 14000, leads: 96, conversions: 18, startDate: '2026-03-15', endDate: '2026-12-31' },
      { id: 'CMP-9403', name: 'Founder Network Outreach', channel: 'LinkedIn', objective: 'Lead Gen', status: 'Running', budget: 18000, spent: 12000, reach: 24000, leads: 64, conversions: 12, startDate: '2026-04-15', endDate: '2026-06-15' },
      { id: 'CMP-9404', name: 'Client Referral Program', channel: 'Email + WhatsApp', objective: 'Retention', status: 'Running', budget: 4000, spent: 1800, reach: 4000, leads: 48, conversions: 4, startDate: '2026-01-01', endDate: '2026-12-31' },
      { id: 'CMP-9405', name: 'Conference Sponsorship', channel: 'Offline', objective: 'Awareness', status: 'Scheduled', budget: 30000, spent: 0, reach: 0, leads: 0, conversions: 0, startDate: '2026-06-10', endDate: '2026-06-12' },
    ],
  },
}
